# profiles/middleware.py
from django.utils import timezone
from profiles.models import IndividualProfile

class UpdateLastActiveMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.user.is_authenticated:
            IndividualProfile.objects.filter(user=request.user).update(
                last_active=timezone.now()
            )
        return response