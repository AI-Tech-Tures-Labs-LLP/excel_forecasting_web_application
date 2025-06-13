import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  logout,
  clearError,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectAuthError,
  selectLoginLoading,
  selectRegisterLoading,
  selectUserPermissions,
  selectUserRole,
  selectHasPermission,
} from "../redux/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const error = useSelector(selectAuthError);
  const loginLoading = useSelector(selectLoginLoading);
  const registerLoading = useSelector(selectRegisterLoading);
  const permissions = useSelector(selectUserPermissions);
  const role = useSelector(selectUserRole);

  const login = async (credentials) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const register = async (userData) => {
    try {
      await dispatch(registerUser(userData)).unwrap();
      navigate("/login", {
        state: { message: "Registration successful! Please sign in." },
      });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasRole = (roles) => {
    if (typeof roles === "string") {
      return role === roles;
    }
    return Array.isArray(roles) ? roles.includes(role) : false;
  };

  const hasAnyPermission = (permissionList) => {
    return permissionList.some((permission) =>
      permissions.includes(permission)
    );
  };

  return {
    // State
    user,
    isAuthenticated,
    error,
    loginLoading,
    registerLoading,
    permissions,
    role,

    // Actions
    login,
    register,
    logout: signOut,
    clearError: clearAuthError,

    // Utilities
    hasPermission,
    hasRole,
    hasAnyPermission,
  };
};

// ========================= PERMISSION HOOKS =========================

// src/hooks/usePermissions.js
import { useSelector } from "react-redux";
import {
  selectUserPermissions,
  selectUserRole,
  selectHasPermission,
} from "../redux/authSlice";

export const usePermissions = () => {
  const permissions = useSelector(selectUserPermissions);
  const role = useSelector(selectUserRole);

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasRole = (roles) => {
    if (typeof roles === "string") {
      return role === roles;
    }
    return Array.isArray(roles) ? roles.includes(role) : false;
  };

  const hasAnyPermission = (permissionList) => {
    return permissionList.some((permission) =>
      permissions.includes(permission)
    );
  };

  const hasAllPermissions = (permissionList) => {
    return permissionList.every((permission) =>
      permissions.includes(permission)
    );
  };

  const canAccess = (requiredPermissions = [], allowedRoles = []) => {
    const roleCheck = allowedRoles.length === 0 || hasRole(allowedRoles);
    const permissionCheck =
      requiredPermissions.length === 0 || hasAnyPermission(requiredPermissions);

    return roleCheck && permissionCheck;
  };

  return {
    permissions,
    role,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
  };
};
