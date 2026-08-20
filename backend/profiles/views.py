from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import PermissionDenied
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

from .models import IndividualProfile, ParentProfile, FamilyLink, Photo
from .serializers import IndividualProfileSerializer, ParentProfileSerializer, FamilyLinkSerializer, PhotoSerializer
from .permissions import IsOwnerOrReadOnly
from .filters import IndividualProfileFilter


class IndividualProfileViewSet(viewsets.ModelViewSet):
    serializer_class = IndividualProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = IndividualProfile.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = IndividualProfileFilter
    search_fields = ['full_name', 'education', 'profession', 'about_me', 'location_city', 'location_state', 'location_country']
    ordering_fields = ['last_active', 'created_at', 'date_of_birth']
    ordering = ['-last_active']

    def get_queryset(self):
        if self.request.user.is_staff:
            return IndividualProfile.objects.all()
        return IndividualProfile.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def request_photo(self, request, pk=None):
        """Send an interest with photo_request=True to the target profile."""
        profile = self.get_object()
        user = request.user

        if not hasattr(user, 'individual_profile'):
            return Response({"detail": "You must have an individual profile to request photos."}, status=status.HTTP_403_FORBIDDEN)

        if profile == user.individual_profile:
            return Response({"detail": "You cannot request photos from yourself."}, status=status.HTTP_400_BAD_REQUEST)

        from interests.models import Interest
        from interests.serializers import InterestSerializer

        existing = Interest.objects.filter(sender=user.individual_profile, receiver=profile).first()
        if existing:
            existing.photo_request = True
            existing.save()
            return Response(InterestSerializer(existing).data, status=status.HTTP_200_OK)

        interest = Interest.objects.create(
            sender=user.individual_profile,
            receiver=profile,
            status=Interest.Status.SENT,
            photo_request=True
        )
        return Response(InterestSerializer(interest).data, status=status.HTTP_201_CREATED)


class ParentProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ParentProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = ParentProfile.objects.all()

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
        if hasattr(user, 'individual_profile'):
            return FamilyLink.objects.filter(individual=user.individual_profile)
        elif hasattr(user, 'parent_profile'):
            return FamilyLink.objects.filter(parent=user.parent_profile)
        return FamilyLink.objects.none()

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'parent_profile'):
            raise PermissionDenied("Only parents can request access")
        parent_profile = self.request.user.parent_profile
        serializer.save(parent=parent_profile, status='pending')

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        link = self.get_object()
        if hasattr(request.user, 'individual_profile') and link.individual == request.user.individual_profile:
            link.status = 'approved'
            link.save()
            return Response(FamilyLinkSerializer(link).data)
        return Response({"detail": "You do not have permission to approve this request."}, status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        link = self.get_object()
        if (hasattr(request.user, 'individual_profile') and link.individual == request.user.individual_profile) or \
           (hasattr(request.user, 'parent_profile') and link.parent == request.user.parent_profile):
            link.status = 'revoked'
            link.save()
            return Response(FamilyLinkSerializer(link).data)
        return Response({"detail": "You do not have permission to revoke this request."}, status=status.HTTP_403_FORBIDDEN)


class PhotoViewSet(viewsets.ModelViewSet):
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]
    queryset = Photo.objects.all()

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'individual_profile'):
            return Photo.objects.filter(profile=user.individual_profile)
        return Photo.objects.none()

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'individual_profile'):
            raise PermissionDenied("You must have an individual profile to upload photos")
        serializer.save(profile=self.request.user.individual_profile)

    @action(detail=True, methods=['get'])
    def view(self, request, pk=None):
        photo = get_object_or_404(Photo, pk=pk)
        user = request.user

        # Owner sees original
        if hasattr(user, 'individual_profile') and photo.profile == user.individual_profile:
            return FileResponse(photo.image.open(), content_type='image/jpeg')

        # Check mutual interest
        from interests.models import Interest
        mutual = False
        if hasattr(user, 'individual_profile'):
            mutual = Interest.objects.filter(
                sender=user.individual_profile, receiver=photo.profile, status='accepted'
            ).exists() or Interest.objects.filter(
                sender=photo.profile, receiver=user.individual_profile, status='accepted'
            ).exists()

        if mutual:
            return FileResponse(photo.image.open(), content_type='image/jpeg')
        else:
            if photo.blurred_image:
                return FileResponse(photo.blurred_image.open(), content_type='image/jpeg')
            return Response({"detail": "Blurred image not available"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def set_primary(self, request, pk=None):
        photo = self.get_object()
        # Ensure the photo belongs to the current user
        if not hasattr(request.user, 'individual_profile') or photo.profile != request.user.individual_profile:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        # Unset primary on all photos of the profile
        Photo.objects.filter(profile=request.user.individual_profile).update(is_primary=False)
        # Set this photo as primary
        photo.is_primary = True
        photo.save()

        return Response(PhotoSerializer(photo).data)