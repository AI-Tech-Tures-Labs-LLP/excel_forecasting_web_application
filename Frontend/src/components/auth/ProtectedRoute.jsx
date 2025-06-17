// // // src/components/auth/ProtectedRoute.jsx
// // import React from "react";
// // import { useSelector } from "react-redux";
// // import { Navigate, useLocation } from "react-router-dom";
// // import {
// //   selectIsAuthenticated,
// //   selectHasPermission,
// // } from "../../redux/authSlice";

// // const ProtectedRoute = ({ children, requiredPermission = null }) => {
// //   const isAuthenticated = useSelector(selectIsAuthenticated);
// //   const hasPermission = useSelector((state) =>
// //     requiredPermission ? selectHasPermission(state, requiredPermission) : true
// //   );
// //   const location = useLocation();

// //   if (!isAuthenticated) {
// //     return <Navigate to="/login" state={{ from: location }} replace />;
// //   }

// //   if (requiredPermission && !hasPermission) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //         <div className="text-center">
// //           <div className="text-6xl text-gray-400 mb-4">🔒</div>
// //           <h1 className="text-2xl font-bold text-gray-900 mb-2">
// //             Access Denied
// //           </h1>
// //           <p className="text-gray-600">
// //             You don't have permission to access this page.
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return children;
// // };

// // export default ProtectedRoute;

// // src/components/auth/ProtectedRoute.jsx
// import React, { useEffect, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { Shield, Loader } from "lucide-react";

// const ProtectedRoute = ({ children, requiredPermission = null }) => {
//   const location = useLocation();
//   const [authState, setAuthState] = useState({
//     loading: true,
//     user: null,
//     isAuthenticated: false,
//   });

//   // Check authentication state only once
//   useEffect(() => {
//     const checkAuth = () => {
//       try {
//         const userData = localStorage.getItem("user");
//         const token = localStorage.getItem("access_token");

//         console.log("ProtectedRoute auth check:", {
//           hasUser: !!userData,
//           hasToken: !!token,
//           location: location.pathname,
//         });

//         if (userData && token) {
//           const user = JSON.parse(userData);
//           setAuthState({
//             loading: false,
//             user,
//             isAuthenticated: true,
//           });
//         } else {
//           setAuthState({
//             loading: false,
//             user: null,
//             isAuthenticated: false,
//           });
//         }
//       } catch (error) {
//         console.error("Auth check error:", error);
//         setAuthState({
//           loading: false,
//           user: null,
//           isAuthenticated: false,
//         });
//       }
//     };

//     checkAuth();
//   }, [location.pathname]);

//   // Show loading while checking auth
//   if (authState.loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Checking authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   // Check if user has required permission/role
//   const hasPermission = () => {
//     if (!requiredPermission) return true;

//     if (requiredPermission === "admin") {
//       return authState.user?.role === "admin";
//     }

//     // Add other permission checks as needed
//     return true;
//   };

//   // Redirect to login if not authenticated
//   if (!authState.isAuthenticated) {
//     console.log(
//       "Not authenticated, redirecting to login from:",
//       location.pathname
//     );
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Show access denied if permission check fails
//   if (requiredPermission && !hasPermission()) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
//           <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
//             <Shield className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">
//             Access Denied
//           </h1>
//           <p className="text-gray-600 mb-4">
//             You don't have permission to access this page.
//           </p>
//           <p className="text-gray-500 text-sm">
//             Required role: {requiredPermission} | Your role:{" "}
//             {authState.user?.role || "none"}
//           </p>
//           <button
//             onClick={() => window.history.back()}
//             className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return children;
// };

// export default ProtectedRoute;

import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Shield, Loader } from "lucide-react";

const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState({
    loading: true,
    user: null,
    isAuthenticated: false,
  });

  // Check authentication state only once
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("access_token");

        console.log("ProtectedRoute auth check:", {
          hasUser: !!userData,
          hasToken: !!token,
          location: location.pathname,
          requiredPermission: requiredPermission,
        });

        if (userData && token) {
          const user = JSON.parse(userData);
          console.log("User data:", user);
          setAuthState({
            loading: false,
            user,
            isAuthenticated: true,
          });
        } else {
          console.log("No user data or token found");
          setAuthState({
            loading: false,
            user: null,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthState({
          loading: false,
          user: null,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, [location.pathname, requiredPermission]);

  // Show loading while checking auth
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Check if user has required permission/role
  const hasPermission = () => {
    if (!requiredPermission) {
      console.log("No permission required, allowing access");
      return true;
    }

    if (requiredPermission === "admin") {
      const hasAdminAccess = authState.user?.role === "admin";
      console.log("Admin permission check:", {
        userRole: authState.user?.role,
        hasAdminAccess: hasAdminAccess,
        requiredPermission: requiredPermission,
      });
      return hasAdminAccess;
    }

    // Add other permission checks as needed
    console.log("Permission check passed for:", requiredPermission);
    return true;
  };

  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    console.log(
      "Not authenticated, redirecting to login from:",
      location.pathname
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show access denied if permission check fails
  if (requiredPermission && !hasPermission()) {
    console.log("Access denied - insufficient permissions:", {
      requiredPermission,
      userRole: authState.user?.role,
      currentPath: location.pathname,
    });

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-gray-500 text-sm">
            Required role: {requiredPermission} | Your role:{" "}
            {authState.user?.role || "none"}
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  console.log("ProtectedRoute: Access granted, rendering children");
  return children;
};

export default ProtectedRoute;
