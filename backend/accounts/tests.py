from rest_framework.test import APITestCase
from rest_framework import status
from django.core.cache import cache
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from .models import User
from profiles.models import IndividualProfile

class RegistrationSecurityTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.register_url = reverse('register')
        self.request_otp_url = reverse('request-otp')
        self.verify_otp_url = reverse('verify-otp')

    def test_register_without_otp_fails(self):
        response = self.client.post(self.register_url, {
            'phone': '1234567890',
            'password': 'testpass123',
            'confirm_password': 'testpass123',
            'role': 'individual'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Phone number not verified', str(response.data))

    def test_admin_role_rejected_after_otp(self):
        self.client.post(self.request_otp_url, {'phone': '1234567890'}, format='json')
        otp = cache.get('otp:1234567890')
        self.client.post(self.verify_otp_url, {'phone': '1234567890', 'otp': otp}, format='json')
        response = self.client.post(self.register_url, {
            'phone': '1234567890',
            'password': 'testpass123',
            'confirm_password': 'testpass123',
            'role': 'admin'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid role', str(response.data))

    def test_otp_lockout_after_5_wrong_attempts(self):
        self.client.post(self.request_otp_url, {'phone': '1234567890'}, format='json')
        for _ in range(5):
            response = self.client.post(self.verify_otp_url, {'phone': '1234567890', 'otp': '000000'}, format='json')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response = self.client.post(self.verify_otp_url, {'phone': '1234567890', 'otp': '000000'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
	
    def test_existing_user_cannot_register_again(self):
        # Create an existing user with a password
        User.objects.create_user(phone='9999999999', password='oldpassword123', role='individual')
        # Simulate OTP verification
        cache.set('otp_verified:9999999999', True, timeout=600)
        # Attempt to register with new password
        response = self.client.post(self.register_url, {
            'phone': '9999999999',
            'password': 'newpassword123',
            'confirm_password': 'newpassword123',
            'role': 'individual'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already registered', str(response.data))
        # Verify password unchanged
        user = User.objects.get(phone='9999999999')
        self.assertTrue(user.check_password('oldpassword123'))


class PremiumExpiryTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user1 = User.objects.create_user(phone='1111111111', password='testpass123', role='individual')
        self.profile1 = IndividualProfile.objects.create(
            user=self.user1, full_name='User One', gender='male', date_of_birth='1995-01-01',
            location_city='Chennai', location_country='India'
        )
        # Create 6 receiver profiles
        self.receivers = []
        for i in range(6):
            user = User.objects.create_user(phone=f'222222222{i}', password='testpass123', role='individual')
            profile = IndividualProfile.objects.create(
                user=user, full_name=f'Receiver {i}', gender='female', date_of_birth='1995-01-01',
                location_city='Chennai', location_country='India'
            )
            self.receivers.append(profile)

    def test_premium_expired_enforces_daily_limit(self):
        self.user1.is_premium = True
        self.user1.premium_expiry = timezone.now() - timedelta(days=1)
        self.user1.save()
        self.client.force_authenticate(user=self.user1)

        url = reverse('interest-list')
        for i in range(6):
            response = self.client.post(url, {'receiver': str(self.receivers[i].id)}, format='json')
            if i < 5:
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            else:
                self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    def test_active_premium_unlimited(self):
        self.user1.is_premium = True
        self.user1.premium_expiry = timezone.now() + timedelta(days=30)
        self.user1.save()
        self.client.force_authenticate(user=self.user1)

        url = reverse('interest-list')
        for i in range(6):
            response = self.client.post(url, {'receiver': str(self.receivers[i].id)}, format='json')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)