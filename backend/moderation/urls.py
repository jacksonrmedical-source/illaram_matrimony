from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlockViewSet, ReportViewSet

router = DefaultRouter()
router.register(r'blocks', BlockViewSet, basename='block')
router.register(r'reports', ReportViewSet, basename='report')

urlpatterns = [
    path('', include(router.urls)),
]