from django.urls import path
from .views import (
    ChatView,
    ChatHistoryView,
    ClearChatView,
    SuggestedQuestionsView,
)

urlpatterns = [
    path('',                          ChatView.as_view(),                name='chat'),
    path('history/<str:session_id>/', ChatHistoryView.as_view(),         name='chat-history'),
    path('clear/<str:session_id>/',   ClearChatView.as_view(),           name='chat-clear'),
    path('suggestions/',              SuggestedQuestionsView.as_view(),  name='chat-suggestions'),
]
