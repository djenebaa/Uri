from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Remove the default fields from AbstractUser
    first_name = None
    last_name = None

    # Necessary fields for the user model
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username
