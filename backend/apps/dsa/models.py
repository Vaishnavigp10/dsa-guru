from django.db import models
from django.conf import settings


class DSATopic(models.Model):
    CATEGORY_CHOICES = [
        ('array', 'Array'),
        ('linked_list', 'Linked List'),
        ('stack', 'Stack'),
        ('queue', 'Queue'),
        ('tree', 'Tree'),
        ('graph', 'Graph'),
        ('hash_table', 'Hash Table'),
        ('sorting', 'Sorting'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ], default='beginner')
    time_complexity = models.CharField(max_length=50, blank=True)
    space_complexity = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category} - {self.name}"


class VisualizationHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='visualizations'
    )
    topic = models.CharField(max_length=100)
    operation = models.CharField(max_length=100)
    input_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.topic} - {self.operation}"