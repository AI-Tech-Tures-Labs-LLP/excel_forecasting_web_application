// // src/App.jsx - UPDATED WITH ROLE-BASED ROUTING
// import React, { useEffect, useState } from "react";
// import {
//   useLocation,
//   Routes,
//   Route,
//   useNavigate,
//   useParams,
// } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { AppContextProvider } from "./context/AppContext";

// // Auth components
// import LoginPage from "./components/auth/LoginPage";
// import RegisterPage from "./components/auth/RegisterPage";

// // Your existing components
// import LandingPage from "./components/LandingPage";
// import XLSXUploader from "./components/XLSXUploader";
// import FileUploadStep from "./components/FileUploadStep";
// import Forecast from "./components/Forecast";
// import ProductSelector from "./components/ProductSelector";
// import Navbar from "./components/Navbar";
// import Toast from "./components/Toast";
// import LoadingOverlay from "./components/LoadingOverlay";
// import AnalystManagement from "./components/AnalystManagement";
// import AdminDashboard from "./components/admin/AdminDashboard";

// // Redux imports
// import { setCurrentView } from "./redux/uiSlice";
// import { setCurrentSession, setFiles } from "./redux/forecastSlice";
// import ProductDetailsView from "./components/product-details/ProductDetailsView";
// import { getAllFiles } from "./services/forecast.service";

// // Simple auth check function
// const isAuthenticated = () => {
//   const token = localStorage.getItem("access_token");
//   const user = localStorage.getItem("user");
//   return !!(token && user);
// };

// // Get current user role
// const getCurrentUserRole = () => {
//   try {
//     const userData = localStorage.getItem("user");
//     const user = JSON.parse(userData);
//     return user?.role || null;
//   } catch (error) {
//     return null;
//   }
// };

// // Enhanced ProtectedRoute component with role-based redirection
// const ProtectedRoute = ({
//   children,
//   requiredPermission = null,
//   allowedRoles = null,
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       navigate("/login", { state: { from: location } });
//       return;
//     }

//     const userRole = getCurrentUserRole();

//     // Check if user has required permission
//     if (requiredPermission === "admin" && userRole !== "admin") {
//       console.log("Access denied - admin required");
//       navigate("/dashboard");
//       return;
//     }

//     // Check if user role is allowed for this route
//     if (allowedRoles && !allowedRoles.includes(userRole)) {
//       console.log(
//         `Access denied - role ${userRole} not in allowed roles:`,
//         allowedRoles
//       );
//       // Redirect based on role
//       if (userRole === "admin") {
//         navigate("/");
//       } else {
//         navigate("/dashboard");
//       }
//       return;
//     }
//   }, [navigate, location, requiredPermission, allowedRoles]);

//   if (!isAuthenticated()) {
//     return null;
//   }

//   const userRole = getCurrentUserRole();

//   // Additional admin check for rendering
//   if (requiredPermission === "admin" && userRole !== "admin") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
//           <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
//             <svg
//               className="w-8 h-8 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
//               />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">
//             Access Denied
//           </h1>
//           <p className="text-gray-600 mb-4">
//             You don't have permission to access this page.
//           </p>
//           <p className="text-gray-500 text-sm">
//             Required role: Admin | Your role: {userRole || "none"}
//           </p>
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Check allowed roles for rendering
//   if (allowedRoles && !allowedRoles.includes(userRole)) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
//           <div className="mx-auto w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-4">
//             <svg
//               className="w-8 h-8 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
//               />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">
//             Access Restricted
//           </h1>
//           <p className="text-gray-600 mb-4">
//             This page is not available for your role.
//           </p>
//           <p className="text-gray-500 text-sm">
//             Allowed roles: {allowedRoles.join(", ")} | Your role:{" "}
//             {userRole || "none"}
//           </p>
//           <button
//             onClick={() => navigate(userRole === "admin" ? "/" : "/dashboard")}
//             className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//           >
//             Go to {userRole === "admin" ? "Home" : "Dashboard"}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return children;
// };

// function App() {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [authChecked, setAuthChecked] = useState(false);
//   const files = useSelector((state) => state.forecast.files);
//   const isHomePage = location.pathname === "/";
//   const isLoginPage = location.pathname === "/login";
//   const isRegisterPage = location.pathname === "/register";
//   const isAuthPage = isLoginPage || isRegisterPage;
//   const authenticated = isAuthenticated();
//   const { sheetId } = useParams();

//   // Global state
//   const globalLoading = useSelector(
//     (state) => state.ui?.globalLoading || false
//   );
//   const toasts = useSelector((state) => state.ui?.toasts || []);
//   const theme = useSelector((state) => state.ui?.theme || "light");

//   const getFiles = async () => {
//     try {
//       const res = await getAllFiles();
//       console.log("Fetched files:", res.data);
//       dispatch(setFiles(res.data));
//     } catch (err) {
//       console.error("Error fetching files:", err);
//       return [];
//     }
//   };

//   // Simple auth check on mount
//   useEffect(() => {
//     setAuthChecked(true);
//     getFiles();
//   }, []);

//   // Role-based redirection after login
//   useEffect(() => {
//     if (authenticated && authChecked) {
//       const userRole = getCurrentUserRole();
//       const currentPath = location.pathname;

//       // Redirect based on role if on home page or unauthorized page
//       if (currentPath === "/" && userRole !== "admin") {
//         // Analysts should go to dashboard, not landing page
//         navigate("/dashboard", { replace: true });
//         return;
//       }

//       // Load forecast data from localStorage if available
//       if (sheetId) {
//         const file = files?.find((f) => f.id === sheetId);
//         if (file) {
//           const fileData = {
//             id: file.id,
//             name: file.name,
//             file_url: file.file,
//             summary_url: file.summary,
//             month_from: file.month_from,
//             month_to: file.month_to,
//             categories: JSON.parse(file.categories || "[]"),
//             output_folder: file.output_folder,
//             uploaded_at: file.uploaded_at,
//             percentage: file.percentage,
//           };
//           dispatch(setCurrentSession(fileData));
//         }
//       }

//       // Set initial view based on route
//       const viewMap = {
//         "/": "landing",
//         "/dashboard": "dashboard",
//         "/pricing": "pricing",
//         "/file-upload": "file-upload",
//         "/forecast": "forecast",
//         "/products": "products",
//         "/analysts": "analysts",
//         "/register": "register",
//       };

//       const currentView = viewMap[location.pathname] || "landing";
//       dispatch(setCurrentView(currentView));
//     }
//   }, [
//     dispatch,
//     location.pathname,
//     authenticated,
//     authChecked,
//     sheetId,
//     navigate,
//     files,
//   ]);

//   // Apply theme to document
//   useEffect(() => {
//     document.documentElement.className = theme;
//   }, [theme]);

//   // Show loading while checking auth
//   if (!authChecked) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <AppContextProvider>
//       <div className={`min-h-screen bg-gray-50 flex flex-col ${theme}`}>
//         {/* Global Loading Overlay */}
//         {globalLoading && <LoadingOverlay />}

//         {/* Navigation - only show if authenticated and not on auth pages */}
//         {authenticated && !isHomePage && !isAuthPage && <Navbar />}

//         {/* Main Content */}
//         <div
//           className={`flex-grow ${
//             authenticated && !isHomePage && !isAuthPage ? "pb-16 sm:pb-0" : ""
//           }`}
//         >
//           <Routes>
//             {/* Public routes */}
//             <Route path="/login" element={<LoginPage />} />

//             {/* Admin-only routes */}
//             <Route
//               path="/"
//               element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <LandingPage />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/register"
//               element={
//                 <ProtectedRoute requiredPermission="admin">
//                   <RegisterPage />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/forecast"
//               element={
//                 <ProtectedRoute requiredPermission="admin">
//                   <Forecast />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/analysts"
//               element={
//                 <ProtectedRoute requiredPermission="admin">
//                   <AnalystManagement />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Routes available to both admin and analysts */}
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute
//                   allowedRoles={["admin", "analyst", "senior_analyst"]}
//                 >
//                   <AdminDashboard />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/pricing"
//               element={
//                 <ProtectedRoute>
//                   <XLSXUploader />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/file-upload"
//               element={
//                 <ProtectedRoute>
//                   <FileUploadStep />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/products"
//               element={
//                 <ProtectedRoute>
//                   <ProductSelector />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/products/:sheetId"
//               element={
//                 <ProtectedRoute>
//                   <ProductSelector />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/products/:sheetId/:productId"
//               element={
//                 <ProtectedRoute>
//                   <ProductDetailsView />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Settings route placeholder */}
//             <Route
//               path="/settings"
//               element={
//                 <ProtectedRoute>
//                   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                     <div className="text-center">
//                       <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                         Settings
//                       </h1>
//                       <p className="text-gray-600">
//                         Settings page coming soon...
//                       </p>
//                     </div>
//                   </div>
//                 </ProtectedRoute>
//               }
//             />

//             {/* Profile route placeholder */}
//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                     <div className="text-center">
//                       <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                         Profile
//                       </h1>
//                       <p className="text-gray-600">
//                         Profile page coming soon...
//                       </p>
//                     </div>
//                   </div>
//                 </ProtectedRoute>
//               }
//             />

//             {/* Fallback route - redirect based on role */}
//             <Route
//               path="*"
//               element={
//                 authenticated ? (
//                   <ProtectedRoute>
//                     {(() => {
//                       const userRole = getCurrentUserRole();
//                       if (userRole === "admin") {
//                         return <LandingPage />;
//                       } else {
//                         return <AdminDashboard />;
//                       }
//                     })()}
//                   </ProtectedRoute>
//                 ) : (
//                   <LoginPage />
//                 )
//               }
//             />
//           </Routes>
//         </div>

//         {/* Toast Notifications */}
//         <div className="fixed top-4 right-4 z-50 space-y-2">
//           {toasts.map((toast) => (
//             <Toast
//               key={toast.id}
//               id={toast.id}
//               type={toast.type}
//               message={toast.message}
//               duration={toast.duration}
//             />
//           ))}
//         </div>
//       </div>
//     </AppContextProvider>
//   );
// }

// export default App;

// src/App.jsx - UPDATED WITH WEBSOCKET INTEGRATION
import React, { useEffect, useState } from "react";
import {
  useLocation,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppContextProvider } from "./context/AppContext";
import { WebSocketProvider } from "./context/WebSocketProvider";

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
import AnalystManagement from "./components/AnalystManagement";
import AdminDashboard from "./components/admin/AdminDashboard";

// Redux imports
import { setCurrentView } from "./redux/uiSlice";
import { setCurrentSession, setFiles } from "./redux/forecastSlice";
import ProductDetailsView from "./components/product-details/ProductDetailsView";
import { getAllFiles } from "./services/forecast.service";

// Simple auth check function
const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

// Get current user role
const getCurrentUserRole = () => {
  try {
    const userData = localStorage.getItem("user");
    const user = JSON.parse(userData);
    return user?.role || null;
  } catch (error) {
    return null;
  }
};

// Enhanced ProtectedRoute component with role-based redirection
const ProtectedRoute = ({
  children,
  requiredPermission = null,
  allowedRoles = null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: location } });
      return;
    }

    const userRole = getCurrentUserRole();

    // Check if user has required permission
    if (requiredPermission === "admin" && userRole !== "admin") {
      console.log("Access denied - admin required");
      navigate("/dashboard");
      return;
    }

    // Check if user role is allowed for this route
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      console.log(
        `Access denied - role ${userRole} not in allowed roles:`,
        allowedRoles
      );
      // Redirect based on role
      if (userRole === "admin") {
        navigate("/");
      } else {
        navigate("/dashboard");
      }
      return;
    }
  }, [navigate, location, requiredPermission, allowedRoles]);

  if (!isAuthenticated()) {
    return null;
  }

  const userRole = getCurrentUserRole();

  // Additional admin check for rendering
  if (requiredPermission === "admin" && userRole !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-gray-500 text-sm">
            Required role: Admin | Your role: {userRole || "none"}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Check allowed roles for rendering
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="mx-auto w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Restricted
          </h1>
          <p className="text-gray-600 mb-4">
            This page is not available for your role.
          </p>
          <p className="text-gray-500 text-sm">
            Allowed roles: {allowedRoles.join(", ")} | Your role:{" "}
            {userRole || "none"}
          </p>
          <button
            onClick={() => navigate(userRole === "admin" ? "/" : "/dashboard")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go to {userRole === "admin" ? "Home" : "Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const files = useSelector((state) => state.forecast.files);
  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isAuthPage = isLoginPage || isRegisterPage;
  const authenticated = isAuthenticated();
  const { sheetId } = useParams();

  // Global state
  const globalLoading = useSelector(
    (state) => state.ui?.globalLoading || false
  );
  const toasts = useSelector((state) => state.ui?.toasts || []);
  const theme = useSelector((state) => state.ui?.theme || "light");

  const getFiles = async () => {
    try {
      const res = await getAllFiles();
      console.log("Fetched files:", res.data);
      dispatch(setFiles(res.data));
    } catch (err) {
      console.error("Error fetching files:", err);
      return [];
    }
  };

  // Simple auth check on mount
  useEffect(() => {
    setAuthChecked(true);
    getFiles();
  }, []);

  // Role-based redirection after login
  useEffect(() => {
    if (authenticated && authChecked) {
      const userRole = getCurrentUserRole();
      const currentPath = location.pathname;

      // Redirect based on role if on home page or unauthorized page
      if (currentPath === "/" && userRole !== "admin") {
        // Analysts should go to dashboard, not landing page
        navigate("/dashboard", { replace: true });
        return;
      }

      // Load forecast data from localStorage if available
      if (sheetId) {
        const file = files?.find((f) => f.id === sheetId);
        if (file) {
          const fileData = {
            id: file.id,
            name: file.name,
            file_url: file.file,
            summary_url: file.summary,
            month_from: file.month_from,
            month_to: file.month_to,
            categories: JSON.parse(file.categories || "[]"),
            output_folder: file.output_folder,
            uploaded_at: file.uploaded_at,
            percentage: file.percentage,
          };
          dispatch(setCurrentSession(fileData));
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
        "/analysts": "analysts",
        "/register": "register",
      };

      const currentView = viewMap[location.pathname] || "landing";
      dispatch(setCurrentView(currentView));
    }
  }, [
    dispatch,
    location.pathname,
    authenticated,
    authChecked,
    sheetId,
    navigate,
    files,
  ]);

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
      <WebSocketProvider>
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

              {/* Admin-only routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <LandingPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/register"
                element={
                  <ProtectedRoute requiredPermission="admin">
                    <RegisterPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/forecast"
                element={
                  <ProtectedRoute requiredPermission="admin">
                    <Forecast />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analysts"
                element={
                  <ProtectedRoute requiredPermission="admin">
                    <AnalystManagement />
                  </ProtectedRoute>
                }
              />

              {/* Routes available to both admin and analysts */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "analyst", "senior_analyst"]}
                  >
                    <AdminDashboard />
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

              <Route
                path="/products/:sheetId/:productId"
                element={
                  <ProtectedRoute>
                    <ProductDetailsView />
                  </ProtectedRoute>
                }
              />

              {/* Settings route placeholder */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                          Settings
                        </h1>
                        <p className="text-gray-600">
                          Settings page coming soon...
                        </p>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Profile route placeholder */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                          Profile
                        </h1>
                        <p className="text-gray-600">
                          Profile page coming soon...
                        </p>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Fallback route - redirect based on role */}
              <Route
                path="*"
                element={
                  authenticated ? (
                    <ProtectedRoute>
                      {(() => {
                        const userRole = getCurrentUserRole();
                        if (userRole === "admin") {
                          return <LandingPage />;
                        } else {
                          return <AdminDashboard />;
                        }
                      })()}
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
      </WebSocketProvider>
    </AppContextProvider>
  );
}

export default App;
