from rest_framework import serializers
from PIL import Image, ImageFilter
import io
from django.core.files.base import ContentFile
from .models import IndividualProfile, ParentProfile, FamilyLink, Photo


class IndividualProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndividualProfile
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')


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
            # Open the uploaded image using Pillow
            img = Image.open(image)
            # Apply blur filter
            blurred_img = img.filter(ImageFilter.GaussianBlur(radius=25))
            # Convert to RGB (required for JPEG, especially if PNG with alpha)
            if blurred_img.mode in ('RGBA', 'LA', 'P'):
                blurred_img = blurred_img.convert('RGB')
            # Save blurred image to a bytes buffer
            buffer = io.BytesIO()
            blurred_img.save(buffer, format='JPEG')
            buffer.seek(0)

            # Create a ContentFile and assign to blurred_image
            blurred_file = ContentFile(buffer.read(), name=f"blurred_{image.name}")
            validated_data['blurred_image'] = blurred_file

        return super().create(validated_data)