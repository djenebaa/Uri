import requests
from django.shortcuts import render
from decouple import config
from content_management.models import Genre, Media
from user_preferences.models import UserFavoriteContent
from django.http import JsonResponse


def fetch_external_data(request, genre_id=None):
    api_url = "https://api.themoviedb.org/3/discover/tv"

    headers = {
        "Authorization": f'Bearer {config("TMDB_API_TOKEN")}',
        "Accept": "application/json",
    }

    params = {
        "include_adult": "false",
        "include_null_first_air_dates": "false",
        "language": "en-US",
        "page": "1",
        "sort_by": "popularity.desc",
        "with_origin_country": "KR",
    }

    # Add a filter by genre if genre specified
    if genre_id:
        params["with_genres"] = genre_id

    # Get request of the api
    response = requests.get(api_url, headers=headers, params=params)

    # Check if the request succeeded
    if response.status_code == 200:
        data = response.json()
        medias = data.get("results", [])

        for media in medias:
            media["external_id"] = media.get("id", None)
        return JsonResponse(medias, safe=False)


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
                    "popularity": data.get("popularity", 0),
                    "first_air_date": data.get("first_air_date", "1900-01-01"),
                    "media_type": "tv_show", 
                },
            )
        else:
            # Handle API errors and show the error
            return JsonResponse({"error": "Media not found on TMDb"}, status=response.status_code)

    is_favorite = UserFavoriteContent.objects.filter(
        user=request.user, media=media, media_type="tv_show"
    ).exists()

    return JsonResponse({
        "media": {
            "title": media.title,
            "description": media.description,
            "image": media.image,
            "first_air_date": media.first_air_date,  
            "number_of_episodes": media.number_of_episodes,
            "status": media.status,
            "popularity": media.popularity,  
            "is_favorite": is_favorite, 
            "release_date": media.release_date,
        }
    })