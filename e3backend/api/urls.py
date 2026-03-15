from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, GalleryCategoryViewSet, GalleryItemViewSet, TrainerViewSet,
    PlacementViewSet, ContactMessageViewSet, ContactSettingViewSet, AboutContentViewSet, MediaAssetViewSet,
    EnrollmentViewSet
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'gallery-categories', GalleryCategoryViewSet)
router.register(r'gallery-items', GalleryItemViewSet)
router.register(r'trainers', TrainerViewSet)
router.register(r'placements', PlacementViewSet)
router.register(r'contact-messages', ContactMessageViewSet)
router.register(r'contact-settings', ContactSettingViewSet, basename='contact-settings')
router.register(r'about-content', AboutContentViewSet)
router.register(r'media-assets', MediaAssetViewSet)
router.register(r'enrollments', EnrollmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
