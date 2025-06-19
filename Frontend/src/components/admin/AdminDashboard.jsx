// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Users, UserPlus, TrendingUp, Upload } from "lucide-react";

// // Import components
// import DashboardHeader from "./DashboardHeader";
// import StatsCards from "./StatsCards";
// import QuickActions from "./QuickActions";
// import RecentActivity from "./RecentActivity";
// import TeamPerformance from "./TeamPerformance";
// import SystemHealth from "./SystemHealth";
// import ActionItems from "./ActionItems";
// import QuickInsights from "./QuickInsights";

// // Import hooks
// import useDashboardData from "./hooks/useDashboardData";
// import useNotifications from "./hooks/useNotifications";

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedTimeframe, setSelectedTimeframe] = useState("7days");

//   // Use custom hooks
//   const {
//     stats,
//     recentActivities,
//     performanceData,
//     quickMetrics,
//     loading,
//     fetchDashboardData,
//   } = useDashboardData(selectedTimeframe);

//   const { notifications, fetchNotifications } = useNotifications();

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

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchDashboardData();
//     await fetchNotifications();
//     setRefreshing(false);
//   };

//   // Admin actions configuration
//   const adminActions = [
//     {
//       title: "Manage Analysts",
//       description:
//         "View, edit, and manage analyst accounts with real-time performance tracking",
//       icon: Users,
//       path: "/analysts",
//       gradient: "from-blue-500 to-blue-600",
//       hoverGradient: "hover:from-blue-600 hover:to-blue-700",
//       adminOnly: true,
//       count: stats.totalAnalysts,
//       badge:
//         stats.activeAnalysts < stats.totalAnalysts ? "Some Inactive" : null,
//       iconBg: "bg-blue-100",
//       iconColor: "text-blue-600",
//     },
//     {
//       title: "Create User",
//       description: "Add new analyst or administrator users to the system",
//       icon: UserPlus,
//       path: "/register",
//       gradient: "from-emerald-500 to-emerald-600",
//       hoverGradient: "hover:from-emerald-600 hover:to-emerald-700",
//       adminOnly: true,
//       badge: "Analysts & Admins",
//       iconBg: "bg-emerald-100",
//       iconColor: "text-emerald-600",
//     },
//     {
//       title: "Generate Forecast",
//       description: "Create and manage forecasting projects across categories",
//       icon: TrendingUp,
//       path: "/forecast",
//       gradient: "from-purple-500 to-purple-600",
//       hoverGradient: "hover:from-purple-600 hover:to-purple-700",
//       adminOnly: true,
//       count: stats.totalForecasts,
//       badge: stats.pendingTasks > 0 ? `${stats.pendingTasks} pending` : null,
//       iconBg: "bg-purple-100",
//       iconColor: "text-purple-600",
//     },
//     {
//       title: "File Management",
//       description: "Manage data files and spreadsheets for analysis",
//       icon: Upload,
//       path: "/file-upload",
//       gradient: "from-indigo-500 to-indigo-600",
//       hoverGradient: "hover:from-indigo-600 hover:to-indigo-700",
//       adminOnly: false,
//       badge: "Data Management",
//       iconBg: "bg-indigo-100",
//       iconColor: "text-indigo-600",
//     },
//   ];

//   const filteredActions = adminActions.filter(
//     (action) => !action.adminOnly || isAdmin
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
//           <div className="space-y-2">
//             <p className="text-slate-600 font-medium">Loading dashboard...</p>
//             <p className="text-slate-400 text-sm">Preparing your analytics</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(148_163_184_/_0.15)_1px,transparent_0)] [background-size:24px_24px] pointer-events-none"></div>

//       <div className="relative max-w-7xl mx-auto p-6">
//         {/* Header */}
//         <DashboardHeader
//           currentUser={currentUser}
//           isAdmin={isAdmin}
//           notifications={notifications}
//           refreshing={refreshing}
//           onRefresh={handleRefresh}
//         />

//         {/* Stats Cards */}
//         <StatsCards stats={stats} />

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//           {/* Quick Actions */}
//           <div className="lg:col-span-2">
//             <QuickActions
//               stats={stats}
//               isAdmin={isAdmin}
//               filteredActions={filteredActions}
//             />
//           </div>

//           {/* Recent Activities */}
//           <RecentActivity recentActivities={recentActivities} />
//         </div>

//         {/* Team Performance */}
//         {isAdmin && performanceData.length > 0 && (
//           <TeamPerformance
//             performanceData={performanceData}
//             selectedTimeframe={selectedTimeframe}
//             setSelectedTimeframe={setSelectedTimeframe}
//           />
//         )}

//         {/* Bottom Grid: System Health, Action Items, Quick Insights */}
//         {isAdmin && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             <SystemHealth />
//             <ActionItems stats={stats} />
//             <QuickInsights stats={stats} performanceData={performanceData} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// src/components/admin/AdminDashboard.jsx - Final version with modal approach
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  TrendingUp,
  Upload,
  FileText,
  Target,
  BarChart3,
} from "lucide-react";

// Import components
import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import QuickActions from "./QuickActions"; // This now includes the Forecast Approval modal
import RecentActivity from "./RecentActivity";
import TeamPerformance from "./TeamPerformance";
import SystemHealth from "./SystemHealth";
import ActionItems from "./ActionItems";
import QuickInsights from "./QuickInsights";

// Import hooks
import useDashboardData from "./hooks/useDashboardData";
import useNotifications from "./hooks/useNotifications";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("7days");

  // Use custom hooks
  const {
    stats,
    recentActivities,
    performanceData,
    quickMetrics,
    loading,
    fetchDashboardData,
  } = useDashboardData(selectedTimeframe);

  const { notifications, fetchNotifications } = useNotifications();

  // Get current user to check role
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
  const isAnalyst =
    currentUser?.role === "analyst" || currentUser?.role === "senior_analyst";

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    await fetchNotifications();
    setRefreshing(false);
  };

  // Admin actions configuration
  const adminActions = [
    {
      title: "Manage Analysts",
      description:
        "View, edit, and manage analyst accounts with real-time performance tracking",
      icon: Users,
      path: "/analysts",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "hover:from-blue-600 hover:to-blue-700",
      adminOnly: true,
      count: stats.totalAnalysts,
      badge:
        stats.activeAnalysts < stats.totalAnalysts ? "Some Inactive" : null,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Create User",
      description: "Add new analyst or administrator users to the system",
      icon: UserPlus,
      path: "/register",
      gradient: "from-emerald-500 to-emerald-600",
      hoverGradient: "hover:from-emerald-600 hover:to-emerald-700",
      adminOnly: true,
      badge: "Analysts & Admins",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Generate Forecast",
      description: "Create and manage forecasting projects across categories",
      icon: TrendingUp,
      path: "/forecast",
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "hover:from-purple-600 hover:to-purple-700",
      adminOnly: true,
      count: stats.totalForecasts,
      badge: stats.pendingTasks > 0 ? `${stats.pendingTasks} pending` : null,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "File Management",
      description: "Manage data files and spreadsheets for analysis",
      icon: Upload,
      path: "/file-upload",
      gradient: "from-indigo-500 to-indigo-600",
      hoverGradient: "hover:from-indigo-600 hover:to-indigo-700",
      adminOnly: false,
      badge: "Data Management",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  // Analyst-specific actions
  const analystActions = [
    {
      title: "Product Analysis",
      description: "Analyze product forecasts and update recommendations",
      icon: BarChart3,
      path: "/products",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "hover:from-blue-600 hover:to-blue-700",
      adminOnly: false,
      badge: "Active Projects",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Data Files",
      description: "Access and manage forecast data files",
      icon: FileText,
      path: "/file-upload",
      gradient: "from-indigo-500 to-indigo-600",
      hoverGradient: "hover:from-indigo-600 hover:to-indigo-700",
      adminOnly: false,
      badge: "Data Access",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "Performance Metrics",
      description: "View your forecast accuracy and performance stats",
      icon: Target,
      path: "#",
      gradient: "from-orange-500 to-orange-600",
      hoverGradient: "hover:from-orange-600 hover:to-orange-700",
      adminOnly: false,
      badge: "94% Accuracy",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const filteredActions = isAdmin
    ? adminActions.filter((action) => !action.adminOnly || isAdmin)
    : analystActions;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
          <div className="space-y-2">
            <p className="text-slate-600 font-medium">Loading dashboard...</p>
            <p className="text-slate-400 text-sm">Preparing your analytics</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(148_163_184_/_0.15)_1px,transparent_0)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header */}
        <DashboardHeader
          currentUser={currentUser}
          isAdmin={isAdmin}
          notifications={notifications}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions - Now includes Forecast Approval modal */}
          <div className="lg:col-span-2">
            <QuickActions
              stats={stats}
              isAdmin={isAdmin}
              filteredActions={filteredActions}
            />
          </div>

          {/* Recent Activities */}
          <RecentActivity recentActivities={recentActivities} />
        </div>

        {/* Admin-only sections */}
        {isAdmin && (
          <>
            {/* Team Performance */}
            {performanceData.length > 0 && (
              <TeamPerformance
                performanceData={performanceData}
                selectedTimeframe={selectedTimeframe}
                setSelectedTimeframe={setSelectedTimeframe}
              />
            )}

            {/* Bottom Grid: System Health, Action Items, Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SystemHealth />
              <ActionItems stats={stats} />
              <QuickInsights stats={stats} performanceData={performanceData} />
            </div>
          </>
        )}

        {/* Analyst-only sections */}
        {isAnalyst && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Personal Performance Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <Target className="text-white" size={18} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  My Performance
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-800">
                      Forecast Accuracy
                    </span>
                  </div>
                  <span className="text-sm font-bold text-green-700">
                    94.2%
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <BarChart3 size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Completed Forecasts
                    </span>
                  </div>
                  <span className="text-sm font-bold text-blue-700">
                    127 this month
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={16} className="text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">
                      Avg Confidence
                    </span>
                  </div>
                  <span className="text-sm font-bold text-purple-700">
                    91.8%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Tasks */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                  <FileText className="text-white" size={18} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Quick Tasks
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm font-medium text-amber-800">
                      Pending Reviews
                    </span>
                  </div>
                  <span className="text-sm font-bold text-amber-700">
                    3 items
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-red-800">
                      Revisions Needed
                    </span>
                  </div>
                  <span className="text-sm font-bold text-red-700">1 item</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">
                      Due Today
                    </span>
                  </div>
                  <span className="text-sm font-bold text-blue-700">
                    2 items
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Assignments */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
                  <BarChart3 className="text-white" size={18} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Recent Work
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">
                      GEM-742-BLU
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Approved
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Bridge Gem742 • 2 hours ago
                  </div>
                </div>

                <div className="p-3 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">
                      PRL-150-WHT
                    </span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      Revision
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Fine Pearl • 1 day ago
                  </div>
                </div>

                <div className="p-3 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900">
                      DMD-890-CLR
                    </span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      Pending
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Diamond • 3 hours ago
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
