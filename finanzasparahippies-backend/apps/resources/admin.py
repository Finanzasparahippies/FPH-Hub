from django.contrib import admin
from .models import Resource

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ("title", "resource_type", "is_premium", "created_at")
    list_filter = ("resource_type", "is_premium")
    search_fields = ("title", "description")
