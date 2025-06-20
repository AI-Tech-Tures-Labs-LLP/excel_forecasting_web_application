// // // // src/components/admin/QuickActions.jsx
// // // import React, { useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { Zap, ArrowRight, CheckSquare } from "lucide-react";
// // // import ForecastApprovalWorkflow from "./ForecastApprovalWorkflow";

// // // const QuickActions = ({ stats, isAdmin, filteredActions }) => {
// // //   const navigate = useNavigate();
// // //   const [showApprovalModal, setShowApprovalModal] = useState(false);

// // //   // Lock/unlock scroll when modal opens/closes
// // //   React.useEffect(() => {
// // //     if (showApprovalModal) {
// // //       // Lock scroll
// // //       document.body.style.overflow = "hidden";
// // //       document.documentElement.style.overflow = "hidden";
// // //     } else {
// // //       // Unlock scroll
// // //       document.body.style.overflow = "unset";
// // //       document.documentElement.style.overflow = "unset";
// // //     }

// // //     // Cleanup function to ensure scroll is unlocked when component unmounts
// // //     return () => {
// // //       document.body.style.overflow = "unset";
// // //       document.documentElement.style.overflow = "unset";
// // //     };
// // //   }, [showApprovalModal]);

// // //   const handleCardClick = (path) => {
// // //     if (path === "#approval-workflow") {
// // //       setShowApprovalModal(true);
// // //       return;
// // //     }
// // //     console.log(`Navigating to: ${path}`);
// // //     navigate(path);
// // //   };

// // //   // Add Forecast Approval action to the existing actions
// // //   const enhancedActions = [
// // //     ...filteredActions,
// // //     {
// // //       title: "Forecast Approval",
// // //       description: isAdmin
// // //         ? "Review and approve pending forecast submissions from analysts"
// // //         : "Track your forecast submissions and approval status",
// // //       icon: CheckSquare,
// // //       path: "#approval-workflow",
// // //       gradient: "from-purple-500 to-purple-600",
// // //       hoverGradient: "hover:from-purple-600 hover:to-purple-700",
// // //       adminOnly: false,
// // //       badge: isAdmin ? "3 Pending" : "2 Submitted",
// // //       iconBg: "bg-purple-100",
// // //       iconColor: "text-purple-600",
// // //       futureScope: true, // Special flag for future scope items
// // //     },
// // //   ];

// // //   return (
// // //     <>
// // //       <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8">
// // //         <div className="flex items-center justify-between mb-6">
// // //           <div className="flex items-center gap-3">
// // //             <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
// // //               <Zap className="text-white" size={20} />
// // //             </div>
// // //             <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
// // //           </div>
// // //           <div className="text-sm text-slate-500">
// // //             {enhancedActions.length} available actions
// // //           </div>
// // //         </div>
// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //           {enhancedActions.map((action, index) => {
// // //             const IconComponent = action.icon;
// // //             return (
// // //               <div
// // //                 key={action.path}
// // //                 onClick={() => handleCardClick(action.path)}
// // //                 className="group relative bg-white/60 backdrop-blur-sm border border-white/40 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white/80 overflow-hidden"
// // //               >
// // //                 {/* Gradient Background */}
// // //                 <div
// // //                   className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
// // //                 ></div>

// // //                 <div className="relative">
// // //                   <div className="flex items-start justify-between mb-4">
// // //                     <div
// // //                       className={`p-3 rounded-xl ${action.iconBg} group-hover:scale-110 transition-transform duration-300`}
// // //                     >
// // //                       <IconComponent size={24} className={action.iconColor} />
// // //                     </div>
// // //                     <div className="flex items-center gap-2">
// // //                       {action.futureScope && (
// // //                         <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
// // //                           🚀 2 WEEKS
// // //                         </span>
// // //                       )}
// // //                       <ArrowRight
// // //                         className="opacity-0 group-hover:opacity-100 text-slate-400 group-hover:translate-x-1 transition-all duration-300"
// // //                         size={20}
// // //                       />
// // //                     </div>
// // //                   </div>

// // //                   <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-slate-800">
// // //                     {action.title}
// // //                   </h3>
// // //                   <p className="text-slate-600 text-sm mb-4 leading-relaxed">
// // //                     {action.description}
// // //                   </p>

// // //                   <div className="flex items-center justify-between">
// // //                     {action.count !== undefined && (
// // //                       <div className="flex items-center gap-2">
// // //                         <span className="text-2xl font-bold text-slate-800">
// // //                           {action.count}
// // //                         </span>
// // //                         <span className="text-sm text-slate-500">items</span>
// // //                       </div>
// // //                     )}
// // //                     {action.badge && (
// // //                       <span
// // //                         className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${action.gradient} text-white shadow-sm`}
// // //                       >
// // //                         {action.badge}
// // //                       </span>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             );
// // //           })}
// // //         </div>
// // //       </div>

// // //       {/* Forecast Approval Modal */}
// // //       {showApprovalModal && (
// // //         <div
// // //           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
// // //           onClick={(e) => {
// // //             // Close modal if clicking on backdrop
// // //             if (e.target === e.currentTarget) {
// // //               setShowApprovalModal(false);
// // //             }
// // //           }}
// // //         >
// // //           <div
// // //             className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-white/20"
// // //             onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
// // //           >
// // //             {/* Modal Header */}
// // //             <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white p-6">
// // //               <div className="flex items-center justify-between">
// // //                 <div className="flex items-center gap-3">
// // //                   <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
// // //                     <CheckSquare size={24} />
// // //                   </div>
// // //                   <div>
// // //                     <h2 className="text-2xl font-bold">
// // //                       {isAdmin
// // //                         ? "Forecast Approval Center"
// // //                         : "My Forecast Submissions"}
// // //                     </h2>
// // //                     <p className="text-purple-100 mt-1">
// // //                       {isAdmin
// // //                         ? "Manage and approve forecast submissions from your team"
// // //                         : "Track your forecast submissions and approval status"}
// // //                     </p>
// // //                   </div>
// // //                 </div>
// // //                 <div className="flex items-center gap-3">
// // //                   <span className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full font-medium border border-white/30">
// // //                     🚀 Future Scope - 2 Weeks
// // //                   </span>
// // //                   <button
// // //                     onClick={() => setShowApprovalModal(false)}
// // //                     className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/20 hover:scale-105"
// // //                     aria-label="Close modal"
// // //                   >
// // //                     <svg
// // //                       className="w-6 h-6"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       viewBox="0 0 24 24"
// // //                     >
// // //                       <path
// // //                         strokeLinecap="round"
// // //                         strokeLinejoin="round"
// // //                         strokeWidth={2}
// // //                         d="M6 18L18 6M6 6l12 12"
// // //                       />
// // //                     </svg>
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Modal Content */}
// // //             <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
// // //               <ForecastApprovalWorkflow
// // //                 userRole={isAdmin ? "admin" : "analyst"}
// // //               />
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </>
// // //   );
// // // };

// // // export default QuickActions;

// // // src/components/admin/QuickActions.jsx
// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Zap, ArrowRight, CheckSquare, BarChart3 } from "lucide-react";
// // import ForecastApprovalWorkflow from "./ForecastApprovalWorkflow";
// // import DetailedDashboard from "./DetailedDashboard"; // Import the detailed dashboard

// // const QuickActions = ({ stats, isAdmin, filteredActions }) => {
// //   const navigate = useNavigate();
// //   const [showApprovalModal, setShowApprovalModal] = useState(false);
// //   const [showDetailedDashboard, setShowDetailedDashboard] = useState(false);

// //   // Lock/unlock scroll when modal opens/closes
// //   React.useEffect(() => {
// //     if (showApprovalModal || showDetailedDashboard) {
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
// //   }, [showApprovalModal, showDetailedDashboard]);

// //   const handleCardClick = (path) => {
// //     if (path === "#approval-workflow") {
// //       setShowApprovalModal(true);
// //       return;
// //     }
// //     if (path === "#detailed-dashboard") {
// //       setShowDetailedDashboard(true);
// //       return;
// //     }
// //     console.log(`Navigating to: ${path}`);
// //     navigate(path);
// //   };

// //   // Add both Forecast Approval and Detailed Dashboard actions to the existing actions
// //   const enhancedActions = [
// //     ...filteredActions,
// //     {
// //       title: "Detailed Analytics",
// //       description: isAdmin
// //         ? "Access comprehensive user and product analytics with advanced metrics"
// //         : "View detailed performance analytics and product insights",
// //       icon: BarChart3,
// //       path: "#detailed-dashboard",
// //       gradient: "from-indigo-500 to-indigo-600",
// //       hoverGradient: "hover:from-indigo-600 hover:to-indigo-700",
// //       adminOnly: false,
// //       badge: `${stats.totalForecasts || 156} Forecasts`,
// //       iconBg: "bg-indigo-100",
// //       iconColor: "text-indigo-600",
// //     },
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

// //       {/* Detailed Dashboard Modal */}
// //       {showDetailedDashboard && (
// //         <div
// //           className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
// //           onClick={(e) => {
// //             // Close modal if clicking on backdrop
// //             if (e.target === e.currentTarget) {
// //               setShowDetailedDashboard(false);
// //             }
// //           }}
// //         >
// //           <div
// //             className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-white/20"
// //             onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
// //           >
// //             {/* Modal Header */}
// //             <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white p-6">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center gap-3">
// //                   <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
// //                     <BarChart3 size={24} />
// //                   </div>
// //                   <div>
// //                     <h2 className="text-2xl font-bold">
// //                       Detailed Analytics Dashboard
// //                     </h2>
// //                     <p className="text-indigo-100 mt-1">
// //                       Comprehensive user and product metrics with advanced
// //                       insights
// //                     </p>
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center gap-3">
// //                   <span className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full font-medium border border-white/30">
// //                     Live Data
// //                   </span>
// //                   <button
// //                     onClick={() => setShowDetailedDashboard(false)}
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
// //             <div className="p-6 max-h-[calc(95vh-120px)] overflow-y-auto">
// //               <DetailedDashboard />
// //             </div>
// //           </div>
// //         </div>
// //       )}

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
//     if (path === "#detailed-dashboard" && isAdmin) {
//       setShowDetailedDashboard(true);
//       return;
//     }
//     console.log(`Navigating to: ${path}`);
//     navigate(path);
//   };

//   // Add enhanced actions based on user role
//   const enhancedActions = [
//     ...filteredActions,
//     // Detailed Analytics - Admin Only
//     ...(isAdmin
//       ? [
//           {
//             title: "Detailed Analytics",
//             description:
//               "Access comprehensive user and product analytics with advanced metrics",
//             icon: BarChart3,
//             path: "#detailed-dashboard",
//             gradient: "from-indigo-500 to-indigo-600",
//             hoverGradient: "hover:from-indigo-600 hover:to-indigo-700",
//             adminOnly: true,
//             badge: `${stats.totalForecasts || 156} Forecasts`,
//             iconBg: "bg-indigo-100",
//             iconColor: "text-indigo-600",
//           },
//         ]
//       : []),
//     // Forecast Approval - Available to both roles
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

//       {/* Detailed Dashboard Modal - Admin Only */}
//       {showDetailedDashboard && isAdmin && (
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
import {
  Zap,
  ArrowRight,
  CheckSquare,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import ForecastApprovalWorkflow from "./ForecastApprovalWorkflow";
import DetailedDashboard from "./DetailedDashboard"; // Import the detailed dashboard

const QuickActions = ({ stats, isAdmin, filteredActions }) => {
  const navigate = useNavigate();
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDetailedDashboard, setShowDetailedDashboard] = useState(false);
  const [showAnalystMetrics, setShowAnalystMetrics] = useState(false);

  // Mock analyst metrics data - replace with actual API call
  const analystMetrics = {
    avgTimeSpent: "2h 15m",
    productsReviewed: 24,
    pendingProducts: 8,
    notReviewedProducts: 12,
  };

  // Lock/unlock scroll when modal opens/closes
  React.useEffect(() => {
    if (showApprovalModal || showDetailedDashboard || showAnalystMetrics) {
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
  }, [showApprovalModal, showDetailedDashboard, showAnalystMetrics]);

  const handleCardClick = (path) => {
    if (path === "#approval-workflow") {
      setShowApprovalModal(true);
      return;
    }
    if (path === "#detailed-dashboard" && isAdmin) {
      setShowDetailedDashboard(true);
      return;
    }
    if (path === "#analyst-metrics" && !isAdmin) {
      setShowAnalystMetrics(true);
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
      : [
          // Analyst Metrics - Analyst Only
          {
            title: "My Performance",
            description:
              "View your work metrics including time spent, products reviewed, and pending tasks",
            icon: BarChart3,
            path: "#analyst-metrics",
            gradient: "from-emerald-500 to-emerald-600",
            hoverGradient: "hover:from-emerald-600 hover:to-emerald-700",
            adminOnly: false,
            badge: `${analystMetrics.productsReviewed} Reviewed`,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
          },
        ]),
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
          <div className="text-sm text-slate-500">{enhancedActions.length}</div>
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
                        <span className="text-2xl font-bold text-slate-800"></span>
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

      {/* Analyst Metrics Modal - Analyst Only */}
      {showAnalystMetrics && !isAdmin && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAnalystMetrics(false);
            }
          }}
        >
          <div
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      My Performance Metrics
                    </h2>
                    <p className="text-emerald-100 mt-1">
                      Track your productivity and work analytics
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAnalystMetrics(false)}
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

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Average Time Spent */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        Average Time Spent
                      </h3>
                      <p className="text-sm text-blue-600">
                        Per product review
                      </p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {analystMetrics.avgTimeSpent}
                  </div>
                  <p className="text-sm text-blue-600">Daily average</p>
                </div>

                {/* Products Reviewed */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">
                        Products Reviewed
                      </h3>
                      <p className="text-sm text-green-600">This month</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-900 mb-2">
                    {analystMetrics.productsReviewed}
                  </div>
                  <p className="text-sm text-green-600">Completed reviews</p>
                </div>

                {/* Pending Products */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-orange-900">
                        Pending Products
                      </h3>
                      <p className="text-sm text-orange-600">Awaiting review</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-orange-900 mb-2">
                    {analystMetrics.pendingProducts}
                  </div>
                  <p className="text-sm text-orange-600">Need attention</p>
                </div>

                {/* Not Reviewed Products */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-500 rounded-lg">
                      <XCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-900">
                        Not Reviewed
                      </h3>
                      <p className="text-sm text-red-600">Remaining tasks</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-red-900 mb-2">
                    {analystMetrics.notReviewedProducts}
                  </div>
                  <p className="text-sm text-red-600">Backlog items</p>
                </div>
              </div>

              {/* Summary Section */}
              <div className="mt-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">
                  Performance Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {Math.round(
                        (analystMetrics.productsReviewed /
                          (analystMetrics.productsReviewed +
                            analystMetrics.pendingProducts +
                            analystMetrics.notReviewedProducts)) *
                          100
                      )}
                      %
                    </div>
                    <div className="text-slate-600">Completion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analystMetrics.productsReviewed +
                        analystMetrics.pendingProducts +
                        analystMetrics.notReviewedProducts}
                    </div>
                    <div className="text-slate-600">Total Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((analystMetrics.productsReviewed / 30) * 10) /
                        10}
                    </div>
                    <div className="text-slate-600">Daily Average</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
