import secrets
from django.core.cache import cache
from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import PhoneSerializer, OTPSerializer, RegistrationSerializer


def generate_otp():
    return ''.join(secrets.choice('0123456789') for _ in range(6))


class RequestOTPView(views.APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'otp'

    def post(self, request):
        serializer = PhoneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']

        # Check if already locked out
        lock_key = f'otp_lock:{phone}'
        if cache.get(lock_key):
            return Response({"detail": "Too many OTP attempts. Try again later."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        otp = generate_otp()
        cache.set(f'otp:{phone}', otp, timeout=300)  # 5 minutes
        print(f"OTP for {phone}: {otp}")  # dev only

        return Response({"detail": "OTP sent successfully"}, status=status.HTTP_200_OK)


class VerifyOTPView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']
        otp = serializer.validated_data['otp']

        lock_key = f'otp_lock:{phone}'
        if cache.get(lock_key):
            return Response({"detail": "Too many OTP attempts. Try again later."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        cached_otp = cache.get(f'otp:{phone}')
        if cached_otp and cached_otp == otp:
            cache.delete(f'otp:{phone}')
            cache.set(f'otp_verified:{phone}', True, timeout=600)  # 10 minutes to complete registration
            user, created = User.objects.get_or_create(phone=phone)
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user_id': str(user.id),
                'is_new_user': created,
            }, status=status.HTTP_200_OK)

        # Increment failed attempts
        attempts_key = f'otp_attempts:{phone}'
        attempts = cache.get(attempts_key, 0) + 1
        cache.set(attempts_key, attempts, timeout=300)
        if attempts >= 5:
            cache.set(lock_key, True, timeout=600)  # 10 min lock
        return Response({"detail": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get('phone')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')
        email = request.data.get('email', '')
        role = request.data.get('role', 'individual')

        # Validate OTP verified
        if not cache.get(f'otp_verified:{phone}'):
            return Response({"detail": "Phone number not verified. Please verify OTP first."}, status=status.HTTP_400_BAD_REQUEST)

        # Role restriction
        if role not in ['individual', 'parent']:
            return Response({"detail": "Invalid role."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user already exists and has usable password
        user = User.objects.filter(phone=phone).first()
        if user and user.has_usable_password():
            return Response({"detail": "Phone number already registered. Please login."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate using serializer (will not check uniqueness)
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Create or update user
        user, created = User.objects.get_or_create(phone=phone)
        user.set_password(password)
        user.email = email if email else None
        user.role = role
        user.save()

        # Consume OTP verified flag
        cache.delete(f'otp_verified:{phone}')

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': str(user.id),
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)