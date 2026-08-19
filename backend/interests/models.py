import uuid
from django.db import models
from django.conf import settings
from profiles.models import IndividualProfile


class Interest(models.Model):
    class Status(models.TextChoices):
        SENT = 'sent', 'Sent'
        ACCEPTED = 'accepted', 'Accepted'
        DECLINED = 'declined', 'Declined'
        PHOTO_REQUESTED = 'photo_requested', 'Photo Requested'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(IndividualProfile, on_delete=models.CASCADE, related_name='sent_interests')
    receiver = models.ForeignKey(IndividualProfile, on_delete=models.CASCADE, related_name='received_interests')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SENT)
    photo_request = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('sender', 'receiver')

    def __str__(self):
        return f"{self.sender.full_name} -> {self.receiver.full_name} ({self.status})"