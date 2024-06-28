from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

class UserCreateForm(UserCreationForm):
    email = forms.EmailField(max_length=254, help_text='Required. Enter a valid email address.')
    class Meta:
        model = User
        fields = ('username', 'email')
        widgets = {
            'email': forms.EmailInput(attrs={'placeholder': 'Example@email.com'}),
            'username': forms.TextInput(attrs={'placeholder': 'Username'}),
        }
