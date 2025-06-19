import React, { useState } from "react";
import {
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  BarChart3,
  LineChart,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Search,
  ChevronDown,
  User,
  Award,
  Target,
  Activity,
  FileText,
  Zap,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

const DetailedDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7days");
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data for dashboard
  const workflowMetrics = {
    totalForecastsThisMonth: 156,
    forecastsInProgress: 23,
    forecastsNotReviewed: 34,
    forecastsFinalized: 99,
    rejectedForecasts: 12,
    avgReviewTime: 2.4, // hours
  };

  const weeklyData = [
    { week: "Week 1", forecasts: 45, users: 8, avgTime: 2.1 },
    { week: "Week 2", forecasts: 52, users: 9, avgTime: 2.3 },
    { week: "Week 3", forecasts: 38, users: 7, avgTime: 2.8 },
    { week: "Week 4", forecasts: 41, users: 8, avgTime: 2.2 },
  ];

  const userDetailedData = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Senior Analyst",
      email: "sarah.chen@company.com",
      totalForecasts: 42,
      completed: 38,
      pending: 3,
      rejected: 1,
      avgAccuracy: 94.2,
      avgReviewTime: 1.8,
      categories: ["Bridge Gem742", "Diamond"],
      lastActive: "2 hours ago",
      status: "active",
      weeklyTrend: "+12%",
    },
    {
      id: 2,
      name: "David Kim",
      role: "Analyst",
      email: "david.kim@company.com",
      totalForecasts: 35,
      completed: 31,
      pending: 2,
      rejected: 2,
      avgAccuracy: 89.7,
      avgReviewTime: 2.1,
      categories: ["Womens Silver260&404", "Fine Pearl"],
      lastActive: "1 hour ago",
      status: "active",
      weeklyTrend: "+8%",
    },
    {
      id: 3,
      name: "Emily Zhang",
      role: "Analyst",
      email: "emily.zhang@company.com",
      totalForecasts: 28,
      completed: 22,
      pending: 4,
      rejected: 2,
      avgAccuracy: 91.3,
      avgReviewTime: 2.8,
      categories: ["Fine Pearl", "Semi"],
      lastActive: "30 minutes ago",
      status: "active",
      weeklyTrend: "-3%",
    },
    {
      id: 4,
      name: "Alex Thompson",
      role: "Senior Analyst",
      email: "alex.thompson@company.com",
      totalForecasts: 51,
      completed: 46,
      pending: 3,
      rejected: 2,
      avgAccuracy: 96.1,
      avgReviewTime: 1.5,
      categories: ["Diamond", "Bridal"],
      lastActive: "4 hours ago",
      status: "active",
      weeklyTrend: "+15%",
    },
  ];

  const productDetailedData = [
    {
      id: "GEM-742-BLU",
      category: "Bridge Gem742",
      analyst: "Sarah Chen",
      status: "completed",
      confidence: 94,
      method: "ML Algorithm",
      forecastValue: 87500,
      quantity: 1250,
      submittedDate: "2024-12-18",
      reviewTime: 1.2,
      approver: "Michael Rodriguez",
      notes: "Strong seasonal trend identified",
      priority: "high",
    },
    {
      id: "SLV-260-PNK",
      category: "Womens Silver260&404",
      analyst: "David Kim",
      status: "completed",
      confidence: 89,
      method: "Index-based",
      forecastValue: 62300,
      quantity: 890,
      submittedDate: "2024-12-17",
      reviewTime: 2.1,
      approver: "Jennifer Taylor",
      notes: "Standard index application",
      priority: "medium",
    },
    {
      id: "PRL-150-WHT",
      category: "Fine Pearl",
      analyst: "Emily Zhang",
      status: "rejected",
      confidence: 76,
      method: "Trend Analysis",
      forecastValue: 97500,
      quantity: 650,
      submittedDate: "2024-12-16",
      reviewTime: 3.2,
      approver: "Michael Rodriguez",
      notes: "Confidence below threshold",
      priority: "high",
    },
    {
      id: "DMD-890-CLR",
      category: "Diamond",
      analyst: "Alex Thompson",
      status: "pending",
      confidence: 98,
      method: "Hybrid (ML + Index)",
      forecastValue: 315000,
      quantity: 2100,
      submittedDate: "2024-12-19",
      reviewTime: null,
      approver: "Jennifer Taylor",
      notes: "High-value SKU with exceptional confidence",
      priority: "urgent",
    },
    {
      id: "BRL-300-GLD",
      category: "Bridal",
      analyst: "Sarah Chen",
      status: "in_progress",
      confidence: 87,
      method: "Index-based",
      forecastValue: 135000,
      quantity: 450,
      submittedDate: "2024-12-19",
      reviewTime: null,
      approver: null,
      notes: "Wedding season forecast",
      priority: "high",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-blue-500";
      case "low":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTrendIcon = (trend) => {
    if (trend.startsWith("+"))
      return <ArrowUp size={12} className="text-green-600" />;
    if (trend.startsWith("-"))
      return <ArrowDown size={12} className="text-red-600" />;
    return <Minus size={12} className="text-gray-600" />;
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
            <BarChart3 className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Detailed Analytics Dashboard
            </h3>
            <p className="text-slate-600 text-sm">
              Comprehensive user and product metrics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Forecast Workflow Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">TOTAL</span>
          </div>
          <div className="text-2xl font-bold text-blue-800">
            {workflowMetrics.totalForecastsThisMonth}
          </div>
          <div className="text-xs text-blue-600">This Month</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="text-xs text-amber-600 font-medium">PROGRESS</span>
          </div>
          <div className="text-2xl font-bold text-amber-800">
            {workflowMetrics.forecastsInProgress}
          </div>
          <div className="text-xs text-amber-600">In Progress</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">PENDING</span>
          </div>
          <div className="text-2xl font-bold text-orange-800">
            {workflowMetrics.forecastsNotReviewed}
          </div>
          <div className="text-xs text-orange-600">Not Reviewed</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-xs text-emerald-600 font-medium">
              COMPLETED
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-800">
            {workflowMetrics.forecastsFinalized}
          </div>
          <div className="text-xs text-emerald-600">Finalized</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-xs text-red-600 font-medium">REJECTED</span>
          </div>
          <div className="text-2xl font-bold text-red-800">
            {workflowMetrics.rejectedForecasts}
          </div>
          <div className="text-xs text-red-600">For Correction</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">
              AVG TIME
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-800">
            {workflowMetrics.avgReviewTime}h
          </div>
          <div className="text-xs text-purple-600">Review Time</div>
        </div>
      </div>

      {/* Time-Based Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Forecasts Finalized per Week */}
        <div className="bg-white/60 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-slate-900">Forecasts per Week</h4>
            <LineChart size={16} className="text-slate-400" />
          </div>
          <div className="space-y-2">
            {weeklyData.map((week, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{week.week}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(week.forecasts / 60) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-slate-900 w-8">
                    {week.forecasts}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity Over Time */}
        <div className="bg-white/60 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-slate-900">User Activity</h4>
            <Users size={16} className="text-slate-400" />
          </div>
          <div className="space-y-2">
            {weeklyData.map((week, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{week.week}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(week.users / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-slate-900 w-8">
                    {week.users}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Time per Forecast */}
        <div className="bg-white/60 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-slate-900">Avg Review Time</h4>
            <Clock size={16} className="text-slate-400" />
          </div>
          <div className="space-y-2">
            {weeklyData.map((week, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{week.week}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(week.avgTime / 3) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-slate-900 w-8">
                    {week.avgTime}h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "users", label: "User Details", icon: Users },
          { id: "products", label: "Product Details", icon: Package },
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <IconComponent size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "users" && (
        <div className="bg-white/60 rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">
              User-wise Detailed Table
            </h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select className="px-3 py-2 border border-slate-300 rounded-lg">
                <option value="all">All Roles</option>
                <option value="senior">Senior Analyst</option>
                <option value="analyst">Analyst</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Forecasts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Categories
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/40 divide-y divide-slate-200">
                {userDetailedData.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/60 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {user.role}
                          </div>
                          <div className="text-xs text-slate-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">
                            {user.avgAccuracy}%
                          </span>
                          {user.avgAccuracy > 90 && (
                            <Star className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          Avg {user.avgReviewTime}h review
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-slate-900">
                          {user.totalForecasts} total
                        </div>
                        <div className="flex gap-4 text-xs">
                          <span className="text-emerald-600">
                            {user.completed} done
                          </span>
                          <span className="text-amber-600">
                            {user.pending} pending
                          </span>
                          <span className="text-red-600">
                            {user.rejected} rejected
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.categories.map((category, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status.toUpperCase()}
                        </span>
                        <div className="text-xs text-slate-500">
                          {user.lastActive}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(user.weeklyTrend)}
                        <span
                          className={`text-sm font-medium ${
                            user.weeklyTrend.startsWith("+")
                              ? "text-green-600"
                              : user.weeklyTrend.startsWith("-")
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {user.weeklyTrend}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div className="bg-white/60 rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">
              Product-wise Detailed Table
            </h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select className="px-3 py-2 border border-slate-300 rounded-lg">
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Analyst
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Forecast
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/40 divide-y divide-slate-200">
                {productDetailedData.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-white/60 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getPriorityColor(
                              product.priority
                            )}`}
                          ></div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {product.id}
                            </div>
                            <div className="text-sm text-slate-500">
                              {product.category}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {product.analyst}
                      </div>
                      {product.approver && (
                        <div className="text-xs text-slate-500">
                          Approver: {product.approver}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          product.status
                        )}`}
                      >
                        {product.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-slate-900">
                          ${(product.forecastValue / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-slate-500">
                          {product.quantity} units
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-600">
                            {product.confidence}%
                          </span>
                          {product.confidence > 90 && (
                            <Star className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                        {product.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm text-slate-900">
                          {product.submittedDate}
                        </div>
                        {product.reviewTime && (
                          <div className="text-xs text-slate-500">
                            {product.reviewTime}h review
                          </div>
                        )}
                        {!product.reviewTime &&
                          product.status === "pending" && (
                            <div className="text-xs text-amber-600">
                              Awaiting review
                            </div>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50">
                          <Eye size={16} />
                        </button>
                        {product.status === "pending" && (
                          <button className="text-emerald-600 hover:text-emerald-900 p-1 rounded hover:bg-emerald-50">
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-6 h-6 text-indigo-600" />
                <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full font-medium">
                  ACTIVE
                </span>
              </div>
              <div className="text-2xl font-bold text-indigo-800 mb-1">
                {userDetailedData.length}
              </div>
              <div className="text-sm text-indigo-600">Total Users</div>
              <div className="text-xs text-indigo-500 mt-1">
                {userDetailedData.filter((u) => u.status === "active").length}{" "}
                currently active
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <Award className="w-6 h-6 text-emerald-600" />
                <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full font-medium">
                  AVG
                </span>
              </div>
              <div className="text-2xl font-bold text-emerald-800 mb-1">
                {Math.round(
                  userDetailedData.reduce((sum, u) => sum + u.avgAccuracy, 0) /
                    userDetailedData.length
                )}
                %
              </div>
              <div className="text-sm text-emerald-600">Avg Accuracy</div>
              <div className="text-xs text-emerald-500 mt-1">
                Across all analysts
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <Package className="w-6 h-6 text-purple-600" />
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-medium">
                  TOTAL
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-800 mb-1">
                {productDetailedData.length}
              </div>
              <div className="text-sm text-purple-600">Products Tracked</div>
              <div className="text-xs text-purple-500 mt-1">
                {
                  productDetailedData.filter((p) => p.status === "completed")
                    .length
                }{" "}
                completed
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-6 h-6 text-orange-600" />
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full font-medium">
                  VALUE
                </span>
              </div>
              <div className="text-2xl font-bold text-orange-800 mb-1">
                $
                {Math.round(
                  productDetailedData.reduce(
                    (sum, p) => sum + p.forecastValue,
                    0
                  ) / 1000
                )}
                K
              </div>
              <div className="text-sm text-orange-600">
                Total Forecast Value
              </div>
              <div className="text-xs text-orange-500 mt-1">
                Combined pipeline
              </div>
            </div>
          </div>

          {/* Top Performers and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <div className="bg-white/60 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-900">
                  Top Performers This Month
                </h4>
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <div className="space-y-3">
                {userDetailedData
                  .sort((a, b) => b.avgAccuracy - a.avgAccuracy)
                  .slice(0, 3)
                  .map((user, index) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 text-sm">
                            {user.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {user.role}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">
                          {user.avgAccuracy}%
                        </div>
                        <div className="text-xs text-slate-500">
                          {user.totalForecasts} forecasts
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent High-Value Forecasts */}
            <div className="bg-white/60 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-900">
                  High-Value Recent Forecasts
                </h4>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="space-y-3">
                {productDetailedData
                  .sort((a, b) => b.forecastValue - a.forecastValue)
                  .slice(0, 3)
                  .map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${getPriorityColor(
                            product.priority
                          )}`}
                        ></div>
                        <div>
                          <div className="font-medium text-slate-900 text-sm">
                            {product.id}
                          </div>
                          <div className="text-xs text-slate-500">
                            {product.category}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">
                          ${(product.forecastValue / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-slate-500">
                          {product.confidence}% confidence
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Category Performance Breakdown */}
          <div className="bg-white/60 p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-900">
                Category Performance Breakdown
              </h4>
              <BarChart3 className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from(
                new Set(productDetailedData.map((p) => p.category))
              ).map((category) => {
                const categoryProducts = productDetailedData.filter(
                  (p) => p.category === category
                );
                const avgConfidence = Math.round(
                  categoryProducts.reduce((sum, p) => sum + p.confidence, 0) /
                    categoryProducts.length
                );
                const totalValue = categoryProducts.reduce(
                  (sum, p) => sum + p.forecastValue,
                  0
                );
                const completedCount = categoryProducts.filter(
                  (p) => p.status === "completed"
                ).length;

                return (
                  <div key={category} className="p-4 bg-slate-50 rounded-lg">
                    <div
                      className="font-medium text-slate-900 text-sm mb-2 truncate"
                      title={category}
                    >
                      {category}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Products:</span>
                        <span className="font-medium">
                          {categoryProducts.length}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Completed:</span>
                        <span className="font-medium text-emerald-600">
                          {completedCount}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Avg Confidence:</span>
                        <span className="font-medium">{avgConfidence}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Total Value:</span>
                        <span className="font-medium">
                          ${(totalValue / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedDashboard;
