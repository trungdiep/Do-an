from django.shortcuts import render, HttpResponse, redirect, get_object_or_404
from django.contrib import messages
from .models import Watches, Categorize, Order, OrderItem, Coupon, Address
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.views.generic import DetailView, ListView, View
from django.conf import settings
import stripe
from django.utils import timezone
from django.core import paginator
from django.core.exceptions import ObjectDoesNotExist
from .forms import CouponForm, CheckoutForm
from .models import Payment
import random
import string
stripe.api_key = settings.STRIPE_SECRET_KEY
from .filters import OrderFilter
from django.db.models import Q

def is_valid_form(values):
    valid = True
    for field in values:
        if field == '':
            valid = False
    return valid

def create_ref_code():
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=20))

def index(request):
    order = Order.objects.get(user=request.user, ordered=False)
    return render(request,'payment.html',{'order':order})

class ProductDetail(DetailView):
    model = Watches
    template_name = 'product-details.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        # context['watch_list'] = Watches.objects.filter(brand=self.model.brand)
        context['watch_list'] = Watches.objects.filter(brand=kwargs['object'].brand)
        return context 

class CheckoutView(View):
    template_name = 'checkout.html'
    def get(self, request, *args, **kwargs):
        order = Order.objects.get(user=self.request.user, ordered=False)
        form = CheckoutForm()
        context = {
                'form': form,
                'couponform': CouponForm(),
                'DISPLAY_COUPON_FORM': True,
                'order': order,
            }
        return render(request,"checkout.html", context)

    def post(self, request, *args, **kwargs):
        form = CheckoutForm(request.POST)
        order = Order.objects.get(user=request.user, ordered=False)
        if form.is_valid():
            print("User is entering a new shipping address")
            billing_company = form.cleaned_data.get('billing_company')
            print(billing_company)
            billing_address1 = form.cleaned_data.get('billing_address')
            print(billing_address1)
            billing_address2 = form.cleaned_data.get('billing_address2')
            print(billing_address2)
            billing_country = form.cleaned_data.get('billing_country')
            print(billing_country)
            billing_zip = form.cleaned_data.get('billing_zip')
            print(billing_zip)
            print(request.user)
            if is_valid_form([billing_company, billing_address1, billing_address2,billing_country,billing_zip]):
                billing_address = Address(
                            user=request.user,
                            company=billing_company,
                            street_address=billing_address1,
                            apartment_address=billing_address2,
                            country=billing_country,
                            zip=billing_zip,
                            address_type='B'
                )
                billing_address.save()
                order.billing_address = billing_address
                order.save()
            else:
                messages.warning(request, "Please fill in the required billing address fields!!!")
                return redirect('watch:checkout')

            shipdifferetads = form.cleaned_data.get('shipdifferetads')
            if shipdifferetads == False:
                shipping_address=billing_address 
                shipping_address.pk=None
                shipping_address.save()
                shipping_address.address_type='S'
                shipping_address.save()
                order.shipping_address=shipping_address
                order.save()
                    
            elif shipdifferetads:
                shipping_company = form.cleaned_data.get('shipping_company')
                shipping_address1 = form.cleaned_data.get('shipping_address')
                shipping_address2 = form.cleaned_data.get('shipping_address2')
                shipping_country = form.cleaned_data.get('shipping_country')
                shipping_zip = form.cleaned_data.get('shipping_zip')
                if is_valid_form([shipping_address1, shipping_country, shipping_zip,shipping_company,shipping_address2]):
                    shipping_address = Address(
                            user=request.user,
                            company=shipping_company,
                            street_address=shipping_address1,
                            apartment_address=shipping_address2,
                            country=shipping_country,
                            zip=shipping_zip,
                            address_type='S'
                        )
                    shipping_address.save()
                    order.shipping_address = shipping_address
                    order.save()
                else:
                    messages.warning(request, "Please fill in the required billing address fields!!!")
                    return redirect('watch:checkout')
            pay_option = form.cleaned_data.get('payment_option')
            order.option_pay = pay_option
            order.save()
            if pay_option=='C':
                print(pay_option)
                order_items = order.items.all()
                order_items.update(ordered=True)
                for item in order_items:
                    item.save()

                order.ordered = True
                order.ref_code = create_ref_code()
                order.save()
                messages.success(request, "You have successfully placed an order")
                return redirect('watch:home')
            elif pay_option=="P":
                 return redirect('watch:payment', payment_option='paypal')
            
            return redirect('watch:home')
        else:
            messages.warning(request, "Please fill in the required  address fields!!!")
            return redirect('watch:checkout')

class PaymentView(View):
    def get(self, request, *arg, **kwargs):
        order = Order.objects.get(user=request.user, ordered=False)
        if order.billing_address:
            context = {
                'order': order,
                'DISPLAY_COUPON_FORM': False
            }
            return render(self.request, "payment.html", context)
        else:
            messages.warning(
                self.request, "You have not added a billing address")
            return redirect("core:checkout")
    
    def post(self, request, *arg, **kwargs):
        order = Order.objects.get(user=self.request.user, ordered=False)
        customer_id = request.user.userstripe.stripe_id
        if request.method == "POST":
            token = request.POST['stripeToken']
            amount = int(order.get_total_price_with_coupon() * 100)
            try:
                customer = stripe.Customer.retrieve(customer_id)
                customer.sources.create(source=token)
                charge = stripe.Charge.create(
                    amount=amount,
                    currency="usd",
                    customer=customer,
                    description="Thank you so much!!!!"
                    )
                payment = Payment()
                # payment.stripe_charge_id=charge['id']
                payment.stripe_charge_id='ch_1GIcdmBKjFsE576EI8wyg3Vy'
                print(charge['id'])
                payment.user=request.user
                payment.amount=amount
                payment.save()

                # assign the payment to the order

                order_items = order.items.all()
                order_items.update(ordered=True)
                for item in order_items:
                    item.save()

                order.ordered = True
                order.payment = payment
                order.ref_code = create_ref_code()
                order.save()
                messages.success(request, "You have successfully placed an order")
                return redirect('watch:home')
            except stripe.error.CardError as e:
                messages.success(request, "You have successfully placed an order")
                return redirect('watch:home')



class AddCouponView(View):
    def post(self, *args, **kwargs):
        form = CouponForm(self.request.POST or None)
        if form.is_valid():
            try:
                code = form.cleaned_data.get('code')
                order = Order.objects.get(
                    user=self.request.user, ordered=False)
                print(code)
                coupon = Coupon.objects.get(code=code)
                print(coupon.code)
                order.coupon = coupon
                print(order.coupon)
                order.save()
                return redirect("watch:home")
            except ObjectDoesNotExist:
                return redirect("watch:home")

                

class HomeView(ListView):
    model = Watches
    paginate_by = 20
    template_name = "shop-list.html"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['filter']=OrderFilter(self.request.GET,queryset=self.get_queryset())
        return context

class SearchResultsView(ListView):
    model = Watches
    template_name = 'shop-list.html'
    def get_queryset(self): 
        query = self.request.GET.get('q')
        object_list = Watches.objects.filter(
            Q(name__icontains=query) | Q(categorize__name__icontains=query)
        )
        return object_list


class OrderSummaryView(LoginRequiredMixin, View):
    login_url = '/user/login'
    redirect_field_name  = '/order-summary/'
    def get(self, *args, **kwargs):
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            context = {
                'object': order
            }
            return render(self.request, 'cart.html', context)
        except ObjectDoesNotExist:
            messages.warning(self.request, "You do not have an active order")
            return redirect("/")

@login_required
def add_to_cart(request, slug):
    watch = get_object_or_404(Watches, slug=slug)
    order_item, created = OrderItem.objects.get_or_create(
        item=watch,
        user=request.user,
        ordered=False
    )
    order_qs = Order.objects.filter(user=request.user, ordered=False)
    if order_qs.exists():
        order = order_qs[0]
        # check if the order item is in the order
        if order.items.filter(item__slug=watch.slug).exists():
            order_item.quantity += 1
            order_item.save()
            messages.info(request, "This item quantity was updated.")
            return redirect("watch:order-summary")
        else:
            order.items.add(order_item)
            messages.info(request, "This item was added to your cart.")
            return redirect("watch:order-summary")
    else:
        ordered_date = timezone.now()
        order = Order.objects.create(
            user=request.user, ordered_date=ordered_date)
        order.items.add(order_item)
        messages.info(request, "This item was added to your cart.")
        return redirect("watch:order-summary")


@login_required
def remove_from_cart(request, slug):
    watch = get_object_or_404(Watches, slug=slug)
    order_qs = Order.objects.filter(
        user=request.user,
        ordered=False
    )
    if order_qs.exists():
        order = order_qs[0]
        # check if the order item is in the order
        if order.items.filter(item__slug=watch.slug).exists():
            order_item = OrderItem.objects.filter(
                item=watch,
                user=request.user,
                ordered=False
            )[0]
            order.items.remove(order_item)
            return redirect("watch:home")
        else:
            return redirect("watch:product", slug=slug)
    else:
        messages.info(request, "You do not have an active order")
        return redirect("watch:product", slug=slug)


@login_required
def remove_single_item_from_cart(request, slug):
    watch = get_object_or_404(Watches, slug=slug)
    order_qs = Order.objects.filter(
        user=request.user,
        ordered=False
    )
    if order_qs.exists():
        order = order_qs[0]
        # check if the order item is in the order
        if order.items.filter(item__slug=watch.slug).exists():
            order_item = OrderItem.objects.filter(
                item=watch,
                user=request.user,
                ordered=False
            )[0]
            if order_item.quantity > 1:
                order_item.quantity -= 1
                order_item.save()
            else:
                order.items.remove(order_item)
            return redirect("watch:home")
        else:
            return redirect("watch:product", slug=slug)
    else:
        messages.info(request, "You do not have an active order")
        return redirect("watch:product", slug=slug)