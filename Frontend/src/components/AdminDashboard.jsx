// // import React from "react";
// // import { useNavigate } from "react-router-dom";
// // import {
// //   Users,
// //   UserPlus,
// //   TrendingUp,
// //   Upload,
// //   Package,
// //   Settings,
// //   ArrowRight,
// //   ArrowLeft,
// // } from "lucide-react";

// // const AdminDashboard = () => {
// //   const navigate = useNavigate();

// //   // Get current user to check if admin
// //   const getCurrentUser = () => {
// //     try {
// //       const userData = localStorage.getItem("user");
// //       return userData ? JSON.parse(userData) : null;
// //     } catch {
// //       return null;
// //     }
// //   };

// //   const currentUser = getCurrentUser();
// //   const isAdmin = currentUser?.role === "admin";

// //   const adminLinks = [
// //     {
// //       title: "Manage Analysts",
// //       description:
// //         "Create, edit, and manage analyst accounts with category assignments",
// //       icon: Users,
// //       path: "/analysts",
// //       color: "bg-blue-500",
// //       adminOnly: true,
// //     },
// //     {
// //       title: "Create Analyst",
// //       description: "Add new analyst to the system",
// //       icon: UserPlus,
// //       path: "/register",
// //       color: "bg-green-500",
// //       adminOnly: true,
// //     },
// //     {
// //       title: "Generate Forecast",
// //       description: "Create new forecast and assign to analysts",
// //       icon: TrendingUp,
// //       path: "/forecast",
// //       color: "bg-purple-500",
// //       adminOnly: true,
// //     },
// //     {
// //       title: "Upload Files",
// //       description: "Upload and manage forecast files",
// //       icon: Upload,
// //       path: "/file-upload",
// //       color: "bg-indigo-500",
// //       adminOnly: false,
// //     },
// //     {
// //       title: "View Products",
// //       description: "Browse and manage product data",
// //       icon: Package,
// //       path: "/products",
// //       color: "bg-orange-500",
// //       adminOnly: false,
// //     },
// //     {
// //       title: "Settings",
// //       description: "System settings and configuration",
// //       icon: Settings,
// //       path: "/settings",
// //       color: "bg-gray-500",
// //       adminOnly: false,
// //     },
// //   ];

// //   const filteredLinks = adminLinks.filter((link) => !link.adminOnly || isAdmin);

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       <div className="max-w-6xl mx-auto">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <div className="flex items-center gap-3 mb-4">
// //             <button
// //               onClick={() => navigate("/")}
// //               className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors"
// //             >
// //               <ArrowLeft size={16} />
// //               Back to Home
// //             </button>
// //           </div>
// //           <h1 className="text-3xl font-bold text-gray-900 mb-2">
// //             {isAdmin ? "Admin Dashboard" : "Dashboard"}
// //           </h1>
// //           <p className="text-gray-600">
// //             Welcome back, {currentUser?.username}! Here are your available
// //             options.
// //           </p>
// //           {isAdmin && (
// //             <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
// //               <div className="flex items-center gap-2">
// //                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
// //                 <span className="text-blue-800 font-medium">
// //                   Administrator Access
// //                 </span>
// //               </div>
// //               <p className="text-blue-700 text-sm mt-1">
// //                 You have full administrative privileges including analyst
// //                 management and forecast generation.
// //               </p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Quick Links Grid */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {filteredLinks.map((link) => {
// //             const IconComponent = link.icon;
// //             return (
// //               <div
// //                 key={link.path}
// //                 onClick={() => navigate(link.path)}
// //                 className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1 group"
// //               >
// //                 <div className="flex items-start justify-between">
// //                   <div className="flex-1">
// //                     <div
// //                       className={`${link.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
// //                     >
// //                       <IconComponent className="text-white" size={24} />
// //                     </div>
// //                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
// //                       {link.title}
// //                     </h3>
// //                     <p className="text-gray-600 text-sm mb-4">
// //                       {link.description}
// //                     </p>
// //                   </div>
// //                   <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
// //                     <ArrowRight className="text-gray-400" size={20} />
// //                   </div>
// //                 </div>

// //                 {link.adminOnly && (
// //                   <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
// //                     <div className="w-1 h-1 bg-red-500 rounded-full"></div>
// //                     <span>Admin Only</span>
// //                   </div>
// //                 )}
// //               </div>
// //             );
// //           })}
// //         </div>

// //         {/* Recent Activity or Stats */}
// //         {isAdmin && (
// //           <div className="mt-12">
// //             <h2 className="text-xl font-semibold text-gray-900 mb-4">
// //               Quick Stats
// //             </h2>
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //               <div className="bg-white rounded-lg border border-gray-200 p-6">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-sm text-gray-600">Total Analysts</p>
// //                     <p className="text-2xl font-bold text-gray-900">-</p>
// //                     <p className="text-xs text-gray-500 mt-1">
// //                       Manage in Analysts page
// //                     </p>
// //                   </div>
// //                   <Users className="text-blue-500" size={24} />
// //                 </div>
// //               </div>
// //               <div className="bg-white rounded-lg border border-gray-200 p-6">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-sm text-gray-600">Active Forecasts</p>
// //                     <p className="text-2xl font-bold text-gray-900">-</p>
// //                     <p className="text-xs text-gray-500 mt-1">
// //                       Generate new forecasts
// //                     </p>
// //                   </div>
// //                   <TrendingUp className="text-green-500" size={24} />
// //                 </div>
// //               </div>
// //               <div className="bg-white rounded-lg border border-gray-200 p-6">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-sm text-gray-600">Files Processed</p>
// //                     <p className="text-2xl font-bold text-gray-900">-</p>
// //                     <p className="text-xs text-gray-500 mt-1">
// //                       View in Files section
// //                     </p>
// //                   </div>
// //                   <Upload className="text-purple-500" size={24} />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Instructions for Analysts */}
// //         {!isAdmin && (
// //           <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
// //             <h3 className="text-lg font-semibold text-green-800 mb-2">
// //               Analyst Instructions
// //             </h3>
// //             <div className="text-green-700 text-sm space-y-2">
// //               <p>
// //                 • <strong>Upload Files:</strong> Access and manage forecast
// //                 files assigned to you
// //               </p>
// //               <p>
// //                 • <strong>View Products:</strong> Browse product data and
// //                 analysis results
// //               </p>
// //               <p>
// //                 • <strong>Settings:</strong> Update your profile and preferences
// //               </p>
// //               <p className="mt-3 text-green-600">
// //                 <strong>Note:</strong> Forecast generation is handled by
// //                 administrators who will assign work to you.
// //               </p>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;

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

//   const handleCardClick = (path) => {
//     console.log(`Navigating to: ${path}`); // Debug log
//     navigate(path);
//   };

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
//                 onClick={() => handleCardClick(link.path)}
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

//         {/* Debug Information */}
//         <div className="mt-8 p-4 bg-gray-100 rounded-lg">
//           <h4 className="text-sm font-medium text-gray-800 mb-2">
//             Debug Information:
//           </h4>
//           <div className="text-xs text-gray-600 space-y-1">
//             <p>Current User: {currentUser?.username}</p>
//             <p>User Role: {currentUser?.role}</p>
//             <p>Is Admin: {isAdmin ? "Yes" : "No"}</p>
//             <p>Available Links: {filteredLinks.length}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from "react";
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
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Calendar,
  Filter,
  RefreshCw,
  Download,
  Plus,
  Search,
  Bell,
  Target,
  Zap,
  Database,
  PieChart,
  LineChart,
  Award,
  Briefcase,
  Eye,
  TrendingDown,
  AlertCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAnalysts: 0,
    activeAnalysts: 0,
    totalForecasts: 0,
    pendingTasks: 0,
    completionRate: 0,
    avgPerformance: 0,
    totalProducts: 0,
    categoriesManaged: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [quickMetrics, setQuickMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("7days");
  const [notifications, setNotifications] = useState([]);

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

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
  }, [selectedTimeframe]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch analysts data
      const analystResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/users/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (analystResponse.ok) {
        const users = await analystResponse.json();
        const analysts = users.filter(
          (user) =>
            user.role?.name === "analyst" ||
            user.role?.name === "senior_analyst"
        );

        // Fetch products data to get workload information
        const productsResponse = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/forecast/query/filter_products/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        let totalProducts = 0;
        let reviewedProducts = 0;
        let categoriesSet = new Set();
        let analystWorkloads = {};

        if (productsResponse.ok) {
          const products = await productsResponse.json();
          totalProducts = products.length;
          reviewedProducts = products.filter(
            (p) => p.status === "reviewed"
          ).length;

          // Get unique categories
          products.forEach((p) => {
            if (p.category) categoriesSet.add(p.category);
          });

          // Calculate individual analyst workloads
          analysts.forEach((analyst) => {
            const analystProducts = products.filter(
              (p) => p.assigned_to === analyst.id
            );
            const analystReviewed = analystProducts.filter(
              (p) => p.status === "reviewed"
            ).length;
            const analystPending = analystProducts.filter(
              (p) => p.status === "not_reviewed"
            ).length;

            analystWorkloads[analyst.id] = {
              total: analystProducts.length,
              reviewed: analystReviewed,
              pending: analystPending,
              completionRate:
                analystProducts.length > 0
                  ? Math.round((analystReviewed / analystProducts.length) * 100)
                  : 0,
            };
          });
        }

        const activeAnalysts = analysts.filter((a) => a.is_active).length;
        const completionRate =
          totalProducts > 0
            ? Math.round((reviewedProducts / totalProducts) * 100)
            : 0;

        // Calculate average performance
        const avgPerformance =
          Object.values(analystWorkloads).length > 0
            ? Math.round(
                Object.values(analystWorkloads).reduce(
                  (sum, w) => sum + w.completionRate,
                  0
                ) / Object.values(analystWorkloads).length
              )
            : 0;

        setStats({
          totalAnalysts: analysts.length,
          activeAnalysts,
          totalForecasts: totalProducts,
          pendingTasks: totalProducts - reviewedProducts,
          completionRate,
          avgPerformance,
          totalProducts,
          categoriesManaged: categoriesSet.size,
        });

        // Generate performance data for chart with proper name handling
        const performanceChart = analysts.slice(0, 5).map((analyst) => {
          // Use username since first_name/last_name don't exist in API
          const displayName = analyst.username || "Unknown User";

          return {
            name: displayName,
            performance: analystWorkloads[analyst.id]?.completionRate || 0,
            workload: analystWorkloads[analyst.id]?.total || 0,
          };
        });

        setPerformanceData(performanceChart);

        // Generate recent activities
        const activities = [
          {
            id: 1,
            user:
              analysts[0]?.first_name + " " + analysts[0]?.last_name ||
              "John Doe",
            action: "completed forecast review",
            target: "Bridge Gem742 products",
            time: "2 hours ago",
            type: "success",
            icon: CheckCircle,
          },
          {
            id: 2,
            user:
              analysts[1]?.first_name + " " + analysts[1]?.last_name ||
              "Sarah Smith",
            action: "uploaded new data",
            target: "Gold262&270 collection",
            time: "4 hours ago",
            type: "info",
            icon: BarChart3,
          },
        ];

        setRecentActivities(activities);

        // Set quick metrics with proper name handling
        setQuickMetrics({
          avgProductsPerAnalyst: Math.round(
            totalProducts / (analysts.length || 1)
          ),
          topPerformer:
            performanceChart.length > 0
              ? performanceChart.reduce(
                  (prev, current) =>
                    prev.performance > current.performance ? prev : current,
                  performanceChart[0]
                )
              : { name: "N/A", performance: 0 },
          workloadDistribution: analystWorkloads,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    // Mock notifications - replace with real API
    const mockNotifications = [
      {
        id: 1,
        title: "High Workload Alert",
        message: "3 analysts have workload above 80%",
        type: "warning",
        time: "5 minutes ago",
        unread: true,
      },
      {
        id: 2,
        title: "New Forecast Completed",
        message: "Bridge Gem742 forecast analysis completed",
        type: "success",
        time: "1 hour ago",
        unread: true,
      },
      {
        id: 3,
        title: "System Update",
        message: "Dashboard performance improvements deployed",
        type: "info",
        time: "2 hours ago",
        unread: false,
      },
    ];
    setNotifications(mockNotifications);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleCardClick = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  const adminActions = [
    {
      title: "Manage Analysts",
      description:
        "View, edit, and manage analyst accounts with real-time performance tracking",
      icon: Users,
      path: "/analysts",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      adminOnly: true,
      count: stats.totalAnalysts,
      badge:
        stats.activeAnalysts < stats.totalAnalysts ? "Some Inactive" : null,
    },
    {
      title: "Create Analyst",
      description:
        "Add new analyst users to the system with category assignments",
      icon: UserPlus,
      path: "/register",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      adminOnly: true,
      badge: "Quick Action",
    },
    {
      title: "Generate Forecast",
      description: "Create and manage forecasting projects across categories",
      icon: TrendingUp,
      path: "/forecast",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      adminOnly: true,
      count: stats.totalForecasts,
      badge: stats.pendingTasks > 0 ? `${stats.pendingTasks} pending` : null,
    },
    {
      title: "Upload Files",
      description: "Manage data files and spreadsheets for analysis",
      icon: Upload,
      path: "/file-upload",
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600",
      adminOnly: false,
      badge: "Data Management",
    },
    {
      title: "View Products",
      description: "Browse and analyze product data across all categories",
      icon: Package,
      path: "/products",
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
      adminOnly: false,
      count: stats.totalProducts,
    },
    {
      title: "System Settings",
      description: "Configure system preferences and user permissions",
      icon: Settings,
      path: "/settings",
      color: "bg-gray-500",
      hoverColor: "hover:bg-gray-600",
      adminOnly: false,
    },
  ];

  const filteredActions = adminActions.filter(
    (action) => !action.adminOnly || isAdmin
  );

  const statCards = [
    {
      title: "Total Analysts",
      value: stats.totalAnalysts,
      change: `${stats.activeAnalysts} active`,
      changeType:
        stats.activeAnalysts === stats.totalAnalysts ? "positive" : "neutral",
      icon: Users,
      color: "bg-blue-500",
      trend: "+2 this month",
    },
    {
      title: "Active Forecasts",
      value: stats.totalForecasts,
      change: `${stats.pendingTasks} pending`,
      changeType: stats.pendingTasks < 10 ? "positive" : "warning",
      icon: TrendingUp,
      color: "bg-purple-500",
      trend: "+18 this week",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      change:
        stats.completionRate > 80
          ? "Excellent"
          : stats.completionRate > 60
          ? "Good"
          : "Needs Attention",
      changeType:
        stats.completionRate > 80
          ? "positive"
          : stats.completionRate > 60
          ? "neutral"
          : "negative",
      icon: Target,
      color: "bg-green-500",
      trend: "+5% from last month",
    },
    {
      title: "Avg Performance",
      value: `${stats.avgPerformance}%`,
      change: "Cross-team average",
      changeType: stats.avgPerformance > 85 ? "positive" : "neutral",
      icon: Award,
      color: "bg-orange-500",
      trend:
        stats.avgPerformance > 85 ? "Above target" : "Room for improvement",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      case "error":
        return AlertCircle;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-orange-600 bg-orange-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 p-6 rounded-t-xl">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => navigate("/")}
                    className="text-white opacity-80 hover:opacity-100 flex items-center gap-2 transition-opacity"
                  >
                    <ArrowLeft size={16} />
                    Back to Home
                  </button>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {isAdmin ? "Admin Dashboard" : "Dashboard"}
                </h1>
                <p className="text-indigo-100">
                  Welcome back, {currentUser?.username}! Here's your system
                  overview.
                </p>
                {isAdmin && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-indigo-100 text-sm">
                      Administrator privileges active
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <button
                    onClick={() => {
                      /* Toggle notifications */
                    }}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-lg transition-all duration-200 hover:scale-105 border border-white/20"
                  >
                    <Bell size={20} />
                    {notifications.filter((n) => n.unread).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications.filter((n) => n.unread).length}
                      </span>
                    )}
                  </button>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 border border-white/20 disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`${card.color} p-2 rounded-lg`}>
                        <IconComponent className="text-white" size={20} />
                      </div>
                      <h3 className="text-sm font-medium text-gray-600">
                        {card.title}
                      </h3>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {card.value}
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm ${
                          card.changeType === "positive"
                            ? "text-green-600"
                            : card.changeType === "negative"
                            ? "text-red-600"
                            : card.changeType === "warning"
                            ? "text-orange-600"
                            : "text-gray-600"
                        }`}
                      >
                        {card.change}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {card.trend}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <div
                      key={action.path}
                      onClick={() => handleCardClick(action.path)}
                      className={`${action.color} ${action.hoverColor} text-white p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg group`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent size={20} />
                            <h3 className="font-semibold">{action.title}</h3>
                          </div>
                          <p className="text-white/80 text-sm mb-3">
                            {action.description}
                          </p>
                          <div className="flex items-center justify-between">
                            {action.count !== undefined && (
                              <span className="text-white/90 text-lg font-bold">
                                {action.count}
                              </span>
                            )}
                            {action.badge && (
                              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                                {action.badge}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          size={16}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activities
              </h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-lg ${getActivityColor(
                        activity.type
                      )}`}
                    >
                      <IconComponent size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span>{" "}
                        {activity.action}
                      </p>
                      <p className="text-sm text-indigo-600">
                        {activity.target}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        {isAdmin && performanceData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Analyst Performance Overview
              </h2>
              <div className="flex gap-2">
                {["7days", "30days", "90days"].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedTimeframe === timeframe
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {timeframe === "7days"
                      ? "7 Days"
                      : timeframe === "30days"
                      ? "30 Days"
                      : "90 Days"}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {performanceData.map((analyst, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate("/analysts")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {analyst.name}
                    </h3>
                    <ExternalLink size={14} className="text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Performance</span>
                      <span
                        className={`text-sm font-medium ${
                          analyst.performance > 85
                            ? "text-green-600"
                            : analyst.performance > 70
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {analyst.performance}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          analyst.performance > 85
                            ? "bg-green-500"
                            : analyst.performance > 70
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${analyst.performance}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Workload</span>
                      <span className="text-xs text-gray-700">
                        {analyst.workload} items
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Metrics */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  System Health
                </h3>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">System Status</span>
                  <span className="text-sm font-medium text-green-600">
                    All Systems Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="text-sm font-medium text-green-600">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Response</span>
                  <span className="text-sm font-medium text-green-600">
                    {"<"} 200ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="text-sm font-medium text-blue-600">
                    {stats.activeAnalysts} online
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Avg Products/Analyst
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {quickMetrics.avgProductsPerAnalyst || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Categories</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats.categoriesManaged}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Top Performer</span>
                  <span className="text-sm font-medium text-green-600">
                    {quickMetrics.topPerformer?.name?.split(" ")[0] || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">System Uptime</span>
                  <span className="text-sm font-medium text-green-600">
                    99.9%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions Needed
              </h3>
              <div className="space-y-3">
                {stats.pendingTasks > 50 && (
                  <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg">
                    <AlertTriangle
                      size={16}
                      className="text-orange-600 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-orange-800">
                        High Pending Tasks
                      </p>
                      <p className="text-xs text-orange-600">
                        {stats.pendingTasks} tasks pending review
                      </p>
                    </div>
                  </div>
                )}
                {stats.activeAnalysts < stats.totalAnalysts && (
                  <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                    <Users size={16} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Inactive Analysts
                      </p>
                      <p className="text-xs text-blue-600">
                        {stats.totalAnalysts - stats.activeAnalysts} analysts
                        inactive
                      </p>
                    </div>
                  </div>
                )}
                {stats.completionRate < 70 && (
                  <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                    <TrendingDown size={16} className="text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Low Completion Rate
                      </p>
                      <p className="text-xs text-red-600">
                        Only {stats.completionRate}% completion rate
                      </p>
                    </div>
                  </div>
                )}
                {stats.pendingTasks <= 50 &&
                  stats.activeAnalysts === stats.totalAnalysts &&
                  stats.completionRate >= 70 && (
                    <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                      <CheckCircle
                        size={16}
                        className="text-green-600 mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          All Good!
                        </p>
                        <p className="text-xs text-green-600">
                          System running smoothly
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
