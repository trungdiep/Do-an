# Generated by Django 3.0.1 on 2020-03-01 16:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('watches', '0013_order_thanhtoan'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='thanhtoan',
            new_name='option_pay',
        ),
    ]