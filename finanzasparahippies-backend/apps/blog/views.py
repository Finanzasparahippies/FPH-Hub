from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Post, Category, Tag, Comment
from .serializers import (
    PostSerializer,
    CategorySerializer,
    TagSerializer,
    CommentSerializer,
)

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "content", "seo_title", "seo_description"]
    ordering_fields = ["published_at", "created_at"]
    ordering = ["-published_at"]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Post.objects.all()
        # Public users only see published posts
        return Post.objects.filter(status="published", published_at__lte=timezone.now())

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny] # Allow logic validation inside or adjust as needed
    
    def get_queryset(self):
        # Only show approved comments effectively, or handle in frontend
        return Comment.objects.filter(approved=True)

    def perform_create(self, serializer):
        # Comments created by public might need approval
        serializer.save(approved=False)
