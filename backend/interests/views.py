from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
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
        profile = self.request.user.individual_profile
        serializer.save(sender=profile)

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