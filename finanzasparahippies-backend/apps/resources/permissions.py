from rest_framework import permissions
import requests
import logging

logger = logging.getLogger(__name__)

class HasTierraVivaSubscription(permissions.BasePermission):
    """
    Permiso que verifica si el usuario tiene una suscripción activa en Tierra Viva
    para acceder a recursos premium.
    """
    message = "Necesitas una suscripción activa en Tierra Viva para acceder a este recurso."

    def has_object_permission(self, request, view, obj):
        # Si el recurso no es premium, todos pueden acceder
        if not obj.is_premium:
            return True
            
        # Si es premium, el usuario debe estar autenticado
        if not request.user or not request.user.is_authenticated:
            return False

        # TODO: Implementar llamada real al endpoint de Tierra Viva
        # Por ahora, estamos "mockeando" el acceso permitiendo todo (True).
        is_subscribed = True 
        
        """
        # Ejemplo de futura implementación:
        try:
            response = requests.post(
                "https://www.tierraviva.com.mx/api/verify-subscription/",
                json={"email": request.user.email},
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                return data.get("is_active", False)
        except requests.RequestException as e:
            logger.error(f"Error verificando suscripción en Tierra Viva: {e}")
            return False
        """

        return is_subscribed
