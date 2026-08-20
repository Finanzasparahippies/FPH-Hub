from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.newsletter.models import Subscriber

class NewsletterTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.subscribe_url = "/api/newsletter/subscribe/"

    def test_successful_subscription(self):
        """Verifica la suscripción exitosa de un correo válido."""
        payload = {"email": "subscriber@nectarlabs.dev"}
        response = self.client.post(self.subscribe_url, payload, format="json")
        
        # Debe responder exitosamente y crear la entidad
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])
        self.assertTrue(Subscriber.objects.filter(email="subscriber@nectarlabs.dev").exists())

    def test_duplicate_subscription_idempotency(self):
        """Valida que intentar suscribir un correo duplicado se maneje sin romper el servidor."""
        Subscriber.objects.create(email="existing@nectarlabs.dev")
        payload = {"email": "existing@nectarlabs.dev"}
        response = self.client.post(self.subscribe_url, payload, format="json")
        
        # Idempotencia: no debe crashear con error 500
        self.assertNotEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
