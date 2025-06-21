// // src/components/NotificationDropdown.jsx
// import React, { useState, useRef, useEffect } from "react";
// import { Bell, Check, CheckCheck, X, Clock, User } from "lucide-react";
// import { useNotifications } from "../hooks/useNotifications";

// const NotificationDropdown = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [forceUpdate, setForceUpdate] = useState(0);
//   const dropdownRef = useRef(null);

//   const {
//     notifications,
//     unreadCount,
//     isConnected,
//     loading,
//     markAsRead,
//     markAllAsRead,
//     fetchNotifications,
//   } = useNotifications();

//   // Force re-render when notifications or unreadCount changes
//   useEffect(() => {
//     setForceUpdate((prev) => prev + 1);
//   }, [notifications.length, unreadCount]);

//   // Auto-refresh notifications periodically as fallback
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (isConnected) {
//         fetchNotifications();
//       }
//     }, 30000); // Refresh every 30 seconds

//     return () => clearInterval(interval);
//   }, [isConnected, fetchNotifications]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleNotificationClick = async (notification) => {
//     if (!notification.is_read) {
//       await markAsRead(notification.id);
//     }
//     // Optionally navigate to the related product/note
//   };

//   const handleMarkAllRead = async () => {
//     await markAllAsRead();
//   };

//   const formatTimeAgo = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now - date;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 1) return "Just now";
//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return date.toLocaleDateString();
//   };

//   const getNotificationIcon = (notification) => {
//     return <User className="w-4 h-4 text-indigo-600" />;
//   };

//   const truncateText = (text, maxLength = 80) => {
//     if (!text) return "";
//     return text.length > maxLength
//       ? `${text.substring(0, maxLength)}...`
//       : text;
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Bell Icon with Badge */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg transition-colors"
//         title={`${unreadCount} unread notifications`}
//       >
//         <Bell className="w-6 h-6" />

//         {/* Connection Status Indicator */}
//         <div
//           className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${
//             isConnected ? "bg-green-500" : "bg-red-500"
//           }`}
//           title={isConnected ? "Connected" : "Disconnected"}
//         />

//         {/* Unread Count Badge */}
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
//             {unreadCount > 99 ? "99+" : unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
//           {/* Header */}
//           <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
//             <div className="flex items-center justify-between">
//               <h3 className="text-sm font-semibold text-gray-900">
//                 Notifications
//                 {unreadCount > 0 && (
//                   <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
//                     {unreadCount} new
//                   </span>
//                 )}
//               </h3>

//               <div className="flex items-center space-x-2">
//                 {/* Connection Status */}
//                 <div
//                   className={`w-2 h-2 rounded-full ${
//                     isConnected ? "bg-green-500" : "bg-red-500"
//                   }`}
//                 />

//                 {/* Mark All Read Button */}
//                 {unreadCount > 0 && (
//                   <button
//                     onClick={handleMarkAllRead}
//                     className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
//                     title="Mark all as read"
//                   >
//                     <CheckCheck className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Notifications List */}
//           <div className="max-h-80 overflow-y-auto">
//             {loading ? (
//               <div className="p-4 text-center">
//                 <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2"></div>
//                 <p className="text-sm text-gray-600">
//                   Loading notifications...
//                 </p>
//               </div>
//             ) : notifications.length === 0 ? (
//               <div className="p-8 text-center">
//                 <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
//                 <p className="text-sm text-gray-600">No notifications yet</p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   You'll see notifications when someone tags you in notes
//                 </p>
//               </div>
//             ) : (
//               <div className="divide-y divide-gray-100">
//                 {notifications.slice(0, 10).map((notification) => (
//                   <div
//                     key={notification.id}
//                     onClick={() => handleNotificationClick(notification)}
//                     className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
//                       !notification.is_read
//                         ? "bg-indigo-50 border-l-4 border-indigo-500"
//                         : ""
//                     }`}
//                   >
//                     <div className="flex items-start space-x-3">
//                       {/* Icon */}
//                       <div className="flex-shrink-0 mt-1">
//                         {getNotificationIcon(notification)}
//                       </div>

//                       {/* Content */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between">
//                           <p className="text-sm font-medium text-gray-900">
//                             {notification.sender_name ||
//                               notification.sender_username}
//                           </p>

//                           <div className="flex items-center space-x-2">
//                             {!notification.is_read && (
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   markAsRead(notification.id);
//                                 }}
//                                 className="text-indigo-600 hover:text-indigo-800"
//                                 title="Mark as read"
//                               >
//                                 <Check className="w-3 h-3" />
//                               </button>
//                             )}

//                             <div className="flex items-center text-xs text-gray-500">
//                               <Clock className="w-3 h-3 mr-1" />
//                               {formatTimeAgo(notification.created_at)}
//                             </div>
//                           </div>
//                         </div>

//                         <p className="text-sm text-gray-600 mt-1">
//                           {truncateText(notification.message)}
//                         </p>

//                         {!notification.is_read && (
//                           <div className="mt-2">
//                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
//                               New
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           {notifications.length > 0 && (
//             <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
//               <button
//                 onClick={() => {
//                   setIsOpen(false);
//                   // Navigate to full notifications page if you have one
//                 }}
//                 className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
//               >
//                 View all notifications
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropdown;

// src/components/NotificationDropdown.jsx - Enhanced with better display
import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Clock,
  User,
  MessageCircle,
  Tag,
  AlertCircle,
  ChevronRight,
  Settings,
  Filter,
  Trash2,
  BellOff,
  Archive,
} from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, mentions
  const [forceUpdate, setForceUpdate] = useState(0);
  const dropdownRef = useRef(null);

  const {
    notifications,
    unreadCount,
    isConnected,
    loading,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useNotifications();

  // Force re-render when notifications or unreadCount changes
  useEffect(() => {
    setForceUpdate((prev) => prev + 1);
  }, [notifications.length, unreadCount]);

  // Auto-refresh notifications periodically as fallback
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        fetchNotifications();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isConnected, fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    // Optionally navigate to the related product/note
    // TODO: Implement navigation logic based on notification type
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.is_read;
      case "mentions":
        return (
          notification.type === "mention" ||
          notification.message?.includes("tagged")
        );
      default:
        return true;
    }
  });

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (notification) => {
    if (
      notification.type === "mention" ||
      notification.message?.includes("tagged")
    ) {
      return <Tag className="w-4 h-4 text-blue-600" />;
    }
    if (notification.type === "note") {
      return <MessageCircle className="w-4 h-4 text-green-600" />;
    }
    return <Bell className="w-4 h-4 text-indigo-600" />;
  };

  const getNotificationColor = (notification) => {
    if (
      notification.type === "mention" ||
      notification.message?.includes("tagged")
    ) {
      return "border-l-blue-500 bg-blue-50";
    }
    if (notification.type === "note") {
      return "border-l-green-500 bg-green-50";
    }
    if (notification.priority === "high") {
      return "border-l-red-500 bg-red-50";
    }
    return "border-l-indigo-500 bg-indigo-50";
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const getNotificationTitle = (notification) => {
    if (notification.message?.includes("tagged")) {
      return "You were tagged in a note";
    }
    if (notification.type === "note") {
      return "New note added";
    }
    return "Notification";
  };

  const unreadFilteredCount = filteredNotifications.filter(
    (n) => !n.is_read
  ).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
        title={`${unreadCount} unread notifications`}
      >
        <div className="relative">
          <Bell
            className={`w-6 h-6 transition-all duration-200 ${
              unreadCount > 0 ? "animate-pulse" : ""
            }`}
          />

          {/* Connection Status Indicator */}
          <div
            className={`absolute -top-1 -left-1 w-3 h-3 rounded-full transition-colors ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
            title={isConnected ? "Connected" : "Disconnected"}
          />

          {/* Unread Count Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-scale-in">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[32rem] overflow-hidden transform transition-all duration-200 scale-100 opacity-100">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-indigo-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                Notifications
              </h3>

              <div className="flex items-center space-x-2">
                {/* Connection Status */}
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-xs text-gray-500">
                    {isConnected ? "Live" : "Offline"}
                  </span>
                </div>

                {/* Mark All Read Button */}
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-white rounded-lg p-1 border border-gray-200">
              {[
                { key: "all", label: "All", count: notifications.length },
                { key: "unread", label: "Unread", count: unreadCount },
                {
                  key: "mentions",
                  label: "Mentions",
                  count: notifications.filter((n) =>
                    n.message?.includes("tagged")
                  ).length,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`flex-1 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                    filter === tab.key
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                        filter === tab.key
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {loading ? (
              <div className="p-6 text-center">
                <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-gray-600">
                  Loading notifications...
                </p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {filter === "unread" ? (
                    <CheckCheck className="w-8 h-8 text-gray-400" />
                  ) : filter === "mentions" ? (
                    <Tag className="w-8 h-8 text-gray-400" />
                  ) : (
                    <Bell className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {filter === "unread"
                    ? "All caught up!"
                    : filter === "mentions"
                    ? "No mentions yet"
                    : "No notifications yet"}
                </p>
                <p className="text-xs text-gray-500">
                  {filter === "unread"
                    ? "You've read all your notifications"
                    : filter === "mentions"
                    ? "You'll see mentions when someone tags you"
                    : "You'll see notifications when something happens"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.slice(0, 20).map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 border-l-4 ${
                      !notification.is_read
                        ? getNotificationColor(notification)
                        : "border-l-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 mt-1 p-2 rounded-full ${
                          !notification.is_read
                            ? "bg-white shadow-sm"
                            : "bg-gray-100"
                        }`}
                      >
                        {getNotificationIcon(notification)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              {getNotificationTitle(notification)}
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {notification.sender_name && (
                                <span className="font-medium text-indigo-600">
                                  {notification.sender_name}
                                </span>
                              )}
                              {notification.sender_name && " • "}
                              {truncateText(notification.message)}
                            </p>
                          </div>

                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.is_read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded-full p-1 transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            )}
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500 space-x-2">
                            <Clock className="w-3 h-3" />
                            <span>
                              {formatTimeAgo(notification.created_at)}
                            </span>
                          </div>

                          {!notification.is_read && (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                              <span className="text-xs font-medium text-indigo-600">
                                New
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Additional context for tagged notifications */}
                        {notification.message?.includes("tagged") && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
                            <Tag className="w-3 h-3" />
                            <span>Direct mention</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show more indicator */}
                {filteredNotifications.length > 20 && (
                  <div className="p-3 text-center text-sm text-gray-500 bg-gray-50">
                    Showing 20 of {filteredNotifications.length} notifications
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {unreadFilteredCount} unread • {filteredNotifications.length}{" "}
                  total
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to full notifications page if you have one
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
                >
                  View all
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 4px;
        }

        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
      `}</style>
    </div>
  );
};

export default NotificationDropdown;
