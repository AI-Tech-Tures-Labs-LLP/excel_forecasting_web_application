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

        {/* Stats Cards - Only show for admins */}
        {isAdmin && <StatsCards stats={stats} />}

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
      </div>
    </div>
  );
};

export default AdminDashboard;
