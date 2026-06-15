from rest_framework import serializers
from .models import DSATopic, VisualizationHistory


class DSATopicSerializer(serializers.ModelSerializer):
    class Meta:
        model  = DSATopic
        fields = '__all__'


class VisualizationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model        = VisualizationHistory
        fields       = '__all__'
        read_only_fields = ['user', 'created_at']


class ArrayOperationSerializer(serializers.Serializer):
    array     = serializers.ListField(child=serializers.IntegerField())
    operation = serializers.ChoiceField(choices=['insert', 'delete', 'search', 'update'])
    value     = serializers.IntegerField(required=False)
    index     = serializers.IntegerField(required=False)


class LinkedListOperationSerializer(serializers.Serializer):
    nodes     = serializers.ListField(child=serializers.IntegerField())
    operation = serializers.ChoiceField(choices=['insert', 'delete', 'search', 'traverse'])
    value     = serializers.IntegerField(required=False)
    position  = serializers.IntegerField(required=False)


class StackOperationSerializer(serializers.Serializer):
    stack     = serializers.ListField(child=serializers.IntegerField())
    operation = serializers.ChoiceField(choices=['push', 'pop', 'peek'])
    value     = serializers.IntegerField(required=False)


class QueueOperationSerializer(serializers.Serializer):
    queue     = serializers.ListField(child=serializers.IntegerField())
    operation = serializers.ChoiceField(choices=['enqueue', 'dequeue'])
    value     = serializers.IntegerField(required=False)


class TreeOperationSerializer(serializers.Serializer):
    nodes     = serializers.ListField(
        child=serializers.IntegerField(allow_null=True),
        required=False,
        default=[]
    )
    operation = serializers.ChoiceField(choices=[
        'insert', 'search', 'delete',
        'inorder', 'preorder', 'postorder', 'levelorder',
        'extract'
    ])
    value     = serializers.IntegerField(required=False)
    tree_type = serializers.ChoiceField(
        choices=['bst', 'avl', 'heap', 'rbt'],
        required=False,
        default='bst'
    )
    heap_type = serializers.ChoiceField(
        choices=['max', 'min'],
        required=False,
        default='max'
    )


class GraphOperationSerializer(serializers.Serializer):
    adjacency_list = serializers.DictField(
        child=serializers.ListField()
    )
    operation = serializers.ChoiceField(choices=[
        'bfs', 'dfs', 'dijkstra',
        'cycle_detection', 'topological_sort', 'prims_mst'
    ])
    start = serializers.IntegerField(required=False, default=1)


class HashTableOperationSerializer(serializers.Serializer):
    table       = serializers.JSONField(required=False, allow_null=True, default=None)
    operation   = serializers.ChoiceField(choices=['insert', 'search', 'delete'])
    key         = serializers.CharField()
    value       = serializers.CharField(required=False, default='')
    hash_method = serializers.ChoiceField(
        choices=['chaining', 'linear', 'quadratic', 'double'],
        required=False,
        default='chaining'
    )
    size        = serializers.IntegerField(required=False, default=10)


class SortingOperationSerializer(serializers.Serializer):
    array     = serializers.ListField(child=serializers.IntegerField())
    algorithm = serializers.ChoiceField(choices=[
        'bubble', 'selection', 'insertion',
        'merge', 'quick', 'heap',
        'shell', 'counting', 'radix',
        'binary_search'
    ])
    target    = serializers.IntegerField(required=False)