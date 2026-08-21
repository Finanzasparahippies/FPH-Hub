from rest_framework import viewsets
from .models import Resource
from .serializers import ResourceSerializer
from .permissions import HasTierraVivaSubscription
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class ResourceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar y recuperar recursos. 
    Solo lectura para la API pública, la creación/edición será en el panel de admin.
    """
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, HasTierraVivaSubscription]
