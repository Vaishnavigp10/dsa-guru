from django.urls import path
from .views import (
    TopicProgressListView,
    TopicProgressUpdateView,
    UserStatsView,
    ProgressDashboardView,
)

urlpatterns = [
    path('',          TopicProgressListView.as_view(),  name='progress-list'),
    path('update/',   TopicProgressUpdateView.as_view(),name='progress-update'),
    path('stats/',    UserStatsView.as_view(),           name='user-stats'),
    path('dashboard/',ProgressDashboardView.as_view(),  name='dashboard'),
]