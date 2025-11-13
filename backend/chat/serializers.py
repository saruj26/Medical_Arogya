from rest_framework import serializers
from .models import ChatSession, ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ('id', 'session', 'sender', 'content', 'metadata', 'created_at')
        read_only_fields = ('id', 'sender', 'created_at')

class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    message_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatSession
        fields = ('id', 'user', 'title', 'created_at', 'updated_at', 'messages', 'last_message', 'message_count')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')
    
    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        return last_msg.content if last_msg else ""
    
    def get_message_count(self, obj):
        return obj.messages.count()