
import logging
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model
from ..models import Notification

logger = logging.getLogger(__name__)
User = get_user_model()

class ForecastNoteNotificationService:
    """Service for handling ForecastNote notifications via WebSocket"""
    
    @staticmethod
    def notify_tagged_users(forecast_note):
        """Send notifications to all tagged users when a note is created"""
        
        if not forecast_note.created_by:
            logger.warning(f"No creator found for note {forecast_note.id}")
            return
        
        # Get all tagged users (excluding the creator)
        tagged_users = forecast_note.tagged_to.exclude(id=forecast_note.created_by.id)
        
        if not tagged_users.exists():
            logger.info(f"No users to notify for note {forecast_note.id}")
            return
        
        channel_layer = get_channel_layer()
        if not channel_layer:
            logger.error("Channel layer not configured")
            return
        
        creator_name = forecast_note.created_by.get_full_name() or forecast_note.created_by.username
        
        # Create notifications and send WebSocket messages
        notifications_created = []
        
        for user in tagged_users:
            try:
                # Create notification message
                product_info = ""
                if forecast_note.productdetail:
                    product_info = f" for product {forecast_note.productdetail.product_id}"
                
                message = f"{creator_name} tagged you in a note{product_info}: {forecast_note.note[:100]}..."
                
                # Create notification record
                notification = Notification.objects.create(
                    recipient=user,
                    sender=forecast_note.created_by,
                    message=message
                )
                notifications_created.append(notification)
                
                # Prepare notification data for WebSocket
                notification_data = {
                    'notification_id': notification.id,
                    'message': notification.message,
                    'sender_username': forecast_note.created_by.username,
                    'sender_name': creator_name,
                    'note_id': forecast_note.id,
                    'note_content': forecast_note.note,
                    'product_id': forecast_note.productdetail.product_id if forecast_note.productdetail else None,
                    'sheet_id': forecast_note.sheet.id if forecast_note.sheet else None,
                    'created_at': forecast_note.created_at.isoformat() if forecast_note.created_at else None,
                    'recipient_username': user.username
                }
                
                # Send to user's personal WebSocket channel
                user_group = f"user_{user.id}"
                async_to_sync(channel_layer.group_send)(
                    user_group,
                    {
                        'type': 'send_notification',
                        'message': notification_data
                    }
                )
                
                # Update unread count for user
                unread_count = Notification.objects.filter(recipient=user, is_read=False).count()
                async_to_sync(channel_layer.group_send)(
                    user_group,
                    {
                        'type': 'send_notification_update',
                        'unread_count': unread_count
                    }
                )
                
                logger.info(f"Notification sent to {user.username} for note {forecast_note.id}")
                
            except Exception as e:
                logger.error(f"Failed to notify user {user.username}: {e}")
        
        # Send to public group for monitoring/testing
        if notifications_created:
            public_data = {
                'note_id': forecast_note.id,
                'created_by': forecast_note.created_by.username,
                'created_by_name': creator_name,
                'tagged_users': [n.recipient.username for n in notifications_created],
                'product_id': forecast_note.productdetail.product_id if forecast_note.productdetail else None,
                'note_preview': forecast_note.note[:100] + "..." if forecast_note.note and len(forecast_note.note) > 100 else forecast_note.note,
                'sheet_id': forecast_note.sheet.id if forecast_note.sheet else None
            }
            
            async_to_sync(channel_layer.group_send)(
                "public_test_group",
                {
                    'type': 'send_notification',
                    'message': public_data
                }
            )
        
        logger.info(f"Successfully created {len(notifications_created)} notifications for note {forecast_note.id}")
