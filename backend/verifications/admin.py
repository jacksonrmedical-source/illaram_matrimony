from django.contrib import admin
from .models import Verification
from django.utils import timezone

@admin.action(description="Approve selected verifications")
def approve_verifications(modeladmin, request, queryset):
    queryset.update(status=Verification.Status.APPROVED)

@admin.action(description="Reject selected verifications")
def reject_verifications(modeladmin, request, queryset):
    queryset.update(status=Verification.Status.REJECTED)

class VerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'verification_type', 'status', 'created_at')
    list_filter = ('verification_type', 'status')
    search_fields = ('user__phone',)
    actions = [approve_verifications, reject_verifications]

admin.site.register(Verification, VerificationAdmin)