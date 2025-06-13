import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

// Async thunks with better error handling
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await authService.login(credentials);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await authService.register(userData);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    try {
      const user = authService.getUser();
      const token = authService.getAccessToken();

      if (user && token && !authService.isTokenExpired(token)) {
        // Optionally verify token with backend
        const verifyResult = await authService.getCurrentUser();
        if (verifyResult.success) {
          return { user: verifyResult.data };
        } else {
          // Token is invalid, clear storage
          authService.logout();
          return rejectWithValue("Session expired");
        }
      } else {
        // No valid session
        authService.logout();
        return rejectWithValue("No valid session");
      }
    } catch (error) {
      authService.logout();
      return rejectWithValue(error.message || "Auth initialization failed");
    }
  }
);

// Role permissions
const ROLE_PERMISSIONS = {
  admin: ["dashboard", "products", "users", "settings", "reports", "forecast"],
  manager: ["dashboard", "products", "reports", "forecast"],
  analyst: ["dashboard", "products", "forecast"],
  viewer: ["dashboard", "products"],
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false, // Key flag to track if auth has been initialized
  loading: false,
  loginLoading: false,
  registerLoading: false,
  error: null,
  permissions: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.isAuthenticated = false;
      state.permissions = [];
      state.error = null;
      state.isInitialized = true; // Keep initialized as true
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.permissions = ROLE_PERMISSIONS[action.payload?.role] || [];
      authService.setUser(action.payload);
    },
    // Manual initialization for cases where we don't want async
    setInitialized: (state) => {
      state.isInitialized = true;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.isInitialized = false;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.permissions = ROLE_PERMISSIONS[action.payload.user.role] || [];
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
        state.user = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.error = null; // Don't show error for initialization failure
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.permissions = ROLE_PERMISSIONS[action.payload.user.role] || [];
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.permissions = [];
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.error = action.payload;
      });
  },
});

// Updated selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsInitialized = (state) => state.auth.isInitialized; // New selector
export const selectAuthLoading = (state) => state.auth.loading;
export const selectLoginLoading = (state) => state.auth.loginLoading;
export const selectRegisterLoading = (state) => state.auth.registerLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserPermissions = (state) => state.auth.permissions;
export const selectUserRole = (state) => state.auth.user?.role;

export const selectHasPermission = (state, permission) => {
  return state.auth.permissions.includes(permission);
};

export const { logout, clearError, setUser, setInitialized } =
  authSlice.actions;
export default authSlice.reducer;
