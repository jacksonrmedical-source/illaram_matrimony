from rest_framework import viewsets, permissions
from .models import IndividualProfile, ParentProfile
from .serializers import IndividualProfileSerializer, ParentProfileSerializer
from .permissions import IsOwnerOrReadOnly


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