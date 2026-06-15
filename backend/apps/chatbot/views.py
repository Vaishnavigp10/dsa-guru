import uuid
import os
from google import genai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import ChatSession, ChatMessage
from .serializers import ChatRequestSerializer, ChatSessionSerializer
from .fallback import get_fallback_response

SYSTEM_PROMPT = 'You are DSA Guru, an expert Data Structures and Algorithms assistant. You help students learn DSA concepts clearly and effectively. Your expertise includes Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Hash Tables, Sorting algorithms, Time and Space Complexity analysis. Always explain with simple examples, provide complexity analysis, use step-by-step explanations, prefer Python for code, be student-friendly, use emojis occasionally, and mention edge cases.'


class ChatView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data = serializer.validated_data
        user_message = data['message']
        session_id = data.get('session_id') or str(uuid.uuid4())
        topic_context = data.get('topic_context', '')

        session, _ = ChatSession.objects.get_or_create(
            session_id=session_id,
            defaults={
                'user': request.user if request.user.is_authenticated else None
            }
        )

        full_message = user_message
        if topic_context:
            full_message = f'[Context: Currently viewing {topic_context}]\n\n{user_message}'

        assistant_message = None

        # Try Google Gemini API first
        try:
            api_key = os.getenv('GOOGLE_API_KEY')
            if api_key:
                client = genai.Client(api_key=api_key)
                response = client.models.generate_content(
                    model='gemini-2.0-flash-lite',
                    contents=full_message,
                    config={
                        'system_instruction': SYSTEM_PROMPT,
                        'max_output_tokens': 1024,
                    }
                )
                assistant_message = response.text
        except Exception:
            assistant_message = None

        # Fallback to dummy response if API failed
        if not assistant_message:
            assistant_message = get_fallback_response(user_message)

        # Save to DB
        ChatMessage.objects.create(
            session=session, role='user', content=user_message
        )
        ChatMessage.objects.create(
            session=session, role='assistant', content=assistant_message
        )

        return Response({
            'session_id': session_id,
            'message': assistant_message,
        })


class ChatHistoryView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, session_id):
        try:
            session = ChatSession.objects.get(session_id=session_id)
            return Response(ChatSessionSerializer(session).data)
        except ChatSession.DoesNotExist:
            return Response(
                {'error': 'Session not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class ClearChatView(APIView):
    permission_classes = [permissions.AllowAny]

    def delete(self, request, session_id):
        try:
            session = ChatSession.objects.get(session_id=session_id)
            session.messages.all().delete()
            return Response({'message': 'Chat cleared successfully'})
        except ChatSession.DoesNotExist:
            return Response(
                {'error': 'Session not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class SuggestedQuestionsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        topic = request.query_params.get('topic', 'general')
        suggestions = {
            'array': [
                'What is the time complexity of array insertion?',
                'When should I use arrays vs linked lists?',
                'How does binary search work on arrays?',
            ],
            'linked_list': [
                'How do I reverse a linked list?',
                'Difference between singly and doubly linked lists?',
                'How to detect a cycle in a linked list?',
            ],
            'stack': [
                'What are real-world applications of stacks?',
                'How is a stack used in function call execution?',
                'How to implement a stack using queues?',
            ],
            'queue': [
                'What is the difference between queue and deque?',
                'How is BFS implemented using a queue?',
                'What are priority queues?',
            ],
            'tree': [
                'What is the difference between BST and AVL tree?',
                'How does tree balancing work?',
                'What are the different tree traversals?',
            ],
            'graph': [
                'What is the difference between BFS and DFS?',
                'How does Dijkstra algorithm work?',
                'How to detect cycles in a graph?',
            ],
            'sorting': [
                'Which sorting algorithm is fastest in practice?',
                'When should I use merge sort vs quick sort?',
                'What is a stable sorting algorithm?',
            ],
            'general': [
                'What DSA topics should I learn first?',
                'How do I calculate Big O complexity?',
                'How to prepare for DSA interviews?',
            ]
        }
        return Response({
            'topic': topic,
            'suggestions': suggestions.get(topic, suggestions['general'])
        })
