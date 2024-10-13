from django.urls import path
from .views import add_media_to_favorites, remove_from_favorites, check_favorite_status

urlpatterns = [
    path('add/<str:media_type>/<int:external_id>/', add_media_to_favorites, name='add_media_to_favorites'),
    path('remove/<str:media_type>/<int:external_id>/', remove_from_favorites, name='remove_media_from_favorites'),
    path('check_favorite_status/<str:media_type>/<int:external_id>/', check_favorite_status, name='check_favorite_status'),
]
