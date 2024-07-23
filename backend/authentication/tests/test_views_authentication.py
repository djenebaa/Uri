from django.test import TestCase, Client
from django.urls import reverse
from authentication.models import User




class HomeViewTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_home_view_redirect_if_not_logged_in(self):
        response = self.client.get(reverse('home'))
        self.assertRedirects(response, '/accounts/login/?next=/')

    def test_home_view_render_if_logged_in(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'home.html')

class BaseTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.url = reverse('signup') 
        self.user_data = {
            'email': 'testemail@gmail.com',
            'username': 'BetaUser',
            'password1': 'passwordmia',
            'password2': 'passwordmia',
        }
        self.valid_data = {
            'email': 'testemail@gmail.com',
            'username': 'testbetauser',
            'password1': 'testpassword123',
            'password2': 'testpassword123'
        }
        self.invalid_data = {
            'username': 'testuser',
            'password1': 'testpassword123',
            'password2': 'differentpassword'
        }

        return super().setUp()
    
class SignUpTest(BaseTest):
    
    def test_can_view_page_correctly(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/signup.html')

    def test_can_register_user(self):
        response = self.client.post(self.url, self.user_data, format='text/html')
        self.assertEqual(response.status_code, 302)
        
    def test_post_request_invalid_form(self):
        response = self.client.post(self.url, data=self.invalid_data)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'registration/signup.html')
        
        self.assertIn('form', response.context)
        form = response.context['form']
        self.assertTrue(form.errors)
        
    def test_post_request_valid_form(self):
        response = self.client.post(self.url, data=self.valid_data)
        self.assertRedirects(response, reverse('login'))
        self.assertTrue(User.objects.filter(username='testbetauser').exists())



