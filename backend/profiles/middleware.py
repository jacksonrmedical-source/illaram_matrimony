from django.utils import timezone
from profiles.models import IndividualProfile

class UpdateLastActiveMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        # If user is authenticated and has an individual profile, update last_active
        if request.user.is_authenticated and hasattr(request.user, 'individual_profile'):
            profile = request.user.individual_profile
            profile.last_active = timezone.now()
            profile.save(update_fields=['last_active'])
        return response