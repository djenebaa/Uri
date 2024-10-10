from django.contrib import admin
from django.urls import path, include
from .views import user_profile

urlpatterns = [
    path('user/favorites/', user_profile, name='user_profile'), 
]
