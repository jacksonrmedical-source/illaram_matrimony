from rest_framework import serializers
from .models import Shortlist
from profiles.serializers import IndividualProfileSerializer


class ShortlistSerializer(serializers.ModelSerializer):
    saved_profile_details = serializers.SerializerMethodField()

    class Meta:
        model = Shortlist
        fields = ['id', 'saved_profile', 'saved_profile_details', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_saved_profile_details(self, obj):
        return IndividualProfileSerializer(obj.saved_profile, context=self.context).data