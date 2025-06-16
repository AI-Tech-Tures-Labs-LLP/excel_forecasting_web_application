// src/App.jsx - SIMPLIFIED VERSION
import React, { useEffect, useState } from "react";
import { useLocation, Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppContextProvider } from "./context/AppContext";

// Auth components
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";

// Your existing components
import LandingPage from "./components/LandingPage";
import XLSXUploader from "./components/XLSXUploader";
import FileUploadStep from "./components/FileUploadStep";
import Forecast from "./components/Forecast";
import ProductSelector from "./components/ProductSelector";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import LoadingOverlay from "./components/LoadingOverlay";

// Redux imports
import { setCurrentView } from "./redux/uiSlice";
import { setCurrentSession } from "./redux/forecastSlice";

// Simple auth check function
const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

// Simple ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: location } });
    }
  }, [navigate, location]);

  if (!isAuthenticated()) {
    return null;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isAuthPage = isLoginPage || isRegisterPage;
  const authenticated = isAuthenticated();

  // Global state
  const globalLoading = useSelector(
    (state) => state.ui?.globalLoading || false
  );
  const toasts = useSelector((state) => state.ui?.toasts || []);
  const theme = useSelector((state) => state.ui?.theme || "light");

  // Simple auth check on mount
  useEffect(() => {
    setAuthChecked(true);
  }, []);

  // Initialize app state for authenticated users
  useEffect(() => {
    if (authenticated && authChecked) {
      // Load forecast data from localStorage if available
      const storedForecastData = localStorage.getItem("forecastData");
      if (storedForecastData) {
        try {
          const parsedData = JSON.parse(storedForecastData);
          dispatch(setCurrentSession(parsedData));
        } catch (error) {
          console.error("Failed to parse stored forecast data:", error);
          localStorage.removeItem("forecastData");
        }
      }

      // Set initial view based on route
      const viewMap = {
        "/": "landing",
        "/dashboard": "dashboard",
        "/pricing": "pricing",
        "/file-upload": "file-upload",
        "/forecast": "forecast",
        "/products": "products",
      };

      const currentView = viewMap[location.pathname] || "landing";
      dispatch(setCurrentView(currentView));
    }
  }, [dispatch, location.pathname, authenticated, authChecked]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContextProvider>
      <div className={`min-h-screen bg-gray-50 flex flex-col ${theme}`}>
        {/* Global Loading Overlay */}
        {globalLoading && <LoadingOverlay />}

        {/* Navigation - only show if authenticated and not on auth pages */}
        {authenticated && !isHomePage && !isAuthPage && <Navbar />}

        {/* Main Content */}
        <div
          className={`flex-grow ${
            authenticated && !isHomePage && !isAuthPage ? "pb-16 sm:pb-0" : ""
          }`}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <LandingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <LandingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pricing"
              element={
                <ProtectedRoute>
                  <XLSXUploader />
                </ProtectedRoute>
              }
            />
            <Route
              path="/file-upload"
              element={
                <ProtectedRoute>
                  <FileUploadStep />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forecast"
              element={
                <ProtectedRoute>
                  <Forecast />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductSelector />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products/:sheetId"
              element={
                <ProtectedRoute>
                  <ProductSelector />
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route
              path="*"
              element={
                authenticated ? (
                  <ProtectedRoute>
                    <LandingPage />
                  </ProtectedRoute>
                ) : (
                  <LoginPage />
                )
              }
            />
          </Routes>
        </div>

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              message={toast.message}
              duration={toast.duration}
            />
          ))}
        </div>
      </div>
    </AppContextProvider>
  );
}

export default App;
