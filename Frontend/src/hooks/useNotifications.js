// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from "react";
import websocketService from "../services/websocketService";
import axios from "axios";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get current user
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/notifications/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNotifications(response.data.results || response.data);

      // Count unread notifications
      const unread = (response.data.results || response.data).filter(
        (n) => !n.is_read
      ).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/notifications/unread_count/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/notifications/${notificationId}/mark_read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Also send via WebSocket
      websocketService.markAsRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/notifications/mark_all_read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);

      // Also send via WebSocket
      websocketService.markAllAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, []);

  // WebSocket event handlers
  useEffect(() => {
    const handleConnection = () => {
      console.log("🔔 Notifications: WebSocket connected");
      setIsConnected(true);
      fetchUnreadCount(); // Fetch initial count
    };

    const handleDisconnection = () => {
      console.log("🔌 Notifications: WebSocket disconnected");
      setIsConnected(false);
    };

    const handleNewNotification = (notificationData) => {
      console.log("🔔 New notification received:", notificationData);

      // Create a proper notification object structure
      const newNotification = {
        id: Date.now(), // Temporary ID, will be replaced when we fetch from API
        message: `You've been tagged in a note: ${
          notificationData.note || "New note"
        }`,
        sender_username: notificationData.tagged_to?.[0] || "Unknown",
        sender_name: notificationData.tagged_to?.[0] || "Unknown",
        is_read: false,
        created_at: new Date().toISOString(),
        note_id: notificationData.note_id,
        product_id: notificationData.product_id,
        sheet_id: notificationData.sheet_id,
      };

      // Add new notification to the list (at the beginning)
      setNotifications((prev) => [newNotification, ...prev]);

      // Increment unread count
      setUnreadCount((prev) => prev + 1);

      // Show browser notification if permission granted
      if (Notification.permission === "granted") {
        new Notification("New Note Tag", {
          body: newNotification.message,
          icon: "/favicon.ico",
          tag: "note-tag",
        });
      }

      // Refresh notifications from API to get the proper data structure
      setTimeout(() => {
        fetchNotifications();
      }, 1000);
    };

    const handleCountUpdate = (data) => {
      console.log("📊 Notification count update:", data.unread_count);
      setUnreadCount(data.unread_count);
    };

    const handleMarkReadResponse = (data) => {
      console.log("✅ Mark read response:", data);
      if (data.success) {
        fetchUnreadCount(); // Refresh count
      }
    };

    const handleMarkAllReadResponse = (data) => {
      console.log("✅ Mark all read response:", data);
      setUnreadCount(0);
    };

    // Register WebSocket event listeners
    websocketService.on("connected", handleConnection);
    websocketService.on("disconnected", handleDisconnection);
    websocketService.on("notification", handleNewNotification);
    websocketService.on("notificationCountUpdate", handleCountUpdate);
    websocketService.on("markReadResponse", handleMarkReadResponse);
    websocketService.on("markAllReadResponse", handleMarkAllReadResponse);

    // Connect WebSocket if user is authenticated
    const currentUser = getCurrentUser();
    if (currentUser && !websocketService.isConnected) {
      websocketService.connect(currentUser.id);
    }

    // Request browser notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Cleanup on unmount
    return () => {
      websocketService.off("connected", handleConnection);
      websocketService.off("disconnected", handleDisconnection);
      websocketService.off("notification", handleNewNotification);
      websocketService.off("notificationCountUpdate", handleCountUpdate);
      websocketService.off("markReadResponse", handleMarkReadResponse);
      websocketService.off("markAllReadResponse", handleMarkAllReadResponse);
    };
  }, [fetchUnreadCount]);

  // Initial data fetch
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isConnected,
    loading,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    fetchUnreadCount,
  };
};
