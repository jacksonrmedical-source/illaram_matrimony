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
from .utils import exclude_blocked_profiles


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
        qs = IndividualProfile.objects.all()
        if hasattr(self.request.user, 'individual_profile'):
            qs = exclude_blocked_profiles(qs, self.request.user.individual_profile)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Return the current user's individual profile."""
        if not hasattr(request.user, 'individual_profile'):
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(request.user.individual_profile)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def request_photo(self, request, pk=None):
        profile = self.get_object()
        user = request.user
        if not hasattr(user, 'individual_profile'):
            return Response({"detail": "You must have an individual profile to request photos."}, status=403)
        if profile == user.individual_profile:
            return Response({"detail": "You cannot request photos from yourself."}, status=400)
        from interests.models import Interest
        from interests.serializers import InterestSerializer
        existing = Interest.objects.filter(sender=user.individual_profile, receiver=profile).first()
        if existing:
            existing.photo_request = True
            existing.save()
            return Response(InterestSerializer(existing).data)
        interest = Interest.objects.create(sender=user.individual_profile, receiver=profile, status='sent', photo_request=True)
        return Response(InterestSerializer(interest).data, status=201)


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
        return Response({"detail": "Not allowed"}, status=403)

    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        link = self.get_object()
        if (hasattr(request.user, 'individual_profile') and link.individual == request.user.individual_profile) or \
           (hasattr(request.user, 'parent_profile') and link.parent == request.user.parent_profile):
            link.status = 'revoked'
            link.save()
            return Response(FamilyLinkSerializer(link).data)
        return Response({"detail": "Not allowed"}, status=403)


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
        if hasattr(user, 'individual_profile') and photo.profile == user.individual_profile:
            return FileResponse(photo.image.open(), content_type='image/jpeg')
        from interests.models import Interest
        mutual = False
        if hasattr(user, 'individual_profile'):
            mutual = Interest.objects.filter(sender=user.individual_profile, receiver=photo.profile, status='accepted').exists() or \
                     Interest.objects.filter(sender=photo.profile, receiver=user.individual_profile, status='accepted').exists()
        if mutual:
            return FileResponse(photo.image.open(), content_type='image/jpeg')
        if photo.blurred_image:
            return FileResponse(photo.blurred_image.open(), content_type='image/jpeg')
        return Response({"detail": "Blurred image not available"}, status=404)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def set_primary(self, request, pk=None):
        photo = self.get_object()
        if not hasattr(request.user, 'individual_profile') or photo.profile != request.user.individual_profile:
            return Response({"detail": "Not allowed"}, status=403)
        Photo.objects.filter(profile=request.user.individual_profile).update(is_primary=False)
        photo.is_primary = True
        photo.save()
        return Response(PhotoSerializer(photo).data)