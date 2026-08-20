import os
from django.core.exceptions import ValidationError
from PIL import Image

ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB
MIN_WIDTH = 200
MIN_HEIGHT = 200
MAX_WIDTH = 8000
MAX_HEIGHT = 8000


def validate_image_file(value):
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValidationError(f"Unsupported image extension '{ext}'. Allowed: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}")
    if value.size > MAX_IMAGE_SIZE:
        raise ValidationError("Image file too large. Maximum size is 5 MB.")
    try:
        img = Image.open(value)
        img.verify()
        # Re-open after verify
        img = Image.open(value)
        width, height = img.size
        if width < MIN_WIDTH or height < MIN_HEIGHT:
            raise ValidationError(f"Image dimensions too small. Minimum is {MIN_WIDTH}x{MIN_HEIGHT} pixels.")
        if width > MAX_WIDTH or height > MAX_HEIGHT:
            raise ValidationError(f"Image dimensions too large. Maximum is {MAX_WIDTH}x{MAX_HEIGHT} pixels.")
    except ValidationError:
        raise
    except Exception:
        raise ValidationError("Invalid or corrupted image file.")
    value.seek(0)