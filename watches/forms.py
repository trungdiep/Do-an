from django import forms
from django_countries.fields import CountryField
from django_countries.widgets import CountrySelectWidget


PAYMENT_CHOICES = (
    ('C', 'Cash On Delivery'),
    ('P', 'PayPal')
)

class CheckoutForm(forms.Form):

       
    
    billing_company = forms.CharField(max_length=255,required=False, widget=forms.TextInput(attrs={"class":"form__input form__input--2"}))
    billing_address = forms.CharField(required=False, widget=forms.TextInput(attrs={"class":"form__input form__input--2"}))
    billing_address2 = forms.CharField(required=False, widget=forms.TextInput(attrs={"class":"form__input form__input--2"}))
    billing_country = CountryField(blank_label='(select country)').formfield(
        required=False,
        widget=CountrySelectWidget(attrs={
            'class':"form__input form__input--2 nice-select",
        }))
    billing_zip = forms.CharField(required=False,widget=forms.TextInput(attrs={"class":"form__input form__input--2"}))

    shipdifferetads = forms.BooleanField(required=False)

    shipping_company = forms.CharField(max_length=255,required=False)
    shipping_address = forms.CharField(required=False,widget=forms.TextInput(attrs={"class":"form__input form__input--2"}))
    shipping_address2 = forms.CharField(required=False,widget=forms.TextInput(attrs={"class":"form__input form__input--2"}))
    shipping_country = CountryField(blank_label='(select country)').formfield(
        required=False,
        widget=CountrySelectWidget(attrs={
            'class':"form__input form__input--2 nice-select",
        }))
    shipping_zip = forms.CharField(required=False,widget=forms.TextInput(attrs={"class":"form__input form__input--2"}))

     


    payment_option = forms.ChoiceField(
        widget=forms.RadioSelect, choices=PAYMENT_CHOICES)

class CouponForm(forms.Form):
    code = forms.CharField(widget=forms.TextInput(attrs={
        'class': 'form__input form__input--2 form__input--w285 mr--20',
        'placeholder': 'Coupon Code',
    }))

class PaymentForm(forms.Form):
    stripeToken = forms.CharField(required=False)