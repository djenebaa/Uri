from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from user_preferences.models import UserFavoriteContent
from content_management.models import Media
from django.http import JsonResponse

@login_required
def user_profile(request):
    favorites = UserFavoriteContent.objects.filter(user=request.user)
   
    favorite_media = Media.objects.filter(id__in=[fav.media.id for fav in favorites])
    
    favorite_media_data = list(favorite_media.values())
    return JsonResponse(favorite_media_data, safe=False)