// // // src/components/admin/QuickActions.jsx
// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Zap, ArrowRight, CheckSquare } from "lucide-react";
// // import ForecastApprovalWorkflow from "./ForecastApprovalWorkflow";

// // const QuickActions = ({ stats, isAdmin, filteredActions }) => {
// //   const navigate = useNavigate();
// //   const [showApprovalModal, setShowApprovalModal] = useState(false);

// //   // Lock/unlock scroll when modal opens/closes
// //   React.useEffect(() => {
// //     if (showApprovalModal) {
// //       // Lock scroll
// //       document.body.style.overflow = "hidden";
// //       document.documentElement.style.overflow = "hidden";
// //     } else {
// //       // Unlock scroll
// //       document.body.style.overflow = "unset";
// //       document.documentElement.style.overflow = "unset";
// //     }

// //     // Cleanup function to ensure scroll is unlocked when component unmounts
// //     return () => {
// //       document.body.style.overflow = "unset";
// //       document.documentElement.style.overflow = "unset";
// //     };
// //   }, [showApprovalModal]);

// //   const handleCardClick = (path) => {
// //     if (path === "#approval-workflow") {
// //       setShowApprovalModal(true);
// //       return;
// //     }
// //     console.log(`Navigating to: ${path}`);
// //     navigate(path);
// //   };

// //   // Add Forecast Approval action to the existing actions
// //   const enhancedActions = [
// //     ...filteredActions,
// //     {
// //       title: "Forecast Approval",
// //       description: isAdmin
// //         ? "Review and approve pending forecast submissions from analysts"
// //         : "Track your forecast submissions and approval status",
// //       icon: CheckSquare,
// //       path: "#approval-workflow",
// //       gradient: "from-purple-500 to-purple-600",
// //       hoverGradient: "hover:from-purple-600 hover:to-purple-700",
// //       adminOnly: false,
// //       badge: isAdmin ? "3 Pending" : "2 Submitted",
// //       iconBg: "bg-purple-100",
// //       iconColor: "text-purple-600",
// //       futureScope: true, // Special flag for future scope items
// //     },
// //   ];

// //   return (
// //     <>
// //       <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8">
// //         <div className="flex items-center justify-between mb-6">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
// //               <Zap className="text-white" size={20} />
// //             </div>
// //             <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
// //           </div>
// //           <div className="text-sm text-slate-500">
// //             {enhancedActions.length} available actions
// //           </div>
// //         </div>
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           {enhancedActions.map((action, index) => {
// //             const IconComponent = action.icon;
// //             return (
// //               <div
// //                 key={action.path}
// //                 onClick={() => handleCardClick(action.path)}
// //                 className="group relative bg-white/60 backdrop-blur-sm border border-white/40 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white/80 overflow-hidden"
// //               >
// //                 {/* Gradient Background */}
// //                 <div
// //                   className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
// //                 ></div>

// //                 <div className="relative">
// //                   <div className="flex items-start justify-between mb-4">
// //                     <div
// //                       className={`p-3 rounded-xl ${action.iconBg} group-hover:scale-110 transition-transform duration-300`}
// //                     >
// //                       <IconComponent size={24} className={action.iconColor} />
// //                     </div>
// //                     <div className="flex items-center gap-2">
// //                       {action.futureScope && (
// //                         <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
// //                           🚀 2 WEEKS
// //                         </span>
// //                       )}
// //                       <ArrowRight
// //                         className="opacity-0 group-hover:opacity-100 text-slate-400 group-hover:translate-x-1 transition-all duration-300"
// //                         size={20}
// //                       />
// //                     </div>
// //                   </div>

// //                   <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-slate-800">
// //                     {action.title}
// //                   </h3>
// //                   <p className="text-slate-600 text-sm mb-4 leading-relaxed">
// //                     {action.description}
// //                   </p>

// //                   <div className="flex items-center justify-between">
// //                     {action.count !== undefined && (
// //                       <div className="flex items-center gap-2">
// //                         <span className="text-2xl font-bold text-slate-800">
// //                           {action.count}
// //                         </span>
// //                         <span className="text-sm text-slate-500">items</span>
// //                       </div>
// //                     )}
// //                     {action.badge && (
// //                       <span
// //                         className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${action.gradient} text-white shadow-sm`}
// //                       >
// //                         {action.badge}
// //                       </span>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>

// //       {/* Forecast Approval Modal */}
// //       {showApprovalModal && (
// //         <div
// //           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
// //           onClick={(e) => {
// //             // Close modal if clicking on backdrop
// //             if (e.target === e.currentTarget) {
// //               setShowApprovalModal(false);
// //             }
// //           }}
// //         >
// //           <div
// //             className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-white/20"
// //             onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
// //           >
// //             {/* Modal Header */}
// //             <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white p-6">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center gap-3">
// //                   <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
// //                     <CheckSquare size={24} />
// //                   </div>
// //                   <div>
// //                     <h2 className="text-2xl font-bold">
// //                       {isAdmin
// //                         ? "Forecast Approval Center"
// //                         : "My Forecast Submissions"}
// //                     </h2>
// //                     <p className="text-purple-100 mt-1">
// //                       {isAdmin
// //                         ? "Manage and approve forecast submissions from your team"
// //                         : "Track your forecast submissions and approval status"}
// //                     </p>
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center gap-3">
// //                   <span className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full font-medium border border-white/30">
// //                     🚀 Future Scope - 2 Weeks
// //                   </span>
// //                   <button
// //                     onClick={() => setShowApprovalModal(false)}
// //                     className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/20 hover:scale-105"
// //                     aria-label="Close modal"
// //                   >
// //                     <svg
// //                       className="w-6 h-6"
// //                       fill="none"
// //                       stroke="currentColor"
// //                       viewBox="0 0 24 24"
// //                     >
// //                       <path
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         strokeWidth={2}
// //                         d="M6 18L18 6M6 6l12 12"
// //                       />
// //                     </svg>
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Modal Content */}
// //             <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
// //               <ForecastApprovalWorkflow
// //                 userRole={isAdmin ? "admin" : "analyst"}
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default QuickActions;

// // src/components/admin/QuickActions.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Zap, ArrowRight, CheckSquare, BarChart3 } from "lucide-react";
// import ForecastApprovalWorkflow from "./ForecastApprovalWorkflow";
// import DetailedDashboard from "./DetailedDashboard"; // Import the detailed dashboard

// const QuickActions = ({ stats, isAdmin, filteredActions }) => {
//   const navigate = useNavigate();
//   const [showApprovalModal, setShowApprovalModal] = useState(false);
//   const [showDetailedDashboard, setShowDetailedDashboard] = useState(false);

//   // Lock/unlock scroll when modal opens/closes
//   React.useEffect(() => {
//     if (showApprovalModal || showDetailedDashboard) {
//       // Lock scroll
//       document.body.style.overflow = "hidden";
//       document.documentElement.style.overflow = "hidden";
//     } else {
//       // Unlock scroll
//       document.body.style.overflow = "unset";
//       document.documentElement.style.overflow = "unset";
//     }

//     // Cleanup function to ensure scroll is unlocked when component unmounts
//     return () => {
//       document.body.style.overflow = "unset";
//       document.documentElement.style.overflow = "unset";
//     };
//   }, [showApprovalModal, showDetailedDashboard]);

//   const handleCardClick = (path) => {
//     if (path === "#approval-workflow") {
//       setShowApprovalModal(true);
//       return;
//     }
//     if (path === "#detailed-dashboard") {
//       setShowDetailedDashboard(true);
//       return;
//     }
//     console.log(`Navigating to: ${path}`);
//     navigate(path);
//   };

//   // Add both Forecast Approval and Detailed Dashboard actions to the existing actions
//   const enhancedActions = [
//     ...filteredActions,
//     {
//       title: "Detailed Analytics",
//       description: isAdmin
//         ? "Access comprehensive user and product analytics with advanced metrics"
//         : "View detailed performance analytics and product insights",
//       icon: BarChart3,
//       path: "#detailed-dashboard",
//       gradient: "from-indigo-500 to-indigo-600",
//       hoverGradient: "hover:from-indigo-600 hover:to-indigo-700",
//       adminOnly: false,
//       badge: `${stats.totalForecasts || 156} Forecasts`,
//       iconBg: "bg-indigo-100",
//       iconColor: "text-indigo-600",
//     },
//     {
//       title: "Forecast Approval",
//       description: isAdmin
//         ? "Review and approve pending forecast submissions from analysts"
//         : "Track your forecast submissions and approval status",
//       icon: CheckSquare,
//       path: "#approval-workflow",
//       gradient: "from-purple-500 to-purple-600",
//       hoverGradient: "hover:from-purple-600 hover:to-purple-700",
//       adminOnly: false,
//       badge: isAdmin ? "3 Pending" : "2 Submitted",
//       iconBg: "bg-purple-100",
//       iconColor: "text-purple-600",
//       futureScope: true, // Special flag for future scope items
//     },
//   ];

//   return (
//     <>
//       <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
//               <Zap className="text-white" size={20} />
//             </div>
//             <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
//           </div>
//           <div className="text-sm text-slate-500">
//             {enhancedActions.length} available actions
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {enhancedActions.map((action, index) => {
//             const IconComponent = action.icon;
//             return (
//               <div
//                 key={action.path}
//                 onClick={() => handleCardClick(action.path)}
//                 className="group relative bg-white/60 backdrop-blur-sm border border-white/40 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white/80 overflow-hidden"
//               >
//                 {/* Gradient Background */}
//                 <div
//                   className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
//                 ></div>

//                 <div className="relative">
//                   <div className="flex items-start justify-between mb-4">
//                     <div
//                       className={`p-3 rounded-xl ${action.iconBg} group-hover:scale-110 transition-transform duration-300`}
//                     >
//                       <IconComponent size={24} className={action.iconColor} />
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {action.futureScope && (
//                         <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
//                           🚀 2 WEEKS
//                         </span>
//                       )}
//                       <ArrowRight
//                         className="opacity-0 group-hover:opacity-100 text-slate-400 group-hover:translate-x-1 transition-all duration-300"
//                         size={20}
//                       />
//                     </div>
//                   </div>

//                   <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-slate-800">
//                     {action.title}
//                   </h3>
//                   <p className="text-slate-600 text-sm mb-4 leading-relaxed">
//                     {action.description}
//                   </p>

//                   <div className="flex items-center justify-between">
//                     {action.count !== undefined && (
//                       <div className="flex items-center gap-2">
//                         <span className="text-2xl font-bold text-slate-800">
//                           {action.count}
//                         </span>
//                         <span className="text-sm text-slate-500">items</span>
//                       </div>
//                     )}
//                     {action.badge && (
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${action.gradient} text-white shadow-sm`}
//                       >
//                         {action.badge}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Detailed Dashboard Modal */}
//       {showDetailedDashboard && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//           onClick={(e) => {
//             // Close modal if clicking on backdrop
//             if (e.target === e.currentTarget) {
//               setShowDetailedDashboard(false);
//             }
//           }}
//         >
//           <div
//             className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-white/20"
//             onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
//           >
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white p-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
//                     <BarChart3 size={24} />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold">
//                       Detailed Analytics Dashboard
//                     </h2>
//                     <p className="text-indigo-100 mt-1">
//                       Comprehensive user and product metrics with advanced
//                       insights
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full font-medium border border-white/30">
//                     Live Data
//                   </span>
//                   <button
//                     onClick={() => setShowDetailedDashboard(false)}
//                     className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/20 hover:scale-105"
//                     aria-label="Close modal"
//                   >
//                     <svg
//                       className="w-6 h-6"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M6 18L18 6M6 6l12 12"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 max-h-[calc(95vh-120px)] overflow-y-auto">
//               <DetailedDashboard />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Forecast Approval Modal */}
//       {showApprovalModal && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//           onClick={(e) => {
//             // Close modal if clicking on backdrop
//             if (e.target === e.currentTarget) {
//               setShowApprovalModal(false);
//             }
//           }}
//         >
//           <div
//             className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-white/20"
//             onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
//           >
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white p-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
//                     <CheckSquare size={24} />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold">
//                       {isAdmin
//                         ? "Forecast Approval Center"
//                         : "My Forecast Submissions"}
//                     </h2>
//                     <p className="text-purple-100 mt-1">
//                       {isAdmin
//                         ? "Manage and approve forecast submissions from your team"
//                         : "Track your forecast submissions and approval status"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full font-medium border border-white/30">
//                     🚀 Future Scope - 2 Weeks
//                   </span>
//                   <button
//                     onClick={() => setShowApprovalModal(false)}
//                     className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/20 hover:scale-105"
//                     aria-label="Close modal"
//                   >
//                     <svg
//                       className="w-6 h-6"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M6 18L18 6M6 6l12 12"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
//               <ForecastApprovalWorkflow
//                 userRole={isAdmin ? "admin" : "analyst"}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default QuickActions;

// src/components/admin/QuickActions.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowRight, CheckSquare, BarChart3 } from "lucide-react";
import ForecastApprovalWorkflow from "./ForecastApprovalWorkflow";
import DetailedDashboard from "./DetailedDashboard"; // Import the detailed dashboard

const QuickActions = ({ stats, isAdmin, filteredActions }) => {
  const navigate = useNavigate();
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDetailedDashboard, setShowDetailedDashboard] = useState(false);

  // Lock/unlock scroll when modal opens/closes
  React.useEffect(() => {
    if (showApprovalModal || showDetailedDashboard) {
      // Lock scroll
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Unlock scroll
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    // Cleanup function to ensure scroll is unlocked when component unmounts
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [showApprovalModal, showDetailedDashboard]);

  const handleCardClick = (path) => {
    if (path === "#approval-workflow") {
      setShowApprovalModal(true);
      return;
    }
    if (path === "#detailed-dashboard" && isAdmin) {
      setShowDetailedDashboard(true);
      return;
    }
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  // Add enhanced actions based on user role
  const enhancedActions = [
    ...filteredActions,
    // Detailed Analytics - Admin Only
    ...(isAdmin
      ? [
          {
            title: "Detailed Analytics",
            description:
              "Access comprehensive user and product analytics with advanced metrics",
            icon: BarChart3,
            path: "#detailed-dashboard",
            gradient: "from-indigo-500 to-indigo-600",
            hoverGradient: "hover:from-indigo-600 hover:to-indigo-700",
            adminOnly: true,
            badge: `${stats.totalForecasts || 156} Forecasts`,
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-600",
          },
        ]
      : []),
    // Forecast Approval - Available to both roles
    {
      title: "Forecast Approval",
      description: isAdmin
        ? "Review and approve pending forecast submissions from analysts"
        : "Track your forecast submissions and approval status",
      icon: CheckSquare,
      path: "#approval-workflow",
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "hover:from-purple-600 hover:to-purple-700",
      adminOnly: false,
      badge: isAdmin ? "3 Pending" : "2 Submitted",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      futureScope: true, // Special flag for future scope items
    },
  ];

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
              <Zap className="text-white" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
          </div>
          <div className="text-sm text-slate-500">
            {enhancedActions.length} available actions
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enhancedActions.map((action, index) => {
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
                      <IconComponent size={24} className={action.iconColor} />
                    </div>
                    <div className="flex items-center gap-2">
                      {action.futureScope && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                          🚀 2 WEEKS
                        </span>
                      )}
                      <ArrowRight
                        className="opacity-0 group-hover:opacity-100 text-slate-400 group-hover:translate-x-1 transition-all duration-300"
                        size={20}
                      />
                    </div>
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
                        <span className="text-sm text-slate-500">items</span>
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

      {/* Detailed Dashboard Modal - Admin Only */}
      {showDetailedDashboard && isAdmin && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // Close modal if clicking on backdrop
            if (e.target === e.currentTarget) {
              setShowDetailedDashboard(false);
            }
          }}
        >
          <div
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-white/20"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Detailed Analytics Dashboard
                    </h2>
                    <p className="text-indigo-100 mt-1">
                      Comprehensive user and product metrics with advanced
                      insights
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full font-medium border border-white/30">
                    Live Data
                  </span>
                  <button
                    onClick={() => setShowDetailedDashboard(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/20 hover:scale-105"
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[calc(95vh-120px)] overflow-y-auto">
              <DetailedDashboard />
            </div>
          </div>
        </div>
      )}

      {/* Forecast Approval Modal */}
      {showApprovalModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // Close modal if clicking on backdrop
            if (e.target === e.currentTarget) {
              setShowApprovalModal(false);
            }
          }}
        >
          <div
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-white/20"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <CheckSquare size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {isAdmin
                        ? "Forecast Approval Center"
                        : "My Forecast Submissions"}
                    </h2>
                    <p className="text-purple-100 mt-1">
                      {isAdmin
                        ? "Manage and approve forecast submissions from your team"
                        : "Track your forecast submissions and approval status"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full font-medium border border-white/30">
                    🚀 Future Scope - 2 Weeks
                  </span>
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/20 hover:scale-105"
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <ForecastApprovalWorkflow
                userRole={isAdmin ? "admin" : "analyst"}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;
