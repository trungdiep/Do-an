# Generated by Django 3.0.1 on 2020-03-01 16:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('watches', '0012_remove_order_payment_option'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='thanhtoan',
            field=models.CharField(blank=True, choices=[('C', 'Cash On Delivery'), ('P', 'PayPal')], max_length=1, null=True),
        ),
    ]
