# Generated by Django 3.0.1 on 2020-03-01 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('watches', '0010_remove_address_city'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='payment_option',
            field=models.CharField(choices=[('C', 'Cash On Delivery'), ('P', 'PayPal')], default='C', max_length=2),
            preserve_default=False,
        ),
    ]
