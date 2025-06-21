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
  Save,
} from "lucide-react";

const ForecastApprovalWorkflow = ({ userRole = "admin" }) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState("approve");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedAnalyst, setSelectedAnalyst] = useState("all");
  const [forecasts, setForecasts] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [adminQuantities, setAdminQuantities] = useState({});

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
        recommendedQuantity: 1180,
        analystFinalQuantity: 1250,
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
        recommendedQuantity: 820,
        analystFinalQuantity: 890,
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
        recommendedQuantity: 680,
        analystFinalQuantity: 650,
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
        recommendedQuantity: 1950,
        analystFinalQuantity: 2100,
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
        recommendedQuantity: 420,
        analystFinalQuantity: 450,
        value: 135000,
        variance: "+15%",
        notes: "Wedding season forecast with conservative estimates",
        approver: "Michael Rodriguez",
        submittedHours: 4,
        category_icon: "💒",
        metrics: { accuracy: 88, confidence: 87, variance: 15 },
      },
      {
        id: "FC-2024-006",
        productId: "RNG-445-SLV",
        category: "Engagement Rings",
        analyst: "Sarah Chen",
        analystId: "analyst_001",
        finalizedDate: "2024-12-17",
        dueDate: "2024-12-19",
        priority: "medium",
        status: "approved",
        method: "ML Algorithm",
        confidence: 91,
        recommendedQuantity: 750,
        analystFinalQuantity: 820,
        value: 164000,
        variance: "+18%",
        notes: "Holiday engagement season forecast with strong ML predictions",
        approver: "Jennifer Taylor",
        submittedHours: 12,
        category_icon: "💍",
        approvedDate: "2024-12-18",
        approvalNotes: "Excellent analysis, approved as submitted.",
        metrics: { accuracy: 93, confidence: 91, variance: 18 },
      },
      {
        id: "FC-2024-007",
        productId: "NCK-230-GLD",
        category: "Fine Necklaces",
        analyst: "Sarah Chen",
        analystId: "analyst_001",
        finalizedDate: "2024-12-20",
        dueDate: "2024-12-22",
        priority: "high",
        status: "pending_approval",
        method: "Trend Analysis",
        confidence: 85,
        recommendedQuantity: 950,
        analystFinalQuantity: 980,
        value: 196000,
        variance: "+22%",
        notes:
          "Strong trend analysis indicates increased demand for gold necklaces in Q1",
        approver: "Michael Rodriguez",
        submittedHours: 1,
        category_icon: "📿",
        metrics: { accuracy: 87, confidence: 85, variance: 22 },
      },
      {
        id: "FC-2024-008",
        productId: "EAR-180-PLT",
        category: "Platinum Earrings",
        analyst: "Sarah Chen",
        analystId: "analyst_001",
        finalizedDate: "2024-12-15",
        dueDate: "2024-12-17",
        priority: "low",
        status: "revision_requested",
        method: "Index-based",
        confidence: 72,
        recommendedQuantity: 340,
        analystFinalQuantity: 320,
        value: 96000,
        variance: "-8%",
        notes: "Conservative estimate based on platinum market volatility",
        approver: "Michael Rodriguez",
        submittedHours: 48,
        category_icon: "💎",
        rejectionReason:
          "Please review platinum pricing trends and resubmit with updated analysis.",
        rejectedDate: "2024-12-16",
        metrics: { accuracy: 74, confidence: 72, variance: -8 },
      },
    ];

    // If analyst, filter to show only their forecasts
    if (userRole === "analyst") {
      const currentAnalyst = "Sarah Chen"; // This would come from auth context
      return allForecasts.filter((f) => f.analyst === currentAnalyst);
    }

    return allForecasts;
  };

  // Initialize forecasts state and admin quantities
  React.useEffect(() => {
    const initialForecasts = getInitialMockForecasts();
    setForecasts(initialForecasts);

    // Initialize admin quantities with analyst final quantities
    const initialAdminQuantities = {};
    initialForecasts.forEach((forecast) => {
      initialAdminQuantities[forecast.id] = forecast.analystFinalQuantity;
    });
    setAdminQuantities(initialAdminQuantities);
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

  const getStatusText = (status) => {
    if (userRole === "analyst" && status === "pending_approval") {
      return "SUBMITTED";
    }
    return status.replace("_", " ").toUpperCase();
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

    const matchesAnalyst =
      selectedAnalyst === "all" || forecast.analyst === selectedAnalyst;

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending approval" &&
        forecast.status === "pending_approval") ||
      (activeTab === "approved" && forecast.status === "approved") ||
      (activeTab === "revision" && forecast.status === "revision_requested");

    return matchesSearch && matchesFilter && matchesAnalyst && matchesTab;
  });

  // Get unique analysts for filter dropdown
  const uniqueAnalysts = [...new Set(forecasts.map((f) => f.analyst))].sort();

  const handleAdminQuantityChange = (forecastId, value) => {
    setAdminQuantities((prev) => ({
      ...prev,
      [forecastId]: parseInt(value) || 0,
    }));
  };

  const handleApproval = (forecast, action) => {
    setSelectedForecast(forecast);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const submitApproval = () => {
    if (!selectedForecast) return;

    const currentDate = new Date().toISOString().split("T")[0];
    const adminQuantity = adminQuantities[selectedForecast.id];

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
              approver: "Michael Rodriguez",
              adminQuantity: adminQuantity,
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

  const handleReviseSubmission = (forecast) => {
    setForecasts((prevForecasts) =>
      prevForecasts.map((f) => {
        if (f.id === forecast.id) {
          return {
            ...f,
            status: "pending_approval",
            submittedHours: 0,
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

  const exportApprovedForecasts = () => {
    const approvedForecasts = forecasts.filter((f) => f.status === "approved");

    if (approvedForecasts.length === 0) {
      setSuccessMessage("No approved forecasts to export!");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      return;
    }

    // Prepare CSV data
    const csvData = approvedForecasts.map((forecast) => ({
      "Forecast ID": forecast.id,
      "Product ID": forecast.productId,
      Category: forecast.category,
      Analyst: forecast.analyst,
      "Approved Date": forecast.approvedDate,
      "Approved By": forecast.approver,
      Method: forecast.method,
      "Confidence %": forecast.confidence,
      "Recommended Quantity": forecast.recommendedQuantity,
      "Analyst Final Quantity": forecast.analystFinalQuantity,
      "Admin Approved Quantity":
        forecast.adminQuantity || forecast.analystFinalQuantity,
      "Forecast Value": forecast.value,
      Variance: forecast.variance,
      Priority: forecast.priority.toUpperCase(),
      "Approval Notes": forecast.approvalNotes || "",
      "Analyst Notes": forecast.notes || "",
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0]);
    const csvString = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape commas and quotes in values
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `approved-forecasts-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message
    setSuccessMessage(
      `Exported ${approvedForecasts.length} approved forecasts successfully!`
    );
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };
  const exportAnalystForecasts = () => {
    const analystForecasts =
      filteredForecasts.length > 0 ? filteredForecasts : forecasts;

    if (analystForecasts.length === 0) {
      setSuccessMessage("No forecasts to export!");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      return;
    }

    // Prepare CSV data for analyst
    const csvData = analystForecasts.map((forecast) => ({
      "Forecast ID": forecast.id,
      "Product ID": forecast.productId,
      Category: forecast.category,
      Status: forecast.status.replace("_", " ").toUpperCase(),
      "Submitted Date": forecast.finalizedDate,
      "Due Date": forecast.dueDate,
      Method: forecast.method,
      "Confidence %": forecast.confidence,
      "Recommended Quantity": forecast.recommendedQuantity,
      "My Final Quantity": forecast.analystFinalQuantity,
      "Admin Approved Quantity": forecast.adminQuantity || "",
      "Forecast Value": forecast.value,
      Variance: forecast.variance,
      Priority: forecast.priority.toUpperCase(),
      "Hours Ago Submitted": forecast.submittedHours,
      Approver: forecast.approver || "",
      "Approved Date": forecast.approvedDate || "",
      "Approval Notes": forecast.approvalNotes || "",
      "Revision Reason": forecast.rejectionReason || "",
      "My Notes": forecast.notes || "",
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0]);
    const csvString = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape commas and quotes in values
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `my-forecasts-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message
    setSuccessMessage(
      `Exported ${analystForecasts.length} forecasts successfully!`
    );
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
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
          <Bell className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="text-xs text-amber-600 font-medium">
              {userRole === "analyst" ? "SUBMITTED" : "PENDING"}
            </span>
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
          {["pending approval", "approved", "revision", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab === "pending" && userRole === "analyst"
                ? "Submitted"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Export Button - Show for admin in approved tab, or for analyst in any tab */}
        {((userRole === "admin" && activeTab === "approved") ||
          userRole === "analyst") && (
          <button
            onClick={
              userRole === "admin"
                ? exportApprovedForecasts
                : exportAnalystForecasts
            }
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Download size={16} />
            {userRole === "admin" ? "Export Approved" : "Export My Forecasts"}
          </button>
        )}

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
          {userRole === "admin" && (
            <select
              value={selectedAnalyst}
              onChange={(e) => setSelectedAnalyst(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
            >
              <option value="all">All Analysts</option>
              {uniqueAnalysts.map((analyst) => (
                <option key={analyst} value={analyst}>
                  {analyst}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Forecast Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white/50 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="text-left p-4 font-semibold text-slate-700">
                Status
              </th>
              {userRole === "admin" && (
                <th className="text-left p-4 font-semibold text-slate-700">
                  Analyst
                </th>
              )}
              <th className="text-left p-4 font-semibold text-slate-700">
                Category
              </th>
              <th className="text-left p-4 font-semibold text-slate-700">
                PID
              </th>
              <th className="text-left p-4 font-semibold text-slate-700">
                Recommended Quantity
              </th>
              <th className="text-left p-4 font-semibold text-slate-700">
                Analyst Final Quantity
              </th>
              {userRole === "admin" && (
                <th className="text-left p-4 font-semibold text-slate-700">
                  Admin Quantity
                </th>
              )}
              <th className="text-left p-4 font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredForecasts.map((forecast, index) => (
              <tr
                key={forecast.id}
                className={`border-b border-slate-200 hover:bg-slate-50/50 ${
                  index % 2 === 0 ? "bg-white/30" : "bg-white/10"
                }`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getPriorityColor(
                        forecast.priority
                      )}`}
                    ></div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        forecast.status
                      )}`}
                    >
                      {getStatusText(forecast.status)}
                    </span>
                  </div>
                </td>
                {userRole === "admin" && (
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-slate-400" />
                      <span className="font-medium text-slate-900">
                        {forecast.analyst}
                      </span>
                    </div>
                  </td>
                )}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{forecast.category_icon}</span>
                    <span className="text-slate-700">{forecast.category}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-semibold text-slate-900">
                    {forecast.productId}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-slate-700">
                    {forecast.recommendedQuantity.toLocaleString()}
                  </span>
                </td>
                <td className="p-4">
                  <span className="font-medium text-slate-900">
                    {forecast.analystFinalQuantity.toLocaleString()}
                  </span>
                </td>
                {userRole === "admin" && (
                  <td className="p-4">
                    {forecast.status === "pending_approval" ? (
                      <input
                        type="number"
                        value={
                          adminQuantities[forecast.id] ||
                          forecast.analystFinalQuantity
                        }
                        onChange={(e) =>
                          handleAdminQuantityChange(forecast.id, e.target.value)
                        }
                        className="w-24 px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    ) : (
                      <span className="font-medium text-slate-900">
                        {forecast.adminQuantity
                          ? forecast.adminQuantity.toLocaleString()
                          : forecast.analystFinalQuantity.toLocaleString()}
                      </span>
                    )}
                  </td>
                )}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {userRole === "admin" &&
                      forecast.status === "pending_approval" && (
                        <>
                          <button
                            onClick={() => handleApproval(forecast, "reject")}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-medium transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproval(forecast, "approve")}
                            className="px-2 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded text-xs font-medium transition-colors"
                          >
                            Approve
                          </button>
                        </>
                      )}

                    {userRole === "analyst" &&
                      forecast.status === "revision_requested" && (
                        <button
                          onClick={() => handleReviseSubmission(forecast)}
                          className="px-2 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <Edit3 size={12} />
                          Resubmit
                        </button>
                      )}

                    <button
                      onClick={() => setSelectedForecast(forecast)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredForecasts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              Select a Tab to See Details
            </h3>
          </div>
        )}
      </div>

      {/* Forecast Details Modal */}
      {selectedForecast && !showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {selectedForecast.category_icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedForecast.productId}
                    </h3>
                    <p className="text-slate-600">
                      {selectedForecast.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedForecast(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Analyst</div>
                  <div className="font-semibold text-slate-900">
                    {selectedForecast.analyst}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Confidence</div>
                  <div className="font-semibold text-slate-900">
                    {selectedForecast.confidence}%
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Method</div>
                  <div className="font-semibold text-slate-900">
                    {selectedForecast.method}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Value</div>
                  <div className="font-semibold text-slate-900">
                    ${(selectedForecast.value / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>

              {selectedForecast.notes && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <MessageSquare size={16} className="text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-blue-800 mb-1">
                        Notes:
                      </div>
                      <div className="text-sm text-blue-700">
                        {selectedForecast.notes}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedForecast.approvalNotes && (
                <div className="mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle
                      size={16}
                      className="text-emerald-600 mt-0.5"
                    />
                    <div>
                      <div className="text-sm font-medium text-emerald-800 mb-1">
                        Approval Notes:
                      </div>
                      <div className="text-sm text-emerald-700">
                        {selectedForecast.approvalNotes}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedForecast.rejectionReason && (
                <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-red-600 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-red-800 mb-1">
                        Revision Required:
                      </div>
                      <div className="text-sm text-red-700">
                        {selectedForecast.rejectionReason}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
              {approvalAction === "approve" && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-800">
                    <strong>Admin Quantity:</strong>{" "}
                    {adminQuantities[selectedForecast?.id]?.toLocaleString() ||
                      0}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    This quantity will be approved for execution
                  </div>
                </div>
              )}

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
            Advanced Features
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
