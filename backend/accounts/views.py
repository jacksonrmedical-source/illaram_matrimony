import random
import string
from django.core.cache import cache
from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
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
        # In production, send OTP via SMS (e.g., Twilio, MSG91)
        # For development, store in cache for 5 minutes
        cache.set(f'otp:{phone}', otp, timeout=300)
        print(f"OTP for {phone}: {otp}")  # Remove in production

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
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': str(user.id),
        }, status=status.HTTP_201_CREATED)