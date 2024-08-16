from django.shortcuts import render
from django.shortcuts import redirect, get_object_or_404
# from django.contrib.auth.decorators import login_required
from content_management.models import Serie_TV as Serie
from user_preferences.models import UserFavoriteContent as Favorite


# @login_required
def add_to_favorites(request, serie_id):
    serie = get_object_or_404(Serie, id=serie_id)
    Favorite.objects.get_or_create(user=request.user, serie=serie)
    return redirect('serie_list')