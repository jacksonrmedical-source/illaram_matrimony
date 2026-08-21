from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShortlistViewSet

router = DefaultRouter()
router.register(r'shortlist', ShortlistViewSet, basename='shortlist')

urlpatterns = [
    path('', include(router.urls)),
]