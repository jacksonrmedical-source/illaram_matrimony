from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from accounts.models import User
from profiles.models import IndividualProfile
from .models import Block, Report


class ModerationTests(APITestCase):
    def setUp(self):
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
        self.client.force_authenticate(user=self.user1)

    def test_block_user(self):
        url = reverse('block-list')
        data = {'blocked': str(self.profile2.id)}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Block.objects.filter(blocker=self.profile1, blocked=self.profile2).exists())

    def test_report_user(self):
        url = reverse('report-list')
        data = {
            'reported': str(self.profile2.id),
            'reason': 'fake_profile',
            'description': 'Suspicious profile'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Report.objects.filter(reporter=self.profile1, reported=self.profile2).exists())

    def test_cannot_block_self(self):
        url = reverse('block-list')
        data = {'blocked': str(self.profile1.id)}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)