from django.contrib import admin
from django.urls import path, include
from .views import SignUp, auth_status, get_csrf_token, public_auth_status
urlpatterns = [
    path("signup/", SignUp, name="signup"),
    path("", include("django.contrib.auth.urls")),
    path("auth-status/", auth_status, name="auth_status"),  
    path("public-auth-status/", public_auth_status, name="public_auth_status"),
    path('csrf-token/', get_csrf_token, name='csrf_token'),
    # path('login/', login_view, name='login'),
]
