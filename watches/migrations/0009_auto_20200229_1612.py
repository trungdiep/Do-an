# Generated by Django 3.0.1 on 2020-02-29 09:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('watches', '0008_auto_20200228_2143'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='address',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='address',
            name='last_name',
        ),
        migrations.RemoveField(
            model_name='address',
            name='phone',
        ),
    ]
