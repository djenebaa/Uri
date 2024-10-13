from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from content_management.models import Media
from user_preferences.models import UserFavoriteContent as Favorite
from django.http import JsonResponse

@login_required
def add_media_to_favorites(request, media_type, external_id):
    media = get_object_or_404(Media, external_id=external_id)
    user = request.user

    Favorite.objects.get_or_create(
        user=user,
        media=media,
        media_type=media_type,
    )
    
    response = {
        'success': True,
        'message': 'Media ajouté aux favoris',
        'isFavorited': True
    }
    return JsonResponse(response)

@login_required
def remove_from_favorites(request, media_type, external_id):
    media = Media.objects.filter(external_id=external_id).first()
    user = request.user
    favorite = Favorite.objects.filter(user=user, media=media, media_type=media_type).first()
    
    if favorite:
        favorite.delete()
    
    response = {
        'success': True,
        'message': 'Media retiré des favoris',
        'isFavorited': False  # Indique que le média n'est plus dans les favoris
    }

    return JsonResponse(response)

@login_required
def check_favorite_status(request, media_type, external_id):
    try:
        media = Media.objects.filter(external_id=external_id).first()
        user = request.user

        is_favorited = Favorite.objects.filter(user=user, media=media, media_type=media_type).exists()

        response = {
            'isFavorited': is_favorited
        }

        return JsonResponse(response)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)