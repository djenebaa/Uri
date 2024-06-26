from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from myapp.forms import UserCreateForm  # Replace with your actual form import
from myapp.views import authView  # Replace with your actual view import

class AuthViewTests(TestCase):
    
    def setUp(self):
        self.url = reverse('signup')  # Replace 'signup' with your actual URL name
        self.valid_data = {
            'username': 'testuser',
            'password1': 'testpassword123',
            'password2': 'testpassword123'
        }
        self.invalid_data = {
            'username': 'testuser',
            'password1': 'testpassword123',
            'password2': 'differentpassword'
        }
    
    def test_get_request(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/signup.html')
        self.assertIsInstance(response.context['form'], UserCreateForm)
    
    def test_post_request_valid_form(self):
        response = self.client.post(self.url, data=self.valid_data)
        self.assertRedirects(response, reverse('home'))  # Replace 'home' with your actual home URL
    
        # Check if the user was created
        self.assertTrue(User.objects.filter(username='testuser').exists())
    
    def test_post_request_invalid_form(self):
        response = self.client.post(self.url, data=self.invalid_data)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/signup.html')
        
        # Check if the form has errors
        self.assertIn('form', response.context)
        form = response.context['form']
        self.assertTrue(form.errors)
