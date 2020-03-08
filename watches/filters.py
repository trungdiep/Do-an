import django_filters
from .models import *


class OrderFilter(django_filters.FilterSet):
    class Meta:
        models = Watches
        fields = ["name",'categorize']
