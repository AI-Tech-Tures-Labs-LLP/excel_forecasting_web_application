// src/services/websocketService.js
class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000;
    this.listeners = new Map();
  }

  connect(userId) {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.warn("No access token found, cannot connect to WebSocket");
        return;
      }

      // Close existing connection if any
      this.disconnect();

      // Create WebSocket connection with token in query string

      const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = (event) => {
        console.log("✅ WebSocket connected successfully");
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit("connected", { userId });
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 WebSocket message received:", data);
          this.handleMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.socket.onclose = (event) => {
        console.log(
          "🔌 WebSocket connection closed:",
          event.code,
          event.reason
        );
        this.isConnected = false;
        this.emit("disconnected");

        // Attempt to reconnect if not a clean close
        if (
          event.code !== 1000 &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.scheduleReconnect(userId);
        }
      };

      this.socket.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        this.emit("error", error);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close(1000, "User disconnect");
      this.socket = null;
    }
    this.isConnected = false;
  }

  scheduleReconnect(userId) {
    this.reconnectAttempts++;
    console.log(
      `🔄 Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
    );

    setTimeout(() => {
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        console.log(`🔄 Reconnecting... (attempt ${this.reconnectAttempts})`);
        this.connect(userId);
      }
    }, this.reconnectInterval);
  }

  handleMessage(data) {
    const { type } = data;

    switch (type) {
      case "connection_established":
        console.log("✅ Connection established:", data.message);
        this.emit("connectionEstablished", data);
        break;

      case "notification":
        console.log("🔔 New notification received:", data.data);
        this.emit("notification", data.data);
        break;

      case "notification_count_update":
        console.log("📊 Notification count update:", data.unread_count);
        this.emit("notificationCountUpdate", {
          unread_count: data.unread_count,
        });
        break;

      case "mark_read_response":
        console.log("✅ Mark read response:", data);
        this.emit("markReadResponse", data);
        break;

      case "mark_all_read_response":
        console.log("✅ Mark all read response:", data);
        this.emit("markAllReadResponse", data);
        break;

      default:
        console.log("📨 Message received:", type, data);

        // Handle direct notification messages (when type is not set)
        if (data.note_id || data.product_id || data.message) {
          console.log("🔔 Direct notification message:", data);
          this.emit("notification", data);
        } else {
          this.emit("message", data);
        }
    }
  }

  // Send message to WebSocket
  send(message) {
    if (this.isConnected && this.socket) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected, cannot send message");
    }
  }

  // Mark notification as read
  markAsRead(notificationId) {
    this.send({
      action: "mark_read",
      notification_id: notificationId,
    });
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.send({
      action: "mark_all_read",
    });
  }

  // Get notifications list
  getNotifications() {
    this.send({
      action: "get_notifications",
    });
  }

  // Event listener management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(
            `Error in WebSocket event listener for ${event}:`,
            error
          );
        }
      });
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: this.socket?.readyState,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
