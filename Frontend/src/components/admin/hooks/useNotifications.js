import { useState, useEffect } from "react";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Mock notifications - replace with real API
      const mockNotifications = [
        {
          id: 1,
          title: "High Workload Alert",
          message: "3 analysts have workload above 80%",
          type: "warning",
          time: "5 minutes ago",
          unread: true,
        },
        {
          id: 2,
          title: "New Forecast Completed",
          message: "Bridge Gem742 forecast analysis completed",
          type: "success",
          time: "1 hour ago",
          unread: true,
        },
        {
          id: 3,
          title: "System Update",
          message: "Dashboard performance improvements deployed",
          type: "info",
          time: "2 hours ago",
          unread: false,
        },
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, unread: false } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};

export default useNotifications;
