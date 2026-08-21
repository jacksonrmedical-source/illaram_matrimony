from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from django.core.cache import cache
from django.utils import timezone
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend

from .models import Interest
from .serializers import InterestSerializer
from .filters import InterestFilter
from notifications.services import send_email_notification, send_sms_notification
from profiles.models import IndividualProfile
from moderation.models import Block


class InterestViewSet(viewsets.ModelViewSet):
    serializer_class = InterestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = InterestFilter
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'individual_profile'):
            profile = user.individual_profile
            qs = Interest.objects.filter(sender=profile) | Interest.objects.filter(receiver=profile)
            # Exclude blocked users
            blocked_ids = Block.objects.filter(blocker=profile).values_list('blocked_id', flat=True)
            blocked_by_ids = Block.objects.filter(blocked=profile).values_list('blocker_id', flat=True)
            return qs.exclude(sender_id__in=blocked_ids).exclude(receiver_id__in=blocked_ids).exclude(sender_id__in=blocked_by_ids).exclude(receiver_id__in=blocked_by_ids)
        return Interest.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        profile = user.individual_profile

        # Block check
        receiver_id = self.request.data.get('receiver')
        if receiver_id:
            try:
                receiver = IndividualProfile.objects.get(id=receiver_id)
            except IndividualProfile.DoesNotExist:
                raise PermissionDenied("Receiver not found.")
            if Block.objects.filter(blocker=profile, blocked=receiver).exists() or Block.objects.filter(blocker=receiver, blocked=profile).exists():
                raise PermissionDenied("You cannot send interest to this user.")

        # Enforce daily limit for non-staff non-premium users
        if not user.is_staff and not user.has_active_premium:
            limit = getattr(settings, 'DAILY_INTEREST_LIMIT', 5)
            today = timezone.now().date().isoformat()
            cache_key = f"interest_count:{user.id}:{today}"
            current_count = cache.get(cache_key, 0)

            if current_count >= limit:
                from rest_framework.exceptions import Throttled
                raise Throttled(detail="Daily interest limit reached. Upgrade to premium for unlimited interests.")

            interest = serializer.save(sender=profile)
            cache.set(cache_key, current_count + 1, timeout=86400)
        else:
            interest = serializer.save(sender=profile)

        # Send notifications (existing)
        receiver_email = interest.receiver.user.email
        if receiver_email:
            send_email_notification(
                "You received a new interest on Illaram",
                f"{profile.full_name} has sent you an interest. Log in to view.",
                receiver_email
            )
        send_sms_notification(interest.receiver.user.phone, "You received a new interest on Illaram.")

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        interest = self.get_object()
        if interest.receiver.user != request.user:
            return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        interest.status = Interest.Status.ACCEPTED
        interest.save()

        sender_email = interest.sender.user.email
        if sender_email:
            send_email_notification(
                "Your interest was accepted",
                f"{interest.receiver.full_name} accepted your interest. You can now chat.",
                sender_email
            )
        send_sms_notification(interest.sender.user.phone, "Your interest was accepted on Illaram.")
        return Response(InterestSerializer(interest).data)

    @action(detail=True, methods=['post'])
    def decline(self, request, pk=None):
        interest = self.get_object()
        if interest.receiver.user != request.user:
            return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        interest.status = Interest.Status.DECLINED
        interest.save()
        return Response(InterestSerializer(interest).data)