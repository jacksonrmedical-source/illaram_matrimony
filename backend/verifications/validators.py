import os
from django.core.exceptions import ValidationError
from PIL import Image

ALLOWED_DOC_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png']
ALLOWED_SELFIE_EXTENSIONS = ['.jpg', '.jpeg', '.png']
MAX_DOC_SIZE = 5 * 1024 * 1024  # 5 MB
MAX_SELFIE_SIZE = 5 * 1024 * 1024


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
    except Exception:
        raise ValidationError("Invalid or corrupted selfie image.")
    value.seek(0)