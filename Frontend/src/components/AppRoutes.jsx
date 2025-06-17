// // import React from "react";
// // import { Routes, Route, useLocation } from "react-router-dom";

// // // Import components
// // import LandingPage from "../components/LandingPage";
// // import XLSXUploader from "../components/XLSXUploader";
// // import FileUploadStep from "../components/FileUploadStep";
// // import Forecast from "../components/Forecast";
// // import ProductSelector from "../components/ProductSelector";
// // import Navbar from "../components/Navbar";

// // const AppRoutes = () => {
// //   const location = useLocation();
// //   const isHomePage = location.pathname === '/';

// //   return (
// //     <>
// //       {/* Don't show Navbar on the landing page */}
// //       {!isHomePage && <Navbar />}

// //       <div className={`flex-grow ${!isHomePage ? 'pb-16 sm:pb-0' : ''}`}>
// //         <Routes>
// //           {/* Landing page is the root route */}
// //           <Route path="/" element={<LandingPage />} />

// //           {/* File Upload Step - between landing and forecast */}
// //           <Route path="/file-upload" element={<FileUploadStep />} />

// //           {/* Pricing tool */}
// //           <Route path="/pricing" element={<XLSXUploader />} />

// //           {/* Forecast route */}
// //           <Route path="/forecast" element={<Forecast />} />

// //           {/* Product Selector route */}
// //           <Route path="/products" element={<ProductSelector />} />

// //           {/* Fallback route - redirect to landing page */}
// //           <Route path="*" element={<LandingPage />} />
// //         </Routes>
// //       </div>
// //     </>
// //   );
// // };

// // export default AppRoutes;
// import React from "react";
// import { Routes, Route, useLocation } from "react-router-dom";

// // Import components
// import LandingPage from "../components/LandingPage";
// import XLSXUploader from "../components/XLSXUploader";
// import FileUploadStep from "../components/FileUploadStep";
// import Forecast from "../components/Forecast";
// import ProductSelector from "../components/ProductSelector";
// import Navbar from "../components/Navbar";
// import ProtectedRoute from "../components/auth/ProtectedRoute";
// import AnalystManagement from "../components/AnalystManagement";
// import AdminDashboard from "../components/AdminDashboard";

// // Import auth components
// import LoginPage from "../components/auth/LoginPage";
// import RegisterPage from "../components/auth/RegisterPage";

// const AppRoutes = () => {
//   const location = useLocation();
//   const isHomePage = location.pathname === "/";
//   const isAuthPage = ["/login", "/register"].includes(location.pathname);

//   return (
//     <>
//       {/* Don't show Navbar on the landing page or auth pages */}
//       {!isHomePage && !isAuthPage && <Navbar />}

//       <div
//         className={`flex-grow ${
//           !isHomePage && !isAuthPage ? "pb-16 sm:pb-0" : ""
//         }`}
//       >
//         <Routes>
//           {/* Public routes */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<LoginPage />} />

//           {/* Dashboard route */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* Protected admin-only routes */}
//           <Route
//             path="/register"
//             element={
//               <ProtectedRoute requiredPermission="admin">
//                 <RegisterPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/analysts"
//             element={
//               <ProtectedRoute requiredPermission="admin">
//                 <AnalystManagement />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/forecast"
//             element={
//               <ProtectedRoute requiredPermission="admin">
//                 <Forecast />
//               </ProtectedRoute>
//             }
//           />

//           {/* Protected routes - require authentication */}
//           <Route
//             path="/file-upload"
//             element={
//               <ProtectedRoute>
//                 <FileUploadStep />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/pricing"
//             element={
//               <ProtectedRoute>
//                 <XLSXUploader />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/products"
//             element={
//               <ProtectedRoute>
//                 <ProductSelector />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/products/:sheetId"
//             element={
//               <ProtectedRoute>
//                 <ProductSelector />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/products/:sheetId/:productId"
//             element={
//               <ProtectedRoute>
//                 <ProductSelector />
//               </ProtectedRoute>
//             }
//           />

//           {/* Fallback route - redirect to landing page */}
//           <Route path="*" element={<LandingPage />} />
//         </Routes>
//       </div>
//     </>
//   );
// };

// export default AppRoutes;

import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Import components
import LandingPage from "../components/LandingPage";
import XLSXUploader from "../components/XLSXUploader";
import FileUploadStep from "../components/FileUploadStep";
import Forecast from "../components/Forecast";
import ProductSelector from "../components/ProductSelector";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AnalystManagement from "../components/AnalystManagement";
import AdminDashboard from "../components/AdminDashboard";

// Import auth components
import LoginPage from "../components/auth/LoginPage";
import RegisterPage from "../components/auth/RegisterPage";

const AppRoutes = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {/* Don't show Navbar on the landing page or auth pages */}
      {!isHomePage && !isAuthPage && <Navbar />}

      <div
        className={`flex-grow ${
          !isHomePage && !isAuthPage ? "pb-16 sm:pb-0" : ""
        }`}
      >
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected admin-only routes */}
          <Route
            path="/register"
            element={
              <ProtectedRoute requiredPermission="admin">
                <RegisterPage />
              </ProtectedRoute>
            }
          />

          {/* ANALYST MANAGEMENT ROUTE - This is the key route for your analyst management page */}
          <Route
            path="/analysts"
            element={
              <ProtectedRoute requiredPermission="admin">
                <AnalystManagement />
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

          {/* Protected routes - require authentication */}
          <Route
            path="/file-upload"
            element={
              <ProtectedRoute>
                <FileUploadStep />
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
                <ProductSelector />
              </ProtectedRoute>
            }
          />

          {/* Settings route */}
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

          {/* Profile route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Profile
                    </h1>
                    <p className="text-gray-600">Profile page coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Fallback route - redirect to landing page */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </div>
    </>
  );
};

export default AppRoutes;
