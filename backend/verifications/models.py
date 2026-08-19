import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class Verification(models.Model):
    class VerificationType(models.TextChoices):
        SELFIE = 'selfie', _('Selfie')
        GOVERNMENT_ID = 'government_id', _('Government ID')
        BACKGROUND = 'background', _('Background Check')
        OTP = 'otp', _('OTP')

    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        IN_PROGRESS = 'in_progress', _('In Progress')
        APPROVED = 'approved', _('Approved')
        REJECTED = 'rejected', _('Rejected')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='verifications')
    verification_type = models.CharField(max_length=20, choices=VerificationType.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    document = models.FileField(upload_to='verifications/', blank=True, null=True)
    selfie_image = models.ImageField(upload_to='selfies/', blank=True, null=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'verification_type')

    def __str__(self):
        return f"{self.user.phone} - {self.verification_type} ({self.status})"