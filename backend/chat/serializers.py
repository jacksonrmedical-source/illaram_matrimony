from rest_framework import serializers
from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.full_name', read_only=True)
    sender_id = serializers.UUIDField(source='sender.id', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_name', 'sender_id', 'text', 'is_read', 'created_at']
        read_only_fields = ['id', 'conversation', 'sender', 'is_read', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    participants_details = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'participants_details', 'last_message', 'unread_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_participants_details(self, obj):
        return [
            {'id': str(p.id), 'full_name': p.full_name}
            for p in obj.participants.all()
        ]

    def get_last_message(self, obj):
        last = obj.messages.order_by('-created_at').first()
        if last:
            return MessageSerializer(last).data
        return None

    def get_unread_count(self, obj):
        user = self.context['request'].user
        if hasattr(user, 'individual_profile'):
            return obj.messages.filter(is_read=False).exclude(sender=user.individual_profile).count()
        return 0