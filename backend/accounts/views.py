from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import PhoneSerializer, OTPSerializer, RegistrationSerializer, ParentRegistrationSerializer
from .utils import generate_otp, issue_phone_verified_token, consume_phone_verified_token, check_otp_lock, set_otp_lock, increment_attempts
from django.core.cache import cache

class RequestOTPView(views.APIView):
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'otp'

    def post(self, request):
        print('Register payload:', request.data)
        serializer = PhoneSerializer(data=request.data)
        if not serializer.is_valid():
            print('Serializer errors:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        phone = serializer.validated_data['phone']

        if check_otp_lock(phone):
            return Response({"detail": "Too many OTP attempts. Try again later."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        otp = generate_otp()
        cache.set(f'otp:{phone}', otp, timeout=300)
        print(f"OTP for {phone}: {otp}")  # dev only

        return Response({"detail": "OTP sent successfully"}, status=status.HTTP_200_OK)

class VerifyOTPView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print('Register payload:', request.data)
        serializer = OTPSerializer(data=request.data)
        if not serializer.is_valid():
            print('Serializer errors:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        phone = serializer.validated_data['phone']
        otp = serializer.validated_data['otp']

        if check_otp_lock(phone):
            return Response({"detail": "Too many OTP attempts. Try again later."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        cached_otp = cache.get(f'otp:{phone}')
        if cached_otp and cached_otp == otp:
            cache.delete(f'otp:{phone}')
            token = issue_phone_verified_token(phone)
            return Response({'token': token, 'detail': 'OTP verified'}, status=status.HTTP_200_OK)

        attempts = increment_attempts(phone)
        if attempts >= 5:
            set_otp_lock(phone)
        return Response({"detail": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print('Register payload:', request.data)
        phone = request.data.get('phone')
        token = request.data.get('token')
        role = request.data.get('role', 'individual')

        if role not in ['individual', 'parent']:
            return Response({"detail": "Invalid role."}, status=status.HTTP_400_BAD_REQUEST)

        if not consume_phone_verified_token(phone, token):
            return Response({"detail": "Phone number not verified."}, status=status.HTTP_400_BAD_REQUEST)

        existing = User.objects.filter(phone=phone).first()
        if existing:
            return Response({"detail": "Phone number already registered."}, status=status.HTTP_400_BAD_REQUEST)

        if role == 'parent':
            serializer = ParentRegistrationSerializer(data=request.data)
        else:
            serializer = RegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            print('Serializer errors:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': str(user.id),
        }, status=status.HTTP_201_CREATED)