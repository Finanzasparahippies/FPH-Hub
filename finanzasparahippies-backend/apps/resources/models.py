from django.db import models

class Resource(models.Model):
    RESOURCE_TYPES = (
        ("video", "Video"),
        ("document", "Documento"),
        ("tool", "Herramienta"),
        ("course", "Curso"),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES, default="document")
    file = models.FileField(upload_to="resources/", blank=True, null=True)
    external_link = models.URLField(blank=True, null=True, help_text="Enlace externo si el recurso no es un archivo.")
    is_premium = models.BooleanField(default=False, help_text="Si está marcado, requerirá suscripción en Tierra Viva.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({'Premium' if self.is_premium else 'Gratis'})"
