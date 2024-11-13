from django.shortcuts import redirect, render
from .forms import UserCreateForm
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth import login, authenticate, logout
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from .models import User

@ensure_csrf_cookie
def get_csrf_token(request):
    csrf_token = request.META.get("CSRF_COOKIE", "")
    return JsonResponse({"csrfToken": csrf_token})
@login_required  # This automatically detect is the user is logged in if true redirect to home else it will redirect to login
def home(request):
    return render(request, "home.html", {})

@csrf_exempt 
def Login(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        
        # Check if the username exists
        if not username or not password:
            return JsonResponse({"error": "Username and password are required."}, status=400)

        if not User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Invalid username"}, status=400)
        
        # Check if the password is correct for the given username
        user = authenticate(request, username=username, password=password)
        if user is None:
            return JsonResponse({"error": "Invalid password"}, status=400)

        # Log the user in if authentication is successful
        login(request, user)
        return JsonResponse({"message": "Login successful!"}, status=200)

    # If it's not a POST request, return a 405 Method Not Allowed response
    return JsonResponse({"error": "Invalid method"}, status=405)

def SignUp(request):
    if request.method == "POST":
        form = UserCreateForm(request.POST)
        username = request.POST.get("username")
        email = request.POST.get("email")
        
        errors = {}
        if User.objects.filter(username=username).exists():
            errors['username'] = ['This username is already taken.']
        if User.objects.filter(email=email).exists():
            errors['email'] = ['This email is already registered.']
            
        if errors:
            return JsonResponse({'errors': errors}, status=400)

        
        if form.is_valid():
            user = form.save()
            # return redirect("login")
            login(request, user)
            return JsonResponse({"message": "User created successfully!"}, status=201)
        else:
            # Return form errors
            return JsonResponse({"errors": form.errors}, status=400)

    # If it's not a POST request, return a 405 Method Not Allowed response
    return JsonResponse({"error": "Invalid method"}, status=405)

def Logout(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Successfully logged out'}, status=200)
    return JsonResponse({'error': 'Invalid method'}, status=405)

def auth_status(request):
    if request.user.is_authenticated:
        return JsonResponse(
            {"isAuthenticated": True, "username": request.user.username}, status=200
        )
    else:
        return JsonResponse({"isAuthenticated": False}, status=200)
