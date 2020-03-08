from django.contrib import admin
from django.db.models import Count,Sum
from .models import ( Watches, Specifications,
     Categorize,
     Coupon,
      HighLight, Specification, OrderItem, Order,Payment,
      Address    )
# Register your models here.
from django.contrib.auth.admin import UserAdmin
admin.site.register(Categorize)
admin.site.site_header = 'Shop Watch'
class WatchesAdmin(admin.ModelAdmin):
    fields = (
        ('name','slug'),
        ('brand','categorize'),
        ('price_before_discount','discount','price'),
        ('specifications','image'),
        ('highlight'),
        ('description'),
        ('intro')
        
    )
    list_display = ['id','name','categorize','brand','discount','price',]
    list_display_links = ['id','name']
    search_fields = ['name','brand','discount','categorize__name']

    filter_horizontal = ['highlight']

    ordering = ['id','name']
    prepopulated_fields = {"slug": ("name",)}

admin.site.register(Watches ,WatchesAdmin )

@admin.register(Specifications)
class SpecificationsAdmin(admin.ModelAdmin):
    list_display = ['name']
    # list_editable = ['specifications']
    search_fields = ['name']
    filter_horizontal = ['specifications']


admin.site.register(Specification)
admin.site.register(HighLight)



@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['user','option_pay','ordered_date','billing_address','shipping_address','ref_code','being_delivered','get_total_price_with_coupon']
    list_editable = ['being_delivered']
    ordering = ['ordered_date']
    date_hierarchy = 'ordered_date'
    actions = ['make_published']
    def make_published(self, request, queryset):
        queryset.update(being_delivered='True')
    make_published.short_description = "Mark selected stories as published"
    # change_list_template = 'admin/order_change_list.html'
    # date_hierarchy = 'ordered_date'

    # def changelist_view(self, request, extra_context=None):
    #     response = super().changelist_view(
    #         request,
    #         extra_context=extra_context,
    #     )
    #     try:
    #         qs = response.context_data['cl'].queryset
    #     except (AttributeError, KeyError):
    #         return response
    #     metrics = {
    #         'total':Sum('price')
    #     }
    #     response.context_data['summary'] = list(
    #         qs
    #         .values('price','user__username','ordered_date','ref_code')
    #         .annotate(**metrics)
    #         .order_by('-ordered_date')
    #     )
    #     response.context_data['summary_total'] = dict(
    #         qs.aggregate(**metrics)
    #     )
       
    #     return response


admin.site.register(Payment)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id','ordered','item','user','quantity','get_final_price']
    search_fields = ['name']
    ordering = ['id']
   
    # change_list_template=''



    
admin.site.register(Coupon)
@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['user','company','street_address','apartment_address','country','address_type']
    search_fields = ['user__username','company']
    ordering = ['id']



