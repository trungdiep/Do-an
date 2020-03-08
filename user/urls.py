from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.urls import reverse_lazy

from .views import RegistrationFormView, logout, Profile ,ChangeProfile
from django.contrib.auth.views import ( LoginView, LogoutView, PasswordChangeDoneView,PasswordChangeView,
                        PasswordResetView, PasswordResetDoneView, PasswordResetConfirmView, 
                        PasswordResetCompleteView )


app_name = 'user'

urlpatterns = [
     path('login', LoginView.as_view(template_name='registration/login.html'), name='login'),
     path('logout',LogoutView.as_view(next_page='/') , name='logout'),

    path('password-change', PasswordChangeView.as_view(
        template_name='registration/password_change_form.html', success_url = 'password-change/done'), name='password-change'),
    path('password-change/done', PasswordChangeDoneView.as_view(template_name='registration/password_change_done.html'),
         name='password-change-done'),




    path('register', RegistrationFormView.as_view(), name='register'),
    path('profile', Profile, name='profile'),
    path('changeuser',ChangeProfile,name='change')

]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document=settings.STATIC_ROOT)