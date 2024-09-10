from django.contrib import admin
from django.urls import path
from .views import fetch_external_data, show_type_genres, show_media_details

urlpatterns = [
    path('external-media/<int:genre_id>/', fetch_external_data, name='media_by_genre'),  
    path('show_type_genres/', show_type_genres, name='show_type_genres'),
    path('media/<int:external_id>/', show_media_details, name='media_details'), 
]
