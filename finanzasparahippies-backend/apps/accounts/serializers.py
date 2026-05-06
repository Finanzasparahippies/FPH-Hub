from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

import requests
from django.conf import settings
from rest_framework.exceptions import ValidationError

class UserCreateSerializer(BaseUserCreateSerializer):
    turnstile_token = serializers.CharField(write_only=True, required=True)

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ("id", "email", "username", "password", "turnstile_token")

    def validate(self, attrs):
        token = attrs.pop("turnstile_token", None)
        if not token:
            raise ValidationError({"turnstile_token": "Token de verificación requerido."})

        # Verificar token con Cloudflare
        secret_key = getattr(settings, "TURNSTILE_SECRET_KEY", "1x0000000000000000000000000000000AA")
        verify_url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
        
        try:
            r = requests.post(verify_url, data={
                "secret": secret_key,
                "response": token
            }, timeout=5)
            result = r.json()
            if not result.get("success"):
                raise ValidationError({"turnstile_token": "Verificación CAPTCHA fallida."})
        except requests.RequestException:
            raise ValidationError({"turnstile_token": "Error de conexión con el servicio de verificación."})

        return super().validate(attrs)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "username", "is_staff")

