from django.test import TestCase, Client
from django.urls import reverse
from authentication.models import User


class HomeViewTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='testpassword')

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

class SignUpTest(BaseTest):

    def test_can_register_user(self):
        response = self.client.post(self.url, self.user_data)
        self.assertEqual(response.status_code, 201)

    def test_post_request_invalid_form(self):
        response = self.client.post(self.url, data=self.invalid_data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('password2', response.json()['errors'])

    def test_post_request_valid_form(self):
        response = self.client.post(self.url, data=self.valid_data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(username='testbetauser').exists())
        self.assertEqual(response.json()['message'], 'User created successfully!')
    
    def test_get_request_on_signup(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()['error'], 'Invalid method')
        
    def test_user_is_logged_in_after_signup(self):
        response = self.client.post(self.url, data=self.valid_data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.wsgi_request.user.is_authenticated)
        
    def test_get_csrf_token(self):
        response = self.client.get(reverse('csrf_token'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('csrfToken', response.json())
        
    def test_cannot_register_duplicate_user(self):
        User.objects.create_user(username=self.valid_data['username'], email=self.valid_data['email'], password=self.valid_data['password1'])

        # Check if username already taken
        response = self.client.post(self.url, data={
            'username': self.valid_data['username'],  # Same username
            'email': 'newemail@example.com',  # A valid new email address
            'password1': 'newpassword123',
            'password2': 'newpassword123'
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('errors', response.json()) 
        self.assertIn('username', response.json()['errors']) 
        self.assertEqual(response.json()['errors']['username'][0], 'This username is already taken.')

        # Check if email already taken
        response = self.client.post(self.url, data={
            'username': 'newusername',  # A valid new username
            'email': self.valid_data['email'],  # Same email
            'password1': 'newpassword123',
            'password2': 'newpassword123'
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('errors', response.json())
        self.assertIn('email', response.json()['errors'])
        self.assertEqual(response.json()['errors']['email'][0], 'This email is already registered.')
        
    