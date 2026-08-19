from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Verification
from .serializers import VerificationSerializer
from .permissions import IsOwnerOrReadOnly


class VerificationViewSet(viewsets.ModelViewSet):
    serializer_class = VerificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Verification.objects.all()
        return Verification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def submit_selfie(self, request):
        if 'selfie' not in request.FILES:
            return Response({'detail': 'Selfie image required'}, status=status.HTTP_400_BAD_REQUEST)
        selfie_file = request.FILES['selfie']
        verification, created = Verification.objects.get_or_create(
            user=request.user,
            verification_type=Verification.VerificationType.SELFIE,
            defaults={'selfie_image': selfie_file, 'status': Verification.Status.PENDING}
        )
        if not created:
            verification.selfie_image = selfie_file
            verification.status = Verification.Status.PENDING
            verification.save()
        return Response(VerificationSerializer(verification).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def submit_govt_id(self, request):
        if 'document' not in request.FILES:
            return Response({'detail': 'Government ID document required'}, status=status.HTTP_400_BAD_REQUEST)
        doc_file = request.FILES['document']
        verification, created = Verification.objects.get_or_create(
            user=request.user,
            verification_type=Verification.VerificationType.GOVERNMENT_ID,
            defaults={'document': doc_file, 'status': Verification.Status.PENDING}
        )
        if not created:
            verification.document = doc_file
            verification.status = Verification.Status.PENDING
            verification.save()
        return Response(VerificationSerializer(verification).data, status=status.HTTP_200_OK)