from rest_framework.test import APITestCase
from rest_framework import status
from django.core.cache import cache
from django.urls import reverse
from django.utils import timezone
from accounts.models import User
from profiles.models import IndividualProfile
from .models import Interest


class InterestsTests(APITestCase):
    def setUp(self):
        cache.clear()
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

    def test_send_interest(self):
        url = reverse('interest-list')
        data = {'receiver': str(self.profile2.id)}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'sent')
        self.assertEqual(Interest.objects.count(), 1)

    def test_daily_limit(self):
        # Create 6 additional receivers
        for i in range(6):
            user = User.objects.create_user(phone=f'999000000{i}', password='testpass123', role='individual')
            IndividualProfile.objects.create(
                user=user,
                full_name=f'Dummy {i}',
                gender='female',
                date_of_birth='1995-01-01',
                location_city='Chennai',
                location_country='India',
            )
        receivers = IndividualProfile.objects.exclude(id=self.profile1.id)[:6]
        url = reverse('interest-list')
        for i, receiver in enumerate(receivers):
            data = {'receiver': str(receiver.id)}
            response = self.client.post(url, data, format='json')
            if i < 5:
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            else:
                self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    def test_premium_unlimited_interests(self):
        # Make user1 premium
        self.user1.is_premium = True
        self.user1.save()
        # Create 6 receivers and send interests; all should succeed
        for i in range(6):
            user = User.objects.create_user(phone=f'888000000{i}', password='testpass123', role='individual')
            IndividualProfile.objects.create(
                user=user,
                full_name=f'Premium Target {i}',
                gender='female',
                date_of_birth='1995-01-01',
                location_city='Chennai',
                location_country='India',
            )
        receivers = IndividualProfile.objects.exclude(id=self.profile1.id)[:6]
        url = reverse('interest-list')
        for receiver in receivers:
            data = {'receiver': str(receiver.id)}
            response = self.client.post(url, data, format='json')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_accept_interest(self):
        interest = Interest.objects.create(sender=self.profile1, receiver=self.profile2, status='sent')
        self.client.force_authenticate(user=self.user2)
        url = reverse('interest-accept', args=[interest.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        interest.refresh_from_db()
        self.assertEqual(interest.status, 'accepted')

    def test_filter_by_status(self):
        interest = Interest.objects.create(sender=self.profile1, receiver=self.profile2, status='sent')
        url = reverse('interest-list') + '?status=sent'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)