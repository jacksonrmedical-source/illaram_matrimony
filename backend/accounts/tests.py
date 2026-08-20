from rest_framework.test import APITestCase
from rest_framework import status
from django.core.cache import cache
from django.urls import reverse
from .models import User


class AccountsTests(APITestCase):
    def setUp(self):
        cache.clear()  # Clear cache before each test

    def test_request_otp(self):
        url = reverse('request-otp')  # name from accounts/urls.py
        data = {'phone': '9876543210'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # OTP should be stored in cache
        otp = cache.get('otp:9876543210')
        self.assertIsNotNone(otp)
        self.assertEqual(len(otp), 6)

    def test_verify_otp_and_get_token(self):
        # Request OTP first
        self.client.post(reverse('request-otp'), {'phone': '9876543210'}, format='json')
        otp = cache.get('otp:9876543210')

        # Verify OTP
        url = reverse('verify-otp')
        data = {'phone': '9876543210', 'otp': otp}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertTrue(User.objects.filter(phone='9876543210').exists())

    def test_register_user(self):
        url = reverse('register')
        data = {
            'phone': '9876543210',
            'password': 'testpass123',
            'confirm_password': 'testpass123',
            'email': 'test@example.com',
            'role': 'individual'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        user = User.objects.get(phone='9876543210')
        self.assertEqual(user.email, 'test@example.com')