import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, User, LogIn, AlertCircle } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");

    if (token && user) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [navigate, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) setError(null);
    if (debugInfo) setDebugInfo(null);
  };

  // Test backend connectivity first
  const testBackend = async () => {
    try {
      console.log("Testing backend connectivity...");
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/login/", {
        method: "OPTIONS", // Test if endpoint exists
      });
      console.log(
        "Backend test response:",
        response.status,
        response.statusText
      );
      return response.status !== 404;
    } catch (error) {
      console.error("Backend connectivity test failed:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError(null);
    setDebugInfo(null);

    try {
      console.log("Starting login process...");
      console.log("Form data:", {
        username: formData.username,
        password: "***",
      });

      // Test backend first
      const backendOk = await testBackend();
      if (!backendOk) {
        setError(
          "Cannot connect to authentication server. Please check if backend is running."
        );
        setLoading(false);
        return;
      }

      const loginUrl = "http://127.0.0.1:8000/api/v1/auth/login/";
      console.log("Making request to:", loginUrl);

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      let data;
      try {
        data = await response.json();
        console.log("Response data:", data);
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        const textResponse = await response.text();
        console.log("Raw response:", textResponse);
        setError("Invalid response from server. Check Django logs.");
        setDebugInfo({
          status: response.status,
          statusText: response.statusText,
          responseText: textResponse.substring(0, 200) + "...",
        });
        return;
      }

      if (response.ok) {
        // Success case
        if (data.access && data.user) {
          console.log("Login successful!");

          // Store tokens and user data
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
          localStorage.setItem("user", JSON.stringify(data.user));

          console.log("Stored in localStorage:", {
            access_token: "present",
            refresh_token: "present",
            user: data.user,
          });

          // Navigate to dashboard
          const from = location.state?.from?.pathname || "/dashboard";
          console.log("Redirecting to:", from);

          // Force page reload to ensure fresh state
          window.location.href = from;
        } else {
          console.error("Login response missing required fields:", data);
          setError("Invalid login response format");
          setDebugInfo({
            status: response.status,
            hasAccess: !!data.access,
            hasUser: !!data.user,
            data: data,
          });
        }
      } else {
        // Error case
        console.error("Login failed with status:", response.status);
        console.error("Error data:", data);

        let errorMessage = "Login failed";

        if (response.status === 401) {
          errorMessage = data.detail || "Invalid username or password";
        } else if (response.status === 400) {
          errorMessage = data.detail || data.error || "Invalid request data";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please check Django logs.";
        } else {
          errorMessage =
            data.detail || data.error || `HTTP ${response.status} error`;
        }

        setError(errorMessage);
        setDebugInfo({
          status: response.status,
          statusText: response.statusText,
          errorData: data,
        });
      }
    } catch (networkError) {
      console.error("Network error during login:", networkError);
      setError(
        "Network error. Please check if the Django server is running on port 8000."
      );
      setDebugInfo({
        errorType: "NetworkError",
        message: networkError.message,
        stack: networkError.stack,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success message from registration */}
          {location.state?.message && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-600 text-sm">{location.state.message}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>

              {/* Debug info */}
              {debugInfo && (
                <details className="mt-2">
                  <summary className="text-xs text-red-500 cursor-pointer">
                    Debug Info (click to expand)
                  </summary>
                  <pre className="text-xs text-red-400 mt-1 bg-red-100 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Debug info */}
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Debug Info:</strong>
            <br />
            API URL: http://127.0.0.1:8000/api/v1/auth/login/
            <br />
            Check browser console and Django logs for details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
