from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
import stripe
from django.db.models.signals import post_save

# Create your models here.
stripe.api_key = settings.STRIPE_SECRET_KEY


class userProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    phone = models.CharField(max_length=10, blank=True, null=True)
    image = models.ImageField(upload_to='Avatar', blank=True, null=True)
    # description = models.TextField(default='description default text ')

    def __str__(self):
        return self.user.username

class userStripe(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stripe_id = models.CharField(max_length=120, null=True, blank=True)

    def __str__(self):
        if self.stripe_id:
            return self.stripe_id
        else:
            return self.user.username

def stripeCallBack(sender, instance, created, *args, **kwargs):
    user_stripe_account, created = userStripe.objects.get_or_create(
        user=instance)
    if created:
        print('Create for {}'.format(instance.username))
    if user_stripe_account.stripe_id is None or user_stripe_account.stripe_id == '':
        new_stripe_id = stripe.Customer.create(email=instance.email)
        user_stripe_account.stripe_id = new_stripe_id['id']
        user_stripe_account.save()

def userprofile_receiver(sender, instance, created, *args, **kwargs):
    if created:
        userprofile = userProfile.objects.create(user=instance)

post_save.connect(userprofile_receiver, sender=settings.AUTH_USER_MODEL)

post_save.connect(stripeCallBack, sender=settings.AUTH_USER_MODEL)
