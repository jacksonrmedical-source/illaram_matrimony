from django.core.mail import send_mail
from django.conf import settings


def send_email_notification(subject, message, recipient_email):
    """Send an email notification. For dev, it prints to console."""
    if not recipient_email:
        return
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [recipient_email],
        fail_silently=False,
    )


def send_sms_notification(phone, message):
    """
    Placeholder for SMS sending.
    For now, just print to console. Later integrate Twilio/MSG91.
    """
    # In production, call your SMS provider's API here.
    print(f"[SMS to {phone}]: {message}")