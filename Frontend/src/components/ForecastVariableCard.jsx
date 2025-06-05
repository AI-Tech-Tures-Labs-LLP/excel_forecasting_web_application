// // ForecastVariableCard.jsx
// import React, { useState } from "react";
// import {
//   Clock,
//   Calendar,
//   BarChart3,
//   TrendingDown,
//   AlertTriangle,
//   TrendingUp,
//   Package,
//   Box,
//   Settings,
//   Building2,
//   MapPin,
//   Gem,
//   Star,
//   ShoppingCart,
//   Percent,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Info,
//   X,
//   Calculator,
//   Target,
// } from "lucide-react";

// // Modal Components
// const RequiredQuantityModal = ({ data, onClose }) => (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
//       {/* Modal Header */}
//       <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-white/10 rounded-lg">
//             <Calculator className="text-white" size={24} />
//           </div>
//           <h2 className="text-xl font-bold text-white">
//             Required EOH Quantity Calculation
//           </h2>
//         </div>
//         <button
//           onClick={onClose}
//           className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//         >
//           <X className="text-white" size={24} />
//         </button>
//       </div>

//       {/* Modal Content */}
//       <div className="p-6">
//         <div className="space-y-6">
//           {/* Header Information */}
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
//               <Calendar className="text-blue-600" size={18} />
//               {data.forecastType.toUpperCase()} Forecast - {data.forecastMonth}
//             </h3>
//             <p className="text-sm text-gray-600">
//               Required EOH Quantity for Lead guideline month calculation
//             </p>
//           </div>

//           {/* Formula Display */}
//           <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//             <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
//               <Calculator className="text-gray-600" size={16} />
//               Calculation Formula
//             </h4>
//             <div className="bg-white rounded-lg p-4 border border-gray-300 font-mono text-sm text-gray-700">
//               Required EOH for {data.forecastMonth} = KPI Door Count + Average
//               COM EOM OH + FLDC
//             </div>
//           </div>

//           {/* Component Values */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="p-2 bg-blue-50 rounded-lg">
//                   <Building2 className="text-blue-600" size={16} />
//                 </div>
//                 <h5 className="text-sm font-semibold text-gray-700">
//                   KPI Door Count
//                 </h5>
//               </div>
//               <div className="text-2xl font-bold text-blue-600">
//                 {data.kpiDoorCount?.toLocaleString() || "0"}
//               </div>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="p-2 bg-green-50 rounded-lg">
//                   <Package className="text-green-600" size={16} />
//                 </div>
//                 <h5 className="text-sm font-semibold text-gray-700">
//                   Average COM EOM OH
//                 </h5>
//               </div>
//               <div className="text-2xl font-bold text-green-600">
//                 {data.avgComEOMOH?.toLocaleString() || "0"}
//               </div>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="p-2 bg-purple-50 rounded-lg">
//                   <MapPin className="text-purple-600" size={16} />
//                 </div>
//                 <h5 className="text-sm font-semibold text-gray-700">FLDC</h5>
//               </div>
//               <div className="text-2xl font-bold text-purple-600">
//                 {data.fldc?.toLocaleString() || "0"}
//               </div>
//             </div>
//           </div>

//           {/* Calculation Steps */}
//           <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
//             <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
//               <Target className="text-amber-600" size={16} />
//               Calculation Steps
//             </h4>
//             <div className="space-y-2 text-sm">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">KPI Door Count:</span>
//                 <span className="font-medium">
//                   {data.kpiDoorCount?.toLocaleString() || "0"}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">+ Average COM EOM OH:</span>
//                 <span className="font-medium">
//                   {data.avgComEOMOH?.toLocaleString() || "0"}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">+ FLDC:</span>
//                 <span className="font-medium">
//                   {data.fldc?.toLocaleString() || "0"}
//                 </span>
//               </div>
//               <hr className="border-gray-300" />
//               <div className="flex items-center justify-between text-lg font-bold">
//                 <span className="text-gray-800">
//                   Required EOH for {data.forecastMonth}:
//                 </span>
//                 <span className="text-indigo-600">
//                   {(
//                     (data.kpiDoorCount || 0) +
//                     (data.avgComEOMOH || 0) +
//                     (data.fldc || 0)
//                   ).toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Generic Modal for other variables
// const GenericVariableModal = ({ data, onClose }) => (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-white/10 rounded-lg">
//             <Info className="text-white" size={24} />
//           </div>
//           <h2 className="text-xl font-bold text-white">Variable Information</h2>
//         </div>
//         <button
//           onClick={onClose}
//           className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//         >
//           <X className="text-white" size={24} />
//         </button>
//       </div>
//       <div className="p-6">
//         <div className="space-y-4">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">
//               {data.label}
//             </h3>
//             <p className="text-gray-600 text-sm mb-4">
//               {data.forecastType.toUpperCase()} Forecast Variable
//             </p>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <span className="text-gray-600">Current Value:</span>
//               <span className="font-bold text-lg text-gray-900">
//                 {data.value}
//               </span>
//             </div>
//           </div>
//           <div className="bg-blue-50 rounded-lg p-4">
//             <p className="text-sm text-gray-700">
//               This variable is part of the {data.forecastType} forecast
//               calculations. Click on other variables to see their detailed
//               breakdowns and calculations.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Variable Card Configuration
// const getVariableConfig = (type) => {
//   const baseConfig = [
//     { key: "lead_time", label: "Lead Time", icon: Clock },
//     {
//       key: "leadtime_holiday_adjustment",
//       label: "Country Holiday",
//       type: "boolean",
//       icon: Calendar,
//     },
//     { key: "month_12_fc_index", label: "12-Month FC Index", icon: BarChart3 },
//     { key: "loss", label: "Loss (%)", icon: TrendingDown },
//     {
//       key: "month_12_fc_index_loss",
//       label: "12-Month FC Index (Loss %)",
//       icon: AlertTriangle,
//     },
//     {
//       key: "selected_months",
//       label: "STD Months",
//       type: "array",
//       icon: Calendar,
//     },
//     { key: "trend", label: "Trend", type: "percentage", icon: TrendingUp },
//     {
//       key: "inventory_maintained",
//       label: "Inventory Maintained",
//       type: "boolean",
//       icon: Package,
//     },
//     {
//       key: "trend_index_difference",
//       label: "Trend Index Difference",
//       icon: BarChart3,
//     },
//     { key: "red_box_item", label: "Red Box Item", type: "boolean", icon: Box },
//     { key: "forecasting_method", label: "Forecasting Method", icon: Settings },
//     { key: "door_count", label: "Door Count", icon: Building2 },
//     { key: "average_com_oh", label: "Average Com OH", icon: Package },
//     { key: "fldc", label: "FLDC", icon: MapPin },
//     { key: "birthstone", label: "Birthstone", icon: Gem },
//     { key: "birthstone_month", label: "Birthstone Month", icon: Calendar },
//     {
//       key: "considered_birthstone_required_quantity",
//       label: "Considered Birthstone",
//       type: "boolean",
//       icon: Gem,
//     },
//     { key: "forecast_month", label: "Forecast Month", icon: Calendar },
//     {
//       key: "forecast_month_required_quantity",
//       label: "Forecast Month - Required Qty",
//       icon: Package,
//       clickable: true,
//       modalType: "required_quantity",
//     },
//     {
//       key: "forecast_month_planned_oh",
//       label: "Forecast Month - Planned OH",
//       icon: Package,
//     },
//     {
//       key: "next_forecast_month",
//       label: "Next Forecast Month",
//       icon: Calendar,
//     },
//     {
//       key: "next_forecast_month_required_quantity",
//       label: "Next Forecast Month - Required Qty",
//       icon: Package,
//       clickable: true,
//       modalType: "required_quantity",
//     },
//     {
//       key: "next_forecast_month_planned_oh",
//       label: "Next Forecast Month - Planned OH",
//       icon: Package,
//     },
//     {
//       key: "forecast_month_planned_shipment",
//       label: "Forecast Month - Planned Shipment",
//       icon: Package,
//     },
//     {
//       key: "next_forecast_month_planned_shipment",
//       label: "Next Forecast Month - Planned Shipment",
//       icon: Package,
//     },
//     {
//       key: "qty_added_to_maintain_OH_forecast_month",
//       label: "Forecast Month - Qty Added",
//       icon: Package,
//     },
//     {
//       key: "qty_added_to_maintain_OH_next_forecast_month",
//       label: "Next Forecast Month - Qty Added",
//       icon: Package,
//     },
//     {
//       key: "qty_added_to_balance_SOQ_forecast_month",
//       label: "Macys SOQ - Qty Added",
//       icon: Star,
//     },
//     { key: "total_added_qty", label: "Total Added Qty", icon: Package },
//     { key: "Min_order", label: "Min Order", icon: ShoppingCart },
//     {
//       key: "average_store_sale_thru",
//       label: "Average Store SellThru",
//       type: "percentage",
//       icon: TrendingUp,
//     },
//     { key: "Macys_SOQ", label: "Macys SOQ - Total", icon: Star },
//     {
//       key: "macy_SOQ_percentage",
//       label: "Macys SOQ - Percentage Required",
//       type: "percentage",
//       icon: Percent,
//     },
//     {
//       key: "Qty_given_to_macys",
//       label: "Macys SOQ - Actual Given",
//       icon: Star,
//     },
//     {
//       key: "Below_min_order",
//       label: "Below Min Order",
//       type: "boolean",
//       icon: AlertTriangle,
//     },
//     {
//       key: "Over_macys_SOQ",
//       label: "Over Macys SOQ",
//       type: "boolean",
//       icon: AlertTriangle,
//     },
//     {
//       key: "Added_only_to_balance_macys_SOQ",
//       label: "Macys SOQ - Only Maintained",
//       type: "boolean",
//       icon: CheckCircle,
//     },
//     {
//       key: "Need_to_review_first",
//       label: "Needs Review",
//       type: "boolean",
//       icon: AlertCircle,
//     },
//   ];

//   const typeSpecific = {
//     store: [],
//     com: [
//       {
//         key: "com_month_12_fc_index",
//         label: "COM 12-Month FC Index",
//         icon: BarChart3,
//       },
//       {
//         key: "com_trend",
//         label: "COM Trend",
//         type: "percentage",
//         icon: TrendingUp,
//       },
//       {
//         key: "minimum_required_oh_for_com",
//         label: "Min Required OH for COM",
//         icon: Package,
//       },
//       {
//         key: "vdf_status",
//         label: "VDF Status",
//         type: "boolean",
//         icon: CheckCircle,
//       },
//       { key: "vdf_added_qty", label: "VDF Added Qty", icon: Package },
//     ],
//     omni: [
//       {
//         key: "com_month_12_fc_index",
//         label: "COM 12-Month FC Index",
//         icon: BarChart3,
//       },
//       {
//         key: "com_trend",
//         label: "COM Trend",
//         type: "percentage",
//         icon: TrendingUp,
//       },
//       {
//         key: "com_inventory_maintained",
//         label: "COM Inventory Maintained",
//         type: "boolean",
//         icon: CheckCircle,
//       },
//       {
//         key: "minimum_required_oh_for_com",
//         label: "Min Required OH for COM",
//         icon: Package,
//       },
//       { key: "com_fldc", label: "COM FLDC", icon: MapPin },
//       {
//         key: "store_month_12_fc_index",
//         label: "Store 12-Month FC Index",
//         icon: BarChart3,
//       },
//       {
//         key: "store_month_12_fc_index_loss",
//         label: "Store 12-Month FC Index Loss",
//         icon: AlertTriangle,
//       },
//       {
//         key: "store_trend",
//         label: "Store Trend",
//         type: "percentage",
//         icon: TrendingUp,
//       },
//       {
//         key: "store_inventory_maintained",
//         label: "Store Inventory Maintained",
//         type: "boolean",
//         icon: CheckCircle,
//       },
//       { key: "store_fldc", label: "Store FLDC", icon: MapPin },
//       {
//         key: "trend_index_difference_com",
//         label: "Trend Index Diff (COM)",
//         icon: BarChart3,
//       },
//       {
//         key: "trend_index_difference_store",
//         label: "Trend Index Diff (Store)",
//         icon: BarChart3,
//       },
//       {
//         key: "forecasting_method_com",
//         label: "Forecasting Method (COM)",
//         icon: Settings,
//       },
//       {
//         key: "forecasting_method_store",
//         label: "Forecasting Method (Store)",
//         icon: Settings,
//       },
//       {
//         key: "forecast_month_required_quantity_total",
//         label: "Total Req Qty (Forecast Month)",
//         icon: Package,
//         clickable: true,
//         modalType: "required_quantity",
//       },
//       {
//         key: "next_forecast_month_required_quantity_total",
//         label: "Total Req Qty (Next Month)",
//         icon: Package,
//         clickable: true,
//         modalType: "required_quantity",
//       },
//     ],
//   };

//   return [...baseConfig, ...(typeSpecific[type] || [])];
// };

// // Format value utility
// const formatVariableValue = (value, config) => {
//   if (value === null || value === undefined) return "-";

//   switch (config.type) {
//     case "boolean":
//       return value ? "Yes" : "No";
//     case "array":
//       return Array.isArray(value) ? value.join(", ") : value;
//     case "percentage":
//       return typeof value === "number"
//         ? `${(value * 100).toFixed(2)}%`
//         : `${value}%`;
//     default:
//       const formattedValue =
//         typeof value === "number" ? value.toLocaleString() : value;
//       return config.suffix
//         ? `${formattedValue}${config.suffix}`
//         : formattedValue;
//   }
// };

// // Individual Variable Card Component
// const VariableCard = ({
//   variable,
//   value,
//   bgColor,
//   iconColor,
//   forecastData,
//   forecastType,
// }) => {
//   const [showModal, setShowModal] = useState(false);
//   const IconComponent = variable.icon || Info;

//   const handleCardClick = () => {
//     if (!variable.clickable) return;

//     if (variable.modalType === "required_quantity") {
//       const forecastMonth = variable.key.includes("next")
//         ? forecastData.next_forecast_month
//         : forecastData.forecast_month;

//       const modalData = {
//         forecastType,
//         forecastMonth,
//         kpiDoorCount: forecastData?.door_count || 0,
//         avgComEOMOH: forecastData?.average_com_oh || 0,
//         fldc: forecastData?.fldc || 0,
//         requiredQty: variable.key.includes("next")
//           ? forecastData?.next_forecast_month_required_quantity || 0
//           : forecastData?.forecast_month_required_quantity || 0,
//       };

//       setShowModal({ type: "required_quantity", data: modalData });
//     } else {
//       // Generic modal for other variables
//       const modalData = {
//         label: variable.label,
//         value: formatVariableValue(value, variable),
//         forecastType,
//         key: variable.key,
//       };

//       setShowModal({ type: "generic", data: modalData });
//     }
//   };

//   return (
//     <>
//       <div
//         className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
//           variable.clickable
//             ? "cursor-pointer hover:border-blue-300 hover:scale-105"
//             : ""
//         }`}
//         onClick={handleCardClick}
//       >
//         <div className="p-4">
//           <div className="flex items-center gap-2 mb-3">
//             <div className={`p-1.5 ${bgColor} rounded-md`}>
//               <IconComponent className={iconColor} size={14} />
//             </div>
//             <span className="text-xs font-medium text-gray-600 leading-tight">
//               {variable.label}
//             </span>
//             {variable.clickable && (
//               <div className="ml-auto">
//                 <Info className="text-blue-500" size={12} />
//               </div>
//             )}
//           </div>
//           <div className="text-sm font-bold text-gray-900">
//             {variable.key === "trend_index_difference" ||
//             variable.key === "loss"
//               ? `${formatVariableValue(value, variable)}%`
//               : formatVariableValue(value, variable)}
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {showModal && showModal.type === "required_quantity" && (
//         <RequiredQuantityModal
//           data={showModal.data}
//           onClose={() => setShowModal(false)}
//         />
//       )}

//       {showModal && showModal.type === "generic" && (
//         <GenericVariableModal
//           data={showModal.data}
//           onClose={() => setShowModal(false)}
//         />
//       )}
//     </>
//   );
// };

// // Main Forecast Variables Cards Component
// const ForecastVariableCards = ({ productData }) => {
//   if (!productData) return null;

//   const { store_forecast, com_forecast, omni_forecast } = productData;

//   const renderForecastCards = (
//     forecastData,
//     type,
//     title,
//     bgColor,
//     iconColor,
//     Icon
//   ) => {
//     if (!forecastData || !forecastData[0]) return null;

//     const data = forecastData[0];
//     const variables = getVariableConfig(type);

//     return (
//       <div className="mb-8">
//         <div className="flex items-center gap-3 mb-4">
//           <div className={`p-2 ${bgColor} rounded-lg`}>
//             <Icon className={iconColor} size={20} />
//           </div>
//           <h5 className="text-lg font-semibold text-gray-800">{title}</h5>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {variables.map((variable) => {
//             const value = data[variable.key];

//             return (
//               <VariableCard
//                 key={variable.key}
//                 variable={variable}
//                 value={value}
//                 bgColor={bgColor}
//                 iconColor={iconColor}
//                 forecastData={data}
//                 forecastType={type}
//               />
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {store_forecast &&
//         store_forecast.length > 0 &&
//         renderForecastCards(
//           store_forecast,
//           "store",
//           "Store Forecast Variables",
//           "bg-blue-50",
//           "text-blue-600",
//           Building2
//         )}

//       {com_forecast &&
//         com_forecast.length > 0 &&
//         renderForecastCards(
//           com_forecast,
//           "com",
//           "COM Forecast Variables",
//           "bg-green-50",
//           "text-green-600",
//           ShoppingCart
//         )}

//       {omni_forecast &&
//         omni_forecast.length > 0 &&
//         renderForecastCards(
//           omni_forecast,
//           "omni",
//           "Omni Forecast Variables",
//           "bg-purple-50",
//           "text-purple-600",
//           Package
//         )}
//     </div>
//   );
// };

// export default ForecastVariableCards;

// // ForecastVariableCard.jsx
// import React, { useState } from "react";
// import {
//   Clock,
//   Calendar,
//   BarChart3,
//   TrendingDown,
//   AlertTriangle,
//   TrendingUp,
//   Package,
//   Box,
//   Settings,
//   Building2,
//   MapPin,
//   Gem,
//   Star,
//   ShoppingCart,
//   Percent,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Info,
//   X,
//   Calculator,
//   Target,
//   Truck,
// } from "lucide-react";

// // Modal Components
// const RequiredQuantityModal = ({ data, onClose }) => (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
//       {/* Modal Header */}
//       <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-white/10 rounded-lg">
//             <Calculator className="text-white" size={24} />
//           </div>
//           <h2 className="text-xl font-bold text-white">
//             Required EOH Quantity for Lead Guideline Month
//           </h2>
//         </div>
//         <button
//           onClick={onClose}
//           className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//         >
//           <X className="text-white" size={24} />
//         </button>
//       </div>

//       {/* Modal Content */}
//       <div className="p-6">
//         <div className="space-y-6">
//           {/* Formula Display */}
//           <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//             <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
//               <Calculator className="text-gray-600" size={16} />
//               Calculation Formula
//             </h4>
//             <div className="bg-white rounded-lg p-4 border border-gray-300 font-mono text-sm text-gray-700">
//               KPI Door Count + Average COM EOM OH + FLDC
//             </div>
//           </div>

//           {/* Component Values */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="p-2 bg-blue-50 rounded-lg">
//                   <Building2 className="text-blue-600" size={16} />
//                 </div>
//                 <h5 className="text-sm font-semibold text-gray-700">
//                   KPI Door Count
//                 </h5>
//               </div>
//               <div className="text-2xl font-bold text-blue-600">
//                 {data.kpiDoorCount?.toLocaleString() || "0"}
//               </div>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="p-2 bg-green-50 rounded-lg">
//                   <Package className="text-green-600" size={16} />
//                 </div>
//                 <h5 className="text-sm font-semibold text-gray-700">
//                   Average COM EOM OH
//                 </h5>
//               </div>
//               <div className="text-2xl font-bold text-green-600">
//                 {data.avgComEOMOH?.toLocaleString() || "0"}
//               </div>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="p-2 bg-purple-50 rounded-lg">
//                   <MapPin className="text-purple-600" size={16} />
//                 </div>
//                 <h5 className="text-sm font-semibold text-gray-700">FLDC</h5>
//               </div>
//               <div className="text-2xl font-bold text-purple-600">
//                 {data.fldc?.toLocaleString() || "0"}
//               </div>
//             </div>
//           </div>

//           {/* Calculation Steps */}
//           <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
//             <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
//               <Target className="text-amber-600" size={16} />
//               Calculation
//             </h4>
//             <div className="space-y-2 text-sm">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">KPI Door Count:</span>
//                 <span className="font-medium">
//                   {data.kpiDoorCount?.toLocaleString() || "0"}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">+ Average COM EOM OH:</span>
//                 <span className="font-medium">
//                   {data.avgComEOMOH?.toLocaleString() || "0"}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">+ FLDC:</span>
//                 <span className="font-medium">
//                   {data.fldc?.toLocaleString() || "0"}
//                 </span>
//               </div>
//               <hr className="border-gray-300" />
//               <div className="flex items-center justify-between text-lg font-bold">
//                 <span className="text-gray-800">
//                   Required EOH for {data.forecastMonth}:
//                 </span>
//                 <span className="text-indigo-600">
//                   {(
//                     (data.kpiDoorCount || 0) +
//                     (data.avgComEOMOH || 0) +
//                     (data.fldc || 0)
//                   ).toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Generic Modal for other variables
// const GenericVariableModal = ({ data, onClose }) => (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-white/10 rounded-lg">
//             <Info className="text-white" size={24} />
//           </div>
//           <h2 className="text-xl font-bold text-white">Variable Information</h2>
//         </div>
//         <button
//           onClick={onClose}
//           className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//         >
//           <X className="text-white" size={24} />
//         </button>
//       </div>
//       <div className="p-6">
//         <div className="space-y-4">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">
//               {data.label}
//             </h3>
//             <p className="text-gray-600 text-sm mb-4">
//               {data.forecastType.toUpperCase()} Forecast Variable
//             </p>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <span className="text-gray-600">Current Value:</span>
//               <span className="font-bold text-lg text-gray-900">
//                 {data.value}
//               </span>
//             </div>
//           </div>
//           <div className="bg-blue-50 rounded-lg p-4">
//             <p className="text-sm text-gray-700">
//               This variable is part of the {data.forecastType} forecast
//               calculations. Click on other variables to see their detailed
//               breakdowns and calculations.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Dynamic Variable Configuration - Creates cards for ALL fields in the data
// const getDynamicVariableConfig = (data) => {
//   // Fields to exclude from displaying (meta fields)
//   const excludeFields = ["id", "category", "pid"];

//   // Get all keys from the data object
//   const allKeys = Object.keys(data).filter(
//     (key) => !excludeFields.includes(key)
//   );

//   // Create variable config for each field dynamically
//   return allKeys.map((key) => {
//     const value = data[key];
//     const config = {
//       key,
//       label: formatFieldName(key),
//       icon: getIconForField(key, value),
//       type: getFieldType(value),
//     };

//     // Add special properties for specific fields
//     if (key.includes("forecast_month_required_quantity")) {
//       config.clickable = true;
//       config.modalType = "required_quantity";
//     }

//     return config;
//   });
// };

// // Helper function to format field names into readable labels
// const formatFieldName = (key) => {
//   return key
//     .split("_")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ")
//     .replace(/([A-Z])/g, " $1")
//     .replace(/\s+/g, " ")
//     .trim();
// };

// // Helper function to determine field type based on value
// const getFieldType = (value) => {
//   if (typeof value === "boolean") return "boolean";
//   if (Array.isArray(value)) return "array";
//   if (typeof value === "number" && value >= 0 && value <= 1)
//     return "percentage";
//   return "default";
// };

// // Helper function to get appropriate icon for field
// const getIconForField = (key, value) => {
//   const keyLower = key.toLowerCase();

//   // Time related
//   if (keyLower.includes("time") || keyLower.includes("lead")) return Clock;
//   if (
//     keyLower.includes("month") ||
//     keyLower.includes("date") ||
//     keyLower.includes("holiday")
//   )
//     return Calendar;

//   // Quantity/Package related
//   if (
//     keyLower.includes("qty") ||
//     keyLower.includes("quantity") ||
//     keyLower.includes("shipment") ||
//     keyLower.includes("order")
//   )
//     return Package;
//   if (keyLower.includes("oh") || keyLower.includes("inventory")) return Box;

//   // Financial/Performance
//   if (
//     keyLower.includes("trend") ||
//     keyLower.includes("index") ||
//     keyLower.includes("fc")
//   )
//     return BarChart3;
//   if (keyLower.includes("loss") || keyLower.includes("diff"))
//     return TrendingDown;
//   if (
//     keyLower.includes("sale") ||
//     keyLower.includes("sell") ||
//     keyLower.includes("thru")
//   )
//     return TrendingUp;
//   if (keyLower.includes("macys") || keyLower.includes("soq")) return Star;
//   if (keyLower.includes("percentage") || keyLower.includes("percent"))
//     return Percent;

//   // Location/Structure
//   if (keyLower.includes("door") || keyLower.includes("count")) return Building2;
//   if (keyLower.includes("fldc") || keyLower.includes("location")) return MapPin;

//   // Product attributes
//   if (keyLower.includes("birthstone") || keyLower.includes("gem")) return Gem;
//   if (keyLower.includes("forecast") || keyLower.includes("method"))
//     return Settings;
//   if (keyLower.includes("vendor") || keyLower.includes("supplier"))
//     return Truck;

//   // Status/Flags
//   if (typeof value === "boolean") {
//     if (keyLower.includes("review") || keyLower.includes("need"))
//       return AlertCircle;
//     if (
//       keyLower.includes("over") ||
//       keyLower.includes("below") ||
//       keyLower.includes("error")
//     )
//       return AlertTriangle;
//     if (
//       keyLower.includes("maintained") ||
//       keyLower.includes("status") ||
//       keyLower.includes("added")
//     )
//       return CheckCircle;
//     if (keyLower.includes("box") || keyLower.includes("item")) return Box;
//     return CheckCircle;
//   }

//   // Default icon
//   return Info;
// };

// // Format value utility
// const formatVariableValue = (value, config) => {
//   if (value === null || value === undefined) return "-";

//   switch (config.type) {
//     case "boolean":
//       return value ? "Yes" : "No";
//     case "array":
//       return Array.isArray(value) ? value.join(", ") : value;
//     case "percentage":
//       return typeof value === "number"
//         ? `${(value * 100).toFixed(2)}%`
//         : `${value}%`;
//     default:
//       const formattedValue =
//         typeof value === "number" ? value.toLocaleString() : value;
//       return config.suffix
//         ? `${formattedValue}${config.suffix}`
//         : formattedValue;
//   }
// };

// // Individual Variable Card Component
// const VariableCard = ({
//   variable,
//   value,
//   bgColor,
//   iconColor,
//   forecastData,
//   forecastType,
// }) => {
//   const [showModal, setShowModal] = useState(false);
//   const IconComponent = variable.icon || Info;

//   const handleCardClick = () => {
//     if (!variable.clickable) return;

//     if (variable.modalType === "required_quantity") {
//       const forecastMonth = variable.key.includes("next")
//         ? forecastData.next_forecast_month
//         : forecastData.forecast_month;

//       const modalData = {
//         forecastType,
//         forecastMonth,
//         kpiDoorCount: forecastData?.door_count || 0,
//         avgComEOMOH: forecastData?.average_com_oh || 0,
//         fldc: forecastData?.fldc || 0,
//         requiredQty: variable.key.includes("next")
//           ? forecastData?.next_forecast_month_required_quantity || 0
//           : forecastData?.forecast_month_required_quantity || 0,
//       };

//       setShowModal({ type: "required_quantity", data: modalData });
//     } else {
//       // Generic modal for other variables
//       const modalData = {
//         label: variable.label,
//         value: formatVariableValue(value, variable),
//         forecastType,
//         key: variable.key,
//       };

//       setShowModal({ type: "generic", data: modalData });
//     }
//   };

//   return (
//     <>
//       <div
//         className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
//           variable.clickable
//             ? "cursor-pointer hover:border-blue-300 hover:scale-105"
//             : ""
//         }`}
//         onClick={handleCardClick}
//       >
//         <div className="p-4">
//           <div className="flex items-center gap-2 mb-3">
//             <div className={`p-1.5 ${bgColor} rounded-md`}>
//               <IconComponent className={iconColor} size={14} />
//             </div>
//             <span className="text-xs font-medium text-gray-600 leading-tight">
//               {variable.label}
//             </span>
//             {variable.clickable && (
//               <div className="ml-auto">
//                 <Info className="text-blue-500" size={12} />
//               </div>
//             )}
//           </div>
//           <div className="text-sm font-bold text-gray-900">
//             {variable.key === "trend_index_difference" ||
//             variable.key === "loss"
//               ? `${formatVariableValue(value, variable)}%`
//               : formatVariableValue(value, variable)}
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {showModal && showModal.type === "required_quantity" && (
//         <RequiredQuantityModal
//           data={showModal.data}
//           onClose={() => setShowModal(false)}
//         />
//       )}

//       {showModal && showModal.type === "generic" && (
//         <GenericVariableModal
//           data={showModal.data}
//           onClose={() => setShowModal(false)}
//         />
//       )}
//     </>
//   );
// };

// // Main Forecast Variables Cards Component
// const ForecastVariableCards = ({ productData }) => {
//   // Debug logging
//   console.log("ForecastVariableCards received productData:", productData);

//   if (!productData) {
//     return (
//       <div className="text-center py-8 bg-gray-50 rounded-xl">
//         <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//         <p className="text-gray-600">No product data available</p>
//       </div>
//     );
//   }

//   const { store_forecast, com_forecast, omni_forecast } = productData;

//   // Debug logging for each forecast type
//   console.log("Store forecast data:", store_forecast);
//   console.log("COM forecast data:", com_forecast);
//   console.log("Omni forecast data:", omni_forecast);

//   // Check which forecast types have data
//   const hasStoreData = store_forecast && store_forecast.length > 0;
//   const hasComData = com_forecast && com_forecast.length > 0;
//   const hasOmniData = omni_forecast && omni_forecast.length > 0;

//   console.log(
//     "Data availability - Store:",
//     hasStoreData,
//     "COM:",
//     hasComData,
//     "Omni:",
//     hasOmniData
//   );

//   // If no forecast data exists
//   if (!hasStoreData && !hasComData && !hasOmniData) {
//     return (
//       <div className="text-center py-8 bg-gray-50 rounded-xl">
//         <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
//         <p className="text-gray-600">
//           No forecast variables available for this product
//         </p>
//         <p className="text-gray-500 text-sm mt-2">
//           This product may not have been processed through the forecasting
//           system yet.
//         </p>
//         <div className="mt-4 p-4 bg-white rounded border text-left">
//           <h4 className="font-semibold text-gray-700 mb-2">Debug Info:</h4>
//           <div className="text-xs text-gray-600 space-y-1">
//             <div>Store forecast: {JSON.stringify(store_forecast)}</div>
//             <div>COM forecast: {JSON.stringify(com_forecast)}</div>
//             <div>Omni forecast: {JSON.stringify(omni_forecast)}</div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const renderForecastCards = (
//     forecastData,
//     type,
//     title,
//     bgColor,
//     iconColor,
//     Icon
//   ) => {
//     if (!forecastData || !forecastData[0]) {
//       console.log(`No data for ${type} forecast:`, forecastData);
//       return null;
//     }

//     const data = forecastData[0];
//     console.log(`${type.toUpperCase()} forecast data:`, data);

//     // Use dynamic variable configuration instead of predefined ones
//     const variables = getDynamicVariableConfig(data);
//     console.log(
//       `Dynamic variables for ${type}:`,
//       variables.map((v) => ({ key: v.key, label: v.label, value: data[v.key] }))
//     );

//     return (
//       <div className="mb-8">
//         <div className="flex items-center gap-3 mb-4">
//           <div className={`p-2 ${bgColor} rounded-lg`}>
//             <Icon className={iconColor} size={20} />
//           </div>
//           <h5 className="text-lg font-semibold text-gray-800">{title}</h5>
//           <div className="ml-auto">
//             <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
//               {variables.length} Variables
//             </span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {variables.map((variable) => {
//             const value = data[variable.key];

//             return (
//               <VariableCard
//                 key={variable.key}
//                 variable={variable}
//                 value={value}
//                 bgColor={bgColor}
//                 iconColor={iconColor}
//                 forecastData={data}
//                 forecastType={type}
//               />
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Product Type Summary */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 mb-6">
//         <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
//           <Info className="text-blue-600" size={18} />
//           Forecast Type Summary
//         </h4>
//         <div className="flex items-center gap-4 text-sm">
//           <div
//             className={`flex items-center gap-2 ${
//               hasStoreData ? "text-blue-600" : "text-gray-400"
//             }`}
//           >
//             <Building2 size={16} />
//             <span className="font-medium">
//               Store: {hasStoreData ? "Available" : "Not Available"}
//             </span>
//           </div>
//           <div
//             className={`flex items-center gap-2 ${
//               hasComData ? "text-green-600" : "text-gray-400"
//             }`}
//           >
//             <ShoppingCart size={16} />
//             <span className="font-medium">
//               COM: {hasComData ? "Available" : "Not Available"}
//             </span>
//           </div>
//           <div
//             className={`flex items-center gap-2 ${
//               hasOmniData ? "text-purple-600" : "text-gray-400"
//             }`}
//           >
//             <Package size={16} />
//             <span className="font-medium">
//               Omni: {hasOmniData ? "Available" : "Not Available"}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Render only the forecast types that have data */}
//       {hasStoreData &&
//         renderForecastCards(
//           store_forecast,
//           "store",
//           "Store Forecast Variables",
//           "bg-blue-50",
//           "text-blue-600",
//           Building2
//         )}

//       {hasComData &&
//         renderForecastCards(
//           com_forecast,
//           "com",
//           "COM Forecast Variables",
//           "bg-green-50",
//           "text-green-600",
//           ShoppingCart
//         )}

//       {hasOmniData &&
//         renderForecastCards(
//           omni_forecast,
//           "omni",
//           "Omni Forecast Variables",
//           "bg-purple-50",
//           "text-purple-600",
//           Package
//         )}
//     </div>
//   );
// };

// export default ForecastVariableCards;
// ForecastVariableCard.jsx
// import React, { useState } from "react";
// import {
//   Clock,
//   Calendar,
//   BarChart3,
//   TrendingDown,
//   AlertTriangle,
//   TrendingUp,
//   Package,
//   Box,
//   Settings,
//   Building2,
//   MapPin,
//   Gem,
//   Star,
//   ShoppingCart,
//   Percent,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Info,
//   X,
//   Calculator,
//   Target,
//   Truck,
// } from "lucide-react";

// // Modal Components
// const RequiredQuantityModal = ({ data, onClose }) => {
//   // Check if this is for next forecast month (exclude FLDC)
//   const isNextMonth = data.isNextMonth || false;
//   const formula = isNextMonth
//     ? "KPI Door Count + Average COM EOM OH"
//     : "KPI Door Count + Average COM EOM OH + FLDC";

//   const calculatedTotal = isNextMonth
//     ? (data.kpiDoorCount || 0) + (data.avgComEOMOH || 0)
//     : (data.kpiDoorCount || 0) + (data.avgComEOMOH || 0) + (data.fldc || 0);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
//         {/* Modal Header */}
//         <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-white/10 rounded-lg">
//               <Calculator className="text-white" size={24} />
//             </div>
//             <h2 className="text-xl font-bold text-white">
//               Required EOH Quantity for {isNextMonth ? "Next " : ""}Lead
//               Guideline Month
//             </h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//           >
//             <X className="text-white" size={24} />
//           </button>
//         </div>

//         {/* Modal Content */}
//         <div className="p-6">
//           <div className="space-y-6">
//             {/* Formula Display */}
//             <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//               <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                 <Calculator className="text-gray-600" size={16} />
//                 Calculation Formula
//               </h4>
//               <div className="bg-white rounded-lg p-4 border border-gray-300 font-mono text-sm text-gray-700">
//                 {formula}
//               </div>
//               {isNextMonth && (
//                 <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded">
//                   Note: FLDC is not included in Next Forecast Month calculations
//                 </div>
//               )}
//             </div>

//             {/* Component Values */}
//             <div
//               className={`grid grid-cols-1 ${
//                 isNextMonth ? "md:grid-cols-2" : "md:grid-cols-3"
//               } gap-4`}
//             >
//               <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="p-2 bg-blue-50 rounded-lg">
//                     <Building2 className="text-blue-600" size={16} />
//                   </div>
//                   <h5 className="text-sm font-semibold text-gray-700">
//                     KPI Door Count
//                   </h5>
//                 </div>
//                 <div className="text-2xl font-bold text-blue-600">
//                   {data.kpiDoorCount?.toLocaleString() || "0"}
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="p-2 bg-green-50 rounded-lg">
//                     <Package className="text-green-600" size={16} />
//                   </div>
//                   <h5 className="text-sm font-semibold text-gray-700">
//                     Average COM EOM OH
//                   </h5>
//                 </div>
//                 <div className="text-2xl font-bold text-green-600">
//                   {data.avgComEOMOH?.toLocaleString() || "0"}
//                 </div>
//               </div>

//               {!isNextMonth && (
//                 <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
//                   <div className="flex items-center gap-2 mb-3">
//                     <div className="p-2 bg-purple-50 rounded-lg">
//                       <MapPin className="text-purple-600" size={16} />
//                     </div>
//                     <h5 className="text-sm font-semibold text-gray-700">
//                       FLDC
//                     </h5>
//                   </div>
//                   <div className="text-2xl font-bold text-purple-600">
//                     {data.fldc?.toLocaleString() || "0"}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Calculation Steps */}
//             <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
//               <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                 <Target className="text-amber-600" size={16} />
//                 Calculation
//               </h4>
//               <div className="space-y-2 text-sm">
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">KPI Door Count:</span>
//                   <span className="font-medium">
//                     {data.kpiDoorCount?.toLocaleString() || "0"}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">+ Average COM EOM OH:</span>
//                   <span className="font-medium">
//                     {data.avgComEOMOH?.toLocaleString() || "0"}
//                   </span>
//                 </div>
//                 {!isNextMonth && (
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-600">+ FLDC:</span>
//                     <span className="font-medium">
//                       {data.fldc?.toLocaleString() || "0"}
//                     </span>
//                   </div>
//                 )}
//                 <hr className="border-gray-300" />
//                 <div className="flex items-center justify-between text-lg font-bold">
//                   <span className="text-gray-800">
//                     Required EOH for {data.forecastMonth}:
//                   </span>
//                   <span className="text-indigo-600">
//                     {calculatedTotal.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Generic Modal for other variables
// const GenericVariableModal = ({ data, onClose }) => (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-white/10 rounded-lg">
//             <Info className="text-white" size={24} />
//           </div>
//           <h2 className="text-xl font-bold text-white">Variable Information</h2>
//         </div>
//         <button
//           onClick={onClose}
//           className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//         >
//           <X className="text-white" size={24} />
//         </button>
//       </div>
//       <div className="p-6">
//         <div className="space-y-4">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">
//               {data.label}
//             </h3>
//             <p className="text-gray-600 text-sm mb-4">
//               {data.forecastType.toUpperCase()} Forecast Variable
//             </p>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <span className="text-gray-600">Current Value:</span>
//               <span className="font-bold text-lg text-gray-900">
//                 {data.value}
//               </span>
//             </div>
//           </div>
//           <div className="bg-blue-50 rounded-lg p-4">
//             <p className="text-sm text-gray-700">
//               This variable is part of the {data.forecastType} forecast
//               calculations. Click on other variables to see their detailed
//               breakdowns and calculations.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Dynamic Variable Configuration - Creates cards for ALL fields in the data
// const getDynamicVariableConfig = (data) => {
//   // Fields to exclude from displaying (meta fields)
//   const excludeFields = ["id", "category", "pid"];

//   // Get all keys from the data object
//   const allKeys = Object.keys(data).filter(
//     (key) => !excludeFields.includes(key)
//   );

//   // Create variable config for each field dynamically
//   return allKeys.map((key) => {
//     const value = data[key];
//     const config = {
//       key,
//       label: formatFieldName(key),
//       icon: getIconForField(key, value),
//       type: getFieldType(value),
//     };

//     // Add special properties for specific fields
//     if (key.includes("forecast_month_required_quantity")) {
//       config.clickable = true;
//       config.modalType = "required_quantity";
//     }

//     return config;
//   });
// };

// // Helper function to format field names into readable labels
// const formatFieldName = (key) => {
//   return key
//     .split("_")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ")
//     .replace(/([A-Z])/g, " $1")
//     .replace(/\s+/g, " ")
//     .trim();
// };

// // Helper function to determine field type based on value
// const getFieldType = (value) => {
//   if (typeof value === "boolean") return "boolean";
//   if (Array.isArray(value)) return "array";
//   if (typeof value === "number" && value >= 0 && value <= 1)
//     return "percentage";
//   return "default";
// };

// // Helper function to get appropriate icon for field
// const getIconForField = (key, value) => {
//   const keyLower = key.toLowerCase();

//   // Time related
//   if (keyLower.includes("time") || keyLower.includes("lead")) return Clock;
//   if (
//     keyLower.includes("month") ||
//     keyLower.includes("date") ||
//     keyLower.includes("holiday")
//   )
//     return Calendar;

//   // Quantity/Package related
//   if (
//     keyLower.includes("qty") ||
//     keyLower.includes("quantity") ||
//     keyLower.includes("shipment") ||
//     keyLower.includes("order")
//   )
//     return Package;
//   if (keyLower.includes("oh") || keyLower.includes("inventory")) return Box;

//   // Financial/Performance
//   if (
//     keyLower.includes("trend") ||
//     keyLower.includes("index") ||
//     keyLower.includes("fc")
//   )
//     return BarChart3;
//   if (keyLower.includes("loss") || keyLower.includes("diff"))
//     return TrendingDown;
//   if (
//     keyLower.includes("sale") ||
//     keyLower.includes("sell") ||
//     keyLower.includes("thru")
//   )
//     return TrendingUp;
//   if (keyLower.includes("macys") || keyLower.includes("soq")) return Star;
//   if (keyLower.includes("percentage") || keyLower.includes("percent"))
//     return Percent;

//   // Location/Structure
//   if (keyLower.includes("door") || keyLower.includes("count")) return Building2;
//   if (keyLower.includes("fldc") || keyLower.includes("location")) return MapPin;

//   // Product attributes
//   if (keyLower.includes("birthstone") || keyLower.includes("gem")) return Gem;
//   if (keyLower.includes("forecast") || keyLower.includes("method"))
//     return Settings;
//   if (keyLower.includes("vendor") || keyLower.includes("supplier"))
//     return Truck;

//   // Status/Flags
//   if (typeof value === "boolean") {
//     if (keyLower.includes("review") || keyLower.includes("need"))
//       return AlertCircle;
//     if (
//       keyLower.includes("over") ||
//       keyLower.includes("below") ||
//       keyLower.includes("error")
//     )
//       return AlertTriangle;
//     if (
//       keyLower.includes("maintained") ||
//       keyLower.includes("status") ||
//       keyLower.includes("added")
//     )
//       return CheckCircle;
//     if (keyLower.includes("box") || keyLower.includes("item")) return Box;
//     return CheckCircle;
//   }

//   // Default icon
//   return Info;
// };

// // Format value utility
// const formatVariableValue = (value, config) => {
//   if (value === null || value === undefined) return "-";

//   switch (config.type) {
//     case "boolean":
//       return value ? "Yes" : "No";
//     case "array":
//       return Array.isArray(value) ? value.join(", ") : value;
//     case "percentage":
//       return typeof value === "number"
//         ? `${(value * 100).toFixed(2)}%`
//         : `${value}%`;
//     default:
//       const formattedValue =
//         typeof value === "number" ? value.toLocaleString() : value;
//       return config.suffix
//         ? `${formattedValue}${config.suffix}`
//         : formattedValue;
//   }
// };

// // Individual Variable Card Component
// const VariableCard = ({
//   variable,
//   value,
//   bgColor,
//   iconColor,
//   forecastData,
//   forecastType,
// }) => {
//   const [showModal, setShowModal] = useState(false);
//   const IconComponent = variable.icon || Info;

//   const handleCardClick = () => {
//     if (!variable.clickable) return;

//     if (variable.modalType === "required_quantity") {
//       const isNextMonth = variable.key.includes("next");
//       const forecastMonth = isNextMonth
//         ? forecastData.next_forecast_month
//         : forecastData.forecast_month;

//       const modalData = {
//         forecastType,
//         forecastMonth,
//         isNextMonth, // Add this flag
//         kpiDoorCount: forecastData?.door_count || 0,
//         avgComEOMOH: forecastData?.average_com_oh || 0,
//         fldc: forecastData?.fldc || 0,
//         requiredQty: isNextMonth
//           ? forecastData?.next_forecast_month_required_quantity || 0
//           : forecastData?.forecast_month_required_quantity || 0,
//       };

//       setShowModal({ type: "required_quantity", data: modalData });
//     } else {
//       // Generic modal for other variables
//       const modalData = {
//         label: variable.label,
//         value: formatVariableValue(value, variable),
//         forecastType,
//         key: variable.key,
//       };

//       setShowModal({ type: "generic", data: modalData });
//     }
//   };

//   return (
//     <>
//       <div
//         className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
//           variable.clickable
//             ? "cursor-pointer hover:border-blue-300 hover:scale-105"
//             : ""
//         }`}
//         onClick={handleCardClick}
//       >
//         <div className="p-4">
//           <div className="flex items-center gap-2 mb-3">
//             <div className={`p-1.5 ${bgColor} rounded-md`}>
//               <IconComponent className={iconColor} size={14} />
//             </div>
//             <span className="text-xs font-medium text-gray-600 leading-tight">
//               {variable.label}
//             </span>
//             {variable.clickable && (
//               <div className="ml-auto">
//                 <Info className="text-blue-500" size={12} />
//               </div>
//             )}
//           </div>
//           <div className="text-sm font-bold text-gray-900">
//             {variable.key === "trend_index_difference" ||
//             variable.key === "loss"
//               ? `${formatVariableValue(value, variable)}%`
//               : formatVariableValue(value, variable)}
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {showModal && showModal.type === "required_quantity" && (
//         <RequiredQuantityModal
//           data={showModal.data}
//           onClose={() => setShowModal(false)}
//         />
//       )}

//       {showModal && showModal.type === "generic" && (
//         <GenericVariableModal
//           data={showModal.data}
//           onClose={() => setShowModal(false)}
//         />
//       )}
//     </>
//   );
// };

// // Main Forecast Variables Cards Component
// const ForecastVariableCards = ({ productData }) => {
//   // Debug logging
//   console.log("ForecastVariableCards received productData:", productData);

//   if (!productData) {
//     return (
//       <div className="text-center py-8 bg-gray-50 rounded-xl">
//         <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//         <p className="text-gray-600">No product data available</p>
//       </div>
//     );
//   }

//   const { store_forecast, com_forecast, omni_forecast } = productData;

//   // Debug logging for each forecast type
//   console.log("Store forecast data:", store_forecast);
//   console.log("COM forecast data:", com_forecast);
//   console.log("Omni forecast data:", omni_forecast);

//   // Check which forecast types have data
//   const hasStoreData = store_forecast && store_forecast.length > 0;
//   const hasComData = com_forecast && com_forecast.length > 0;
//   const hasOmniData = omni_forecast && omni_forecast.length > 0;

//   console.log(
//     "Data availability - Store:",
//     hasStoreData,
//     "COM:",
//     hasComData,
//     "Omni:",
//     hasOmniData
//   );

//   // If no forecast data exists
//   if (!hasStoreData && !hasComData && !hasOmniData) {
//     return (
//       <div className="text-center py-8 bg-gray-50 rounded-xl">
//         <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
//         <p className="text-gray-600">
//           No forecast variables available for this product
//         </p>
//         <p className="text-gray-500 text-sm mt-2">
//           This product may not have been processed through the forecasting
//           system yet.
//         </p>
//         <div className="mt-4 p-4 bg-white rounded border text-left">
//           <h4 className="font-semibold text-gray-700 mb-2">Debug Info:</h4>
//           <div className="text-xs text-gray-600 space-y-1">
//             <div>Store forecast: {JSON.stringify(store_forecast)}</div>
//             <div>COM forecast: {JSON.stringify(com_forecast)}</div>
//             <div>Omni forecast: {JSON.stringify(omni_forecast)}</div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const renderForecastCards = (
//     forecastData,
//     type,
//     title,
//     bgColor,
//     iconColor,
//     Icon
//   ) => {
//     if (!forecastData || !forecastData[0]) {
//       console.log(`No data for ${type} forecast:`, forecastData);
//       return null;
//     }

//     const data = forecastData[0];
//     console.log(`${type.toUpperCase()} forecast data:`, data);

//     // Use dynamic variable configuration instead of predefined ones
//     const variables = getDynamicVariableConfig(data);
//     console.log(
//       `Dynamic variables for ${type}:`,
//       variables.map((v) => ({ key: v.key, label: v.label, value: data[v.key] }))
//     );

//     return (
//       <div className="mb-8">
//         <div className="flex items-center gap-3 mb-4">
//           <div className={`p-2 ${bgColor} rounded-lg`}>
//             <Icon className={iconColor} size={20} />
//           </div>
//           <h5 className="text-lg font-semibold text-gray-800">{title}</h5>
//           <div className="ml-auto">
//             <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
//               {variables.length} Variables
//             </span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {variables.map((variable) => {
//             const value = data[variable.key];

//             return (
//               <VariableCard
//                 key={variable.key}
//                 variable={variable}
//                 value={value}
//                 bgColor={bgColor}
//                 iconColor={iconColor}
//                 forecastData={data}
//                 forecastType={type}
//               />
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Product Type Summary */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 mb-6">
//         <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
//           <Info className="text-blue-600" size={18} />
//           Forecast Type Summary
//         </h4>
//         <div className="flex items-center gap-4 text-sm">
//           <div
//             className={`flex items-center gap-2 ${
//               hasStoreData ? "text-blue-600" : "text-gray-400"
//             }`}
//           >
//             <Building2 size={16} />
//             <span className="font-medium">
//               Store: {hasStoreData ? "Available" : "Not Available"}
//             </span>
//           </div>
//           <div
//             className={`flex items-center gap-2 ${
//               hasComData ? "text-green-600" : "text-gray-400"
//             }`}
//           >
//             <ShoppingCart size={16} />
//             <span className="font-medium">
//               COM: {hasComData ? "Available" : "Not Available"}
//             </span>
//           </div>
//           <div
//             className={`flex items-center gap-2 ${
//               hasOmniData ? "text-purple-600" : "text-gray-400"
//             }`}
//           >
//             <Package size={16} />
//             <span className="font-medium">
//               Omni: {hasOmniData ? "Available" : "Not Available"}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Render only the forecast types that have data */}
//       {hasStoreData &&
//         renderForecastCards(
//           store_forecast,
//           "store",
//           "Store Forecast Variables",
//           "bg-blue-50",
//           "text-blue-600",
//           Building2
//         )}

//       {hasComData &&
//         renderForecastCards(
//           com_forecast,
//           "com",
//           "COM Forecast Variables",
//           "bg-green-50",
//           "text-green-600",
//           ShoppingCart
//         )}

//       {hasOmniData &&
//         renderForecastCards(
//           omni_forecast,
//           "omni",
//           "Omni Forecast Variables",
//           "bg-purple-50",
//           "text-purple-600",
//           Package
//         )}
//     </div>
//   );
// };

// export default ForecastVariableCards;

import React, { useState } from "react";
import {
  Clock,
  Calendar,
  BarChart3,
  TrendingDown,
  AlertTriangle,
  TrendingUp,
  Package,
  Box,
  Settings,
  Building2,
  MapPin,
  Gem,
  Star,
  ShoppingCart,
  Percent,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
  Calculator,
  Target,
  Truck,
  Search,
  Filter,
} from "lucide-react";

// Modal Components (keeping existing modal components)
const RequiredQuantityModal = ({ data, onClose }) => {
  const isNextMonth = data.isNextMonth || false;
  const formula = isNextMonth
    ? "KPI Door Count + Average COM EOM OH"
    : "KPI Door Count + Average COM EOM OH + FLDC";

  const calculatedTotal = isNextMonth
    ? (data.kpiDoorCount || 0) + (data.avgComEOMOH || 0)
    : (data.kpiDoorCount || 0) + (data.avgComEOMOH || 0) + (data.fldc || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Calculator className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">
              Required EOH Quantity for {isNextMonth ? "Next " : ""}Lead
              Guideline Month
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calculator className="text-gray-600" size={16} />
                Calculation Formula
              </h4>
              <div className="bg-white rounded-lg p-4 border border-gray-300 font-mono text-sm text-gray-700">
                {formula}
              </div>
              {isNextMonth && (
                <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded">
                  Note: FLDC is not included in Next Forecast Month calculations
                </div>
              )}
            </div>

            <div
              className={`grid grid-cols-1 ${
                isNextMonth ? "md:grid-cols-2" : "md:grid-cols-3"
              } gap-4`}
            >
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building2 className="text-blue-600" size={16} />
                  </div>
                  <h5 className="text-sm font-semibold text-gray-700">
                    KPI Door Count
                  </h5>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {data.kpiDoorCount?.toLocaleString() || "0"}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Package className="text-green-600" size={16} />
                  </div>
                  <h5 className="text-sm font-semibold text-gray-700">
                    Average COM EOM OH
                  </h5>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {data.avgComEOMOH?.toLocaleString() || "0"}
                </div>
              </div>

              {!isNextMonth && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <MapPin className="text-purple-600" size={16} />
                    </div>
                    <h5 className="text-sm font-semibold text-gray-700">
                      FLDC
                    </h5>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {data.fldc?.toLocaleString() || "0"}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
              <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Target className="text-amber-600" size={16} />
                Calculation
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">KPI Door Count:</span>
                  <span className="font-medium">
                    {data.kpiDoorCount?.toLocaleString() || "0"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">+ Average COM EOM OH:</span>
                  <span className="font-medium">
                    {data.avgComEOMOH?.toLocaleString() || "0"}
                  </span>
                </div>
                {!isNextMonth && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">+ FLDC:</span>
                    <span className="font-medium">
                      {data.fldc?.toLocaleString() || "0"}
                    </span>
                  </div>
                )}
                <hr className="border-gray-300" />
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-gray-800">
                    Required EOH for {data.forecastMonth}:
                  </span>
                  <span className="text-indigo-600">
                    {calculatedTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GenericVariableModal = ({ data, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Info className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Variable Information</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="text-white" size={24} />
        </button>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {data.label}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {data.forecastType.toUpperCase()} Forecast Variable
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Current Value:</span>
              <span className="font-bold text-lg text-gray-900">
                {data.value}
              </span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              This variable is part of the {data.forecastType} forecast
              calculations. Click on other variables to see their detailed
              breakdowns and calculations.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Dynamic Variable Configuration
const getDynamicVariableConfig = (data) => {
  const excludeFields = ["id", "category", "pid"];
  const allKeys = Object.keys(data).filter(
    (key) => !excludeFields.includes(key)
  );

  return allKeys.map((key) => {
    const value = data[key];
    const config = {
      key,
      label: formatFieldName(key),
      icon: getIconForField(key, value),
      type: getFieldType(value),
    };

    if (key.includes("forecast_month_required_quantity")) {
      config.clickable = true;
      config.modalType = "required_quantity";
    }

    return config;
  });
};

const formatFieldName = (key) => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/([A-Z])/g, " $1")
    .replace(/\s+/g, " ")
    .trim();
};

const getFieldType = (value) => {
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) return "array";
  if (typeof value === "number" && value >= 0 && value <= 1)
    return "percentage";
  return "default";
};

const getIconForField = (key, value) => {
  const keyLower = key.toLowerCase();

  if (keyLower.includes("time") || keyLower.includes("lead")) return Clock;
  if (
    keyLower.includes("month") ||
    keyLower.includes("date") ||
    keyLower.includes("holiday")
  )
    return Calendar;
  if (
    keyLower.includes("qty") ||
    keyLower.includes("quantity") ||
    keyLower.includes("shipment") ||
    keyLower.includes("order")
  )
    return Package;
  if (keyLower.includes("oh") || keyLower.includes("inventory")) return Box;
  if (
    keyLower.includes("trend") ||
    keyLower.includes("index") ||
    keyLower.includes("fc")
  )
    return BarChart3;
  if (keyLower.includes("loss") || keyLower.includes("diff"))
    return TrendingDown;
  if (
    keyLower.includes("sale") ||
    keyLower.includes("sell") ||
    keyLower.includes("thru")
  )
    return TrendingUp;
  if (keyLower.includes("macys") || keyLower.includes("soq")) return Star;
  if (keyLower.includes("percentage") || keyLower.includes("percent"))
    return Percent;
  if (keyLower.includes("door") || keyLower.includes("count")) return Building2;
  if (keyLower.includes("fldc") || keyLower.includes("location")) return MapPin;
  if (keyLower.includes("birthstone") || keyLower.includes("gem")) return Gem;
  if (keyLower.includes("forecast") || keyLower.includes("method"))
    return Settings;
  if (keyLower.includes("vendor") || keyLower.includes("supplier"))
    return Truck;

  if (typeof value === "boolean") {
    if (keyLower.includes("review") || keyLower.includes("need"))
      return AlertCircle;
    if (
      keyLower.includes("over") ||
      keyLower.includes("below") ||
      keyLower.includes("error")
    )
      return AlertTriangle;
    if (
      keyLower.includes("maintained") ||
      keyLower.includes("status") ||
      keyLower.includes("added")
    )
      return CheckCircle;
    if (keyLower.includes("box") || keyLower.includes("item")) return Box;
    return CheckCircle;
  }

  return Info;
};

const formatVariableValue = (value, config) => {
  if (value === null || value === undefined) return "-";

  switch (config.type) {
    case "boolean":
      return value ? "Yes" : "No";
    case "array":
      return Array.isArray(value) ? value.join(", ") : value;
    case "percentage":
      return typeof value === "number"
        ? `${(value * 100).toFixed(2)}%`
        : `${value}%`;
    default:
      const formattedValue =
        typeof value === "number" ? value.toLocaleString() : value;
      return config.suffix
        ? `${formattedValue}${config.suffix}`
        : formattedValue;
  }
};

// Individual Variable Card Component
const VariableCard = ({
  variable,
  value,
  bgColor,
  iconColor,
  forecastData,
  forecastType,
}) => {
  const [showModal, setShowModal] = useState(false);
  const IconComponent = variable.icon || Info;

  const handleCardClick = () => {
    if (!variable.clickable) return;

    if (variable.modalType === "required_quantity") {
      const isNextMonth = variable.key.includes("next");
      const forecastMonth = isNextMonth
        ? forecastData.next_forecast_month
        : forecastData.forecast_month;

      const modalData = {
        forecastType,
        forecastMonth,
        isNextMonth,
        kpiDoorCount: forecastData?.door_count || 0,
        avgComEOMOH: forecastData?.average_com_oh || 0,
        fldc: forecastData?.fldc || 0,
        requiredQty: isNextMonth
          ? forecastData?.next_forecast_month_required_quantity || 0
          : forecastData?.forecast_month_required_quantity || 0,
      };

      setShowModal({ type: "required_quantity", data: modalData });
    } else {
      const modalData = {
        label: variable.label,
        value: formatVariableValue(value, variable),
        forecastType,
        key: variable.key,
      };

      setShowModal({ type: "generic", data: modalData });
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
          variable.clickable
            ? "cursor-pointer hover:border-blue-300 hover:scale-105"
            : ""
        }`}
        onClick={handleCardClick}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-1.5 ${bgColor} rounded-md`}>
              <IconComponent className={iconColor} size={14} />
            </div>
            <span className="text-xs font-medium text-gray-600 leading-tight">
              {variable.label}
            </span>
            {variable.clickable && (
              <div className="ml-auto">
                <Info className="text-blue-500" size={12} />
              </div>
            )}
          </div>
          <div className="text-sm font-bold text-gray-900">
            {variable.key === "trend_index_difference" ||
            variable.key === "loss"
              ? `${formatVariableValue(value, variable)}%`
              : formatVariableValue(value, variable)}
          </div>
        </div>
      </div>

      {showModal && showModal.type === "required_quantity" && (
        <RequiredQuantityModal
          data={showModal.data}
          onClose={() => setShowModal(false)}
        />
      )}

      {showModal && showModal.type === "generic" && (
        <GenericVariableModal
          data={showModal.data}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

// Main Forecast Variables Cards Component with Search
const ForecastVariableCards = ({ productData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForecastType, setSelectedForecastType] = useState("all");

  console.log("ForecastVariableCards received productData:", productData);

  if (!productData) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No product data available</p>
      </div>
    );
  }

  const { store_forecast, com_forecast, omni_forecast } = productData;

  const hasStoreData = store_forecast && store_forecast.length > 0;
  const hasComData = com_forecast && com_forecast.length > 0;
  const hasOmniData = omni_forecast && omni_forecast.length > 0;

  if (!hasStoreData && !hasComData && !hasOmniData) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <p className="text-gray-600">
          No forecast variables available for this product
        </p>
        <p className="text-gray-500 text-sm mt-2">
          This product may not have been processed through the forecasting
          system yet.
        </p>
      </div>
    );
  }

  // Filter forecast data based on search query and selected type
  const filterVariables = (variables, data) => {
    if (!searchQuery.trim()) return variables;

    return variables.filter((variable) => {
      const labelMatch = variable.label
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const keyMatch = variable.key
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const valueMatch = String(data[variable.key] || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return labelMatch || keyMatch || valueMatch;
    });
  };

  const renderForecastCards = (
    forecastData,
    type,
    title,
    bgColor,
    iconColor,
    Icon
  ) => {
    if (!forecastData || !forecastData[0]) {
      console.log(`No data for ${type} forecast:`, forecastData);
      return null;
    }

    // Filter by forecast type
    if (selectedForecastType !== "all" && selectedForecastType !== type) {
      return null;
    }

    const data = forecastData[0];
    console.log(`${type.toUpperCase()} forecast data:`, data);

    const variables = getDynamicVariableConfig(data);
    const filteredVariables = filterVariables(variables, data);

    if (filteredVariables.length === 0 && searchQuery.trim()) {
      return null; // Don't render section if no variables match search
    }

    console.log(
      `Dynamic variables for ${type}:`,
      variables.map((v) => ({ key: v.key, label: v.label, value: data[v.key] }))
    );

    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 ${bgColor} rounded-lg`}>
            <Icon className={iconColor} size={20} />
          </div>
          <h5 className="text-lg font-semibold text-gray-800">{title}</h5>
          <div className="ml-auto">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {filteredVariables.length} Variable
              {filteredVariables.length !== 1 ? "s" : ""}
              {searchQuery.trim() &&
                filteredVariables.length !== variables.length &&
                ` (${variables.length} total)`}
            </span>
          </div>
        </div>

        {filteredVariables.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              No variables match your search criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVariables.map((variable) => {
              const value = data[variable.key];

              return (
                <VariableCard
                  key={variable.key}
                  variable={variable}
                  value={value}
                  bgColor={bgColor}
                  iconColor={iconColor}
                  forecastData={data}
                  forecastType={type}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Get all available forecast types for the filter dropdown
  const availableForecastTypes = [
    {
      value: "all",
      label: "All Forecast Types",
      count:
        (hasStoreData ? 1 : 0) + (hasComData ? 1 : 0) + (hasOmniData ? 1 : 0),
    },
    ...(hasStoreData ? [{ value: "store", label: "Store", count: 1 }] : []),
    ...(hasComData ? [{ value: "com", label: "COM", count: 1 }] : []),
    ...(hasOmniData ? [{ value: "omni", label: "Omni", count: 1 }] : []),
  ];

  // Check if there are any visible sections after filtering
  const hasVisibleResults = () => {
    if (selectedForecastType === "all") {
      return hasStoreData || hasComData || hasOmniData;
    }
    if (selectedForecastType === "store") return hasStoreData;
    if (selectedForecastType === "com") return hasComData;
    if (selectedForecastType === "omni") return hasOmniData;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search variables by name, key, or value..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Forecast Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500" size={18} />
            <select
              value={selectedForecastType}
              onChange={(e) => setSelectedForecastType(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]"
            >
              {availableForecastTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear All Button */}
          {(searchQuery || selectedForecastType !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedForecastType("all");
              }}
              className="px-4 py-2.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Search Results Summary */}
        {searchQuery.trim() && (
          <div className="mt-3 text-sm text-blue-700">
            <span className="font-medium">Search: "{searchQuery}"</span>
            {selectedForecastType !== "all" && (
              <span className="ml-2">
                in{" "}
                {
                  availableForecastTypes.find(
                    (t) => t.value === selectedForecastType
                  )?.label
                }{" "}
                forecast
              </span>
            )}
          </div>
        )}
      </div>

      {/* Forecast Type Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Info className="text-blue-600" size={18} />
          Forecast Type Summary
        </h4>
        <div className="flex items-center gap-4 text-sm">
          <div
            className={`flex items-center gap-2 ${
              hasStoreData ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <Building2 size={16} />
            <span className="font-medium">
              Store: {hasStoreData ? "Available" : "Not Available"}
            </span>
          </div>
          <div
            className={`flex items-center gap-2 ${
              hasComData ? "text-green-600" : "text-gray-400"
            }`}
          >
            <ShoppingCart size={16} />
            <span className="font-medium">
              COM: {hasComData ? "Available" : "Not Available"}
            </span>
          </div>
          <div
            className={`flex items-center gap-2 ${
              hasOmniData ? "text-purple-600" : "text-gray-400"
            }`}
          >
            <Package size={16} />
            <span className="font-medium">
              Omni: {hasOmniData ? "Available" : "Not Available"}
            </span>
          </div>
        </div>
      </div>

      {/* Render forecast sections */}
      {hasStoreData &&
        renderForecastCards(
          store_forecast,
          "store",
          "Store Forecast Variables",
          "bg-blue-50",
          "text-blue-600",
          Building2
        )}

      {hasComData &&
        renderForecastCards(
          com_forecast,
          "com",
          "COM Forecast Variables",
          "bg-green-50",
          "text-green-600",
          ShoppingCart
        )}

      {hasOmniData &&
        renderForecastCards(
          omni_forecast,
          "omni",
          "Omni Forecast Variables",
          "bg-purple-50",
          "text-purple-600",
          Package
        )}

      {/* No Results Message */}
      {(!hasVisibleResults() ||
        (searchQuery.trim() &&
          ((selectedForecastType === "all" &&
            !hasStoreData &&
            !hasComData &&
            !hasOmniData) ||
            (selectedForecastType === "store" && !hasStoreData) ||
            (selectedForecastType === "com" && !hasComData) ||
            (selectedForecastType === "omni" && !hasOmniData)))) && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Results Found
          </h3>
          <p className="text-gray-500 mb-4">
            No variables match your current search and filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedForecastType("all");
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ForecastVariableCards;
