from rest_framework.test import APITestCase
from rest_framework import status
from django.core.cache import cache
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
import io

from accounts.models import User
from .models import IndividualProfile, ParentProfile, FamilyLink, Photo


class ProfilesTests(APITestCase):
    def setUp(self):
        cache.clear()
        # Create two users with individual profiles
        self.user1 = User.objects.create_user(phone='1111111111', password='testpass123', role='individual')
        self.profile1 = IndividualProfile.objects.create(
            user=self.user1,
            full_name='User One',
            gender='male',
            date_of_birth='1995-01-01',
            location_city='Chennai',
            location_country='India',
        )
        self.user2 = User.objects.create_user(phone='2222222222', password='testpass123', role='individual')
        self.profile2 = IndividualProfile.objects.create(
            user=self.user2,
            full_name='User Two',
            gender='female',
            date_of_birth='1998-01-01',
            location_city='Chennai',
            location_country='India',
        )
        # Authenticate user1 by default
        self.client.force_authenticate(user=self.user1)

    def test_list_profiles(self):
        url = reverse('individualprofile-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Paginated response -> use 'results' key
        self.assertGreaterEqual(len(response.data['results']), 2)

    def test_filter_profiles_by_city(self):
        url = reverse('individualprofile-list') + '?location_city=Chennai'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Both profiles are in Chennai
        self.assertEqual(len(response.data['results']), 2)

    def test_profile_creation(self):
        # New user without profile
        user3 = User.objects.create_user(phone='3333333333', password='testpass123', role='individual')
        self.client.force_authenticate(user=user3)
        url = reverse('individualprofile-list')
        data = {
            'full_name': 'User Three',
            'gender': 'female',
            'date_of_birth': '1996-01-01',
            'location_city': 'Bangalore',
            'location_country': 'India',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(IndividualProfile.objects.filter(user=user3).exists())

    def test_parent_approval_flow(self):
        # Create parent user and profile
        parent_user = User.objects.create_user(phone='4444444444', password='testpass123', role='parent')
        ParentProfile.objects.create(user=parent_user, full_name='Parent One', relation='Father')
        self.client.force_authenticate(user=parent_user)

        # Parent creates a FamilyLink request
        url = reverse('family-link-list')
        data = {'individual': str(self.profile1.id)}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        link_id = response.data['id']

        # Switch to user1 (individual) and approve
        self.client.force_authenticate(user=self.user1)
        approve_url = reverse('family-link-approve', args=[link_id])
        response = self.client.post(approve_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        link = FamilyLink.objects.get(id=link_id)
        self.assertEqual(link.status, 'approved')

    def test_photo_upload_and_blur(self):
        # Create a simple image
        image = Image.new('RGB', (100, 100), color='red')
        buffer = io.BytesIO()
        image.save(buffer, format='JPEG')
        buffer.seek(0)
        photo_file = SimpleUploadedFile('test_photo.jpg', buffer.read(), content_type='image/jpeg')

        # Upload photo as user1
        url = reverse('photo-list')
        response = self.client.post(url, {'image': photo_file}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        photo_id = response.data['id']
        self.assertIsNotNone(response.data.get('blurred_image'))

        # Test set_primary
        set_primary_url = reverse('photo-set-primary', args=[photo_id])
        response = self.client.post(set_primary_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        photo = Photo.objects.get(id=photo_id)
        self.assertTrue(photo.is_primary)

    def test_photo_permission(self):
        # Upload photo as user1 (already authenticated)
        image = Image.new('RGB', (100, 100), color='blue')
        buffer = io.BytesIO()
        image.save(buffer, format='JPEG')
        buffer.seek(0)
        photo_file = SimpleUploadedFile('test2.jpg', buffer.read(), content_type='image/jpeg')
        upload_url = reverse('photo-list')
        response = self.client.post(upload_url, {'image': photo_file}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        photo_id = response.data['id']

        # Switch to user2 and try to view original (no mutual interest)
        self.client.force_authenticate(user=self.user2)
        view_url = reverse('photo-view', args=[photo_id])
        response = self.client.get(view_url)
        # Should be blurred, not original. We just check status 200 and content-type
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'image/jpeg')