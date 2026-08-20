import django_filters
from .models import Interest


class InterestFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name='status', lookup_expr='exact')
    photo_request = django_filters.BooleanFilter(field_name='photo_request')
    # Optional: filter by sender/receiver profile id (if needed later)
    sender = django_filters.UUIDFilter(field_name='sender__id')
    receiver = django_filters.UUIDFilter(field_name='receiver__id')

    class Meta:
        model = Interest
        fields = ['status', 'photo_request', 'sender', 'receiver']