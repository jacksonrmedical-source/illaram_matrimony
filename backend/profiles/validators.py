import os
from django.core.exceptions import ValidationError
from PIL import Image

ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB


def validate_image_file(value):
    # Check extension
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValidationError(f"Unsupported image extension '{ext}'. Allowed: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}")

    # Check size
    if value.size > MAX_IMAGE_SIZE:
        raise ValidationError("Image file too large. Maximum size is 5 MB.")

    # Validate it's a real image using Pillow
    try:
        img = Image.open(value)
        img.verify()  # Verify image integrity
    except Exception:
        raise ValidationError("Invalid or corrupted image file.")

    # Reset file pointer after verify
    value.seek(0)