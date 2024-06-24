from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required  # This automatically detect is the user is logged in if true redirect to home else it will redirect to login
def home(request):
    return render(request, 'home.html', {})
