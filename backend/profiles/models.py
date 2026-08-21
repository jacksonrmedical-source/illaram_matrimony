import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from .validators import validate_image_file


class IndividualProfile(models.Model):
    class Gender(models.TextChoices):
        MALE = 'male', _('Male')
        FEMALE = 'female', _('Female')
        OTHER = 'other', _('Other')

    class Diet(models.TextChoices):
        VEGETARIAN = 'vegetarian', _('Vegetarian')
        NON_VEGETARIAN = 'non_vegetarian', _('Non-Vegetarian')
        EGGETARIAN = 'eggetarian', _('Eggetarian')
        VEGAN = 'vegan', _('Vegan')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='individual_profile')
    full_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=Gender.choices)
    date_of_birth = models.DateField()
    height_cm = models.PositiveSmallIntegerField(null=True, blank=True)
    marital_status = models.CharField(max_length=20, choices=[
        ('never_married', 'Never Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed'),
        ('separated', 'Separated'),
    ], default='never_married')
    education = models.CharField(max_length=200, blank=True)
    profession = models.CharField(max_length=200, blank=True)
    income_range = models.CharField(max_length=50, blank=True)
    location_city = models.CharField(max_length=100)
    location_state = models.CharField(max_length=100, blank=True)
    location_country = models.CharField(max_length=100, default='India')
    about_me = models.TextField(max_length=1000, blank=True)

    # Tamil cultural values
    tamil_language_importance = models.CharField(max_length=20, choices=[
        ('very', 'Very Important'),
        ('somewhat', 'Somewhat Important'),
        ('not', 'Not Important'),
    ], default='somewhat')
    festivals = models.JSONField(default=list, blank=True)  # e.g. ["Pongal", "Deepavali"]
    religion = models.CharField(max_length=50, blank=True, null=True)
    mother_tongue = models.CharField(max_length=50, blank=True, null=True)
    denomination = models.CharField(max_length=50, blank=True, null=True)
    show_community_details = models.BooleanField(default=True)
    locked_fields = models.JSONField(default=list, blank=True)
    review_status = models.CharField(max_length=20, choices=[
        ('draft', 'Draft'),
        ('pending_review', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ], default='draft')
    review_notes = models.TextField(blank=True)
    spiritual_orientation = models.CharField(max_length=50, choices=[
        ('temple_going', 'Temple-going'),
        ('spiritual_not_religious', 'Spiritual but not religious'),
        ('cultural_only', 'Cultural only'),
        ('atheist', 'Atheist'),
    ], default='cultural_only')
    diet = models.CharField(max_length=20, choices=Diet.choices, default=Diet.VEGETARIAN)
    family_involvement = models.CharField(max_length=20, choices=[
        ('high', 'High'),
        ('moderate', 'Moderate'),
        ('low', 'Low'),
    ], default='moderate')
    relocation_willingness = models.CharField(max_length=20, choices=[
        ('within_tn', 'Within Tamil Nadu'),
        ('within_india', 'Within India'),
        ('abroad', 'Abroad'),
        ('flexible', 'Flexible'),
    ], default='flexible')

    # Traditional filters (optional)
    caste = models.CharField(max_length=100, blank=True, null=True)
    subcaste = models.CharField(max_length=100, blank=True, null=True)
    gothram = models.CharField(max_length=100, blank=True, null=True)
    natchathiram = models.CharField(max_length=100, blank=True, null=True)
    rasi = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_active = models.DateTimeField(auto_now=True)

    onboarding_completed = models.BooleanField(default=False)

    preferred_age_min = models.PositiveSmallIntegerField(null=True, blank=True)
    preferred_age_max = models.PositiveSmallIntegerField(null=True, blank=True)
    preferred_location = models.CharField(max_length=100, blank=True, null=True)
    preferred_education = models.CharField(max_length=100, blank=True, null=True)
    preferred_profession = models.CharField(max_length=100, blank=True, null=True)

    photo_visibility = models.CharField(max_length=20, choices=[
        ('private', 'Private until mutual interest'),
        ('public', 'Public'),
    ], default='private')
    who_can_message = models.CharField(max_length=20, choices=[
        ('all', 'All users'),
        ('matches', 'Only matches'),
    ], default='matches')


    def __str__(self):
        return f"{self.full_name} ({self.user.phone})"


class ParentProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='parent_profile')
    full_name = models.CharField(max_length=100)
    relation = models.CharField(max_length=50)  # e.g. Father, Mother, Guardian
    manages_individual = models.ForeignKey(
        IndividualProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='parent_managers'
    )
    is_approved_by_individual = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} -> {self.manages_individual}"


class FamilyLink(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    individual = models.ForeignKey(IndividualProfile, on_delete=models.CASCADE, related_name='family_links')
    parent = models.ForeignKey(ParentProfile, on_delete=models.CASCADE, related_name='family_links')
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('revoked', 'Revoked'),
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.parent.full_name} -> {self.individual.full_name} ({self.status})"


class Photo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(IndividualProfile, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='profile_photos/', validators=[validate_image_file])
    blurred_image = models.ImageField(upload_to='profile_photos/blurred/', blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo for {self.profile.full_name}"