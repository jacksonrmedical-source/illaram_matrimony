from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from profiles.models import IndividualProfile
from interests.models import Interest
from moderation.models import Block


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'individual_profile'):
            return Conversation.objects.filter(participants=user.individual_profile).order_by('-updated_at')
        return Conversation.objects.none()

    def create(self, request, *args, **kwargs):
        """Custom create: verify match, prevent duplicates, and start conversation."""
        user = request.user
        if not hasattr(user, 'individual_profile'):
            raise PermissionDenied("You must have an individual profile to start a conversation")

        participant_id = request.data.get('participant_id')
        if not participant_id:
            return Response({"detail": "participant_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        other_profile = get_object_or_404(IndividualProfile, id=participant_id)
        if other_profile == user.individual_profile:
            return Response({"detail": "Cannot start conversation with yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # Check accepted interest
        accepted_interest = Interest.objects.filter(
            sender=user.individual_profile, receiver=other_profile, status='accepted'
        ).exists() or Interest.objects.filter(
            sender=other_profile, receiver=user.individual_profile, status='accepted'
        ).exists()
        if not accepted_interest:
            raise PermissionDenied("You can only chat with users you have matched with.")

        # Check existing conversation
        existing = Conversation.objects.filter(participants=user.individual_profile).filter(participants=other_profile).first()
        if existing:
            serializer = self.get_serializer(existing)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Create conversation and add participants
        conversation = Conversation.objects.create()
        conversation.participants.add(user.individual_profile, other_profile)
        conversation.save()

        serializer = self.get_serializer(conversation)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        if not conversation.participants.filter(id=request.user.individual_profile.id).exists():
            raise PermissionDenied("You are not a participant in this conversation.")
        messages = conversation.messages.all()
        # Mark incoming messages as read
        messages.filter(is_read=False).exclude(sender=request.user.individual_profile).update(is_read=True)
        return Response(MessageSerializer(messages, many=True).data)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        if not conversation.participants.filter(id=request.user.individual_profile.id).exists():
            raise PermissionDenied("You are not a participant in this conversation.")
        text = request.data.get('text')
        if not text:
            return Response({"detail": "Message text is required."}, status=status.HTTP_400_BAD_REQUEST)
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user.individual_profile,
            text=text
        )
        conversation.save()  # update updated_at
        return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)