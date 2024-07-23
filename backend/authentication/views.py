from django.shortcuts import redirect, render
from .forms import UserCreateForm
from django.contrib.auth.decorators import login_required


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

