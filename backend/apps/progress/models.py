from django.db import models
from django.conf import settings


class TopicProgress(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='progress'
    )
    category = models.CharField(max_length=50)
    topic = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='not_started'
    )
    operations_tried = models.JSONField(default=list)
    time_spent_minutes = models.IntegerField(default=0)
    last_visited = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'category', 'topic']
        ordering = ['-last_visited']

    def __str__(self):
        return f"{self.user} - {self.topic} ({self.status})"


class UserStats(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='stats'
    )
    total_visualizations = models.IntegerField(default=0)
    total_time_minutes = models.IntegerField(default=0)
    streak_days = models.IntegerField(default=0)
    last_active = models.DateField(null=True, blank=True)
    topics_completed = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user} stats"