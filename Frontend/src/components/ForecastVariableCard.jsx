

// // import React, { useState } from "react";
// // import {
// //   Clock,
// //   Calendar,
// //   BarChart3,
// //   TrendingDown,
// //   AlertTriangle,
// //   TrendingUp,
// //   Package,
// //   Box,
// //   Settings,
// //   Building2,
// //   MapPin,
// //   Gem,
// //   Star,
// //   ShoppingCart,
// //   Percent,
// //   CheckCircle,
// //   XCircle,
// //   AlertCircle,
// //   Info,
// //   X,
// //   Calculator,
// //   Target,
// //   Truck,
// //   Search,
// //   Filter,
// // } from "lucide-react";

// // // Modal Components (keeping existing modal components)
// // const RequiredQuantityModal = ({ data, onClose }) => {
// //   const isNextMonth = data.isNextMonth || false;
// //   const formula = isNextMonth
// //     ? "KPI Door Count + Average COM EOM OH"
// //     : "KPI Door Count + Average COM EOM OH + FLDC";

// //   const calculatedTotal = isNextMonth
// //     ? (data.kpiDoorCount || 0) + (data.avgComEOMOH || 0)
// //     : (data.kpiDoorCount || 0) + (data.avgComEOMOH || 0) + (data.fldc || 0);

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //       <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
// //         <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2 bg-white/10 rounded-lg">
// //               <Calculator className="text-white" size={24} />
// //             </div>
// //             <h2 className="text-xl font-bold text-white">
// //               Required EOH Quantity for {isNextMonth ? "Next " : ""}Lead
// //               Guideline Month
// //             </h2>
// //           </div>
// //           <button
// //             onClick={onClose}
// //             className="p-2 hover:bg-white/10 rounded-lg transition-colors"
// //           >
// //             <X className="text-white" size={24} />
// //           </button>
// //         </div>

// //         <div className="p-6">
// //           <div className="space-y-6">
// //             <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
// //               <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
// //                 <Calculator className="text-gray-600" size={16} />
// //                 Calculation Formula
// //               </h4>
// //               <div className="bg-white rounded-lg p-4 border border-gray-300 font-mono text-sm text-gray-700">
// //                 {formula}
// //               </div>
// //               {isNextMonth && (
// //                 <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded">
// //                   Note: FLDC is not included in Next Forecast Month calculations
// //                 </div>
// //               )}
// //             </div>

// //             <div
// //               className={`grid grid-cols-1 ${
// //                 isNextMonth ? "md:grid-cols-2" : "md:grid-cols-3"
// //               } gap-4`}
// //             >
// //               <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
// //                 <div className="flex items-center gap-2 mb-3">
// //                   <div className="p-2 bg-blue-50 rounded-lg">
// //                     <Building2 className="text-blue-600" size={16} />
// //                   </div>
// //                   <h5 className="text-sm font-semibold text-gray-700">
// //                     KPI Door Count
// //                   </h5>
// //                 </div>
// //                 <div className="text-2xl font-bold text-blue-600">
// //                   {data.kpiDoorCount?.toLocaleString() || "0"}
// //                 </div>
// //               </div>

// //               <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
// //                 <div className="flex items-center gap-2 mb-3">
// //                   <div className="p-2 bg-green-50 rounded-lg">
// //                     <Package className="text-green-600" size={16} />
// //                   </div>
// //                   <h5 className="text-sm font-semibold text-gray-700">
// //                     Average COM EOM OH
// //                   </h5>
// //                 </div>
// //                 <div className="text-2xl font-bold text-green-600">
// //                   {data.avgComEOMOH?.toLocaleString() || "0"}
// //                 </div>
// //               </div>

// //               {!isNextMonth && (
// //                 <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
// //                   <div className="flex items-center gap-2 mb-3">
// //                     <div className="p-2 bg-purple-50 rounded-lg">
// //                       <MapPin className="text-purple-600" size={16} />
// //                     </div>
// //                     <h5 className="text-sm font-semibold text-gray-700">
// //                       FLDC
// //                     </h5>
// //                   </div>
// //                   <div className="text-2xl font-bold text-purple-600">
// //                     {data.fldc?.toLocaleString() || "0"}
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
// //               <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
// //                 <Target className="text-amber-600" size={16} />
// //                 Calculation
// //               </h4>
// //               <div className="space-y-2 text-sm">
// //                 <div className="flex items-center justify-between">
// //                   <span className="text-gray-600">KPI Door Count:</span>
// //                   <span className="font-medium">
// //                     {data.kpiDoorCount?.toLocaleString() || "0"}
// //                   </span>
// //                 </div>
// //                 <div className="flex items-center justify-between">
// //                   <span className="text-gray-600">+ Average COM EOM OH:</span>
// //                   <span className="font-medium">
// //                     {data.avgComEOMOH?.toLocaleString() || "0"}
// //                   </span>
// //                 </div>
// //                 {!isNextMonth && (
// //                   <div className="flex items-center justify-between">
// //                     <span className="text-gray-600">+ FLDC:</span>
// //                     <span className="font-medium">
// //                       {data.fldc?.toLocaleString() || "0"}
// //                     </span>
// //                   </div>
// //                 )}
// //                 <hr className="border-gray-300" />
// //                 <div className="flex items-center justify-between text-lg font-bold">
// //                   <span className="text-gray-800">
// //                     Required EOH for {data.forecastMonth}:
// //                   </span>
// //                   <span className="text-indigo-600">
// //                     {calculatedTotal.toLocaleString()}
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const GenericVariableModal = ({ data, onClose }) => (
// //   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //     <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
// //       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
// //         <div className="flex items-center gap-3">
// //           <div className="p-2 bg-white/10 rounded-lg">
// //             <Info className="text-white" size={24} />
// //           </div>
// //           <h2 className="text-xl font-bold text-white">Variable Information</h2>
// //         </div>
// //         <button
// //           onClick={onClose}
// //           className="p-2 hover:bg-white/10 rounded-lg transition-colors"
// //         >
// //           <X className="text-white" size={24} />
// //         </button>
// //       </div>
// //       <div className="p-6">
// //         <div className="space-y-4">
// //           <div>
// //             <h3 className="text-lg font-semibold text-gray-800 mb-2">
// //               {data.label}
// //             </h3>
// //             <p className="text-gray-600 text-sm mb-4">
// //               {data.forecastType.toUpperCase()} Forecast Variable
// //             </p>
// //           </div>
// //           <div className="bg-gray-50 rounded-lg p-4">
// //             <div className="flex items-center justify-between">
// //               <span className="text-gray-600">Current Value:</span>
// //               <span className="font-bold text-lg text-gray-900">
// //                 {data.value}
// //               </span>
// //             </div>
// //           </div>
// //           <div className="bg-blue-50 rounded-lg p-4">
// //             <p className="text-sm text-gray-700">
// //               This variable is part of the {data.forecastType} forecast
// //               calculations. Click on other variables to see their detailed
// //               breakdowns and calculations.
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// // );

// // // Dynamic Variable Configuration
// // const getDynamicVariableConfig = (data) => {
// //   const excludeFields = ["id", "category", "pid"];
// //   const allKeys = Object.keys(data).filter(
// //     (key) => !excludeFields.includes(key)
// //   );

// //   return allKeys.map((key) => {
// //     const value = data[key];
// //     const config = {
// //       key,
// //       label: formatFieldName(key),
// //       icon: getIconForField(key, value),
// //       type: getFieldType(value),
// //     };

// //     if (key.includes("forecast_month_required_quantity")) {
// //       config.clickable = true;
// //       config.modalType = "required_quantity";
// //     }

// //     return config;
// //   });
// // };

// // const formatFieldName = (key) => {
// //   return key
// //     .split("_")
// //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
// //     .join(" ")
// //     .replace(/([A-Z])/g, " $1")
// //     .replace(/\s+/g, " ")
// //     .trim();
// // };

// // const getFieldType = (value) => {
// //   if (typeof value === "boolean") return "boolean";
// //   if (Array.isArray(value)) return "array";
// //   if (typeof value === "number" && value >= 0 && value <= 1)
// //     return "percentage";
// //   return "default";
// // };

// // const getIconForField = (key, value) => {
// //   const keyLower = key.toLowerCase();

// //   if (keyLower.includes("time") || keyLower.includes("lead")) return Clock;
// //   if (
// //     keyLower.includes("month") ||
// //     keyLower.includes("date") ||
// //     keyLower.includes("holiday")
// //   )
// //     return Calendar;
// //   if (
// //     keyLower.includes("qty") ||
// //     keyLower.includes("quantity") ||
// //     keyLower.includes("shipment") ||
// //     keyLower.includes("order")
// //   )
// //     return Package;
// //   if (keyLower.includes("oh") || keyLower.includes("inventory")) return Box;
// //   if (
// //     keyLower.includes("trend") ||
// //     keyLower.includes("index") ||
// //     keyLower.includes("fc")
// //   )
// //     return BarChart3;
// //   if (keyLower.includes("loss") || keyLower.includes("diff"))
// //     return TrendingDown;
// //   if (
// //     keyLower.includes("sale") ||
// //     keyLower.includes("sell") ||
// //     keyLower.includes("thru")
// //   )
// //     return TrendingUp;
// //   if (keyLower.includes("macys") || keyLower.includes("soq")) return Star;
// //   if (keyLower.includes("percentage") || keyLower.includes("percent"))
// //     return Percent;
// //   if (keyLower.includes("door") || keyLower.includes("count")) return Building2;
// //   if (keyLower.includes("fldc") || keyLower.includes("location")) return MapPin;
// //   if (keyLower.includes("birthstone") || keyLower.includes("gem")) return Gem;
// //   if (keyLower.includes("forecast") || keyLower.includes("method"))
// //     return Settings;
// //   if (keyLower.includes("vendor") || keyLower.includes("supplier"))
// //     return Truck;

// //   if (typeof value === "boolean") {
// //     if (keyLower.includes("review") || keyLower.includes("need"))
// //       return AlertCircle;
// //     if (
// //       keyLower.includes("over") ||
// //       keyLower.includes("below") ||
// //       keyLower.includes("error")
// //     )
// //       return AlertTriangle;
// //     if (
// //       keyLower.includes("maintained") ||
// //       keyLower.includes("status") ||
// //       keyLower.includes("added")
// //     )
// //       return CheckCircle;
// //     if (keyLower.includes("box") || keyLower.includes("item")) return Box;
// //     return CheckCircle;
// //   }

// //   return Info;
// // };

// // const formatVariableValue = (value, config) => {
// //   if (value === null || value === undefined) return "-";

// //   switch (config.type) {
// //     case "boolean":
// //       return value ? "Yes" : "No";
// //     case "array":
// //       return Array.isArray(value) ? value.join(", ") : value;
// //     case "percentage":
// //       return typeof value === "number"
// //         ? `${(value * 100).toFixed(2)}%`
// //         : `${value}%`;
// //     default:
// //       const formattedValue =
// //         typeof value === "number" ? value.toLocaleString() : value;
// //       return config.suffix
// //         ? `${formattedValue}${config.suffix}`
// //         : formattedValue;
// //   }
// // };

// // // Individual Variable Card Component
// // const VariableCard = ({
// //   variable,
// //   value,
// //   bgColor,
// //   iconColor,
// //   forecastData,
// //   forecastType,
// // }) => {
// //   const [showModal, setShowModal] = useState(false);
// //   const IconComponent = variable.icon || Info;

// //   const handleCardClick = () => {
// //     if (!variable.clickable) return;

// //     if (variable.modalType === "required_quantity") {
// //       const isNextMonth = variable.key.includes("next");
// //       const forecastMonth = isNextMonth
// //         ? forecastData.next_forecast_month
// //         : forecastData.forecast_month;

// //       const modalData = {
// //         forecastType,
// //         forecastMonth,
// //         isNextMonth,
// //         kpiDoorCount: forecastData?.door_count || 0,
// //         avgComEOMOH: forecastData?.average_com_oh || 0,
// //         fldc: forecastData?.fldc || 0,
// //         requiredQty: isNextMonth
// //           ? forecastData?.next_forecast_month_required_quantity || 0
// //           : forecastData?.forecast_month_required_quantity || 0,
// //       };

// //       setShowModal({ type: "required_quantity", data: modalData });
// //     } else {
// //       const modalData = {
// //         label: variable.label,
// //         value: formatVariableValue(value, variable),
// //         forecastType,
// //         key: variable.key,
// //       };

// //       setShowModal({ type: "generic", data: modalData });
// //     }
// //   };

// //   return (
// //     <>
// //       <div
// //         className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
// //           variable.clickable
// //             ? "cursor-pointer hover:border-blue-300 hover:scale-105"
// //             : ""
// //         }`}
// //         onClick={handleCardClick}
// //       >
// //         <div className="p-4">
// //           <div className="flex items-center gap-2 mb-3">
// //             <div className={`p-1.5 ${bgColor} rounded-md`}>
// //               <IconComponent className={iconColor} size={14} />
// //             </div>
// //             <span className="text-xs font-medium text-gray-600 leading-tight">
// //               {variable.label}
// //             </span>
// //             {variable.clickable && (
// //               <div className="ml-auto">
// //                 <Info className="text-blue-500" size={12} />
// //               </div>
// //             )}
// //           </div>
// //           <div className="text-sm font-bold text-gray-900">
// //             {variable.key === "trend_index_difference" ||
// //             variable.key === "loss"
// //               ? `${formatVariableValue(value, variable)}%`
// //               : formatVariableValue(value, variable)}
// //           </div>
// //         </div>
// //       </div>

// //       {showModal && showModal.type === "required_quantity" && (
// //         <RequiredQuantityModal
// //           data={showModal.data}
// //           onClose={() => setShowModal(false)}
// //         />
// //       )}

// //       {showModal && showModal.type === "generic" && (
// //         <GenericVariableModal
// //           data={showModal.data}
// //           onClose={() => setShowModal(false)}
// //         />
// //       )}
// //     </>
// //   );
// // };

// // // Main Forecast Variables Cards Component with Search
// // const ForecastVariableCards = ({ productData }) => {
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [selectedForecastType, setSelectedForecastType] = useState("all");

// //   console.log("ForecastVariableCards received productData:", productData);

// //   if (!productData) {
// //     return (
// //       <div className="text-center py-8 bg-gray-50 rounded-xl">
// //         <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
// //         <p className="text-gray-600">No product data available</p>
// //       </div>
// //     );
// //   }

// //   const { store_forecast, com_forecast, omni_forecast } = productData;

// //   const hasStoreData = store_forecast && store_forecast.length > 0;
// //   const hasComData = com_forecast && com_forecast.length > 0;
// //   const hasOmniData = omni_forecast && omni_forecast.length > 0;

// //   if (!hasStoreData && !hasComData && !hasOmniData) {
// //     return (
// //       <div className="text-center py-8 bg-gray-50 rounded-xl">
// //         <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
// //         <p className="text-gray-600">
// //           No forecast variables available for this product
// //         </p>
// //         <p className="text-gray-500 text-sm mt-2">
// //           This product may not have been processed through the forecasting
// //           system yet.
// //         </p>
// //       </div>
// //     );
// //   }

// //   // Filter forecast data based on search query and selected type
// //   const filterVariables = (variables, data) => {
// //     if (!searchQuery.trim()) return variables;

// //     return variables.filter((variable) => {
// //       const labelMatch = variable.label
// //         .toLowerCase()
// //         .includes(searchQuery.toLowerCase());
// //       const keyMatch = variable.key
// //         .toLowerCase()
// //         .includes(searchQuery.toLowerCase());
// //       const valueMatch = String(data[variable.key] || "")
// //         .toLowerCase()
// //         .includes(searchQuery.toLowerCase());

// //       return labelMatch || keyMatch || valueMatch;
// //     });
// //   };

// //   const renderForecastCards = (
// //     forecastData,
// //     type,
// //     title,
// //     bgColor,
// //     iconColor,
// //     Icon
// //   ) => {
// //     if (!forecastData || !forecastData[0]) {
// //       console.log(`No data for ${type} forecast:`, forecastData);
// //       return null;
// //     }

// //     // Filter by forecast type
// //     if (selectedForecastType !== "all" && selectedForecastType !== type) {
// //       return null;
// //     }

// //     const data = forecastData[0];
// //     console.log(`${type.toUpperCase()} forecast data:`, data);

// //     const variables = getDynamicVariableConfig(data);
// //     const filteredVariables = filterVariables(variables, data);

// //     if (filteredVariables.length === 0 && searchQuery.trim()) {
// //       return null; // Don't render section if no variables match search
// //     }

// //     console.log(
// //       `Dynamic variables for ${type}:`,
// //       variables.map((v) => ({ key: v.key, label: v.label, value: data[v.key] }))
// //     );

// //     return (
// //       <div className="mb-8">
// //         <div className="flex items-center gap-3 mb-4">
// //           <div className={`p-2 ${bgColor} rounded-lg`}>
// //             <Icon className={iconColor} size={20} />
// //           </div>
// //           <h5 className="text-lg font-semibold text-gray-800">{title}</h5>
// //           <div className="ml-auto">
// //             <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
// //               {filteredVariables.length} Variable
// //               {filteredVariables.length !== 1 ? "s" : ""}
// //               {searchQuery.trim() &&
// //                 filteredVariables.length !== variables.length &&
// //                 ` (${variables.length} total)`}
// //             </span>
// //           </div>
// //         </div>

// //         {filteredVariables.length === 0 ? (
// //           <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
// //             <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
// //             <p className="text-gray-500 text-sm">
// //               No variables match your search criteria
// //             </p>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// //             {filteredVariables.map((variable) => {
// //               const value = data[variable.key];

// //               return (
// //                 <VariableCard
// //                   key={variable.key}
// //                   variable={variable}
// //                   value={value}
// //                   bgColor={bgColor}
// //                   iconColor={iconColor}
// //                   forecastData={data}
// //                   forecastType={type}
// //                 />
// //               );
// //             })}
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   // Get all available forecast types for the filter dropdown
// //   const availableForecastTypes = [
// //     {
// //       value: "all",
// //       label: "All Forecast Types",
// //       count:
// //         (hasStoreData ? 1 : 0) + (hasComData ? 1 : 0) + (hasOmniData ? 1 : 0),
// //     },
// //     ...(hasStoreData ? [{ value: "store", label: "Store", count: 1 }] : []),
// //     ...(hasComData ? [{ value: "com", label: "COM", count: 1 }] : []),
// //     ...(hasOmniData ? [{ value: "omni", label: "Omni", count: 1 }] : []),
// //   ];

// //   // Check if there are any visible sections after filtering
// //   const hasVisibleResults = () => {
// //     if (selectedForecastType === "all") {
// //       return hasStoreData || hasComData || hasOmniData;
// //     }
// //     if (selectedForecastType === "store") return hasStoreData;
// //     if (selectedForecastType === "com") return hasComData;
// //     if (selectedForecastType === "omni") return hasOmniData;
// //     return false;
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {/* Search and Filter Section */}
// //       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
// //         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
// //           {/* Search Input */}
// //           <div className="flex-1 relative">
// //             <div className="relative">
// //               <Search
// //                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
// //                 size={18}
// //               />
// //               <input
// //                 type="text"
// //                 placeholder="Search variables by name, key, or value..."
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-500"
// //               />
// //               {searchQuery && (
// //                 <button
// //                   onClick={() => setSearchQuery("")}
// //                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
// //                 >
// //                   <X size={16} />
// //                 </button>
// //               )}
// //             </div>
// //           </div>

// //           {/* Forecast Type Filter */}
// //           <div className="flex items-center gap-2">
// //             <Filter className="text-gray-500" size={18} />
// //             <select
// //               value={selectedForecastType}
// //               onChange={(e) => setSelectedForecastType(e.target.value)}
// //               className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]"
// //             >
// //               {availableForecastTypes.map((type) => (
// //                 <option key={type.value} value={type.value}>
// //                   {type.label}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* Clear All Button */}
// //           {(searchQuery || selectedForecastType !== "all") && (
// //             <button
// //               onClick={() => {
// //                 setSearchQuery("");
// //                 setSelectedForecastType("all");
// //               }}
// //               className="px-4 py-2.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
// //             >
// //               Clear All
// //             </button>
// //           )}
// //         </div>

// //         {/* Search Results Summary */}
// //         {searchQuery.trim() && (
// //           <div className="mt-3 text-sm text-blue-700">
// //             <span className="font-medium">Search: "{searchQuery}"</span>
// //             {selectedForecastType !== "all" && (
// //               <span className="ml-2">
// //                 in{" "}
// //                 {
// //                   availableForecastTypes.find(
// //                     (t) => t.value === selectedForecastType
// //                   )?.label
// //                 }{" "}
// //                 forecast
// //               </span>
// //             )}
// //           </div>
// //         )}
// //       </div>

// //       {/* Forecast Type Summary */}
// //       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
// //         <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
// //           <Info className="text-blue-600" size={18} />
// //           Forecast Type Summary
// //         </h4>
// //         <div className="flex items-center gap-4 text-sm">
// //           <div
// //             className={`flex items-center gap-2 ${
// //               hasStoreData ? "text-blue-600" : "text-gray-400"
// //             }`}
// //           >
// //             <Building2 size={16} />
// //             <span className="font-medium">
// //               Store: {hasStoreData ? "Available" : "Not Available"}
// //             </span>
// //           </div>
// //           <div
// //             className={`flex items-center gap-2 ${
// //               hasComData ? "text-green-600" : "text-gray-400"
// //             }`}
// //           >
// //             <ShoppingCart size={16} />
// //             <span className="font-medium">
// //               COM: {hasComData ? "Available" : "Not Available"}
// //             </span>
// //           </div>
// //           <div
// //             className={`flex items-center gap-2 ${
// //               hasOmniData ? "text-purple-600" : "text-gray-400"
// //             }`}
// //           >
// //             <Package size={16} />
// //             <span className="font-medium">
// //               Omni: {hasOmniData ? "Available" : "Not Available"}
// //             </span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Render forecast sections */}
// //       {hasStoreData &&
// //         renderForecastCards(
// //           store_forecast,
// //           "store",
// //           "Store Forecast Variables",
// //           "bg-blue-50",
// //           "text-blue-600",
// //           Building2
// //         )}

// //       {hasComData &&
// //         renderForecastCards(
// //           com_forecast,
// //           "com",
// //           "COM Forecast Variables",
// //           "bg-green-50",
// //           "text-green-600",
// //           ShoppingCart
// //         )}

// //       {hasOmniData &&
// //         renderForecastCards(
// //           omni_forecast,
// //           "omni",
// //           "Omni Forecast Variables",
// //           "bg-purple-50",
// //           "text-purple-600",
// //           Package
// //         )}

// //       {/* No Results Message */}
// //       {(!hasVisibleResults() ||
// //         (searchQuery.trim() &&
// //           ((selectedForecastType === "all" &&
// //             !hasStoreData &&
// //             !hasComData &&
// //             !hasOmniData) ||
// //             (selectedForecastType === "store" && !hasStoreData) ||
// //             (selectedForecastType === "com" && !hasComData) ||
// //             (selectedForecastType === "omni" && !hasOmniData)))) && (
// //         <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
// //           <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
// //           <h3 className="text-lg font-medium text-gray-700 mb-2">
// //             No Results Found
// //           </h3>
// //           <p className="text-gray-500 mb-4">
// //             No variables match your current search and filter criteria.
// //           </p>
// //           <button
// //             onClick={() => {
// //               setSearchQuery("");
// //               setSelectedForecastType("all");
// //             }}
// //             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //           >
// //             Clear Filters
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ForecastVariableCards;

// import React, { useState } from 'react';
// import {
//   Clock,
//   Calendar,
//   BarChart3,
//   TrendingUp,
//   TrendingDown,
//   Package,
//   Building2,
//   MapPin,
//   Gem,
//   ShoppingCart,
//   Star,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   Settings,
//   Percent,
//   Box,
//   Info,
//   DollarSign,
//   Target,
//   Activity,
//   Users,
//   Layers,
//   Tag,
//   Search,
//   Filter,
//   Grid,
//   List,
//   X
// } from 'lucide-react';

// const ForecastVariableCards = ({ productData }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [viewMode, setViewMode] = useState("grouped"); // "grouped" or "flat"
//   const [selectedGroup, setSelectedGroup] = useState("all");

//   if (!productData) return null;

//   const { store_forecast, com_forecast, omni_forecast } = productData;
//   console.log("ForecastVariableCards received productData:", productData);

//   // Define variable groups with their relationships
//   const variableGroups = {
//     timing: {
//       title: "Timing & Scheduling",
//       icon: Clock,
//       color: "blue",
//       variables: [
//         { key: "lead_time", label: "Lead Time", suffix: " weeks" },
//         { key: "leadtime_holiday_adjustment", label: "Holiday Adjustment", type: "boolean" },
//         { key: "selected_months", label: "STD Months", type: "array" },
//         { key: "forecast_month", label: "Forecast Month" },
//         { key: "next_forecast_month", label: "Next Forecast Month" },
//         { key: "birthstone_month", label: "Birthstone Month" }
//       ]
//     },
    
//     indexing: {
//       title: "Index & Performance Metrics",
//       icon: BarChart3,
//       color: "purple",
//       variables: [
//         { key: "month_12_fc_index", label: "12-Month FC Index" },
//         { key: "com_month_12_fc_index", label: "COM 12-Month FC Index" },
//         { key: "store_month_12_fc_index", label: "Store 12-Month FC Index" },
//         { key: "std_index_value", label: "STD Index Value", type: "percentage" },
//         { key: "trend_index_difference", label: "Trend Index Difference", suffix: "%" },
//         { key: "trend_index_difference_com", label: "COM Trend Index Diff" },
//         { key: "trend_index_difference_store", label: "Store Trend Index Diff" }
//       ]
//     },

//     trends: {
//       title: "Trend Analysis",
//       icon: TrendingUp,
//       color: "green",
//       variables: [
//         { key: "trend", label: "Primary Trend", type: "percentage" },
//         { key: "com_trend", label: "COM Trend", type: "percentage" },
//         { key: "store_trend", label: "Store Trend", type: "percentage" },
//         { key: "std_trend", label: "STD Trend", type: "percentage" },
//         { key: "loss", label: "Loss Rate", suffix: "" },
//         { key: "month_12_fc_index_loss", label: "12M FC Index Loss", suffix: "%" },
//         { key: "store_month_12_fc_index_loss", label: "Store Index Loss", suffix: "%" }
//       ]
//     },

//     inventory: {
//       title: "Inventory Management",
//       icon: Package,
//       color: "orange",
//       variables: [
//         { key: "inventory_maintained", label: "Inventory Maintained", type: "boolean" },
//         { key: "com_inventory_maintained", label: "COM Inventory Maintained", type: "boolean" },
//         { key: "store_inventory_maintained", label: "Store Inventory Maintained", type: "boolean" },
//         { key: "average_com_oh", label: "Average COM OH" },
//         { key: "minimum_required_oh_for_com", label: "Min Required COM OH" }
//       ]
//     },

//     forecasting: {
//       title: "Forecasting Methods",
//       icon: Settings,
//       color: "indigo",
//       variables: [
//         { key: "forecasting_method", label: "Primary Method" },
//         { key: "forecasting_method_com", label: "COM Method" },
//         { key: "forecasting_method_store", label: "Store Method" }
//       ]
//     },

//     locations: {
//       title: "Location & Distribution",
//       icon: MapPin,
//       color: "teal",
//       variables: [
//         { key: "door_count", label: "Door Count" },
//         { key: "fldc", label: "FLDC" },
//         { key: "com_fldc", label: "COM FLDC" },
//         { key: "store_fldc", label: "Store FLDC" }
//       ]
//     },

//     requirements: {
//       title: "Quantity Requirements",
//       icon: Target,
//       color: "red",
//       variables: [
//         { key: "forecast_month_required_quantity", label: "Forecast Month Required" },
//         { key: "next_forecast_month_required_quantity", label: "Next Month Required" },
//         { key: "forecast_month_required_quantity_total", label: "Total Required (Forecast)" },
//         { key: "next_forecast_month_required_quantity_total", label: "Total Required (Next)" },
//         { key: "min_order", label: "Minimum Order" }
//       ]
//     },

//     planning: {
//       title: "Planning & OH Management",
//       icon: Activity,
//       color: "cyan",
//       variables: [
//         { key: "forecast_month_planned_oh", label: "Forecast Month Planned OH" },
//         { key: "next_forecast_month_planned_oh", label: "Next Month Planned OH" },
//         { key: "forecast_month_planned_shipment", label: "Forecast Month Shipment" },
//         { key: "next_forecast_month_planned_shipment", label: "Next Month Shipment" }
//       ]
//     },

//     adjustments: {
//       title: "Quantity Adjustments",
//       icon: DollarSign,
//       color: "emerald",
//       variables: [
//         { key: "qty_added_to_maintain_OH_forecast_month", label: "Added Qty (Forecast Month)" },
//         { key: "qty_added_to_maintain_OH_next_forecast_month", label: "Added Qty (Next Month)" },
//         { key: "next_forecast_month_qty_added", label: "Next Month Added" },
//         { key: "qty_added_to_balance_SOQ_forecast_month", label: "SOQ Balance Added" },
//         { key: "macys_soq_qty_added", label: "Macy's SOQ Added" },
//         { key: "total_added_qty", label: "Total Added Quantity" },
//         { key: "vdf_added_qty", label: "VDF Added Quantity" }
//       ]
//     },

//     macys: {
//       title: "Macy's SOQ Metrics",
//       icon: Star,
//       color: "yellow",
//       variables: [
//         { key: "Macys_SOQ", label: "Macy's SOQ Total" },
//         { key: "macy_SOQ_percentage", label: "SOQ Percentage Required", type: "percentage" },
//         { key: "Qty_given_to_macys", label: "Actual Given to Macy's" }
//       ]
//     },

//     performance: {
//       title: "Sales Performance",
//       icon: TrendingUp,
//       color: "pink",
//       variables: [
//         { key: "average_store_sale_thru", label: "Avg Store SellThru", type: "percentage" },
//         { key: "average_store_sell_thru", label: "Store SellThru Rate", type: "percentage" }
//       ]
//     },

//     product: {
//       title: "Product Attributes",
//       icon: Gem,
//       color: "violet",
//       variables: [
//         { key: "birthstone", label: "Birthstone" },
//         { key: "considered_birthstone", label: "Considered Birthstone", type: "boolean" },
//         { key: "considered_birthstone_required_quantity", label: "Birthstone Required", type: "boolean" },
//         { key: "red_box_item", label: "Red Box Item", type: "boolean" },
//         { key: "vdf_status", label: "VDF Status", type: "boolean" }
//       ]
//     },

//     flags: {
//       title: "Status Flags & Alerts",
//       icon: AlertTriangle,
//       color: "amber",
//       variables: [
//         { key: "below_min_order", label: "Below Min Order", type: "boolean" },
//         { key: "Below_min_order", label: "Below Min Order", type: "boolean" },
//         { key: "over_macys_soq", label: "Over Macy's SOQ", type: "boolean" },
//         { key: "Over_macys_SOQ", label: "Over Macy's SOQ", type: "boolean" },
//         { key: "macys_soq_only_maintained", label: "SOQ Only Maintained", type: "boolean" },
//         { key: "Added_only_to_balance_macys_SOQ", label: "Only SOQ Balance", type: "boolean" },
//         { key: "needs_review", label: "Needs Review", type: "boolean" },
//         { key: "Need_to_review_first", label: "Review Required", type: "boolean" }
//       ]
//     }
//   };

//   // Color schemes for each group
//   const colorSchemes = {
//     blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
//     purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
//     green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
//     orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
//     indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
//     teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200" },
//     red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
//     cyan: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200" },
//     emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
//     yellow: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
//     pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
//     violet: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
//     amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" }
//   };

//   const formatVariableValue = (value, config) => {
//     if (value === null || value === undefined) return "-";

//     switch (config.type) {
//       case "boolean":
//         return value ? "Yes" : "No";
//       case "array":
//         return Array.isArray(value) ? value.join(", ") : value;
//       case "percentage":
//         return typeof value === "number"
//           ? `${(value * 100).toFixed(2)}%`
//           : `${value}%`;
//       default:
//         const formattedValue =
//           typeof value === "number" ? value.toLocaleString() : value;
//         return config.suffix
//           ? `${formattedValue}${config.suffix}`
//           : formattedValue;
//     }
//   };

//   // Get all variables from all groups for flat view and search
//   const getAllVariables = () => {
//     const allVars = [];
//     Object.entries(variableGroups).forEach(([groupKey, group]) => {
//       group.variables.forEach(variable => {
//         allVars.push({
//           ...variable,
//           groupKey,
//           groupTitle: group.title,
//           groupColor: group.color,
//           groupIcon: group.icon
//         });
//       });
//     });
//     return allVars;
//   };

//   // Filter variables based on search
//   const getFilteredVariables = (data) => {
//     const allVars = getAllVariables();
//     return allVars.filter(variable => {
//       const hasValue = data.hasOwnProperty(variable.key) && 
//                       data[variable.key] !== null && 
//                       data[variable.key] !== undefined;
      
//       const matchesSearch = !searchQuery || 
//                            variable.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                            variable.groupTitle.toLowerCase().includes(searchQuery.toLowerCase());
      
//       const matchesGroup = selectedGroup === "all" || selectedGroup === variable.groupKey;
      
//       return hasValue && matchesSearch && matchesGroup;
//     });
//   };

//   // Render individual variable card
//   const renderVariableCard = (variable, value, data) => {
//     const group = variableGroups[variable.groupKey];
//     const colorScheme = colorSchemes[group.color];
//     const IconComponent = variable.icon || group.icon;

//     return (
//       <div
//         key={`${variable.groupKey}-${variable.key}`}
//         className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
//       >
//         <div className="p-4">
//           <div className="flex items-start gap-3 mb-3">
//             <div className={`p-1.5 ${colorScheme.bg} rounded-md flex-shrink-0`}>
//               <IconComponent className={colorScheme.text} size={14} />
//             </div>
//             <div className="flex-1">
//               <span className="text-xs font-medium text-gray-600 leading-tight block">
//                 {variable.label}
//               </span>
//               {viewMode === "flat" && (
//                 <span className="text-xs text-gray-400 mt-1 block">
//                   {variable.groupTitle}
//                 </span>
//               )}
//             </div>
//           </div>
//           <div className="text-sm font-bold text-gray-900 break-words">
//             {variable.key === "trend_index_difference" || variable.key === "loss"
//               ? `${formatVariableValue(value, variable)}%`
//               : formatVariableValue(value, variable)}
//           </div>
          
//           {/* Value indicator for booleans */}
//           {variable.type === "boolean" && (
//             <div className="mt-2 flex justify-end">
//               {value ? (
//                 <CheckCircle className="text-green-500" size={16} />
//               ) : (
//                 <XCircle className="text-red-500" size={16} />
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Render grouped view
//   const renderGroupedView = (forecastData, type, title, groupBgColor) => {
//     if (!forecastData || !forecastData[0]) return null;

//     const data = forecastData[0];

//     return (
//       <div className="mb-12">
//         <div className="flex items-center gap-3 mb-6">
//           <div className={`p-3 ${groupBgColor} rounded-xl`}>
//             {type === "store" && <Building2 className="text-blue-600" size={24} />}
//             {type === "com" && <ShoppingCart className="text-green-600" size={24} />}
//             {type === "omni" && <Layers className="text-purple-600" size={24} />}
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
//             <p className="text-gray-600">Algorithm variables and performance metrics</p>
//           </div>
//         </div>

//         <div className="space-y-8">
//           {Object.entries(variableGroups).map(([groupKey, group]) => {
//             // Get filtered variables for this group
//             const groupVariables = group.variables.filter(variable => {
//               const hasValue = data.hasOwnProperty(variable.key) && 
//                               data[variable.key] !== null && 
//                               data[variable.key] !== undefined;
//               const matchesSearch = !searchQuery || 
//                                    variable.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                                    group.title.toLowerCase().includes(searchQuery.toLowerCase());
//               const matchesGroup = selectedGroup === "all" || selectedGroup === groupKey;
              
//               return hasValue && matchesSearch && matchesGroup;
//             });

//             if (groupVariables.length === 0) return null;

//             const colorScheme = colorSchemes[group.color];
//             const IconComponent = group.icon;

//             return (
//               <div key={groupKey} className={`border-2 ${colorScheme.border} rounded-xl overflow-hidden`}>
//                 {/* Group Header */}
//                 <div className={`${colorScheme.bg} px-6 py-4 border-b ${colorScheme.border}`}>
//                   <div className="flex items-center gap-3">
//                     <div className={`p-2 bg-white rounded-lg shadow-sm`}>
//                       <IconComponent className={colorScheme.text} size={20} />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800">{group.title}</h3>
//                       <p className="text-sm text-gray-600">{groupVariables.length} variables</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Group Variables */}
//                 <div className="p-6 bg-white">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                     {groupVariables.map((variable) => {
//                       const value = data[variable.key];
//                       return renderVariableCard({ ...variable, groupKey }, value, data);
//                     })}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   // Render flat view
//   const renderFlatView = (forecastData, type, title, groupBgColor) => {
//     if (!forecastData || !forecastData[0]) return null;

//     const data = forecastData[0];
//     const filteredVariables = getFilteredVariables(data);

//     if (filteredVariables.length === 0) {
//       return (
//         <div className="text-center py-8 bg-gray-50 rounded-xl">
//           <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-600">No variables match your search criteria</p>
//         </div>
//       );
//     }

//     return (
//       <div className="mb-12">
//         <div className="flex items-center gap-3 mb-6">
//           <div className={`p-3 ${groupBgColor} rounded-xl`}>
//             {type === "store" && <Building2 className="text-blue-600" size={24} />}
//             {type === "com" && <ShoppingCart className="text-green-600" size={24} />}
//             {type === "omni" && <Layers className="text-purple-600" size={24} />}
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
//             <p className="text-gray-600">{filteredVariables.length} variables found</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//           {filteredVariables.map((variable) => {
//             const value = data[variable.key];
//             return renderVariableCard(variable, value, data);
//           })}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-8">
//       {/* Header with Controls */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           {/* Title and Description */}
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-blue-100 rounded-full">
//               <BarChart3 className="text-blue-600" size={32} />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">Forecast Algorithm Variables</h1>
//               <p className="text-gray-600">Comprehensive view of forecasting variables</p>
//             </div>
//           </div>

//           {/* Controls */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search variables..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[250px]"
//               />
//               {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//             </div>

//             {/* View Mode Toggle */}
//             <div className="flex bg-white rounded-lg border border-gray-300 p-1">
//               <button
//                 onClick={() => setViewMode("grouped")}
//                 className={`px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
//                   viewMode === "grouped"
//                     ? "bg-blue-100 text-blue-700"
//                     : "text-gray-600 hover:text-gray-800"
//                 }`}
//               >
//                 <Grid size={16} />
//                 Grouped
//               </button>
//               <button
//                 onClick={() => setViewMode("flat")}
//                 className={`px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
//                   viewMode === "flat"
//                     ? "bg-blue-100 text-blue-700"
//                     : "text-gray-600 hover:text-gray-800"
//                 }`}
//               >
//                 <List size={16} />
//                 List
//               </button>
//             </div>

//             {/* Group Filter */}
//             <select
//               value={selectedGroup}
//               onChange={(e) => setSelectedGroup(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//             >
//               <option value="all">All Groups</option>
//               {Object.entries(variableGroups).map(([key, group]) => (
//                 <option key={key} value={key}>{group.title}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       {store_forecast && store_forecast.length > 0 && (
//         viewMode === "grouped" 
//           ? renderGroupedView(store_forecast, "store", "Store Forecast Variables", "bg-blue-50")
//           : renderFlatView(store_forecast, "store", "Store Forecast Variables", "bg-blue-50")
//       )}

//       {com_forecast && com_forecast.length > 0 && (
//         viewMode === "grouped" 
//           ? renderGroupedView(com_forecast, "com", "COM Forecast Variables", "bg-green-50")
//           : renderFlatView(com_forecast, "com", "COM Forecast Variables", "bg-green-50")
//       )}

//       {omni_forecast && omni_forecast.length > 0 && (
//         viewMode === "grouped" 
//           ? renderGroupedView(omni_forecast, "omni", "Omni Forecast Variables", "bg-purple-50")
//           : renderFlatView(omni_forecast, "omni", "Omni Forecast Variables", "bg-purple-50")
//       )}
//     </div>
//   );
// };

// export default ForecastVariableCards;

import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  Building2,
  MapPin,
  Gem,
  ShoppingCart,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Percent,
  Box,
  Info,
  DollarSign,
  Target,
  Activity,
  Users,
  Layers,
  Tag,
  Search,
  Filter,
  Grid,
  List,
  X,
  Calculator,
  Truck,
  AlertCircle
} from 'lucide-react';

const ForecastVariableCards = ({ productData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grouped"); // "grouped" or "flat"
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedForecastType, setSelectedForecastType] = useState("all");

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
        <p className="text-gray-600">No forecast variables available for this product</p>
        <p className="text-gray-500 text-sm mt-2">
          This product may not have been processed through the forecasting system yet.
        </p>
      </div>
    );
  }

  // Define variable groups with their relationships
  const variableGroups = {
    timing: {
      title: "Timing & Scheduling",
      icon: Clock,
      color: "blue",
      keywords: ["time", "lead", "selected_months", "forecast_month", "next_forecast_month", "birthstone_month"]
    },

    holidays: {
      title: "Special Days & Holidays",
      icon: Calendar,
      color: "rose",
      keywords: ["holiday", "valentine", "mothers_day", "fathers_day", "mens_day", "womens_day", "christmas", "easter", "thanksgiving", "new_year", "leadtime_holiday"]
    },
    
    indexing: {
      title: "Index & Performance Metrics",
      icon: BarChart3,
      color: "purple",
      keywords: ["index", "fc_index", "month_12", "std_index", "trend_index_difference"]
    },

    trends: {
      title: "Trend Analysis",
      icon: TrendingUp,
      color: "green",
      keywords: ["trend", "loss", "std_trend", "com_trend", "store_trend"]
    },

    inventory: {
      title: "Inventory Management",
      icon: Package,
      color: "orange",
      keywords: ["inventory", "maintained", "oh", "average_com_oh", "minimum_required_oh"]
    },

    forecasting: {
      title: "Forecasting Methods",
      icon: Settings,
      color: "indigo",
      keywords: ["forecasting_method", "method"]
    },

    locations: {
      title: "Location & Distribution",
      icon: MapPin,
      color: "teal",
      keywords: ["door_count", "fldc", "location"]
    },

    requirements: {
      title: "Quantity Requirements",
      icon: Target,
      color: "red",
      keywords: ["required_quantity", "min_order", "minimum"]
    },

    planning: {
      title: "Planning & OH Management",
      icon: Activity,
      color: "cyan",
      keywords: ["planned_oh", "planned_shipment", "shipment"]
    },

    adjustments: {
      title: "Quantity Adjustments",
      icon: DollarSign,
      color: "emerald",
      keywords: ["qty_added", "added_qty", "vdf_added", "total_added"]
    },

    macys: {
      title: "Macy's SOQ Metrics",
      icon: Star,
      color: "yellow",
      keywords: ["macys", "soq", "Macys_SOQ", "macy_SOQ"]
    },

    performance: {
      title: "Sales Performance",
      icon: TrendingUp,
      color: "pink",
      keywords: ["sale", "sell", "thru", "average_store"]
    },

    product: {
      title: "Product Attributes",
      icon: Gem,
      color: "violet",
      keywords: ["birthstone", "considered_birthstone", "red_box", "vdf_status"]
    },

    flags: {
      title: "Status Flags & Alerts",
      icon: AlertTriangle,
      color: "amber",
      keywords: ["below_min", "over_macys", "needs_review", "Need_to_review", "Added_only", "macys_soq_only"]
    }
  };

  // Color schemes for each group
  const colorSchemes = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
    green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
    teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200" },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
    cyan: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
    pink: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" }
  };

  // Dynamic variable configuration (from your original code)
  const getDynamicVariableConfig = (data) => {
    const excludeFields = ["id", "category", "pid"];
    const allKeys = Object.keys(data).filter(
      (key) => !excludeFields.includes(key) && 
               data[key] !== null && 
               data[key] !== undefined
    );

    return allKeys.map((key) => {
      const value = data[key];
      const config = {
        key,
        label: formatFieldName(key),
        icon: getIconForField(key, value),
        type: getFieldType(value),
        groupKey: determineGroupForField(key)
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

    // Special days and holidays first
    if (keyLower.includes("holiday") || keyLower.includes("valentine") || 
        keyLower.includes("mothers") || keyLower.includes("fathers") || 
        keyLower.includes("mens_day") || keyLower.includes("womens_day") ||
        keyLower.includes("christmas") || keyLower.includes("easter")) return Calendar;
    
    if (keyLower.includes("time") || keyLower.includes("lead")) return Clock;
    if (keyLower.includes("month") || keyLower.includes("date"))
      return Calendar;
    if (keyLower.includes("qty") || keyLower.includes("quantity") || keyLower.includes("shipment") || keyLower.includes("order"))
      return Package;
    if (keyLower.includes("oh") || keyLower.includes("inventory")) return Box;
    if (keyLower.includes("trend") || keyLower.includes("index") || keyLower.includes("fc"))
      return BarChart3;
    if (keyLower.includes("loss") || keyLower.includes("diff"))
      return TrendingDown;
    if (keyLower.includes("sale") || keyLower.includes("sell") || keyLower.includes("thru"))
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
      if (keyLower.includes("over") || keyLower.includes("below") || keyLower.includes("error"))
        return AlertTriangle;
      if (keyLower.includes("maintained") || keyLower.includes("status") || keyLower.includes("added"))
        return CheckCircle;
      if (keyLower.includes("box") || keyLower.includes("item")) return Box;
      return CheckCircle;
    }

    return Info;
  };

  // Determine which group a field belongs to
  const determineGroupForField = (key) => {
    const keyLower = key.toLowerCase();
    
    for (const [groupKey, group] of Object.entries(variableGroups)) {
      if (group.keywords.some(keyword => keyLower.includes(keyword.toLowerCase()))) {
        return groupKey;
      }
    }
    
    return 'other'; // Default group for unmatched fields
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
        
        // Handle special cases that should show as percentages
        if (config.key === "trend_index_difference" || config.key === "loss") {
          return `${formattedValue}%`;
        }
        
        return config.suffix
          ? `${formattedValue}${config.suffix}`
          : formattedValue;
    }
  };

  // Get all variables from data (dynamic approach)
  const getAllVariablesFromData = (data) => {
    return getDynamicVariableConfig(data);
  };

  // Filter variables based on search
  const getFilteredVariables = (variables, data) => {
    return variables.filter(variable => {
      const matchesSearch = !searchQuery || 
                           variable.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           variable.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           String(data[variable.key] || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGroup = selectedGroup === "all" || selectedGroup === variable.groupKey;
      
      return matchesSearch && matchesGroup;
    });
  };

  // Render individual variable card
  const renderVariableCard = (variable, value, data, bgColor, iconColor) => {
    const IconComponent = variable.icon || Info;

    return (
      <div
        key={variable.key}
        className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
          variable.clickable ? "cursor-pointer hover:border-blue-300 hover:scale-105" : ""
        }`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className={`p-1.5 ${bgColor} rounded-md flex-shrink-0`}>
              <IconComponent className={iconColor} size={14} />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-gray-600 leading-tight block">
                {variable.label}
              </span>
              {viewMode === "flat" && variable.groupKey !== 'other' && (
                <span className="text-xs text-gray-400 mt-1 block">
                  {variableGroups[variable.groupKey]?.title || 'Other'}
                </span>
              )}
            </div>
            {variable.clickable && (
              <div className="ml-auto">
                <Info className="text-blue-500" size={12} />
              </div>
            )}
          </div>
          <div className="text-sm font-bold text-gray-900 break-words">
            {formatVariableValue(value, variable)}
          </div>
          
          {/* Value indicator for booleans */}
          {variable.type === "boolean" && (
            <div className="mt-2 flex justify-end">
              {value ? (
                <CheckCircle className="text-green-500" size={16} />
              ) : (
                <XCircle className="text-red-500" size={16} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render grouped view
  const renderGroupedView = (forecastData, type, title, groupBgColor) => {
    if (!forecastData || !forecastData[0]) return null;

    const data = forecastData[0];
    const allVariables = getAllVariablesFromData(data);
    const filteredVariables = getFilteredVariables(allVariables, data);

    // Group variables by their determined group
    const groupedVariables = {};
    filteredVariables.forEach(variable => {
      const groupKey = variable.groupKey || 'other';
      if (!groupedVariables[groupKey]) {
        groupedVariables[groupKey] = [];
      }
      groupedVariables[groupKey].push(variable);
    });

    // Only show groups that have variables
    const visibleGroups = Object.keys(groupedVariables).filter(groupKey => 
      groupedVariables[groupKey].length > 0
    );

    if (visibleGroups.length === 0) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No variables match your search criteria</p>
        </div>
      );
    }

    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 ${groupBgColor} rounded-xl`}>
            {type === "store" && <Building2 className="text-blue-600" size={24} />}
            {type === "com" && <ShoppingCart className="text-green-600" size={24} />}
            {type === "omni" && <Layers className="text-purple-600" size={24} />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600">{filteredVariables.length} variables found</p>
          </div>
        </div>

        <div className="space-y-8">
          {visibleGroups.map((groupKey) => {
            const group = variableGroups[groupKey] || { 
              title: 'Other Variables', 
              icon: Info, 
              color: 'gray' 
            };
            const groupVariables = groupedVariables[groupKey];
            const colorScheme = colorSchemes[group.color] || colorSchemes.blue;
            const IconComponent = group.icon;

            return (
              <div key={groupKey} className={`border-2 ${colorScheme.border} rounded-xl overflow-hidden`}>
                {/* Group Header */}
                <div className={`${colorScheme.bg} px-6 py-4 border-b ${colorScheme.border}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                      <IconComponent className={colorScheme.text} size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{group.title}</h3>
                      <p className="text-sm text-gray-600">{groupVariables.length} variables</p>
                    </div>
                  </div>
                </div>

                {/* Group Variables */}
                <div className="p-6 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {groupVariables.map((variable) => {
                      const value = data[variable.key];
                      return renderVariableCard(variable, value, data, colorScheme.bg, colorScheme.text);
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render flat view
  const renderFlatView = (forecastData, type, title, groupBgColor) => {
    if (!forecastData || !forecastData[0]) return null;

    const data = forecastData[0];
    const allVariables = getAllVariablesFromData(data);
    const filteredVariables = getFilteredVariables(allVariables, data);

    if (filteredVariables.length === 0) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No variables match your search criteria</p>
        </div>
      );
    }

    const bgColor = type === "store" ? "bg-blue-50" : type === "com" ? "bg-green-50" : "bg-purple-50";
    const iconColor = type === "store" ? "text-blue-600" : type === "com" ? "text-green-600" : "text-purple-600";

    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 ${groupBgColor} rounded-xl`}>
            {type === "store" && <Building2 className="text-blue-600" size={24} />}
            {type === "com" && <ShoppingCart className="text-green-600" size={24} />}
            {type === "omni" && <Layers className="text-purple-600" size={24} />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600">{filteredVariables.length} variables found</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVariables.map((variable) => {
            const value = data[variable.key];
            return renderVariableCard(variable, value, data, bgColor, iconColor);
          })}
        </div>
      </div>
    );
  };

  // Get available forecast types for filter
  const availableForecastTypes = [
    { value: "all", label: "All Forecast Types" },
    ...(hasStoreData ? [{ value: "store", label: "Store" }] : []),
    ...(hasComData ? [{ value: "com", label: "COM" }] : []),
    ...(hasOmniData ? [{ value: "omni", label: "Omni" }] : []),
  ];

  // Get unique groups that actually exist in data
  const getAvailableGroups = () => {
    const allGroups = new Set();
    
    [store_forecast, com_forecast, omni_forecast].forEach(forecast => {
      if (forecast && forecast[0]) {
        const variables = getAllVariablesFromData(forecast[0]);
        variables.forEach(variable => {
          if (variable.groupKey && variable.groupKey !== 'other') {
            allGroups.add(variable.groupKey);
          }
        });
      }
    });

    return [
      { value: "all", label: "All Groups" },
      ...Array.from(allGroups).map(groupKey => ({
        value: groupKey,
        label: variableGroups[groupKey]?.title || groupKey
      }))
    ];
  };

  const availableGroups = getAvailableGroups();

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Description */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Forecast Algorithm Variables</h1>
              <p className="text-gray-600">Comprehensive view of forecasting variables</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search variables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[250px]"
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

            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewMode("grouped")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === "grouped"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Grid size={16} />
                Grouped
              </button>
              <button
                onClick={() => setViewMode("flat")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === "flat"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <List size={16} />
                List
              </button>
            </div>

            {/* Forecast Type Filter */}
            <select
              value={selectedForecastType}
              onChange={(e) => setSelectedForecastType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {availableForecastTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            {/* Group Filter */}
            {availableGroups.length > 1 && (
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {availableGroups.map(group => (
                  <option key={group.value} value={group.value}>{group.label}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {(selectedForecastType === "all" || selectedForecastType === "store") && 
       hasStoreData && (
        viewMode === "grouped" 
          ? renderGroupedView(store_forecast, "store", "Store Forecast Variables", "bg-blue-50")
          : renderFlatView(store_forecast, "store", "Store Forecast Variables", "bg-blue-50")
      )}

      {(selectedForecastType === "all" || selectedForecastType === "com") && 
       hasComData && (
        viewMode === "grouped" 
          ? renderGroupedView(com_forecast, "com", "COM Forecast Variables", "bg-green-50")
          : renderFlatView(com_forecast, "com", "COM Forecast Variables", "bg-green-50")
      )}

      {(selectedForecastType === "all" || selectedForecastType === "omni") && 
       hasOmniData && (
        viewMode === "grouped" 
          ? renderGroupedView(omni_forecast, "omni", "Omni Forecast Variables", "bg-purple-50")
          : renderFlatView(omni_forecast, "omni", "Omni Forecast Variables", "bg-purple-50")
      )}
    

    </div>
  );
};

export default ForecastVariableCards;