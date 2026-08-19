from rest_framework import serializers
from .models import Block, Report
from profiles.models import IndividualProfile


class BlockSerializer(serializers.ModelSerializer):
    blocked = serializers.PrimaryKeyRelatedField(queryset=IndividualProfile.objects.all(), write_only=True)
    blocked_name = serializers.CharField(source='blocked.full_name', read_only=True)
    blocker_name = serializers.CharField(source='blocker.full_name', read_only=True)

    class Meta:
        model = Block
        fields = ['id', 'blocker', 'blocked', 'blocker_name', 'blocked_name', 'created_at']
        read_only_fields = ['id', 'blocker', 'created_at']


class ReportSerializer(serializers.ModelSerializer):
    reported = serializers.PrimaryKeyRelatedField(queryset=IndividualProfile.objects.all(), write_only=True)
    reported_name = serializers.CharField(source='reported.full_name', read_only=True)
    reporter_name = serializers.CharField(source='reporter.full_name', read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'reporter', 'reported', 'reason', 'description', 'resolved', 'reporter_name', 'reported_name', 'created_at']
        read_only_fields = ['id', 'reporter', 'resolved', 'created_at']