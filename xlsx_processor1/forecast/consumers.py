import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get authenticated user from scope
        self.user = self.scope.get("user")
        
        if not self.user or not self.user.is_authenticated:
            logger.warning("Unauthenticated user attempted WebSocket connection")
            await self.close()
            return
        
        # Create user-specific group name
        self.user_group_name = f"user_{self.user.id}"
        self.public_group_name = "public_test_group"
        
        if not self.channel_layer:
            logger.error("Channel layer not configured")
            await self.close()
            return
        
        # Join user-specific group and public group
        await self.channel_layer.group_add(self.user_group_name, self.channel_name)
        await self.channel_layer.group_add(self.public_group_name, self.channel_name)
        
        await self.accept()
        
        # Send connection confirmation with unread count
        unread_count = await self.get_unread_count()
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'user': self.user.username,
            'unread_count': unread_count,
            'message': f'Connected as {self.user.username}'
        }))
        
        logger.info(f"✅ WebSocket connected for user: {self.user.username}")

    async def disconnect(self, close_code):
        # Leave groups
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(self.user_group_name, self.channel_name)
            await self.channel_layer.group_discard(self.public_group_name, self.channel_name)
            logger.info(f"🔌 WebSocket disconnected for user: {self.user.username}")

    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        try:
            data = json.loads(text_data)
            action = data.get('action')
            
            if action == 'mark_read':
                notification_id = data.get('notification_id')
                success = await self.mark_notification_read(notification_id)
                await self.send(text_data=json.dumps({
                    'type': 'mark_read_response',
                    'success': success,
                    'notification_id': notification_id
                }))
                
            elif action == 'mark_all_read':
                count = await self.mark_all_notifications_read()
                await self.send(text_data=json.dumps({
                    'type': 'mark_all_read_response',
                    'count': count
                }))
                
            elif action == 'get_notifications':
                notifications = await self.get_user_notifications()
                await self.send(text_data=json.dumps({
                    'type': 'notifications_list',
                    'notifications': notifications
                }))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))

    # WebSocket message handlers
    async def send_notification(self, event):
        """Send notification to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'data': event['message']
        }))

    async def send_notification_update(self, event):
        """Send unread count update"""
        await self.send(text_data=json.dumps({
            'type': 'notification_count_update',
            'unread_count': event['unread_count']
        }))

    # Database operations
    @database_sync_to_async
    def get_unread_count(self):
        from .models import Notification
        return Notification.objects.filter(recipient=self.user, is_read=False).count()

    @database_sync_to_async
    def mark_notification_read(self, notification_id):
        from .models import Notification
        try:
            notification = Notification.objects.get(id=notification_id, recipient=self.user)
            notification.mark_as_read()
            return True
        except Notification.DoesNotExist:
            return False

    @database_sync_to_async
    def mark_all_notifications_read(self):
        from .models import Notification
        notifications = Notification.objects.filter(recipient=self.user, is_read=False)
        count = notifications.count()
        for notification in notifications:
            notification.mark_as_read()
        return count

    @database_sync_to_async
    def get_user_notifications(self):
        from .models import Notification
        notifications = Notification.objects.filter(recipient=self.user).order_by('-created_at')[:20]
        return [
            {
                'id': n.id,
                'message': n.message,
                'sender': n.sender.username,
                'sender_name': n.sender.get_full_name() or n.sender.username,
                'is_read': n.is_read,
                'created_at': n.created_at.isoformat(),
            }
            for n in notifications
        ]
