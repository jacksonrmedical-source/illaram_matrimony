import uuid
from django.db import models
from profiles.models import IndividualProfile


class Shortlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_profile = models.ForeignKey(IndividualProfile, on_delete=models.CASCADE, related_name='shortlists')
    saved_profile = models.ForeignKey(IndividualProfile, on_delete=models.CASCADE, related_name='shortlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user_profile', 'saved_profile')

    def __str__(self):
        return f"{self.user_profile.full_name} shortlisted {self.saved_profile.full_name}"