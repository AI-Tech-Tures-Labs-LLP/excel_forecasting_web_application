# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("channel_layer:", self.channel_layer)
        self.group_name = "public_test_group"

        if not self.channel_layer:
            print("❌ channel_layer is None (misconfigured)")
            await self.close()
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print("✅ WebSocket connected to group:", self.group_name)

    async def disconnect(self, close_code):
        if self.channel_layer and hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            print(f"🔌 Disconnected from group: {self.group_name}")
        else:
            print("⚠️ Disconnect failed: channel_layer or group_name missing")

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event["message"]))

