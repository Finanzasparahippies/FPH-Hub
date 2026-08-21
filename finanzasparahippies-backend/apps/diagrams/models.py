from django.db import models
from django.conf import settings

class Diagram(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    mermaid_code = models.TextField(help_text="Mermaid flowchart code")
    theme_config = models.JSONField(default=dict, blank=True, help_text="Custom styles/theme config for the diagram")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='diagrams')
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
