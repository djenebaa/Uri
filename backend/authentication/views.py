from django.shortcuts import redirect, render
from .forms import UserCreateForm
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth import login


def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({"csrfToken": csrf_token})


@login_required  # This automatically detect is the user is logged in if true redirect to home else it will redirect to login
def home(request):
    return render(request, "home.html", {})


def SignUp(request):
    if request.method == "POST":
        form = UserCreateForm(request.POST)
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


def auth_status(request):
    if request.user.is_authenticated:
        return JsonResponse(
            {"isAuthenticated": True, "username": request.user.username}
        )
    else:
        return JsonResponse({"isAuthenticated": False})
