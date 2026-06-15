from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics

from .models import DSATopic, VisualizationHistory
from .serializers import (
    DSATopicSerializer, VisualizationHistorySerializer,
    ArrayOperationSerializer, LinkedListOperationSerializer,
    StackOperationSerializer, QueueOperationSerializer,
    TreeOperationSerializer, GraphOperationSerializer,
    HashTableOperationSerializer, SortingOperationSerializer
)

from .algorithms.arrays import array_insert, array_delete, array_search, array_update
from .algorithms.linked_list import ll_insert, ll_delete, ll_search, ll_traverse
from .algorithms.stack import stack_push, stack_pop, stack_peek
from .algorithms.queue_ds import queue_enqueue, queue_dequeue
from .algorithms.trees import (
    bst_insert, bst_search, bst_delete,
    tree_inorder, tree_preorder, tree_postorder, tree_level_order,
    avl_insert, avl_delete, avl_search,
    heap_insert, heap_extract,
    rb_insert, rb_search
)
from .algorithms.graphs import (
    graph_bfs, graph_dfs, graph_dijkstra,
    graph_cycle_detection, graph_topological_sort,
    graph_prims_mst
)
from .algorithms.hash_table import (
    hash_chaining_insert, hash_chaining_search, hash_chaining_delete,
    hash_open_addressing_insert, hash_open_addressing_search,
    hash_open_addressing_delete
)
from .algorithms.sorting import (
    bubble_sort, selection_sort, insertion_sort,
    merge_sort, quick_sort, heap_sort,
    shell_sort, counting_sort, radix_sort,
    binary_search
)


class DSATopicListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = DSATopic.objects.all()
    serializer_class = DSATopicSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['category', 'difficulty']


class ArrayOperationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ArrayOperationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data  = serializer.validated_data
        arr   = data['array']
        op    = data['operation']
        value = data.get('value')
        index = data.get('index')

        try:
            if op == 'insert':
                result = array_insert(arr, value, index)
            elif op == 'delete':
                result = array_delete(arr, index if index is not None else 0)
            elif op == 'search':
                result = array_search(arr, value)
            elif op == 'update':
                result = array_update(arr, index, value)
            else:
                return Response({'error': 'Invalid operation'}, status=400)

            self._save_history(request, 'array', op, data)
            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    def _save_history(self, request, topic, op, data):
        if request.user.is_authenticated:
            VisualizationHistory.objects.create(
                user=request.user,
                topic=topic,
                operation=op,
                input_data=dict(data)
            )


class LinkedListOperationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LinkedListOperationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data     = serializer.validated_data
        nodes    = data['nodes']
        op       = data['operation']
        value    = data.get('value')
        position = data.get('position')

        try:
            if op == 'insert':
                result = ll_insert(nodes, value, position)
            elif op == 'delete':
                result = ll_delete(nodes, value)
            elif op == 'search':
                result = ll_search(nodes, value)
            elif op == 'traverse':
                result = ll_traverse(nodes)
            else:
                return Response({'error': 'Invalid operation'}, status=400)

            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class StackOperationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = StackOperationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data  = serializer.validated_data
        stack = data['stack']
        op    = data['operation']
        value = data.get('value')

        try:
            if op == 'push':
                result = stack_push(stack, value)
            elif op == 'pop':
                result = stack_pop(stack)
            elif op == 'peek':
                result = stack_peek(stack)
            else:
                return Response({'error': 'Invalid operation'}, status=400)

            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class QueueOperationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = QueueOperationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data  = serializer.validated_data
        queue = data['queue']
        op    = data['operation']
        value = data.get('value')

        try:
            if op == 'enqueue':
                result = queue_enqueue(queue, value)
            elif op == 'dequeue':
                result = queue_dequeue(queue)
            else:
                return Response({'error': 'Invalid operation'}, status=400)

            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class TreeOperationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = TreeOperationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data      = serializer.validated_data
        nodes     = data.get('nodes', [])
        op        = data['operation']
        value     = data.get('value')
        heap_type = data.get('heap_type', 'max')
        tree_type = data.get('tree_type', 'bst')

        try:
            # ── AVL Tree ──
            if tree_type == 'avl':
                if op == 'insert':
                    result = avl_insert(nodes, value)
                elif op == 'delete':
                    result = avl_delete(nodes, value)
                elif op == 'search':
                    result = avl_search(nodes, value)
                elif op == 'inorder':
                    result = tree_inorder(nodes)
                elif op == 'preorder':
                    result = tree_preorder(nodes)
                elif op == 'postorder':
                    result = tree_postorder(nodes)
                else:
                    result = tree_inorder(nodes)

            # ── Red-Black Tree ──
            elif tree_type == 'rbt':
                if op == 'insert':
                    result = rb_insert(nodes, value)
                elif op == 'search':
                    result = rb_search(nodes, value)
                else:
                    result = rb_insert(nodes, value)

            # ── Heap ──
            elif tree_type == 'heap':
                if op == 'insert':
                    result = heap_insert(nodes, value, heap_type)
                elif op == 'extract':
                    result = heap_extract(nodes, heap_type)
                else:
                    result = tree_inorder(nodes)

            # ── BST ──
            else:
                if op == 'insert':
                    result = bst_insert(nodes, value)
                elif op == 'search':
                    result = bst_search(nodes, value)
                elif op == 'delete':
                    result = bst_delete(nodes, value)
                elif op == 'inorder':
                    result = tree_inorder(nodes)
                elif op == 'preorder':
                    result = tree_preorder(nodes)
                elif op == 'postorder':
                    result = tree_postorder(nodes)
                elif op == 'levelorder':
                    result = tree_level_order(nodes)
                else:
                    return Response({'error': 'Invalid operation'}, status=400)

            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class GraphOperationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = GraphOperationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data  = serializer.validated_data
        adj   = data['adjacency_list']
        op    = data['operation']
        start = data.get('start', 1)

        try:
            if op == 'bfs':
                result = graph_bfs(adj, start)
            elif op == 'dfs':
                result = graph_dfs(adj, start)
            elif op == 'dijkstra':
                result = graph_dijkstra(adj, start)
            elif op == 'cycle_detection':
                result = graph_cycle_detection(adj)
            elif op == 'topological_sort':
                result = graph_topological_sort(adj)
            elif op == 'prims_mst':
                result = graph_prims_mst(adj, start)
            else:
                return Response({'error': 'Invalid operation'}, status=400)

            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class HashTableOperationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = HashTableOperationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data        = serializer.validated_data
        table       = data.get('table') or {}
        op          = data['operation']
        key         = data['key']
        value       = data.get('value', '')
        hash_method = data.get('hash_method', 'chaining')
        size        = data.get('size', 10)

        try:
            if hash_method == 'chaining':
                if op == 'insert':
                    result = hash_chaining_insert(table, key, value, size)
                elif op == 'search':
                    result = hash_chaining_search(table, key, size)
                elif op == 'delete':
                    result = hash_chaining_delete(table, key, size)
                else:
                    return Response({'error': 'Invalid operation'}, status=400)
            else:
                probe = hash_method
                if op == 'insert':
                    result = hash_open_addressing_insert(table, key, value, size, probe)
                elif op == 'search':
                    result = hash_open_addressing_search(table, key, size, probe)
                elif op == 'delete':
                    result = hash_open_addressing_delete(table, key, size, probe)
                else:
                    return Response({'error': 'Invalid operation'}, status=400)

            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class SortingOperationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SortingOperationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data   = serializer.validated_data
        arr    = data['array']
        algo   = data['algorithm']
        target = data.get('target')

        try:
            if algo == 'bubble':
                result = bubble_sort(arr)
            elif algo == 'selection':
                result = selection_sort(arr)
            elif algo == 'insertion':
                result = insertion_sort(arr)
            elif algo == 'merge':
                result = merge_sort(arr)
            elif algo == 'quick':
                result = quick_sort(arr)
            elif algo == 'heap':
                result = heap_sort(arr)
            elif algo == 'shell':
                result = shell_sort(arr)
            elif algo == 'counting':
                result = counting_sort(arr)
            elif algo == 'radix':
                result = radix_sort(arr)
            elif algo == 'binary_search':
                if target is None:
                    return Response({'error': 'target is required for binary search'}, status=400)
                result = binary_search(arr, target)
            else:
                return Response({'error': 'Invalid algorithm'}, status=400)

            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class VisualizationHistoryView(generics.ListAPIView):
    serializer_class   = VisualizationHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return VisualizationHistory.objects.filter(
            user=self.request.user
        )[:20]