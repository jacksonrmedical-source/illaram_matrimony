import uuid
from django.db import models
from profiles.models import IndividualProfile


class Block(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    blocker = models.ForeignKey(IndividualProfile, on_delete=models.CASCADE, related_name='blocks_made')
    blocked = models.ForeignKey(IndividualProfile, on_delete=models.CASCADE, related_name='blocks_received')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('blocker', 'blocked')  # Prevent duplicate blocks

    def __str__(self):
        return f"{self.blocker.full_name} blocked {self.blocked.full_name}"


class Report(models.Model):
    class Reason(models.TextChoices):
        FAKE_PROFILE = 'fake_profile', 'Fake Profile'
        INAPPROPRIATE_CONTENT = 'inappropriate_content', 'Inappropriate Content'
        HARASSMENT = 'harassment', 'Harassment'
        OTHER = 'other', 'Other'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reporter = models.ForeignKey(IndividualProfile, on_delete=models.CASCADE, related_name='reports_made')
    reported = models.ForeignKey(IndividualProfile, on_delete=models.CASCADE, related_name='reports_received')
    reason = models.CharField(max_length=50, choices=Reason.choices, default=Reason.OTHER)
    description = models.TextField(max_length=1000, blank=True)
    resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('reporter', 'reported')  # One report per pair (for simplicity)

    def __str__(self):
        return f"{self.reporter.full_name} reported {self.reported.full_name}"