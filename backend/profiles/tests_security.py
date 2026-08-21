from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from datetime import timedelta
from accounts.models import User
from profiles.models import IndividualProfile, Photo
from moderation.models import Block
from PIL import Image
import io

class BlockEnforcementTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(phone='1111111111', password='testpass123', role='individual')
        self.user2 = User.objects.create_user(phone='2222222222', password='testpass123', role='individual')
        self.profile1 = IndividualProfile.objects.create(user=self.user1, full_name='User One', gender='male', date_of_birth='1995-01-01', location_city='Chennai', location_country='India')
        self.profile2 = IndividualProfile.objects.create(user=self.user2, full_name='User Two', gender='female', date_of_birth='1995-01-01', location_city='Chennai', location_country='India')
        self.client.force_authenticate(user=self.user1)

    def test_blocked_user_not_in_discover(self):
        Block.objects.create(blocker=self.profile1, blocked=self.profile2)
        url = reverse('individualprofile-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results']
        self.assertFalse(any(p['id'] == str(self.profile2.id) for p in results))

    def test_cannot_send_interest_to_blocked(self):
        Block.objects.create(blocker=self.profile1, blocked=self.profile2)
        url = reverse('interest-list')
        response = self.client.post(url, {'receiver': str(self.profile2.id)}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class MediaProtectionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(phone='3333333333', password='testpass123', role='individual')
        self.profile = IndividualProfile.objects.create(user=self.user, full_name='User Three', gender='male', date_of_birth='1995-01-01', location_city='Chennai', location_country='India')

    def test_original_photo_direct_access_forbidden(self):
        img = Image.new('RGB', (100, 100), color='red')
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG')
        buffer.seek(0)
        photo_file = SimpleUploadedFile('test.jpg', buffer.read(), content_type='image/jpeg')
        photo = Photo.objects.create(profile=self.profile, image=photo_file)
        response = self.client.get(photo.image.url)
        self.assertEqual(response.status_code, 404)


class LastActiveDebounceTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(phone='4444444444', password='testpass123', role='individual')
        self.profile = IndividualProfile.objects.create(user=self.user, full_name='User Four', gender='male', date_of_birth='1995-01-01', location_city='Chennai', location_country='India')
        self.client.force_authenticate(user=self.user)
        self.url = reverse('individualprofile-me')  # using /me endpoint

    def test_last_active_updates_only_when_stale(self):
        # Set last_active to 6 minutes ago (stale)
        old_time = timezone.now() - timedelta(minutes=6)
        IndividualProfile.objects.filter(id=self.profile.id).update(last_active=old_time)
        self.client.get(self.url)
        self.profile.refresh_from_db()
        self.assertGreater(self.profile.last_active, old_time)

        # Set last_active to 2 minutes ago (not stale)
        recent_time = timezone.now() - timedelta(minutes=2)
        IndividualProfile.objects.filter(id=self.profile.id).update(last_active=recent_time)
        self.client.get(self.url)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.last_active, recent_time)