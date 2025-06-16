import { AUTH_CONSTANTS, ROLE_PERMISSIONS } from "../constants/auth";

export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const hasRole = (userRole, allowedRoles) => {
  if (!userRole) return false;
  if (typeof allowedRoles === "string") {
    return userRole === allowedRoles;
  }
  return Array.isArray(allowedRoles) ? allowedRoles.includes(userRole) : false;
};

export const getUserPermissions = (userRole) => {
  return ROLE_PERMISSIONS[userRole] || [];
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const shouldRefreshToken = (
  token,
  threshold = AUTH_CONSTANTS.TOKEN_REFRESH_THRESHOLD
) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    const expirationTime = payload.exp;
    const timeUntilExpiration = (expirationTime - currentTime) * 1000;

    return timeUntilExpiration <= threshold;
  } catch {
    return false;
  }
};

export const getRoleColor = (role) => {
  const colors = {
    admin: "bg-red-100 text-red-800 border-red-200",
    manager: "bg-blue-100 text-blue-800 border-blue-200",
    analyst: "bg-green-100 text-green-800 border-green-200",
    viewer: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return colors[role] || colors.viewer;
};

export const formatUserDisplayName = (user) => {
  if (!user) return "Unknown User";

  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }

  if (user.first_name) {
    return user.first_name;
  }

  return user.username || user.email || "Unknown User";
};
