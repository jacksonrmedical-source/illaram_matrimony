import re
from rest_framework import serializers
from .models import User
from profiles.models import ParentProfile

PHONE_REGEX = r'^\+?[1-9]\d{7,14}$'

class PhoneSerializer(serializers.Serializer):
    phone = serializers.RegexField(regex=PHONE_REGEX, required=True)

class OTPSerializer(serializers.Serializer):
    phone = serializers.RegexField(regex=PHONE_REGEX, required=True)
    otp = serializers.CharField(min_length=6, max_length=6)

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('phone', 'password', 'confirm_password', 'email')
        extra_kwargs = {'phone': {'validators': []}}

    def validate_password(self, value):
        # Complex enough: at least one letter and one digit
        if not re.search(r'[A-Za-z]', value) or not re.search(r'\d', value):
            raise serializers.ValidationError('Password must contain at least one letter and one number.')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError('Passwords do not match.')
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return User.objects.create_user(**validated_data)

class ParentRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    relation = serializers.CharField(max_length=50, required=True)
    family_member_name = serializers.CharField(max_length=100, required=True)

    class Meta:
        model = User
        fields = ('phone', 'password', 'confirm_password', 'email', 'relation', 'family_member_name')
        extra_kwargs = {'phone': {'validators': []}}

    def validate_password(self, value):
        if not re.search(r'[A-Za-z]', value) or not re.search(r'\d', value):
            raise serializers.ValidationError('Password must contain at least one letter and one number.')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError('Passwords do not match.')
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('confirm_password')
        relation = validated_data.pop('relation')
        family_member_name = validated_data.pop('family_member_name')
        user = User.objects.create_user(password=password, **validated_data)
        user.role = 'parent'
        user.save()
        ParentProfile.objects.create(user=user, full_name=family_member_name, relation=relation)
        return user