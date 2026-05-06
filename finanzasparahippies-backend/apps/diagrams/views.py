from rest_framework import viewsets, permissions
from .models import Diagram
from .serializers import DiagramSerializer

class DiagramViewSet(viewsets.ModelViewSet):
    serializer_class = DiagramSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own diagrams
        return Diagram.objects.filter(author=self.request.user).order_by('-updated_at')
