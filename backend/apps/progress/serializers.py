from rest_framework import serializers
from .models import TopicProgress, UserStats


class TopicProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopicProgress
        fields = '__all__'
        read_only_fields = ['user', 'last_visited']


class UserStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStats
        fields = '__all__'
        read_only_fields = ['user']