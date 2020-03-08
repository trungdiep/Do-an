from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, UserChangeForm
from django.views.generic import View, FormView, DetailView, UpdateView
from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from .forms import EditProfileForm, ChangeProfileForm
# Create your views here.
from user.forms import RegistrationForm



class RegistrationFormView(FormView):
    form_class = RegistrationForm
    template_name = 'registration/registration.html'
    success_url = '/product/home'

    def form_valid(self, form):
        form.save()
        return redirect('watch:home')

@login_required
def Profile(request):
    return render(request, 'my-account.html')

@login_required
def ChangeProfile(request):
    if request.method == "POST":
        form_user = EditProfileForm(request.POST,instance=request.user)
        form = ChangeProfileForm(request.POST,instance=request.user.userprofile)
        if form.is_valid() and  form_user.is_valid():
            form_user.save()
            form.save()
            return redirect('user:profile')
    else:
        form_user = EditProfileForm(instance=request.user)
        form = ChangeProfileForm(instance=request.user.userprofile)
        context = {'form':form ,'form_user':form_user}
        return render(request,'registration/edit_profile.html',context)
        # return render(request,'my-account.html',context)



            

