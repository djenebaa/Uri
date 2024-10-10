from django.contrib import admin
from django.urls import path, include
from .views import SignUp, auth_status, get_csrf_token
urlpatterns = [
    path("signup/", SignUp, name="signup"),
    path("", include("django.contrib.auth.urls")),
    path("auth-status/", auth_status, name="auth_status"),  
    path('csrf-token/', get_csrf_token, name='csrf_token'),
]
