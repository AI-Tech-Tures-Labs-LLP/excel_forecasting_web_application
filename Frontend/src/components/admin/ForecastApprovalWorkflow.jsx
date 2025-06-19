// src/components/admin/ForecastApprovalWorkflow.jsx
import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  MessageSquare,
  FileText,
  Send,
  ArrowRight,
  User,
  Calendar,
  TrendingUp,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Star,
  Target,
  Zap,
  Users,
  Bell,
  CheckSquare,
  XCircle,
  Edit3,
  History,
  Archive,
  Award,
  Activity,
} from "lucide-react";

const ForecastApprovalWorkflow = ({ userRole = "admin" }) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState("approve");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [forecasts, setForecasts] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Mock data for forecasts - adjusted based on user role
  const getInitialMockForecasts = () => {
    const allForecasts = [
      {
        id: "FC-2024-001",
        productId: "GEM-742-BLU",
        category: "Bridge Gem742",
        analyst: "Sarah Chen",
        analystId: "analyst_001",
        finalizedDate: "2024-12-18",
        dueDate: "2024-12-20",
        priority: "high",
        status: "pending_approval",
        method: "ML Algorithm",
        confidence: 94,
        totalQuantity: 1250,
        value: 87500,
        variance: "+12%",
        notes:
          "Strong seasonal trend identified, adjusted for Valentine's Day demand",
        approver: "Michael Rodriguez",
        submittedHours: 6,
        category_icon: "💎",
        metrics: { accuracy: 96, confidence: 94, variance: 12 },
      },
      {
        id: "FC-2024-002",
        productId: "SLV-260-PNK",
        category: "Womens Silver260&404",
        analyst: "David Kim",
        analystId: "analyst_002",
        finalizedDate: "2024-12-17",
        dueDate: "2024-12-19",
        priority: "medium",
        status: "approved",
        method: "Index-based",
        confidence: 89,
        totalQuantity: 890,
        value: 62300,
        variance: "+8%",
        notes: "Standard index application, no significant anomalies detected",
        approver: "Jennifer Taylor",
        submittedHours: 18,
        category_icon: "💍",
        approvedDate: "2024-12-18",
        approvalNotes: "Great work! Confidence level is solid.",
        metrics: { accuracy: 92, confidence: 89, variance: 8 },
      },
      {
        id: "FC-2024-003",
        productId: "PRL-150-WHT",
        category: "Fine Pearl",
        analyst: "Emily Zhang",
        analystId: "analyst_003",
        finalizedDate: "2024-12-16",
        dueDate: "2024-12-18",
        priority: "high",
        status: "revision_requested",
        method: "Trend Analysis",
        confidence: 76,
        totalQuantity: 650,
        value: 97500,
        variance: "-5%",
        notes:
          "Analyst notes: Seasonal adjustment applied for spring collection",
        approver: "Michael Rodriguez",
        submittedHours: 32,
        category_icon: "🦪",
        rejectionReason:
          "Confidence level below threshold. Please review Q4 data impact.",
        rejectedDate: "2024-12-17",
        metrics: { accuracy: 78, confidence: 76, variance: -5 },
      },
      {
        id: "FC-2024-004",
        productId: "DMD-890-CLR",
        category: "Diamond",
        analyst: "Alex Thompson",
        analystId: "analyst_004",
        finalizedDate: "2024-12-19",
        dueDate: "2024-12-21",
        priority: "urgent",
        status: "pending_approval",
        method: "Hybrid (ML + Index)",
        confidence: 98,
        totalQuantity: 2100,
        value: 315000,
        variance: "+25%",
        notes:
          "High-value SKU with exceptional confidence. Holiday demand spike anticipated.",
        approver: "Jennifer Taylor",
        submittedHours: 2,
        category_icon: "💎",
        metrics: { accuracy: 99, confidence: 98, variance: 25 },
      },
      {
        id: "FC-2024-005",
        productId: "BRL-300-GLD",
        category: "Bridal",
        analyst: "Sarah Chen",
        analystId: "analyst_001",
        finalizedDate: "2024-12-19",
        dueDate: "2024-12-21",
        priority: "high",
        status: "pending_approval",
        method: "Index-based",
        confidence: 87,
        totalQuantity: 450,
        value: 135000,
        variance: "+15%",
        notes: "Wedding season forecast with conservative estimates",
        approver: "Michael Rodriguez",
        submittedHours: 4,
        category_icon: "💒",
        metrics: { accuracy: 88, confidence: 87, variance: 15 },
      },
    ];

    // If analyst, filter to show only their forecasts
    if (userRole === "analyst") {
      const currentAnalyst = "Sarah Chen"; // This would come from auth context
      return allForecasts.filter((f) => f.analyst === currentAnalyst);
    }

    return allForecasts;
  };

  // Initialize forecasts state
  React.useEffect(() => {
    setForecasts(getInitialMockForecasts());
  }, [userRole]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending_approval":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "revision_requested":
        return "bg-red-100 text-red-800 border-red-200";
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

  const getMethodIcon = (method) => {
    if (method.includes("ML")) return <Zap className="w-4 h-4" />;
    if (method.includes("Index")) return <BarChart3 className="w-4 h-4" />;
    if (method.includes("Trend")) return <TrendingUp className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  const filteredForecasts = forecasts.filter((forecast) => {
    const matchesSearch =
      forecast.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      forecast.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      forecast.analyst.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "high_priority" &&
        ["urgent", "high"].includes(forecast.priority)) ||
      (selectedFilter === "low_confidence" && forecast.confidence < 85);

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && forecast.status === "pending_approval") ||
      (activeTab === "approved" && forecast.status === "approved") ||
      (activeTab === "revision" && forecast.status === "revision_requested");

    return matchesSearch && matchesFilter && matchesTab;
  });

  const handleApproval = (forecast, action) => {
    setSelectedForecast(forecast);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const submitApproval = () => {
    if (!selectedForecast) return;

    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toLocaleTimeString();

    // Update the forecast status
    setForecasts((prevForecasts) =>
      prevForecasts.map((forecast) => {
        if (forecast.id === selectedForecast.id) {
          if (approvalAction === "approve") {
            return {
              ...forecast,
              status: "approved",
              approvedDate: currentDate,
              approvalNotes:
                approvalNotes || "Approved without additional comments",
              approver: "Michael Rodriguez", // This would come from current user
            };
          } else {
            return {
              ...forecast,
              status: "revision_requested",
              rejectedDate: currentDate,
              rejectionReason:
                approvalNotes || "Revision requested - please review",
              approver: "Michael Rodriguez",
            };
          }
        }
        return forecast;
      })
    );

    // Show success message
    const actionText =
      approvalAction === "approve" ? "approved" : "sent back for revision";
    setSuccessMessage(
      `Forecast ${selectedForecast.productId} has been ${actionText} successfully!`
    );
    setShowSuccessToast(true);

    // Switch to appropriate tab
    if (approvalAction === "approve") {
      setActiveTab("approved");
    } else {
      setActiveTab("revision");
    }

    // Reset modal state
    setShowApprovalModal(false);
    setApprovalNotes("");
    setSelectedForecast(null);

    // Hide success toast after 3 seconds
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  // Handle analyst revision submission (simulate resubmission)
  const handleReviseSubmission = (forecast) => {
    setForecasts((prevForecasts) =>
      prevForecasts.map((f) => {
        if (f.id === forecast.id) {
          return {
            ...f,
            status: "pending_approval",
            submittedHours: 0, // Just resubmitted
            notes: f.notes + " [REVISED: Updated based on feedback]",
          };
        }
        return f;
      })
    );

    setSuccessMessage(
      `Forecast ${forecast.productId} has been resubmitted for approval!`
    );
    setShowSuccessToast(true);
    setActiveTab("pending");

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  const stats = {
    pending: forecasts.filter((f) => f.status === "pending_approval").length,
    approved: forecasts.filter((f) => f.status === "approved").length,
    revision: forecasts.filter((f) => f.status === "revision_requested").length,
    totalValue: forecasts.reduce((sum, f) => sum + f.value, 0),
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right-5">
          <CheckCircle size={20} />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <CheckSquare className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {userRole === "admin"
                ? "Forecast Approval Workflow"
                : "My Forecast Submissions"}
            </h3>
            <p className="text-slate-600 text-sm">
              {userRole === "admin"
                ? "Manage and approve forecast submissions"
                : "Track your forecast submissions and approvals"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
            🚀 2 WEEKS - Future Scope
          </span>
          <Bell className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="text-xs text-amber-600 font-medium">PENDING</span>
          </div>
          <div className="text-2xl font-bold text-amber-800">
            {stats.pending}
          </div>
          <div className="text-xs text-amber-600">
            {userRole === "admin" ? "Awaiting approval" : "Under review"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-xs text-emerald-600 font-medium">
              APPROVED
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-800">
            {stats.approved}
          </div>
          <div className="text-xs text-emerald-600">
            {userRole === "admin"
              ? "Ready for execution"
              : "Successfully approved"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-xs text-red-600 font-medium">REVISION</span>
          </div>
          <div className="text-2xl font-bold text-red-800">
            {stats.revision}
          </div>
          <div className="text-xs text-red-600">
            {userRole === "admin" ? "Needs changes" : "Requires updates"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">VALUE</span>
          </div>
          <div className="text-lg font-bold text-blue-800">
            ${(stats.totalValue / 1000).toFixed(0)}K
          </div>
          <div className="text-xs text-blue-600">
            {userRole === "admin"
              ? "Total forecast value"
              : "My forecast value"}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Tabs */}
        <div className="flex bg-slate-100 rounded-lg p-1">
          {["pending", "approved", "revision", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search forecasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Forecasts</option>
            <option value="high_priority">High Priority</option>
            <option value="low_confidence">Low Confidence</option>
          </select>
        </div>
      </div>

      {/* Forecast List */}
      <div className="space-y-4">
        {filteredForecasts.map((forecast) => (
          <div
            key={forecast.id}
            className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 bg-white/50"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{forecast.category_icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900">
                      {forecast.productId}
                    </h4>
                    <div
                      className={`w-2 h-2 rounded-full ${getPriorityColor(
                        forecast.priority
                      )}`}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600">{forecast.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    forecast.status
                  )}`}
                >
                  {forecast.status.replace("_", " ").toUpperCase()}
                </span>
                <button
                  onClick={() => setSelectedForecast(forecast)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="text-lg font-bold text-slate-900">
                  {forecast.totalQuantity.toLocaleString()}
                </div>
                <div className="text-xs text-slate-600">Quantity</div>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="text-lg font-bold text-slate-900">
                  ${(forecast.value / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-slate-600">Value</div>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-lg font-bold text-slate-900">
                    {forecast.confidence}%
                  </span>
                  {forecast.confidence > 90 && (
                    <Star className="w-3 h-3 text-yellow-500" />
                  )}
                </div>
                <div className="text-xs text-slate-600">Confidence</div>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  {getMethodIcon(forecast.method)}
                  <span className="text-sm font-medium text-slate-900">
                    {forecast.method.split(" ")[0]}
                  </span>
                </div>
                <div className="text-xs text-slate-600">Method</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{userRole === "admin" ? forecast.analyst : "You"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{forecast.finalizedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{forecast.submittedHours}h ago</span>
                </div>
              </div>

              {userRole === "admin" &&
                forecast.status === "pending_approval" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproval(forecast, "reject")}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                    >
                      Request Revision
                    </button>
                    <button
                      onClick={() => handleApproval(forecast, "approve")}
                      className="px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                )}

              {userRole === "analyst" &&
                forecast.status === "revision_requested" && (
                  <button
                    onClick={() => handleReviseSubmission(forecast)}
                    className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    <Edit3 size={14} />
                    Resubmit Forecast
                  </button>
                )}
            </div>

            {forecast.notes && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <MessageSquare size={14} className="text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-blue-800 mb-1">
                      {userRole === "admin" ? "Analyst Notes:" : "Your Notes:"}
                    </div>
                    <div className="text-sm text-blue-700">
                      {forecast.notes}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {forecast.approvalNotes && forecast.status === "approved" && (
              <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-emerald-600 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-emerald-800 mb-1">
                      Approval Notes:
                    </div>
                    <div className="text-sm text-emerald-700">
                      {forecast.approvalNotes}
                    </div>
                    <div className="text-xs text-emerald-600 mt-1">
                      Approved on {forecast.approvedDate} by {forecast.approver}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {forecast.rejectionReason && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-red-600 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-red-800 mb-1">
                      {userRole === "admin"
                        ? "Revision Required:"
                        : "Feedback from Approver:"}
                    </div>
                    <div className="text-sm text-red-700">
                      {forecast.rejectionReason}
                    </div>
                    {forecast.rejectedDate && (
                      <div className="text-xs text-red-600 mt-1">
                        Rejected on {forecast.rejectedDate} by{" "}
                        {forecast.approver}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredForecasts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              No forecasts found
            </h3>
            <p className="text-slate-500">
              {userRole === "admin"
                ? "Try adjusting your search or filter criteria"
                : "No forecast submissions match your criteria"}
            </p>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div
              className={`p-6 rounded-t-2xl ${
                approvalAction === "approve"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                  : "bg-gradient-to-r from-red-500 to-red-600"
              }`}
            >
              <div className="flex items-center gap-3 text-white">
                {approvalAction === "approve" ? (
                  <CheckCircle size={24} />
                ) : (
                  <XCircle size={24} />
                )}
                <div>
                  <h3 className="text-lg font-bold">
                    {approvalAction === "approve"
                      ? "Approve Forecast"
                      : "Request Revision"}
                  </h3>
                  <p className="text-sm opacity-90">
                    {selectedForecast?.productId} - {selectedForecast?.category}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {approvalAction === "approve"
                    ? "Approval Notes (Optional)"
                    : "Revision Instructions"}
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={
                    approvalAction === "approve"
                      ? "Add any comments or approval notes..."
                      : "Specify what changes are needed..."
                  }
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitApproval}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                    approvalAction === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {approvalAction === "approve"
                    ? "Approve"
                    : "Request Revision"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Future Features Preview */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-purple-800">
            Coming Soon: Advanced Features
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-purple-700">
          <div className="flex items-center gap-1">
            <Bell size={12} />
            <span>Auto Notifications</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>Multi-level Approval</span>
          </div>
          <div className="flex items-center gap-1">
            <History size={12} />
            <span>Approval History</span>
          </div>
          <div className="flex items-center gap-1">
            <Award size={12} />
            <span>Performance Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastApprovalWorkflow;
