import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

class AuthService {
  // Update the API base URL
  constructor() {
    this.API_BASE_URL = "http://127.0.0.1:8000/api/v1/auth";
  }

  async login(credentials) {
    try {
      console.log("Attempting login with:", { username: credentials.username });

      const response = await fetch(`${this.API_BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        timeout: 10000,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.error || `HTTP ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Login response:", data);

      if (!data.access || !data.user) {
        throw new Error("Invalid response format from server");
      }

      this.setTokens(data.access, data.refresh);
      this.setUser(data.user);

      return {
        success: true,
        data: { user: data.user, access: data.access, refresh: data.refresh },
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }
  }

  // Token management methods
  setTokens(access, refresh) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }

  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  getAccessToken() {
    return localStorage.getItem("access_token");
  }

  getUser() {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  isAuthenticated() {
    const token = this.getAccessToken();
    const user = this.getUser();
    return !!(token && user);
  }
}

export default new AuthService();
