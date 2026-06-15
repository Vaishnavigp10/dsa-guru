from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum
from .models import TopicProgress, UserStats
from .serializers import TopicProgressSerializer, UserStatsSerializer


class TopicProgressListView(generics.ListAPIView):
    serializer_class = TopicProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TopicProgress.objects.filter(user=self.request.user)


class TopicProgressUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        category = request.data.get('category')
        topic = request.data.get('topic')
        status_val = request.data.get('status', 'in_progress')
        operation = request.data.get('operation', '')
        time_spent = request.data.get('time_spent_minutes', 0)

        if not category or not topic:
            return Response(
                {'error': 'category and topic are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        progress, created = TopicProgress.objects.get_or_create(
            user=request.user,
            category=category,
            topic=topic,
            defaults={'status': status_val}
        )

        # Update operations tried
        if operation and operation not in progress.operations_tried:
            progress.operations_tried.append(operation)

        # Update status
        progress.status = status_val
        progress.time_spent_minutes += int(time_spent)

        if status_val == 'completed' and not progress.completed_at:
            progress.completed_at = timezone.now()

        progress.save()

        # Update user stats
        self._update_stats(request.user, time_spent, status_val)

        return Response(TopicProgressSerializer(progress).data)

    def _update_stats(self, user, time_spent, status_val):
        stats, _ = UserStats.objects.get_or_create(user=user)
        stats.total_visualizations += 1
        stats.total_time_minutes += int(time_spent)
        stats.last_active = timezone.now().date()

        # Update streak
        if stats.last_active == timezone.now().date():
            stats.streak_days += 1

        if status_val == 'completed':
            stats.topics_completed += 1

        stats.save()


class UserStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        stats, _ = UserStats.objects.get_or_create(user=request.user)

        # Aggregate progress data
        total_topics = TopicProgress.objects.filter(
            user=request.user
        ).count()

        completed_topics = TopicProgress.objects.filter(
            user=request.user,
            status='completed'
        ).count()

        in_progress_topics = TopicProgress.objects.filter(
            user=request.user,
            status='in_progress'
        ).count()

        category_breakdown = {}
        for progress in TopicProgress.objects.filter(user=request.user):
            cat = progress.category
            if cat not in category_breakdown:
                category_breakdown[cat] = {
                    'total': 0, 'completed': 0
                }
            category_breakdown[cat]['total'] += 1
            if progress.status == 'completed':
                category_breakdown[cat]['completed'] += 1

        return Response({
            'stats': UserStatsSerializer(stats).data,
            'summary': {
                'total_topics': total_topics,
                'completed_topics': completed_topics,
                'in_progress_topics': in_progress_topics,
                'completion_percentage': round(
                    (completed_topics / total_topics * 100)
                    if total_topics > 0 else 0, 1
                ),
            },
            'category_breakdown': category_breakdown
        })


class ProgressDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        recent_progress = TopicProgress.objects.filter(
            user=request.user
        )[:5]

        bookmarks_count = request.user.bookmarks.count()

        return Response({
            'recent_activity': TopicProgressSerializer(
                recent_progress, many=True
            ).data,
            'bookmarks_count': bookmarks_count,
        })