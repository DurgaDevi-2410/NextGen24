from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Course, GalleryCategory, GalleryItem, Trainer, Placement, ContactMessage, ContactSetting, AboutContent, MediaAsset, Enrollment
from .serializers import (
    CourseSerializer, GalleryCategorySerializer, GalleryItemSerializer, 
    TrainerSerializer, PlacementSerializer, ContactMessageSerializer, 
    ContactSettingSerializer, AboutContentSerializer, MediaAssetSerializer,
    EnrollmentSerializer
)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class GalleryCategoryViewSet(viewsets.ModelViewSet):
    queryset = GalleryCategory.objects.all()
    serializer_class = GalleryCategorySerializer

class GalleryItemViewSet(viewsets.ModelViewSet):
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemSerializer

class TrainerViewSet(viewsets.ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer

class PlacementViewSet(viewsets.ModelViewSet):
    queryset = Placement.objects.all()
    serializer_class = PlacementSerializer

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

class ContactSettingViewSet(viewsets.ModelViewSet):
    queryset = ContactSetting.objects.all()
    serializer_class = ContactSettingSerializer
    
    def get_queryset(self):
        # Always return only the first settings object or create one if not exist
        if not ContactSetting.objects.exists():
            ContactSetting.objects.create(
                address="123, Education Hub", primary_phone="+91 90000 00000",
                official_email="info@e3campus.com", whatsapp="+91 90000 00000"
            )
        return ContactSetting.objects.all()[:1]

class AboutContentViewSet(viewsets.ModelViewSet):
    queryset = AboutContent.objects.all()
    serializer_class = AboutContentSerializer
    lookup_field = 'section_name'

    def create(self, request, *args, **kwargs):
        section_name = request.data.get('section_name')
        data = request.data.get('data')
        obj, created = AboutContent.objects.update_or_create(
            section_name=section_name,
            defaults={'data': data}
        )
        serializer = self.get_serializer(obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class MediaAssetViewSet(viewsets.ModelViewSet):
    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetSerializer

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
