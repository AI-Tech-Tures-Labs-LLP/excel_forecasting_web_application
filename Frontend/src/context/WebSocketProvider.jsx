// src/context/WebSocketProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import websocketService from "../services/websocketService";

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  };

  useEffect(() => {
    // Connect WebSocket when authenticated user is available
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      if (currentUser && !websocketService.isConnected) {
        console.log("🔌 Connecting WebSocket for user:", currentUser.username);
        websocketService.connect(currentUser.id);
      }
    }

    // Set up connection status listeners
    const handleConnected = () => {
      console.log("✅ WebSocket Provider: Connected");
      setIsConnected(true);
      setConnectionStatus("connected");
    };

    const handleDisconnected = () => {
      console.log("🔌 WebSocket Provider: Disconnected");
      setIsConnected(false);
      setConnectionStatus("disconnected");
    };

    const handleError = (error) => {
      console.error("❌ WebSocket Provider: Error", error);
      setConnectionStatus("error");
    };

    const handleConnectionEstablished = (data) => {
      console.log("🎉 WebSocket Provider: Connection established", data);
      setIsConnected(true);
      setConnectionStatus("connected");
    };

    // Register event listeners
    websocketService.on("connected", handleConnected);
    websocketService.on("disconnected", handleDisconnected);
    websocketService.on("error", handleError);
    websocketService.on("connectionEstablished", handleConnectionEstablished);

    // Cleanup on unmount
    return () => {
      websocketService.off("connected", handleConnected);
      websocketService.off("disconnected", handleDisconnected);
      websocketService.off("error", handleError);
      websocketService.off(
        "connectionEstablished",
        handleConnectionEstablished
      );

      // Don't disconnect here as other components might still need it
      // websocketService.disconnect();
    };
  }, []);

  // Monitor authentication changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "access_token" || e.key === "user") {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          if (currentUser && !websocketService.isConnected) {
            websocketService.connect(currentUser.id);
          }
        } else {
          // User logged out, disconnect WebSocket
          websocketService.disconnect();
          setIsConnected(false);
          setConnectionStatus("disconnected");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const connect = () => {
    const currentUser = getCurrentUser();
    if (currentUser && isAuthenticated()) {
      websocketService.connect(currentUser.id);
    }
  };

  const disconnect = () => {
    websocketService.disconnect();
    setIsConnected(false);
    setConnectionStatus("disconnected");
  };

  const value = {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    websocketService,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
