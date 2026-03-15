from rest_framework import serializers
from .models import Course, GalleryCategory, GalleryItem, Trainer, Placement, ContactMessage, ContactSetting, AboutContent, MediaAsset, Enrollment

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = '__all__'

class GalleryCategorySerializer(serializers.ModelSerializer):
    items = GalleryItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = GalleryCategory
        fields = '__all__'

class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'

class PlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Placement
        fields = '__all__'

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'

class ContactSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSetting
        fields = '__all__'

class AboutContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutContent
        fields = '__all__'

class MediaAssetSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = MediaAsset
        fields = ['id', 'file', 'file_url', 'uploaded_at']
        read_only_fields = ['uploaded_at']
    
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Replace the file field with the full URL
        representation['file'] = self.get_file_url(instance)
        return representation

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'
