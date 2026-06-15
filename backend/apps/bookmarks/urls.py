from django.urls import path
from .views import (
    BookmarkListCreateView,
    BookmarkDeleteView,
    BookmarkToggleView,
    BookmarkCheckView,
)

urlpatterns = [
    path('',          BookmarkListCreateView.as_view(), name='bookmark-list'),
    path('<int:pk>/', BookmarkDeleteView.as_view(),     name='bookmark-delete'),
    path('toggle/',   BookmarkToggleView.as_view(),     name='bookmark-toggle'),
    path('check/',    BookmarkCheckView.as_view(),      name='bookmark-check'),
]