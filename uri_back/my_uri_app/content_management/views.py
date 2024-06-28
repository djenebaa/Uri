import requests
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from decouple import config

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

    # Ajouter le filtre par genre si genre_id est spécifié
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

    return render(request, 'movies/all_tv_shows.html', {'series': series})

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