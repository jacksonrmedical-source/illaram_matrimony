from django.http import FileResponse, Http404
from django.conf import settings
from django.shortcuts import get_object_or_404
from profiles.models import Photo
import os

def protected_media_view(request, path):
    # Only allow authenticated users for media
    if not request.user.is_authenticated:
        raise Http404

    # Normalize path
    full_path = os.path.join(settings.MEDIA_ROOT, path)

    # Block original photos and verification docs
    if path.startswith('profile_photos/') and not path.startswith('profile_photos/blurred/'):
        raise Http404
    if path.startswith('verifications/'):
        raise Http404

    if not os.path.exists(full_path):
        raise Http404

    return FileResponse(open(full_path, 'rb'))