// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Users,
//   UserPlus,
//   TrendingUp,
//   Upload,
//   Package,
//   Settings,
//   ArrowRight,
//   ArrowLeft,
// } from "lucide-react";

// const AdminDashboard = () => {
//   const navigate = useNavigate();

//   // Get current user to check if admin
//   const getCurrentUser = () => {
//     try {
//       const userData = localStorage.getItem("user");
//       return userData ? JSON.parse(userData) : null;
//     } catch {
//       return null;
//     }
//   };

//   const currentUser = getCurrentUser();
//   const isAdmin = currentUser?.role === "admin";

//   const adminLinks = [
//     {
//       title: "Manage Analysts",
//       description:
//         "Create, edit, and manage analyst accounts with category assignments",
//       icon: Users,
//       path: "/analysts",
//       color: "bg-blue-500",
//       adminOnly: true,
//     },
//     {
//       title: "Create Analyst",
//       description: "Add new analyst to the system",
//       icon: UserPlus,
//       path: "/register",
//       color: "bg-green-500",
//       adminOnly: true,
//     },
//     {
//       title: "Generate Forecast",
//       description: "Create new forecast and assign to analysts",
//       icon: TrendingUp,
//       path: "/forecast",
//       color: "bg-purple-500",
//       adminOnly: true,
//     },
//     {
//       title: "Upload Files",
//       description: "Upload and manage forecast files",
//       icon: Upload,
//       path: "/file-upload",
//       color: "bg-indigo-500",
//       adminOnly: false,
//     },
//     {
//       title: "View Products",
//       description: "Browse and manage product data",
//       icon: Package,
//       path: "/products",
//       color: "bg-orange-500",
//       adminOnly: false,
//     },
//     {
//       title: "Settings",
//       description: "System settings and configuration",
//       icon: Settings,
//       path: "/settings",
//       color: "bg-gray-500",
//       adminOnly: false,
//     },
//   ];

//   const filteredLinks = adminLinks.filter((link) => !link.adminOnly || isAdmin);

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center gap-3 mb-4">
//             <button
//               onClick={() => navigate("/")}
//               className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors"
//             >
//               <ArrowLeft size={16} />
//               Back to Home
//             </button>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             {isAdmin ? "Admin Dashboard" : "Dashboard"}
//           </h1>
//           <p className="text-gray-600">
//             Welcome back, {currentUser?.username}! Here are your available
//             options.
//           </p>
//           {isAdmin && (
//             <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                 <span className="text-blue-800 font-medium">
//                   Administrator Access
//                 </span>
//               </div>
//               <p className="text-blue-700 text-sm mt-1">
//                 You have full administrative privileges including analyst
//                 management and forecast generation.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Quick Links Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredLinks.map((link) => {
//             const IconComponent = link.icon;
//             return (
//               <div
//                 key={link.path}
//                 onClick={() => navigate(link.path)}
//                 className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1 group"
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div
//                       className={`${link.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
//                     >
//                       <IconComponent className="text-white" size={24} />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       {link.title}
//                     </h3>
//                     <p className="text-gray-600 text-sm mb-4">
//                       {link.description}
//                     </p>
//                   </div>
//                   <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <ArrowRight className="text-gray-400" size={20} />
//                   </div>
//                 </div>

//                 {link.adminOnly && (
//                   <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
//                     <div className="w-1 h-1 bg-red-500 rounded-full"></div>
//                     <span>Admin Only</span>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Recent Activity or Stats */}
//         {isAdmin && (
//           <div className="mt-12">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">
//               Quick Stats
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-white rounded-lg border border-gray-200 p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">Total Analysts</p>
//                     <p className="text-2xl font-bold text-gray-900">-</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Manage in Analysts page
//                     </p>
//                   </div>
//                   <Users className="text-blue-500" size={24} />
//                 </div>
//               </div>
//               <div className="bg-white rounded-lg border border-gray-200 p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">Active Forecasts</p>
//                     <p className="text-2xl font-bold text-gray-900">-</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Generate new forecasts
//                     </p>
//                   </div>
//                   <TrendingUp className="text-green-500" size={24} />
//                 </div>
//               </div>
//               <div className="bg-white rounded-lg border border-gray-200 p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">Files Processed</p>
//                     <p className="text-2xl font-bold text-gray-900">-</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       View in Files section
//                     </p>
//                   </div>
//                   <Upload className="text-purple-500" size={24} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Instructions for Analysts */}
//         {!isAdmin && (
//           <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
//             <h3 className="text-lg font-semibold text-green-800 mb-2">
//               Analyst Instructions
//             </h3>
//             <div className="text-green-700 text-sm space-y-2">
//               <p>
//                 • <strong>Upload Files:</strong> Access and manage forecast
//                 files assigned to you
//               </p>
//               <p>
//                 • <strong>View Products:</strong> Browse product data and
//                 analysis results
//               </p>
//               <p>
//                 • <strong>Settings:</strong> Update your profile and preferences
//               </p>
//               <p className="mt-3 text-green-600">
//                 <strong>Note:</strong> Forecast generation is handled by
//                 administrators who will assign work to you.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  TrendingUp,
  Upload,
  Package,
  Settings,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Get current user to check if admin
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  const adminLinks = [
    {
      title: "Manage Analysts",
      description:
        "Create, edit, and manage analyst accounts with category assignments",
      icon: Users,
      path: "/analysts",
      color: "bg-blue-500",
      adminOnly: true,
    },
    {
      title: "Create Analyst",
      description: "Add new analyst to the system",
      icon: UserPlus,
      path: "/register",
      color: "bg-green-500",
      adminOnly: true,
    },
    {
      title: "Generate Forecast",
      description: "Create new forecast and assign to analysts",
      icon: TrendingUp,
      path: "/forecast",
      color: "bg-purple-500",
      adminOnly: true,
    },
    {
      title: "Upload Files",
      description: "Upload and manage forecast files",
      icon: Upload,
      path: "/file-upload",
      color: "bg-indigo-500",
      adminOnly: false,
    },
    {
      title: "View Products",
      description: "Browse and manage product data",
      icon: Package,
      path: "/products",
      color: "bg-orange-500",
      adminOnly: false,
    },
    {
      title: "Settings",
      description: "System settings and configuration",
      icon: Settings,
      path: "/settings",
      color: "bg-gray-500",
      adminOnly: false,
    },
  ];

  const filteredLinks = adminLinks.filter((link) => !link.adminOnly || isAdmin);

  const handleCardClick = (path) => {
    console.log(`Navigating to: ${path}`); // Debug log
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Home
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isAdmin ? "Admin Dashboard" : "Dashboard"}
          </h1>
          <p className="text-gray-600">
            Welcome back, {currentUser?.username}! Here are your available
            options.
          </p>
          {isAdmin && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-blue-800 font-medium">
                  Administrator Access
                </span>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                You have full administrative privileges including analyst
                management and forecast generation.
              </p>
            </div>
          )}
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <div
                key={link.path}
                onClick={() => handleCardClick(link.path)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div
                      className={`${link.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="text-white" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {link.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {link.description}
                    </p>
                  </div>
                  <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="text-gray-400" size={20} />
                  </div>
                </div>

                {link.adminOnly && (
                  <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                    <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                    <span>Admin Only</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent Activity or Stats */}
        {isAdmin && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Stats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Analysts</p>
                    <p className="text-2xl font-bold text-gray-900">-</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Manage in Analysts page
                    </p>
                  </div>
                  <Users className="text-blue-500" size={24} />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Forecasts</p>
                    <p className="text-2xl font-bold text-gray-900">-</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Generate new forecasts
                    </p>
                  </div>
                  <TrendingUp className="text-green-500" size={24} />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Files Processed</p>
                    <p className="text-2xl font-bold text-gray-900">-</p>
                    <p className="text-xs text-gray-500 mt-1">
                      View in Files section
                    </p>
                  </div>
                  <Upload className="text-purple-500" size={24} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions for Analysts */}
        {!isAdmin && (
          <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Analyst Instructions
            </h3>
            <div className="text-green-700 text-sm space-y-2">
              <p>
                • <strong>Upload Files:</strong> Access and manage forecast
                files assigned to you
              </p>
              <p>
                • <strong>View Products:</strong> Browse product data and
                analysis results
              </p>
              <p>
                • <strong>Settings:</strong> Update your profile and preferences
              </p>
              <p className="mt-3 text-green-600">
                <strong>Note:</strong> Forecast generation is handled by
                administrators who will assign work to you.
              </p>
            </div>
          </div>
        )}

        {/* Debug Information */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-2">
            Debug Information:
          </h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Current User: {currentUser?.username}</p>
            <p>User Role: {currentUser?.role}</p>
            <p>Is Admin: {isAdmin ? "Yes" : "No"}</p>
            <p>Available Links: {filteredLinks.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
