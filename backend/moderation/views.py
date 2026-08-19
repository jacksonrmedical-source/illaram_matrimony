from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Block, Report
from .serializers import BlockSerializer, ReportSerializer
from profiles.models import IndividualProfile


class BlockViewSet(viewsets.ModelViewSet):
    serializer_class = BlockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'individual_profile'):
            return Block.objects.filter(blocker=user.individual_profile)
        return Block.objects.none()

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'individual_profile'):
            raise PermissionDenied("You must have an individual profile to block users")
        blocker = self.request.user.individual_profile
        blocked_id = self.request.data.get('blocked')
        if not blocked_id:
            raise PermissionDenied("Blocked profile ID is required")
        try:
            blocked = IndividualProfile.objects.get(id=blocked_id)
        except IndividualProfile.DoesNotExist:
            raise PermissionDenied("Blocked profile not found")
        if blocked == blocker:
            raise PermissionDenied("You cannot block yourself")
        serializer.save(blocker=blocker, blocked=blocked)


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'individual_profile'):
            return Report.objects.filter(reporter=user.individual_profile)
        return Report.objects.none()

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'individual_profile'):
            raise PermissionDenied("You must have an individual profile to report users")
        reporter = self.request.user.individual_profile
        reported_id = self.request.data.get('reported')
        if not reported_id:
            raise PermissionDenied("Reported profile ID is required")
        try:
            reported = IndividualProfile.objects.get(id=reported_id)
        except IndividualProfile.DoesNotExist:
            raise PermissionDenied("Reported profile not found")
        if reported == reporter:
            raise PermissionDenied("You cannot report yourself")
        serializer.save(reporter=reporter, reported=reported)