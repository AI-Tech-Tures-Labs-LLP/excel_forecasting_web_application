"""
ASGI config for xlsx_processor project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""




# asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from forecast.routing import websocket_urlpatterns  # <-- change to your actual app name

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'xlsx_processor.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(websocket_urlpatterns),  # 🚨 remove AuthMiddlewareStack
})
