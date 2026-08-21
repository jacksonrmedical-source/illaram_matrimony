from rest_framework import serializers
from .models import User


class PhoneSerializer(serializers.Serializer):
    phone = serializers.RegexField(regex=r'^\+?[0-9]{8,15}$', required=True)


class OTPSerializer(serializers.Serializer):
    phone = serializers.RegexField(regex=r'^\+?[0-9]{8,15}$', required=True)
    otp = serializers.CharField(min_length=6, max_length=6)


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('phone', 'password', 'confirm_password', 'email', 'role')

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return attrs