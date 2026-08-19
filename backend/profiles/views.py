from rest_framework import viewsets, permissions
from .models import IndividualProfile, ParentProfile
from .serializers import IndividualProfileSerializer, ParentProfileSerializer
from .permissions import IsOwnerOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import FamilyLink
from .serializers import FamilyLinkSerializer
from django.shortcuts import get_object_or_404

class IndividualProfileViewSet(viewsets.ModelViewSet):
    serializer_class = IndividualProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = IndividualProfile.objects.all()  # Added for basename auto-detection

    def get_queryset(self):
        if self.request.user.is_staff:
            return IndividualProfile.objects.all()
        # For now, all authenticated users can view all profiles
        return IndividualProfile.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ParentProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ParentProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = ParentProfile.objects.all()      # Added for basename auto-detection

    def get_queryset(self):
        if self.request.user.is_staff:
            return ParentProfile.objects.all()
        return ParentProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FamilyLinkViewSet(viewsets.ModelViewSet):
    serializer_class = FamilyLinkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # If user has an individual profile, show family links where they are the individual.
        # If user has a parent profile, show links where they are the parent.
        if hasattr(user, 'individual_profile'):
            return FamilyLink.objects.filter(individual=user.individual_profile)
        elif hasattr(user, 'parent_profile'):
            return FamilyLink.objects.filter(parent=user.parent_profile)
        return FamilyLink.objects.none()

    def perform_create(self, serializer):
        # This is called when POST /api/profiles/family-links/ is used.
        # Only a parent should create a FamilyLink (request access).
        if not hasattr(self.request.user, 'parent_profile'):
            raise PermissionError("Only parents can request access")
        parent_profile = self.request.user.parent_profile
        # The 'individual' must be provided in the request data.
        serializer.save(parent=parent_profile, status='pending')

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        link = self.get_object()
        # Only the individual involved can approve
        if hasattr(request.user, 'individual_profile') and link.individual == request.user.individual_profile:
            link.status = 'approved'
            link.save()
            return Response(FamilyLinkSerializer(link).data)
        return Response({"detail": "You do not have permission to approve this request."}, status=403)

    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        link = self.get_object()
        # Both individual and parent can revoke (or only individual)
        if (hasattr(request.user, 'individual_profile') and link.individual == request.user.individual_profile) or \
           (hasattr(request.user, 'parent_profile') and link.parent == request.user.parent_profile):
            link.status = 'revoked'
            link.save()
            return Response(FamilyLinkSerializer(link).data)
        return Response({"detail": "You do not have permission to revoke this request."}, status=403)