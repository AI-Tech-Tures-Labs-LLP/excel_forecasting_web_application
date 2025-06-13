// src/utils/errorHandling.js
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid username or password",
  USER_NOT_FOUND: "User account not found",
  ACCOUNT_DISABLED: "Your account has been disabled",
  TOKEN_EXPIRED: "Your session has expired. Please log in again",
  TOKEN_INVALID: "Invalid authentication token",
  PERMISSION_DENIED: "You do not have permission to perform this action",
  NETWORK_ERROR: "Network error. Please check your connection",
  SERVER_ERROR: "Server error. Please try again later",
  VALIDATION_ERROR: "Please check your input and try again",
  REGISTRATION_FAILED: "Registration failed. Please try again",
  USERNAME_EXISTS: "Username already exists",
  EMAIL_EXISTS: "Email address already registered",
  WEAK_PASSWORD: "Password is too weak. Please choose a stronger password",
};

export const getAuthErrorMessage = (error) => {
  if (typeof error === "string") {
    return error;
  }

  if (error?.response?.data?.detail) {
    return error.response.data.detail;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  // Handle specific status codes
  switch (error?.response?.status) {
    case 401:
      return AUTH_ERRORS.INVALID_CREDENTIALS;
    case 403:
      return AUTH_ERRORS.PERMISSION_DENIED;
    case 404:
      return AUTH_ERRORS.USER_NOT_FOUND;
    case 500:
      return AUTH_ERRORS.SERVER_ERROR;
    default:
      return "An unexpected error occurred";
  }
};
