from rest_framework import serializers
from .models import IndividualProfile, ParentProfile, FamilyLink


class IndividualProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndividualProfile
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')


class ParentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentProfile
        fields = '__all__'
        read_only_fields = ('user', 'created_at')