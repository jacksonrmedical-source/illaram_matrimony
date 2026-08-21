from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Import protected media view
from profiles.protected_media import protected_media_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/accounts/', include('accounts.urls')),
    path('api/profiles/', include('profiles.urls')),
    path('api/verifications/', include('verifications.urls')),
    path('api/interests/', include('interests.urls')),
    path('api/moderation/', include('moderation.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/matches/', include('matches.urls')),
    # Protected media route (replaces static media serving)
    re_path(r'^media/(?P<path>.*)$', protected_media_view),
]