from django.contrib import admin
from .models import IndividualProfile, Photo, ParentProfile, FamilyLink

class IndividualProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'gender', 'location_city', 'review_status', 'created_at')
    list_filter = ('review_status', 'gender')
    search_fields = ('full_name', 'location_city')
    actions = ['approve_profiles', 'reject_profiles']

    def approve_profiles(self, request, queryset):
        queryset.update(review_status='approved')
    approve_profiles.short_description = "Approve selected profiles"

    def reject_profiles(self, request, queryset):
        queryset.update(review_status='rejected')
    reject_profiles.short_description = "Reject selected profiles"

admin.site.register(IndividualProfile, IndividualProfileAdmin)
admin.site.register(Photo)
admin.site.register(ParentProfile)
admin.site.register(FamilyLink)