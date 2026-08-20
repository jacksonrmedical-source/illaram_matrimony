from rest_framework import serializers
from PIL import Image, ImageFilter
import io
from django.core.files.base import ContentFile
from .models import IndividualProfile, ParentProfile, FamilyLink, Photo


class IndividualProfileSerializer(serializers.ModelSerializer):
    completeness_score = serializers.SerializerMethodField()
    is_selfie_verified = serializers.SerializerMethodField()
    is_govt_id_verified = serializers.SerializerMethodField()
    verification_badges = serializers.SerializerMethodField()

    class Meta:
        model = IndividualProfile
        fields = '__all__'
        read_only_fields = (
            'user', 'created_at', 'updated_at', 'completeness_score',
            'is_selfie_verified', 'is_govt_id_verified', 'verification_badges'
        )

    def get_completeness_score(self, obj):
        important_fields = [
            'full_name', 'gender', 'date_of_birth', 'height_cm', 'marital_status',
            'education', 'profession', 'income_range', 'location_city',
            'location_state', 'location_country', 'about_me',
            'tamil_language_importance', 'festivals', 'spiritual_orientation',
            'diet', 'family_involvement', 'relocation_willingness',
            'caste', 'subcaste', 'gothram', 'natchathiram', 'rasi'
        ]

        filled = 0
        total = len(important_fields)

        for field in important_fields:
            value = getattr(obj, field, None)
            if value is not None and value != '' and value != [] and value != {}:
                filled += 1

        return int((filled / total) * 100)

    def get_is_selfie_verified(self, obj):
        return obj.user.verifications.filter(
            verification_type='selfie', status='approved'
        ).exists()

    def get_is_govt_id_verified(self, obj):
        return obj.user.verifications.filter(
            verification_type='government_id', status='approved'
        ).exists()

    def get_verification_badges(self, obj):
        badges = []
        if self.get_is_selfie_verified(obj):
            badges.append('selfie')
        if self.get_is_govt_id_verified(obj):
            badges.append('government_id')
        return badges


class ParentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentProfile
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class FamilyLinkSerializer(serializers.ModelSerializer):
    individual_name = serializers.CharField(source='individual.full_name', read_only=True)
    parent_name = serializers.CharField(source='parent.full_name', read_only=True)

    class Meta:
        model = FamilyLink
        fields = ['id', 'individual', 'parent', 'status', 'individual_name', 'parent_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'parent', 'status', 'created_at', 'updated_at']


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'profile', 'image', 'blurred_image', 'is_primary', 'created_at']
        read_only_fields = ['id', 'profile', 'blurred_image', 'created_at']

    def create(self, validated_data):
        image = validated_data.get('image')
        if image:
            img = Image.open(image)
            blurred_img = img.filter(ImageFilter.GaussianBlur(radius=25))
            if blurred_img.mode in ('RGBA', 'LA', 'P'):
                blurred_img = blurred_img.convert('RGB')
            buffer = io.BytesIO()
            blurred_img.save(buffer, format='JPEG')
            buffer.seek(0)
            blurred_file = ContentFile(buffer.read(), name=f"blurred_{image.name}")
            validated_data['blurred_image'] = blurred_file
        return super().create(validated_data)