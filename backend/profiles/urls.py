from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IndividualProfileViewSet, ParentProfileViewSet

router = DefaultRouter()
router.register(r'individual-profiles', IndividualProfileViewSet)
router.register(r'parent-profiles', ParentProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]