from django.contrib import admin
from django.urls import path, include
from .views import authView

urlpatterns = [
    path("signup/", authView, name= "authView"),
    path("", include("django.contrib.auth.urls")),
]