import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
import forecast.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "xlsx_processor.settings")
django.setup()

# Separate Django and WebSocket apps
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,  # ✅ Handles Django REST Framework, admin, etc.
    "websocket": AuthMiddlewareStack(
        URLRouter(
            forecast.routing.websocket_urlpatterns
        )
    ),
})