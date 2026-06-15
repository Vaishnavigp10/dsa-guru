from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Bookmark
from .serializers import BookmarkSerializer


class BookmarkListCreateView(generics.ListCreateAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookmarkDeleteView(generics.DestroyAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)


class BookmarkToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        topic = request.data.get('topic')
        category = request.data.get('category')
        operation = request.data.get('operation', '')
        note = request.data.get('note', '')

        if not topic or not category:
            return Response(
                {'error': 'topic and category are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        bookmark, created = Bookmark.objects.get_or_create(
            user=request.user,
            topic=topic,
            operation=operation,
            defaults={'category': category, 'note': note}
        )

        if not created:
            bookmark.delete()
            return Response({
                'bookmarked': False,
                'message': f'Removed bookmark for {topic}'
            })

        return Response({
            'bookmarked': True,
            'message': f'Bookmarked {topic}',
            'bookmark': BookmarkSerializer(bookmark).data
        }, status=status.HTTP_201_CREATED)


class BookmarkCheckView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        topic = request.query_params.get('topic')
        operation = request.query_params.get('operation', '')
        exists = Bookmark.objects.filter(
            user=request.user,
            topic=topic,
            operation=operation
        ).exists()
        return Response({'bookmarked': exists})