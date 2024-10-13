from django.db import models
from authentication.models import User

class Genre(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Media(models.Model):
    MEDIA_TYPE_CHOICES = [
        ('tv_show', 'TV Show'),
        ('movie', 'Movie'),
        ('anime', 'Anime'),
    ]

    external_id = models.IntegerField(null=True)  # External ID from APIs
    title = models.CharField(max_length=500, unique=True)
    description = models.TextField(max_length=500)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)  # Unified genre model
    age_limit = models.IntegerField(null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)
    number_of_episodes = models.IntegerField(null=True, blank=True)  # Nullable for Movies
    image = models.URLField(max_length=500)
    popularity = models.FloatField(null=True, blank=True)
    first_air_date = models.DateField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=[
        ('Ongoing', 'Ongoing'),
        ('Completed', 'Completed'),
        ('Upcoming', 'Upcoming'),
        ('Cancelled', 'Cancelled'),
        ('Released', 'Released'),
    ], default='Ongoing')

    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES)

    def __str__(self):
        return self.title

class UserContentTracking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    media = models.ForeignKey(Media, on_delete=models.CASCADE)  # ForeignKey to the unified Media model
    date_followed = models.DateField()
    progression = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.user.username} - {self.media.title}"
