from rest_framework import serializers
from .models import Post, Category, Tag, Comment
from apps.accounts.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ("approved", "created_at")

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    # Write-only fields for creating/updating
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Category.objects.all(), source="categories"
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Tag.objects.all(), source="tags"
    )

    class Meta:
        model = Post
        fields = (
            "id",
            "author",
            "title",
            "slug",
            "excerpt",
            "content",
            "status",
            "categories",
            "tags",
            "category_ids",
            "tag_ids",
            "featured_image",
            "seo_title",
            "seo_description",
            "created_at",
            "updated_at",
            "published_at",
        )
        read_only_fields = ("slug", "author", "created_at", "updated_at")

    def create(self, validated_data):
        author = self.context["request"].user
        return Post.objects.create(author=author, **validated_data)
