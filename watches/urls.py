from django.urls import path
from .views import ( ProductDetail, HomeView,  add_to_cart, 
            remove_from_cart, remove_single_item_from_cart, OrderSummaryView, index,
            AddCouponView,
            CheckoutView,
            PaymentView,
            SearchResultsView,
            )
app_name = 'watch'
urlpatterns = [
    path('index/',index, name='index'),
    path('watch/<slug>', ProductDetail.as_view(), name='product'),
    path('order-summary/', OrderSummaryView.as_view(), name='order-summary'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('add-coupon/', AddCouponView.as_view(), name='add-coupon'),
    path('', HomeView.as_view(), name='home'),
    path('payment/<payment_option>/', PaymentView.as_view(),name='payment'),
    path('search/', SearchResultsView.as_view(), name='search_results'),
    path('add-to-cart/<slug>/', add_to_cart, name='add-to-cart'),
    path('remove-from-cart/<slug>/', remove_from_cart, name='remove-from-cart'),
    path('remove-item-from-cart/<slug>/', remove_single_item_from_cart, name='remove-single-item-from-cart'),
]   
