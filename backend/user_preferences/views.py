from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from content_management.models import Media
from user_preferences.models import UserFavoriteContent as Favorite

@login_required
def add_media_to_favorites(request, media_type, external_id):
    media = get_object_or_404(Media, external_id=external_id)
    user = request.user
    

    Favorite.objects.get_or_create(
        user=user,
        media=media,
        media_type=media_type,
    )
    
    return redirect('user_profile')  

@login_required
def remove_from_favorites(request, media_type, external_id):
    media = Media.objects.filter(external_id=external_id).first()
    
    if media:
        favorite = Favorite.objects.filter(user=request.user, media=media, media_type=media_type)
    else:
        pass
    
    if favorite.exists():
        favorite.delete()
    
    return redirect('user_profile')
