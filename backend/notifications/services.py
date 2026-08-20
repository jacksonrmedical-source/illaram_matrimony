import os
import requests
from django.core.mail import send_mail
from django.conf import settings


def send_email_notification(subject, message, recipient_email):
    """Send an email using SMTP configured in settings."""
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
    """Send an SMS using a provider API.
    Supports Twilio or MSG91 based on settings.
    """
    if not phone:
        return

    provider = getattr(settings, 'SMS_PROVIDER', 'console').lower()

    if provider == 'twilio':
        _send_twilio_sms(phone, message)
    elif provider == 'msg91':
        _send_msg91_sms(phone, message)
    else:
        # Fallback to console for development
        print(f"[SMS to {phone}]: {message}")


def _send_twilio_sms(phone, message):
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    from_number = os.getenv('TWILIO_FROM_NUMBER')

    if not all([account_sid, auth_token, from_number]):
        print("Twilio credentials missing. SMS not sent.")
        return

    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    data = {
        'From': from_number,
        'To': phone,
        'Body': message
    }
    response = requests.post(url, data=data, auth=(account_sid, auth_token))
    if response.status_code >= 400:
        print(f"Twilio SMS error: {response.text}")


def _send_msg91_sms(phone, message):
    authkey = os.getenv('MSG91_AUTH_KEY')
    sender_id = os.getenv('MSG91_SENDER_ID', 'ILLARM')
    if not authkey:
        print("MSG91 auth key missing. SMS not sent.")
        return

    # Remove non-digits from phone for MSG91 (expects country code without +)
    clean_phone = phone.replace('+', '').replace(' ', '').replace('-', '')
    if not clean_phone.startswith('91'):
        clean_phone = '91' + clean_phone  # Assume India if no country code

    url = "https://api.msg91.com/api/v5/flow/"
    headers = {
        'authkey': authkey,
        'content-type': 'application/json'
    }
    payload = {
        "sender": sender_id,
        "route": "4",
        "country": "91",
        "sms": [
            {"message": message, "to": [clean_phone]}
        ]
    }
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code >= 400:
        print(f"MSG91 SMS error: {response.text}")