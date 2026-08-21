from django.utils import timezone
from datetime import timedelta
from profiles.models import IndividualProfile

class UpdateLastActiveMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.user.is_authenticated:
            last_active = IndividualProfile.objects.filter(user=request.user).values_list('last_active', flat=True).first()
            if last_active is None or timezone.now() - last_active > timedelta(minutes=5):
                IndividualProfile.objects.filter(user=request.user).update(last_active=timezone.now())
        return response