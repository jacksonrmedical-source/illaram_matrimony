import os
from django.core.exceptions import ValidationError
from PIL import Image

ALLOWED_DOC_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png']
ALLOWED_SELFIE_EXTENSIONS = ['.jpg', '.jpeg', '.png']
MAX_DOC_SIZE = 5 * 1024 * 1024
MAX_SELFIE_SIZE = 5 * 1024 * 1024
MIN_SELFIE_WIDTH = 200
MIN_SELFIE_HEIGHT = 200
MAX_SELFIE_WIDTH = 8000
MAX_SELFIE_HEIGHT = 8000


def validate_document_file(value):
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in ALLOWED_DOC_EXTENSIONS:
        raise ValidationError(f"Unsupported document extension '{ext}'. Allowed: {', '.join(ALLOWED_DOC_EXTENSIONS)}")
    if value.size > MAX_DOC_SIZE:
        raise ValidationError("Document file too large. Maximum size is 5 MB.")


def validate_selfie_image(value):
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in ALLOWED_SELFIE_EXTENSIONS:
        raise ValidationError(f"Unsupported image extension '{ext}'. Allowed: {', '.join(ALLOWED_SELFIE_EXTENSIONS)}")
    if value.size > MAX_SELFIE_SIZE:
        raise ValidationError("Selfie image too large. Maximum size is 5 MB.")
    try:
        img = Image.open(value)
        img.verify()
        img = Image.open(value)
        width, height = img.size
        if width < MIN_SELFIE_WIDTH or height < MIN_SELFIE_HEIGHT:
            raise ValidationError(f"Selfie dimensions too small. Minimum is {MIN_SELFIE_WIDTH}x{MIN_SELFIE_HEIGHT} pixels.")
        if width > MAX_SELFIE_WIDTH or height > MAX_SELFIE_HEIGHT:
            raise ValidationError(f"Selfie dimensions too large. Maximum is {MAX_SELFIE_WIDTH}x{MAX_SELFIE_HEIGHT} pixels.")
    except ValidationError:
        raise
    except Exception:
        raise ValidationError("Invalid or corrupted selfie image.")
    value.seek(0)