from django.shortcuts import redirect, render
from django.contrib.auth.forms import UserCreationForm
from .forms import UserCreateForm

def authView(request):
    if request.method == "POST":
        form = UserCreateForm(request.POST or None)
        if form.is_valid():
            form.save()
            return redirect("home")
    else:
        form = UserCreateForm()
    return render(request, 'registration/signup.html', {"form": form})
