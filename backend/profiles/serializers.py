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

from .models import FamilyLink

class FamilyLinkSerializer(serializers.ModelSerializer):
    individual_name = serializers.CharField(source='individual.full_name', read_only=True)
    parent_name = serializers.CharField(source='parent.full_name', read_only=True)

    class Meta:
        model = FamilyLink
        fields = ['id', 'individual', 'parent', 'status', 'individual_name', 'parent_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'parent', 'status', 'created_at', 'updated_at']  # status is changed via actions, not direct create