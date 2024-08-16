import requests
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.decorators import login_required
from decouple import config
from content_management.models import Serie_TV, GenreSerieTV

@login_required
def fetch_external_data(request, genre_id=None):
    # URL de l'API externe
    api_url = 'https://api.themoviedb.org/3/discover/tv'
    
    # En-têtes pour l'API
    headers = {
        'Authorization': f'Bearer {config("TMDB_API_TOKEN")}',
        'Accept': 'application/json',
    }
    
    # Paramètres pour l'API
    params = {
        'include_adult': 'false',
        'include_null_first_air_dates': 'false',
        'language': 'en-US',
        'page': '1',
        'sort_by': 'popularity.desc',
        'with_origin_country': 'KR',
    }
              
    # Ajouter le filtre par genre si le genre_id est spécifié
    if genre_id:
        params['with_genres'] = genre_id
    
    # Faire une requête GET à l'API externe
    response = requests.get(api_url, headers=headers, params=params) 
    # Vérifier si la requête a réussi
    if response.status_code == 200:
        data = response.json()
        series = data.get('results', [])
    else:
        series = []

    return render(request, 'movies/display_tv_shows.html', {'series': series})

    

@login_required
def show_genres(request):
    api_url = 'https://api.themoviedb.org/3/genre/tv/list'
    headers = {
        'Authorization': f'Bearer {config("TMDB_API_TOKEN")}',
        'Accept': 'application/json',
    }

    response = requests.get(api_url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        genres = data.get('genres', [])
    else:
        genres = []

    return render(request, 'movies/series_by_genre.html', {'genres': genres})

@login_required
def show_tv_show_details(request, serie_id):
    try:
        serie = Serie_TV.objects.get(external_id=serie_id)
    except Serie_TV.DoesNotExist:
        # Fetch from external source if not found in the DB
        api_url = f'https://api.themoviedb.org/3/tv/{serie_id}'
        headers = {
            'Authorization': f'Bearer {config("TMDB_API_TOKEN")}',
            'Accept': 'application/json',
        }
        response = requests.get(api_url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            genre_id = data['genres'][0]['id'] if data['genres'] else None
            genre_instance = GenreSerieTV.objects.get_or_create(
                tmdb_id=genre_id
            )[0] if genre_id else None
            
            # Create or update the Serie_TV instance
            serie, created = Serie_TV.objects.get_or_create(
                external_id=serie_id,
                defaults={
                    'title': data.get('name', 'Unknown'),
                    'description': data.get('overview', 'No description available'),
                    'genre': genre_instance,
                    'age_limit': data.get('age_limit', 0),
                    'release_date': data.get('release_date', '1900-01-01'),
                    'number_of_episodes': data.get('number_of_episodes', 0),
                    'image': data.get('poster_path', ''),
                    'status': 'Ongoing'
                }
            )
        else:
            # Redirect or show an error if the external fetch also fails
            return render(request, 'movies/not_found.html', {'message': 'TV Show not found.'})

    return render(request, 'movies/tv_show_details.html', {'serie': serie})