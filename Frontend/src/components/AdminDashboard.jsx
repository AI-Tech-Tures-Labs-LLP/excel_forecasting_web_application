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
  Crown,
  MoreVertical,
  Grid3X3,
  BarChart2,
  Layers,
  Shield,
  Star,
  Monitor,
  Workflow,
  BookOpen,
  Sparkles,
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

        // Fetch recent file uploads instead of mock activities
        await fetchRecentUploads();

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

  const fetchRecentUploads = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/sheet-upload/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const uploads = await response.json();

        // Sort uploads by uploaded_at date (most recent first) and take the last 5
        const sortedUploads = uploads
          .sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))
          .slice(0, 5);

        // Fetch user data to get usernames
        const usersResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/users/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        let userMap = {};
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          userMap = users.reduce((acc, user) => {
            acc[user.id] = user.username || user.email || "Unknown User";
            return acc;
          }, {});
        }

        // Transform uploads data into recent activities format
        const activities = sortedUploads.map((upload, index) => {
          // Calculate time ago
          const uploadDate = new Date(upload.uploaded_at);
          const now = new Date();
          const diffInMinutes = Math.floor((now - uploadDate) / (1000 * 60));

          let timeAgo;
          if (diffInMinutes < 1) {
            timeAgo = "Just now";
          } else if (diffInMinutes < 60) {
            timeAgo = `${diffInMinutes} minute${
              diffInMinutes > 1 ? "s" : ""
            } ago`;
          } else if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
          } else {
            const days = Math.floor(diffInMinutes / 1440);
            timeAgo = `${days} day${days > 1 ? "s" : ""} ago`;
          }

          // Get file size from the file URL or set as unknown
          const fileName = upload.name || "Unknown file";
          const userName = userMap[upload.user] || "Admin";

          // Extract categories info for display
          let categoriesInfo = "";
          try {
            const categories = JSON.parse(upload.categories || "[]");
            if (categories.length > 0) {
              categoriesInfo = categories
                .map((cat) => `${cat.name}${cat.value}`)
                .join(", ");
            }
          } catch (e) {
            categoriesInfo = upload.output_folder || "";
          }

          return {
            id: upload.id || index,
            user: userName,
            action: "uploaded file",
            target: fileName,
            time: timeAgo,
            type: upload.is_processed ? "success" : "info",
            icon: Upload,
            fileSize: null, // File size not available in this API
            status: upload.is_processed ? "processed" : "pending",
            categories: categoriesInfo,
            monthRange:
              upload.month_from && upload.month_to
                ? `${upload.month_from} - ${upload.month_to}`
                : null,
            percentage: upload.percentage,
          };
        });

        setRecentActivities(activities);
      } else {
        console.error("Failed to fetch recent uploads");
        // Fallback to empty activities if API fails
        setRecentActivities([]);
      }
    } catch (error) {
      console.error("Error fetching recent uploads:", error);
      // Fallback to empty activities if API fails
      setRecentActivities([]);
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
      gradient: "from-blue-500 to-blue-600",
      trend: "+2 this month",
      percentage: Math.round(
        (stats.activeAnalysts / stats.totalAnalysts) * 100
      ),
    },
    {
      title: "Active Forecasts",
      value: stats.totalForecasts,
      change: `${stats.pendingTasks} pending`,
      changeType: stats.pendingTasks < 10 ? "positive" : "warning",
      icon: TrendingUp,
      gradient: "from-purple-500 to-purple-600",
      trend: "+18 this week",
      percentage: stats.totalForecasts
        ? Math.round(
            ((stats.totalForecasts - stats.pendingTasks) /
              stats.totalForecasts) *
              100
          )
        : 0,
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
      gradient: "from-emerald-500 to-emerald-600",
      trend: "+5% from last month",
      percentage: stats.completionRate,
    },
    {
      title: "Avg Performance",
      value: `${stats.avgPerformance}%`,
      change: "Cross-team average",
      changeType: stats.avgPerformance > 85 ? "positive" : "neutral",
      icon: Award,
      gradient: "from-orange-500 to-orange-600",
      trend:
        stats.avgPerformance > 85 ? "Above target" : "Room for improvement",
      percentage: stats.avgPerformance,
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
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "warning":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

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
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-8">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => navigate("/")}
                    className="text-white/80 hover:text-white flex items-center gap-2 transition-all duration-200 hover:gap-3 group"
                  >
                    <ArrowLeft
                      size={16}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                    <span className="text-sm font-medium">Back to Home</span>
                  </button>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <Monitor className="text-white" size={24} />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-1">
                      {isAdmin ? "Admin Dashboard" : "Dashboard"}
                    </h1>
                    <p className="text-blue-100 text-lg">
                      Welcome back,{" "}
                      <span className="font-semibold text-white">
                        {currentUser?.username}
                      </span>
                    </p>
                  </div>
                </div>
                <p className="text-slate-300 mb-4 max-w-2xl">
                  Comprehensive system overview with real-time analytics and
                  performance insights. Monitor your team's progress and manage
                  operations efficiently.
                </p>
                {isAdmin && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-400/30">
                      <Shield size={14} className="text-emerald-300" />
                      <span className="text-emerald-100 text-sm font-medium">
                        Administrator Access
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-400/30">
                      <Sparkles size={14} className="text-blue-300" />
                      <span className="text-blue-100 text-sm">
                        Premium Features Enabled
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl transition-all duration-200 hover:scale-105 border border-white/20 group">
                    <Bell size={20} className="group-hover:animate-pulse" />
                    {notifications.filter((n) => n.unread).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium shadow-lg animate-pulse">
                        {notifications.filter((n) => n.unread).length}
                      </span>
                    )}
                  </button>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-200 hover:scale-105 border border-white/20 disabled:opacity-50 group"
                >
                  <RefreshCw
                    size={18}
                    className={`${
                      refreshing ? "animate-spin" : "group-hover:rotate-180"
                    } transition-transform duration-300`}
                  />
                  <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/90 relative overflow-hidden"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}
                    >
                      <IconComponent className="text-white" size={24} />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-slate-900 mb-1">
                        {card.value}
                      </div>
                      <div className="text-sm text-slate-500 font-medium">
                        {card.title}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium ${
                          card.changeType === "positive"
                            ? "text-emerald-600"
                            : card.changeType === "negative"
                            ? "text-red-600"
                            : card.changeType === "warning"
                            ? "text-amber-600"
                            : "text-slate-600"
                        }`}
                      >
                        {card.change}
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {card.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${card.gradient} shadow-sm`}
                        style={{ width: `${card.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{card.trend}</span>
                    <TrendingUp
                      size={14}
                      className="text-slate-400 group-hover:text-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
                    <Zap className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Quick Actions
                  </h2>
                </div>
                <div className="text-sm text-slate-500">
                  {filteredActions.length} available actions
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <div
                      key={action.path}
                      onClick={() => handleCardClick(action.path)}
                      className="group relative bg-white/60 backdrop-blur-sm border border-white/40 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white/80 overflow-hidden"
                    >
                      {/* Gradient Background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                      ></div>

                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`p-3 rounded-xl ${action.iconBg} group-hover:scale-110 transition-transform duration-300`}
                          >
                            <IconComponent
                              size={24}
                              className={action.iconColor}
                            />
                          </div>
                          <ArrowRight
                            className="opacity-0 group-hover:opacity-100 text-slate-400 group-hover:translate-x-1 transition-all duration-300"
                            size={20}
                          />
                        </div>

                        <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-slate-800">
                          {action.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                          {action.description}
                        </p>

                        <div className="flex items-center justify-between">
                          {action.count !== undefined && (
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-slate-800">
                                {action.count}
                              </span>
                              <span className="text-sm text-slate-500">
                                items
                              </span>
                            </div>
                          )}
                          {action.badge && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${action.gradient} text-white shadow-sm`}
                            >
                              {action.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <Activity className="text-white" size={16} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Activity
                </h2>
              </div>
              <button
                onClick={() => navigate("/file-upload")}
                className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All
                <ExternalLink size={12} />
              </button>
            </div>
            <div className="max-h-[525px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50/50 transition-all duration-200 border border-transparent hover:border-slate-200/50"
                    >
                      <div
                        className={`p-1.5 rounded-lg border ${getActivityColor(
                          activity.type
                        )} group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}
                      >
                        <IconComponent size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {activity.user}
                          </p>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mb-1">
                          {activity.action}
                        </p>
                        <p
                          className="text-xs text-blue-600 font-medium truncate mb-2"
                          title={activity.target}
                        >
                          {activity.target}
                        </p>

                        {activity.categories && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {activity.categories
                              .split(", ")
                              .slice(0, 2)
                              .map((cat, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full"
                                >
                                  {cat}
                                </span>
                              ))}
                            {activity.categories.split(", ").length > 2 && (
                              <span className="text-xs text-slate-400">
                                +{activity.categories.split(", ").length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {activity.percentage && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                                {activity.percentage}%
                              </span>
                            )}
                            {activity.monthRange && (
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">
                                {activity.monthRange}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                              activity.status === "processed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {activity.status === "processed" ? "✓" : "⏳"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Upload size={24} className="text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium mb-1 text-sm">
                    No recent uploads
                  </p>
                  <p className="text-slate-400 text-xs mb-3">
                    Start by uploading your first file
                  </p>
                  <button
                    onClick={() => navigate("/file-upload")}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:underline"
                  >
                    Upload File →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        {isAdmin && performanceData.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <BarChart2 className="text-white" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Team Performance
                </h2>
              </div>
              <div className="flex gap-2">
                {["7days", "30days", "90days"].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedTimeframe === timeframe
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {performanceData.map((analyst, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer border border-slate-200/50 hover:border-slate-300/50 hover:-translate-y-1"
                  onClick={() => navigate("/analysts")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {analyst.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 truncate text-sm">
                          {analyst.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {analyst.workload} tasks
                        </p>
                      </div>
                    </div>
                    <ExternalLink
                      size={14}
                      className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">
                        Performance
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          analyst.performance > 90
                            ? "text-emerald-600"
                            : analyst.performance > 80
                            ? "text-blue-600"
                            : analyst.performance > 70
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {analyst.performance}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          analyst.performance > 90
                            ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                            : analyst.performance > 80
                            ? "bg-gradient-to-r from-blue-400 to-blue-500"
                            : analyst.performance > 70
                            ? "bg-gradient-to-r from-amber-400 to-amber-500"
                            : "bg-gradient-to-r from-red-400 to-red-500"
                        } shadow-sm`}
                        style={{ width: `${analyst.performance}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400" />
                        <span className="text-xs text-slate-500">
                          Efficiency
                        </span>
                      </div>
                      <span className="text-xs font-medium text-slate-700">
                        {Math.round(
                          (analyst.performance / analyst.workload) * 10
                        ) / 10}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Quick Metrics & Actions Needed */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* System Health */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
                  <Monitor className="text-white" size={18} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  System Health
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-emerald-800">
                      System Status
                    </span>
                  </div>
                  <span className="text-sm font-bold text-emerald-700">
                    Operational
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Database size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Database
                    </span>
                  </div>
                  <span className="text-sm font-bold text-blue-700">
                    99.9% Uptime
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Workflow size={16} className="text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">
                      API Response
                    </span>
                  </div>
                  <span className="text-sm font-bold text-purple-700">
                    245ms avg
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Needed */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                  <AlertTriangle className="text-white" size={18} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Action Items
                </h3>
              </div>

              <div className="space-y-3">
                {stats.pendingTasks > 10 && (
                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <AlertTriangle
                      size={16}
                      className="text-amber-600 mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-800">
                        High Pending Tasks
                      </p>
                      <p className="text-xs text-amber-600">
                        {stats.pendingTasks} tasks need review
                      </p>
                    </div>
                  </div>
                )}

                {stats.activeAnalysts < stats.totalAnalysts && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <Users
                      size={16}
                      className="text-blue-600 mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-800">
                        Inactive Analysts
                      </p>
                      <p className="text-xs text-blue-600">
                        {stats.totalAnalysts - stats.activeAnalysts} analysts
                        offline
                      </p>
                    </div>
                  </div>
                )}

                {stats.completionRate < 80 && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
                    <TrendingDown
                      size={16}
                      className="text-red-600 mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">
                        Low Completion Rate
                      </p>
                      <p className="text-xs text-red-600">
                        Only {stats.completionRate}% completion
                      </p>
                    </div>
                  </div>
                )}

                {stats.pendingTasks <= 10 &&
                  stats.activeAnalysts === stats.totalAnalysts &&
                  stats.completionRate >= 80 && (
                    <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <CheckCircle
                        size={16}
                        className="text-emerald-600 mt-0.5 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-emerald-800">
                          All Systems Optimal
                        </p>
                        <p className="text-xs text-emerald-600">
                          Everything running smoothly
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
                  <BarChart3 className="text-white" size={18} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Quick Insights
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <PieChart size={16} className="text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Avg Tasks/Analyst
                    </span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">
                    {Math.round(
                      stats.totalForecasts / (stats.totalAnalysts || 1)
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Crown size={16} className="text-amber-500" />
                    <span className="text-sm font-medium text-slate-700">
                      Top Performer
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {performanceData.length > 0
                      ? performanceData
                          .reduce((prev, current) =>
                            prev.performance > current.performance
                              ? prev
                              : current
                          )
                          .name.split(" ")[0]
                      : "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Layers size={16} className="text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Categories
                    </span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">
                    {stats.categoriesManaged}
                  </span>
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
