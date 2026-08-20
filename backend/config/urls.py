from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # Exact-match paths first (good practice)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # App includes with distinct prefixes
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/profiles/', include('profiles.urls')),
    path('api/verifications/', include('verifications.urls')),
    path('api/interests/', include('interests.urls')),
    path('api/moderation/', include('moderation.urls')),
    path('api/chat/', include('chat.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)