import random
import string
from django.core.cache import cache
from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import PhoneSerializer, OTPSerializer, RegistrationSerializer


def generate_otp():
    return ''.join(random.choices(string.digits, k=6))


class RequestOTPView(views.APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'otp'

    def post(self, request):
        serializer = PhoneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']

        otp = generate_otp()
        cache.set(f'otp:{phone}', otp, timeout=300)
        print(f"OTP for {phone}: {otp}")

        return Response({"detail": "OTP sent successfully"}, status=status.HTTP_200_OK)


class VerifyOTPView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']
        otp = serializer.validated_data['otp']

        cached_otp = cache.get(f'otp:{phone}')
        if cached_otp and cached_otp == otp:
            cache.delete(f'otp:{phone}')
            user, created = User.objects.get_or_create(phone=phone)
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user_id': str(user.id),
                'is_new_user': created,
            }, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get('phone')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')
        email = request.data.get('email', '')
        role = request.data.get('role', 'individual')

        # Basic validation
        if not phone or not password or not confirm_password:
            return Response({"detail": "phone, password, confirm_password are required."}, status=status.HTTP_400_BAD_REQUEST)
        if password != confirm_password:
            return Response({"detail": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)
        if len(password) < 8:
            return Response({"detail": "Password must be at least 8 characters."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user already exists (created during OTP verification)
        user, created = User.objects.get_or_create(phone=phone)

        # Update user fields
        user.set_password(password)
        user.email = email if email else None
        if role in ['individual', 'parent', 'admin']:
            user.role = role
        else:
            user.role = 'individual'
        user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': str(user.id),
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)