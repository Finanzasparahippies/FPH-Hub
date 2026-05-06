from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiagramViewSet

router = DefaultRouter()
router.register(r'', DiagramViewSet, basename='diagram')

urlpatterns = [
    path('', include(router.urls)),
]
