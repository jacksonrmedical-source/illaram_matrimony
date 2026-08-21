import secrets
from django.core.cache import cache

OTP_TIMEOUT = 300          # 5 minutes
TOKEN_TIMEOUT = 900        # 15 minutes
LOCKOUT_TIMEOUT = 1800     # 30 minutes
MAX_ATTEMPTS = 5

def generate_otp():
    return ''.join(secrets.choice('0123456789') for _ in range(6))

def issue_phone_verified_token(phone):
    token = secrets.token_urlsafe(32)
    cache.set(f'phone_verified:{phone}:{token}', True, timeout=TOKEN_TIMEOUT)
    return token

def consume_phone_verified_token(phone, token):
    key = f'phone_verified:{phone}:{token}'
    if cache.get(key):
        cache.delete(key)
        return True
    return False

def check_otp_lock(phone):
    return cache.get(f'otp_lock:{phone}')

def set_otp_lock(phone):
    cache.set(f'otp_lock:{phone}', True, timeout=LOCKOUT_TIMEOUT)

def increment_attempts(phone):
    key = f'otp_attempts:{phone}'
    attempts = cache.get(key, 0) + 1
    cache.set(key, attempts, timeout=OTP_TIMEOUT)
    return attempts