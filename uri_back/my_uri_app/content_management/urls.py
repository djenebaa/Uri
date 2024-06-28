from django.contrib import admin
from django.urls import path
from .views import fetch_external_data, show_genres

urlpatterns = [
    path('external-tv-show/<int:genre_id>/', fetch_external_data, name='tv_show_by_genre'),
    path('show_genres/', show_genres, name='show_genres'),
]
