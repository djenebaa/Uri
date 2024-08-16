from django.urls import path
from .views import add_to_favorites, remove_from_favorites

urlpatterns = [
    path('favorites/add/<str:media_type>/<int:media_id>/', add_to_favorites, name='add_media_to_favorites'),
    path('favorites/remove/<str:media_type>/<int:media_id>/', remove_from_favorites, name='remove_media_from_favorites'),
]
