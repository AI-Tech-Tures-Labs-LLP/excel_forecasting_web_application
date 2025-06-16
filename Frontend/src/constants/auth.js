// src/constants/auth.js
export const AUTH_CONSTANTS = {
  ROLES: {
    ADMIN: "admin",
    MANAGER: "manager",
    ANALYST: "analyst",
    VIEWER: "viewer",
  },

  PERMISSIONS: {
    DASHBOARD: "dashboard",
    PRODUCTS: "products",
    USERS: "users",
    SETTINGS: "settings",
    REPORTS: "reports",
    FORECAST: "forecast",
  },

  STORAGE_KEYS: {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    USER: "user",
    PREFERENCES: "user_preferences",
  },

  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour
};

export const ROLE_PERMISSIONS = {
  [AUTH_CONSTANTS.ROLES.ADMIN]: [
    AUTH_CONSTANTS.PERMISSIONS.DASHBOARD,
    AUTH_CONSTANTS.PERMISSIONS.PRODUCTS,
    AUTH_CONSTANTS.PERMISSIONS.USERS,
    AUTH_CONSTANTS.PERMISSIONS.SETTINGS,
    AUTH_CONSTANTS.PERMISSIONS.REPORTS,
    AUTH_CONSTANTS.PERMISSIONS.FORECAST,
  ],
  [AUTH_CONSTANTS.ROLES.MANAGER]: [
    AUTH_CONSTANTS.PERMISSIONS.DASHBOARD,
    AUTH_CONSTANTS.PERMISSIONS.PRODUCTS,
    AUTH_CONSTANTS.PERMISSIONS.REPORTS,
    AUTH_CONSTANTS.PERMISSIONS.FORECAST,
  ],
  [AUTH_CONSTANTS.ROLES.ANALYST]: [
    AUTH_CONSTANTS.PERMISSIONS.DASHBOARD,
    AUTH_CONSTANTS.PERMISSIONS.PRODUCTS,
    AUTH_CONSTANTS.PERMISSIONS.FORECAST,
  ],
  [AUTH_CONSTANTS.ROLES.VIEWER]: [
    AUTH_CONSTANTS.PERMISSIONS.DASHBOARD,
    AUTH_CONSTANTS.PERMISSIONS.PRODUCTS,
  ],
};

export const ROLE_LABELS = {
  [AUTH_CONSTANTS.ROLES.ADMIN]: {
    label: "Administrator",
    description: "Full system access with user management",
    color: "red",
  },
  [AUTH_CONSTANTS.ROLES.MANAGER]: {
    label: "Manager",
    description: "Manage products, forecasts, and view reports",
    color: "blue",
  },
  [AUTH_CONSTANTS.ROLES.ANALYST]: {
    label: "Analyst",
    description: "Create and analyze forecasts",
    color: "green",
  },
  [AUTH_CONSTANTS.ROLES.VIEWER]: {
    label: "Viewer",
    description: "Read-only access to products and dashboard",
    color: "gray",
  },
};
