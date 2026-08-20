from django.contrib import admin
from .models import IndividualProfile, Photo

class IndividualProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'gender', 'date_of_birth', 'location_city', 'profession', 'diet', 'last_active')
    list_filter = ('gender', 'diet', 'spiritual_orientation', 'location_country')
    search_fields = ('full_name', 'location_city', 'profession', 'education')

class PhotoAdmin(admin.ModelAdmin):
    list_display = ('profile', 'is_primary', 'created_at')
    list_filter = ('is_primary',)

admin.site.register(IndividualProfile, IndividualProfileAdmin)
admin.site.register(Photo, PhotoAdmin)