from django.urls import path
from .views import add_media_to_favorites, remove_from_favorites

urlpatterns = [
    path('add/<str:media_type>/<int:external_id>/', add_media_to_favorites, name='add_media_to_favorites'),
    path('remove/<str:media_type>/<int:external_id>/', remove_from_favorites, name='remove_media_from_favorites'),
]
