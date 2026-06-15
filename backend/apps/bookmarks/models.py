from django.db import models
from django.conf import settings


class Bookmark(models.Model):
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

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookmarks'
    )
    topic = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    operation = models.CharField(max_length=100, blank=True)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'topic', 'operation']

    def __str__(self):
        return f"{self.user} → {self.topic} ({self.operation})"