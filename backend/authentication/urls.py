from django.contrib import admin
from django.urls import path, include
from .views import SignUp 


urlpatterns = [
    path("signup/", SignUp, name="signup"),
    path("", include("django.contrib.auth.urls")),
]
