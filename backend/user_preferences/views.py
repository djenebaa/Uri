from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from content_management.models import Media
from user_preferences.models import UserFavoriteContent as Favorite

@login_required
def add_to_favorites(request, media_type, media_id):
    media = get_object_or_404(Media, external_id=media_id)

    Favorite.objects.get_or_create(user=request.user, media=media)
    return redirect('user/profile')

@login_required
def remove_from_favorites(request, media_type, media_id):
    media = get_object_or_404(Media, external_id=media_id)

    favorite = Favorite.objects.filter(user=request.user, media=media)
    if favorite.exists():
        favorite.delete()
    return redirect('user/profile')
