from rest_framework import serializers
from .models import Verification


class VerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = '__all__'
        read_only_fields = ('user', 'status', 'created_at', 'updated_at')