from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IndividualProfileViewSet, ParentProfileViewSet, FamilyLinkViewSet, PhotoViewSet

router = DefaultRouter()
router.register(r'individual-profiles', IndividualProfileViewSet)
router.register(r'parent-profiles', ParentProfileViewSet)
router.register(r'family-links', FamilyLinkViewSet, basename='family-link')
router.register(r'photos', PhotoViewSet, basename='photo')

urlpatterns = [
    path('', include(router.urls)),
]