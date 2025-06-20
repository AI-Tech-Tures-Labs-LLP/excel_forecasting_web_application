import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging

logger = logging.getLogger(__name__)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # You can assign a dummy user id for anonymous clients
        self.user_group_name = f"user_anonymous"
        self.public_group_name = "public_test_group"

        if not self.channel_layer:
            logger.error("Channel layer not configured")
            await self.close()
            return

        await self.channel_layer.group_add(self.user_group_name, self.channel_name)
        await self.channel_layer.group_add(self.public_group_name, self.channel_name)

        await self.accept()

        # Just send dummy connection info
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'user': 'Anonymous',
            'unread_count': 0,
            'message': 'Connected anonymously'
        }))

        logger.info("✅ WebSocket connected anonymously")

    async def disconnect(self, close_code):
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(self.user_group_name, self.channel_name)
            await self.channel_layer.group_discard(self.public_group_name, self.channel_name)
            logger.info("🔌 Anonymous WebSocket disconnected")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get('action')

            # You can limit access to actions here
            await self.send(text_data=json.dumps({
                'type': 'info',
                'message': f'Action "{action}" is not available for anonymous clients'
            }))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'data': event['message']
        }))

    async def send_notification_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'notification_count_update',
            'unread_count': event['unread_count']
        }))
