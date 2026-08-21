from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from accounts.models import User
from profiles.models import IndividualProfile
from moderation.models import Block

class ChatBlockTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(phone='1111111111', password='testpass123', role='individual')
        self.user2 = User.objects.create_user(phone='2222222222', password='testpass123', role='individual')
        self.profile1 = IndividualProfile.objects.create(user=self.user1, full_name='User One', gender='male', date_of_birth='1995-01-01', location_city='Chennai', location_country='India')
        self.profile2 = IndividualProfile.objects.create(user=self.user2, full_name='User Two', gender='female', date_of_birth='1995-01-01', location_city='Chennai', location_country='India')
        self.client.force_authenticate(user=self.user1)

    def test_cannot_start_conversation_with_blocked(self):
        Block.objects.create(blocker=self.profile1, blocked=self.profile2)
        url = reverse('conversation-list')
        response = self.client.post(url, {'participant_id': str(self.profile2.id)}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)