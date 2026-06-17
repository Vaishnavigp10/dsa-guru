from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def health_check(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health_check),
    path('api/auth/',      include('apps.users.urls')),
    path('api/dsa/',       include('apps.dsa.urls')),
    path('api/bookmarks/', include('apps.bookmarks.urls')),
    path('api/progress/',  include('apps.progress.urls')),
    path('api/chatbot/',   include('apps.chatbot.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)