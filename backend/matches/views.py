from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Shortlist
from .serializers import ShortlistSerializer
from profiles.models import IndividualProfile


class ShortlistViewSet(viewsets.ModelViewSet):
    serializer_class = ShortlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'individual_profile'):
            return Shortlist.objects.filter(user_profile=self.request.user.individual_profile).order_by('-created_at')
        return Shortlist.objects.none()

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'individual_profile'):
            raise PermissionDenied("You must have an individual profile to shortlist")
        saved_id = self.request.data.get('saved_profile')
        if not saved_id:
            raise PermissionDenied("saved_profile ID is required")
        try:
            saved = IndividualProfile.objects.get(id=saved_id)
        except IndividualProfile.DoesNotExist:
            raise PermissionDenied("Profile not found")
        if saved == self.request.user.individual_profile:
            raise PermissionDenied("Cannot shortlist yourself")
        if Shortlist.objects.filter(user_profile=self.request.user.individual_profile, saved_profile=saved).exists():
            raise PermissionDenied("Already shortlisted")
        serializer.save(user_profile=self.request.user.individual_profile, saved_profile=saved)