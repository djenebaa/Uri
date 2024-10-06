from django.shortcuts import redirect, render
from .forms import UserCreateForm
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate,login

from django.middleware.csrf import get_token


def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})

# def login_view(request):
#     if request.method == 'POST':
#         username = request.POST.get('username')
#         password = request.POST.get('password')
#         user = authenticate(request, username=username, password=password)
#         if user is not None:
#             login(request, user)
#             return JsonResponse({'status': 'success'}, status=200)
#         else:
#             return JsonResponse({'error': 'Invalid credentials'}, status=400)
#     return JsonResponse({'error': 'Invalid method'}, status=405)


@login_required  # This automatically detect is the user is logged in if true redirect to home else it will redirect to login
def home(request):
    return render(request, 'home.html', {})


def SignUp(request):
    if request.method == "POST":
        form = UserCreateForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("login")
    else:
        form = UserCreateForm()
    return render(request, 'registration/signup.html', {"form": form})

@login_required
def auth_status(request):
    return JsonResponse({'isAuthenticated': True})

def public_auth_status(request):
    return JsonResponse({'isAuthenticated': False})