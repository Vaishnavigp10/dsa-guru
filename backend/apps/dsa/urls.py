from django.urls import path
from .views import (
    DSATopicListView,
    ArrayOperationView,
    LinkedListOperationView,
    StackOperationView,
    QueueOperationView,
    TreeOperationView,
    GraphOperationView,
    HashTableOperationView,
    SortingOperationView,
    VisualizationHistoryView,
)

urlpatterns = [
    path('topics/',      DSATopicListView.as_view(),        name='dsa-topics'),
    path('array/',       ArrayOperationView.as_view(),      name='array-op'),
    path('linkedlist/',  LinkedListOperationView.as_view(), name='ll-op'),
    path('stack/',       StackOperationView.as_view(),      name='stack-op'),
    path('queue/',       QueueOperationView.as_view(),      name='queue-op'),
    path('tree/',        TreeOperationView.as_view(),       name='tree-op'),
    path('graph/',       GraphOperationView.as_view(),      name='graph-op'),
    path('hashtable/',   HashTableOperationView.as_view(),  name='hash-op'),
    path('sorting/',     SortingOperationView.as_view(),    name='sort-op'),
    path('history/',     VisualizationHistoryView.as_view(),name='viz-history'),
]