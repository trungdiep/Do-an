# Generated by Django 3.0.1 on 2020-02-27 16:06

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('user', '0002_usestripe'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='useStripe',
            new_name='userStripe',
        ),
    ]