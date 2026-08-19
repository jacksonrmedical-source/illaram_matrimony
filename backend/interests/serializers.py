from rest_framework import serializers
from .models import Interest


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = '__all__'
        read_only_fields = ('sender', 'created_at', 'updated_at')