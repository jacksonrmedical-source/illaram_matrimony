from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.cache import cache
from django.utils import timezone
from django.conf import settings
from .models import Interest
from .serializers import InterestSerializer


class InterestViewSet(viewsets.ModelViewSet):
    serializer_class = InterestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'individual_profile'):
            profile = user.individual_profile
            return Interest.objects.filter(sender=profile) | Interest.objects.filter(receiver=profile)
        return Interest.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        profile = user.individual_profile

        # Enforce daily limit for non-staff users
        if not user.is_staff:
            limit = getattr(settings, 'DAILY_INTEREST_LIMIT', 5)
            today = timezone.now().date().isoformat()
            cache_key = f"interest_count:{user.id}:{today}"
            current_count = cache.get(cache_key, 0)

            if current_count >= limit:
                # Use Response to return a custom error
                from rest_framework.exceptions import Throttled
                raise Throttled(detail="Daily interest limit reached. Upgrade to premium for unlimited interests.")

            # Save the interest first
            interest = serializer.save(sender=profile)

            # Increment the counter
            cache.set(cache_key, current_count + 1, timeout=86400)  # 24 hours
            return interest
        else:
            return serializer.save(sender=profile)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        interest = self.get_object()
        if interest.receiver.user != request.user:
            return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        interest.status = Interest.Status.ACCEPTED
        interest.save()
        return Response(InterestSerializer(interest).data)

    @action(detail=True, methods=['post'])
    def decline(self, request, pk=None):
        interest = self.get_object()
        if interest.receiver.user != request.user:
            return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        interest.status = Interest.Status.DECLINED
        interest.save()
        return Response(InterestSerializer(interest).data)