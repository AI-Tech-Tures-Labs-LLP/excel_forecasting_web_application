// src/App.jsx
import React, { useEffect, useState, createContext, useContext } from "react";
import { useLocation, Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppContextProvider } from "./context/AppContext";

// Components
import LandingPage from "./components/LandingPage";
import XLSXUploader from "./components/XLSXUploader";
import FileUploadStep from "./components/FileUploadStep";
import Forecast from "./components/Forecast";
import ProductSelector from "./components/ProductSelector";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import LoadingOverlay from "./components/LoadingOverlay";
import LoginPage from "./components/LoginPage";

// Redux imports
import { setCurrentView } from "./redux/uiSlice";
import { setCurrentSession } from "./redux/forecastSlice";

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user was previously authenticated (optional persistence)
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (username) => {
    setIsAuthenticated(true);
    const userData = { username, loginTime: new Date().toISOString() };
    setUser(userData);

    // Optional: Persist authentication state
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);

    // Clear authentication state
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";

  // Global state
  const globalLoading = useSelector((state) => state.ui.globalLoading);
  const toasts = useSelector((state) => state.ui.toasts);
  const theme = useSelector((state) => state.ui.theme);

  // Initialize app state
  useEffect(() => {
    // Only initialize app data if user is authenticated
    if (isAuthenticated) {
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
        "/pricing": "pricing",
        "/file-upload": "file-upload", // ADD THIS LINE
        "/forecast": "forecast",
        "/products": "products",
        "/login": "login",
      };

      const currentView = viewMap[location.pathname] || "landing";
      dispatch(setCurrentView(currentView));
    }
  }, [dispatch, location.pathname, isAuthenticated]);

  // Redirect to login if not authenticated and not already on login page
  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, isLoginPage, navigate]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <AppContextProvider>
      <div className={`min-h-screen bg-gray-50 flex flex-col ${theme}`}>
        {/* Global Loading Overlay */}
        {globalLoading && <LoadingOverlay />}

        {/* Navigation - only show if authenticated and not on login/home page */}
        {isAuthenticated && !isHomePage && !isLoginPage && <Navbar />}

        {/* Main Content */}
        <div
          className={`flex-grow ${
            isAuthenticated && !isHomePage && !isLoginPage
              ? "pb-16 sm:pb-0"
              : ""
          }`}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
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
            {/* ADD THIS NEW ROUTE */}
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
            <Route path="*" element={<LoginPage />} />
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

// Main App Wrapper with Auth Provider
function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithAuth;
