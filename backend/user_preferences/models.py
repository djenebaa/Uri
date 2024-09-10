from django.db import models
from authentication.models import User
from content_management.models import Genre, Media

class UserGenrePreference(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)  
    media_type = models.CharField(max_length=10, choices=[
        ('anime', 'Anime'),
        ('movie', 'Movie'),
        ('tv_show', 'TV Show'),
    ], null=True, blank=True) 

    def __str__(self):
        return f"{self.user.username} - {self.genre.name} ({self.media_type})"
    
class UserFavoriteContent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    media = models.ForeignKey(Media, on_delete=models.CASCADE, null=True, blank=True)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE, null=True, blank=True)
    media_type = models.CharField(
        max_length=10,
        choices=[
            ('anime', 'Anime'),
            ('movie', 'Movie'),
            ('tv_show', 'TV Show'),
        ],
        null=True,
        blank=True
    )
    external_id = models.IntegerField(null=True, blank=True)  # New field added for external ID

    class Meta:
        unique_together = ('user', 'media', 'media_type')

    def __str__(self):
        return f"{self.user.username} - {self.media.title if self.media else 'No Media'}"