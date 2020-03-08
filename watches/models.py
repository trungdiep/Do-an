from django.db.models.signals import post_save
from django_countries.fields import CountryField
from django.shortcuts import reverse
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.template.defaultfilters import slugify
from django.shortcuts import reverse
from django.db.models.signals import post_save
from image_cropping import ImageRatioField
from ckeditor.fields import RichTextField
# Create your models here.

ADDRESS_CHOICES = (
    ('B', 'Billing'),
    ('S', 'Shopping'),
)

PAYMENT_CHOICES = (
    ('C', 'Cash On Delivery'),
    ('P', 'PayPal')
)

class Categorize(models.Model):
    name = models.CharField(max_length=100)
    date_create = models.DateTimeField(auto_created=True, auto_now_add=True)
    date_update = models.DateTimeField(auto_now_add=True, auto_created=True)
    descriptions = models.CharField(max_length=250, blank=True)

    def __str__(self):
        return self.name


class Specification(models.Model):
    detail = models.CharField(max_length=255,blank=True, null=True)

    def __str__(self):
        return self.detail


class HighLight(models.Model):
    highlight = models.CharField(max_length=225)
    detail = models.CharField(max_length=150, blank=True, null=True)

    def __str__(self):
        return self.highlight

class Specifications(models.Model):
    name = models.CharField(max_length=50, blank=True, null= True)
    specifications = models.ManyToManyField(Specification, blank=True)

    def __str__(self):
        return self.name


class Watches(models.Model):
    name = models.CharField(max_length=25)
    brand = models.CharField(max_length=255, blank=True, null=True)
    categorize = models.ForeignKey(Categorize, on_delete=models.CASCADE, blank=True, null=True)
    # price_before_discount = models.DecimalField(max_digits=6, decimal_places=2)
    price_before_discount = models.FloatField(blank=True, null=True)

    image = models.ImageField(upload_to='Image', blank=True, null=True)
    specifications = models.ForeignKey('Specifications', on_delete=models.SET_NULL, blank=True, null=True)
    description = RichTextField(blank=True, null=True)
    intro = models.CharField(max_length=255, blank=True, null=True)
    highlight = models.ManyToManyField('HighLight', blank=True)
    discount = models.IntegerField(default=0, blank=True)
    price = models.FloatField(blank=True, null=True)
    slug = models.SlugField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def set_intro(self):
        self.intro =self.description.split('.')[0]
        return self.intro

    def __str__(self):
        return self.name

    def set_price(self):
        self.price = self.price_before_discount - self.price_before_discount * self.discount/100
        return self.price

    def get_absolute_url(self):
        return reverse("watch:product", kwargs={
            'slug': self.slug
        })

    def get_add_to_cart_url(self):
        return reverse("watch:add-to-cart", kwargs={
            'slug': self.slug
        })

    def get_remove_from_cart_url(self):
        return reverse("watch:remove-from-cart", kwargs={
            'slug': self.slug
        })

    


    def save(self, *args, **kwargs):
        self.intro = self.set_intro()
        self.price = self.set_price()
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, blank=True, null=True)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Watches, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.item.name}"

    def get_total_item_price(self):
        return self.quantity * self.item.price_before_discount

    def get_total_discount_item_price(self):
        return self.quantity * self.item.price

    def get_amount_saved(self):
        return self.get_total_item_price() - self.get_total_discount_item_price()

    def get_final_price(self):
        if self.item.discount > 0 :
            return self.get_total_discount_item_price()
        else:
            return self.get_total_item_price()


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    option_pay = models.CharField(max_length=1,choices=PAYMENT_CHOICES,blank=True, null=True)
    ref_code = models.CharField(max_length=20, blank=True, null=True)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateField(auto_now_add=True)
    ordered = models.BooleanField(default=False)
    billing_address = models.ForeignKey('Address', related_name='billing_address', on_delete=models.SET_NULL,
                                        blank=True, null=True)
    shipping_address = models.ForeignKey('Address', related_name='shipping_address', on_delete=models.SET_NULL,
                                         blank=True, null=True)
    payment = models.ForeignKey(
        'Payment', on_delete=models.SET_NULL, blank=True, null=True)
    coupon = models.ForeignKey(
        "Coupon", on_delete=models.SET_NULL, blank=True, null=True)
    being_delivered = models.BooleanField(default=False)
    price = models.FloatField(null=True)
    received = models.BooleanField(default=False)
    refund_requested = models.BooleanField(default=False)
    refund_granted = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
    
    def get_total_price(self):
        total= 0
        for order_item in self.items.all():
            total += order_item.get_final_price()
        return total

    def get_total_price_with_coupon(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_final_price()
        if self.coupon:
            total -= self.coupon.amount
        self.price = total
        return total, self.price


class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    # first_name = models.CharField(max_length=255,blank=True,null=True)
    # last_name = models.CharField(max_length=255,blank=True,null=True)
    # phone = models.CharField(max_length=15,blank=True,null=True)
    # phone = models.EmailField(max_length=100,blank=True,null=True)
    company = models.CharField(max_length=255, blank=True, null=True)             
    street_address = models.CharField(max_length=100)
    apartment_address = models.CharField(max_length=100)
    # city = models.CharField(max_length=100)
    country = CountryField(multiple=False)
    zip = models.CharField(max_length=100)
    address_type = models.CharField(max_length=1, choices=ADDRESS_CHOICES)
    default = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name_plural = "Addresses"


class Payment(models.Model):
    stripe_charge_id = models.CharField(max_length=50)
    amount = models.FloatField(blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


class Coupon(models.Model):
    code = models.CharField(max_length=15, blank=True, null=True)
    amount = models.FloatField()

    def __str__(self):
        return self.code


class Refund(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    reason = models.TextField()
    accepted = models.BooleanField(default=False)
    email = models.EmailField()

    def __str__(self):
        return f"{self.pk}"