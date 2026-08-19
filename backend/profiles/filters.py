import django_filters
from .models import IndividualProfile


class IndividualProfileFilter(django_filters.FilterSet):
    # Age range filtering based on date_of_birth
    min_age = django_filters.NumberFilter(method='filter_min_age')
    max_age = django_filters.NumberFilter(method='filter_max_age')

    # Location fields (case-insensitive contains)
    location_city = django_filters.CharFilter(field_name='location_city', lookup_expr='icontains')
    location_state = django_filters.CharFilter(field_name='location_state', lookup_expr='icontains')
    location_country = django_filters.CharFilter(field_name='location_country', lookup_expr='icontains')

    # Education/profession contains
    education = django_filters.CharFilter(field_name='education', lookup_expr='icontains')
    profession = django_filters.CharFilter(field_name='profession', lookup_expr='icontains')

    # Traditional filters (exact match)
    caste = django_filters.CharFilter(field_name='caste', lookup_expr='iexact')
    subcaste = django_filters.CharFilter(field_name='subcaste', lookup_expr='iexact')
    gothram = django_filters.CharFilter(field_name='gothram', lookup_expr='iexact')
    natchathiram = django_filters.CharFilter(field_name='natchathiram', lookup_expr='iexact')
    rasi = django_filters.CharFilter(field_name='rasi', lookup_expr='iexact')

    # Other fields
    gender = django_filters.CharFilter(field_name='gender', lookup_expr='exact')
    marital_status = django_filters.CharFilter(field_name='marital_status', lookup_expr='exact')
    diet = django_filters.CharFilter(field_name='diet', lookup_expr='exact')
    spiritual_orientation = django_filters.CharFilter(field_name='spiritual_orientation', lookup_expr='exact')
    tamil_language_importance = django_filters.CharFilter(field_name='tamil_language_importance', lookup_expr='exact')
    family_involvement = django_filters.CharFilter(field_name='family_involvement', lookup_expr='exact')
    relocation_willingness = django_filters.CharFilter(field_name='relocation_willingness', lookup_expr='exact')

    class Meta:
        model = IndividualProfile
        fields = [
            'gender', 'marital_status', 'diet', 'spiritual_orientation',
            'tamil_language_importance', 'family_involvement', 'relocation_willingness',
            'caste', 'subcaste', 'gothram', 'natchathiram', 'rasi',
        ]

    def filter_min_age(self, queryset, name, value):
        """Filter profiles older than or equal to min_age."""
        from datetime import date
        from dateutil.relativedelta import relativedelta
        cutoff_date = date.today() - relativedelta(years=value)
        return queryset.filter(date_of_birth__lte=cutoff_date)

    def filter_max_age(self, queryset, name, value):
        """Filter profiles younger than or equal to max_age."""
        from datetime import date
        from dateutil.relativedelta import relativedelta
        cutoff_date = date.today() - relativedelta(years=value)
        return queryset.filter(date_of_birth__gte=cutoff_date)