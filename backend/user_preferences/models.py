from django.db import models
from authentication.models import User
from content_management.models import GenreAnime, GenreFilm, GenreSerieTV, Serie_TV  

class UserGenrePreference(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    genre_anime_id = models.ForeignKey(GenreAnime, on_delete=models.CASCADE)
    genre_film_id = models.ForeignKey(GenreFilm, on_delete=models.CASCADE)
    genre_serie_tv_id = models.ForeignKey(GenreSerieTV, on_delete=models.CASCADE)
    
class UserFavoriteContent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    anime = models.ForeignKey(GenreAnime, on_delete=models.CASCADE, null=True, blank=True)
    film = models.ForeignKey(GenreFilm, on_delete=models.CASCADE, null=True, blank=True)
    genre_serie_tv = models.ForeignKey(GenreSerieTV, on_delete=models.CASCADE, null=True, blank=True)
    serie_tv = models.ForeignKey(Serie_TV, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.serie_tv.title if self.serie_tv else 'No Series'}"