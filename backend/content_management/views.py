import requests
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.decorators import login_required
from decouple import config
from content_management.models import Genre, Media
from user_preferences.models import UserFavoriteContent
from django.http import JsonResponse

@login_required
def fetch_external_data(request, genre_id=None):
    # URL de l'API externe
    api_url = "https://api.themoviedb.org/3/discover/tv"

    # En-têtes pour l'API
    headers = {
        "Authorization": f'Bearer {config("TMDB_API_TOKEN")}',
        "Accept": "application/json",
    }

    # Paramètres pour l'API
    params = {
        "include_adult": "false",
        "include_null_first_air_dates": "false",
        "language": "en-US",
        "page": "1",
        "sort_by": "popularity.desc",
        "with_origin_country": "KR",
    }

    # Ajouter le filtre par genre si le genre_id est spécifié
    if genre_id:
        params["with_genres"] = genre_id

    # Faire une requête GET à l'API externe
    response = requests.get(api_url, headers=headers, params=params)

    # Vérifier si la requête a réussi
    if response.status_code == 200:
        data = response.json()
        medias = data.get("results", [])

        for media in medias:
            media['external_id'] = media.get('id', None)  
        return JsonResponse(medias, safe=False)
    



@login_required
def show_type_genres(request):
    api_url = "https://api.themoviedb.org/3/genre/tv/list"
    headers = {
        "Authorization": f'Bearer {config("TMDB_API_TOKEN")}',
        "Accept": "application/json",
    }

    response = requests.get(api_url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        genres = data.get("genres", [])
    else:
        genres = []

    return JsonResponse(genres, safe=False) 


@login_required
def show_media_details(request, external_id):
    try:
        media = Media.objects.get(external_id=external_id)
    except Media.DoesNotExist:
        # Fetch from external source if not found in the DB
        api_url = f"https://api.themoviedb.org/3/tv/{external_id}"
        headers = {
            "Authorization": f'Bearer {config("TMDB_API_TOKEN")}',
            "Accept": "application/json",
        }
        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            data = response.json()
            genre_id = data["genres"][0]["id"] if data["genres"] else None
            genre_instance = (
                Genre.objects.get_or_create(id=genre_id)[0] if genre_id else None
            )

            # Create or update the media instance with a default media_type
            media, created = Media.objects.get_or_create(
                external_id=external_id,
                defaults={
                    "title": data.get("name", "Unknown"),
                    "description": data.get("overview", "No description available"),
                    "genre": genre_instance,
                    "age_limit": data.get("age_limit", 0),
                    "release_date": data.get("release_date", "1900-01-01"),
                    "number_of_episodes": data.get("number_of_episodes", 0),
                    "image": data.get("poster_path", ""),
                    "status": "Ongoing",
                    "media_type": "tv_show",  # Set default media_type here
                },
            )
        else:
            # Redirect or show an error if the external fetch also fails
            return render(
                request, "not_found.html", {"message": "Show not found."}
            )
            
    is_favorite = UserFavoriteContent.objects.filter(
        user=request.user, media=media, media_type='tv_show'
    ).exists()

    return render(request, "content/content_details.html", {
        "media": media,
        "favorites": is_favorite,
    })
