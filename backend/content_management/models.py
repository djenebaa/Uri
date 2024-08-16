from django.db import models
from authentication.models import User

class GenreFilm(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class GenreSerieTV(models.Model):
    tmdb_id = models.IntegerField(unique=True,null=True)  
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class GenreAnime(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Serie_TV(models.Model):
    external_id = models.IntegerField(null=True) 
    title = models.CharField(max_length=500, unique=True)
    description = models.TextField(max_length=500)
    genre = models.ForeignKey(GenreSerieTV, on_delete=models.CASCADE) # maybe remove on cascade
    age_limit = models.IntegerField(null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)
    number_of_episodes = models.IntegerField(null=True, blank=True)
    image = models.URLField(max_length=500)
    
    STATUS_CHOICES = [
        ('Ongoing', 'Ongoing'),
        ('Completed', 'Completed'),
        ('Upcoming', 'Upcoming'),
        ('Cancelled', 'Cancelled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Ongoing')

    def __str__(self):
        return self.title

class Film(models.Model):
    film_id = models.IntegerField() 
    title = models.CharField(max_length=500, unique=True)
    description = models.TextField(max_length=500)
    genre = models.ForeignKey(GenreFilm, on_delete=models.CASCADE)
    age_limit = models.IntegerField()
    release_date = models.DateField()
    image = models.URLField(max_length=500)
    
    STATUS_CHOICES = [
        ('Released', 'Released'),
        ('Upcoming', 'Upcoming'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Released')

    def __str__(self):
        return self.title

class Anime(models.Model):
    anime_id = models.IntegerField() 
    title = models.CharField(max_length=500, unique=True)
    description = models.TextField(max_length=500)
    genre = models.ForeignKey(GenreAnime, on_delete=models.CASCADE)
    age_limit = models.IntegerField()
    release_date = models.DateField()
    number_of_episodes = models.IntegerField()
    image = models.URLField(max_length=500)
    
    STATUS_CHOICES = [
        ('Ongoing', 'Ongoing'),
        ('Completed', 'Completed'),
        ('Upcoming', 'Upcoming'),
        ('Cancelled', 'Cancelled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Ongoing')

    def __str__(self):
        return self.title

class User_content_tracking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.CharField(max_length=50) 
    content_id = models.IntegerField() 
    date_followed = models.DateField()  
    progression = models.DecimalField(max_digits=5, decimal_places=2) 
    def __str__(self):
        return f"{self.user.username} - {self.content_type} - {self.content_id}"
