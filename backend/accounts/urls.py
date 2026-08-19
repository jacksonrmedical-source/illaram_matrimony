from django.urls import path
from .views import RequestOTPView, VerifyOTPView, RegisterView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]