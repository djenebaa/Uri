from django.db import models
from authentication.models import User
from content_management.models import GenreAnime, GenreFilm, GenreSerieTV  

class UserGenrePreference(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    genre_anime_id = models.ForeignKey(GenreAnime, on_delete=models.CASCADE)
    genre_film_id = models.ForeignKey(GenreFilm, on_delete=models.CASCADE)
    genre_serie_tv_id = models.ForeignKey(GenreSerieTV, on_delete=models.CASCADE)
    
class UserFavoriteContent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    anime = models.ForeignKey(GenreAnime, on_delete=models.CASCADE)
    film = models.ForeignKey(GenreFilm, on_delete=models.CASCADE)
    serie_tv = models.ForeignKey(GenreSerieTV, on_delete=models.CASCADE)