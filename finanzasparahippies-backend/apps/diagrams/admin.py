from django.contrib import admin
from .models import Diagram

@admin.register(Diagram)
class DiagramAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'updated_at', 'is_public')
    list_filter = ('is_public', 'created_at')
    search_fields = ('title', 'description', 'author__username')
