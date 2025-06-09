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
//   X,
//   Calculator,
//   Truck,
//   AlertCircle
// } from 'lucide-react';

// const ForecastVariableCards = ({ productData }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [viewMode, setViewMode] = useState("grouped"); // "grouped" or "flat"
//   const [selectedGroup, setSelectedGroup] = useState("all");
//   const [selectedForecastType, setSelectedForecastType] = useState("all");

//   if (!productData) {
//     return (
//       <div className="text-center py-8 bg-gray-50 rounded-xl">
//         <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//         <p className="text-gray-600">No product data available</p>
//       </div>
//     );
//   }

//   const { store_forecast, com_forecast, omni_forecast } = productData;

//   const hasStoreData = store_forecast && store_forecast.length > 0;
//   const hasComData = com_forecast && com_forecast.length > 0;
//   const hasOmniData = omni_forecast && omni_forecast.length > 0;

//   if (!hasStoreData && !hasComData && !hasOmniData) {
//     return (
//       <div className="text-center py-8 bg-gray-50 rounded-xl">
//         <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
//         <p className="text-gray-600">No forecast variables available for this product</p>
//         <p className="text-gray-500 text-sm mt-2">
//           This product may not have been processed through the forecasting system yet.
//         </p>
//       </div>
//     );
//   }

//   // Define variable groups with their relationships
//   const variableGroups = {
//     timing: {
//       title: "Timing & Scheduling",
//       icon: Clock,
//       color: "blue",
//       keywords: ["time", "lead", "selected_months", "forecast_month", "next_forecast_month", "birthstone_month"]
//     },

//     holidays: {
//       title: "Special Days & Holidays",
//       icon: Calendar,
//       color: "rose",
//       keywords: ["holiday", "valentine", "mothers_day", "fathers_day", "mens_day", "womens_day", "christmas", "easter", "thanksgiving", "new_year", "leadtime_holiday"]
//     },

//     indexing: {
//       title: "Index & Performance Metrics",
//       icon: BarChart3,
//       color: "purple",
//       keywords: ["index", "fc_index", "month_12", "std_index", "trend_index_difference"]
//     },

//     trends: {
//       title: "Trend Analysis",
//       icon: TrendingUp,
//       color: "green",
//       keywords: ["trend", "loss", "std_trend", "com_trend", "store_trend"]
//     },

//     inventory: {
//       title: "Inventory Management",
//       icon: Package,
//       color: "orange",
//       keywords: ["inventory", "maintained", "oh", "average_com_oh", "minimum_required_oh"]
//     },

//     forecasting: {
//       title: "Forecasting Methods",
//       icon: Settings,
//       color: "indigo",
//       keywords: ["forecasting_method", "method"]
//     },

//     locations: {
//       title: "Location & Distribution",
//       icon: MapPin,
//       color: "teal",
//       keywords: ["door_count", "fldc", "location"]
//     },

//     requirements: {
//       title: "Quantity Requirements",
//       icon: Target,
//       color: "red",
//       keywords: ["required_quantity", "min_order", "minimum"]
//     },

//     planning: {
//       title: "Planning & OH Management",
//       icon: Activity,
//       color: "cyan",
//       keywords: ["planned_oh", "planned_shipment", "shipment"]
//     },

//     adjustments: {
//       title: "Quantity Adjustments",
//       icon: DollarSign,
//       color: "emerald",
//       keywords: ["qty_added", "added_qty", "vdf_added", "total_added"]
//     },

//     macys: {
//       title: "Macy's SOQ Metrics",
//       icon: Star,
//       color: "yellow",
//       keywords: ["macys", "soq", "Macys_SOQ", "macy_SOQ"]
//     },

//     performance: {
//       title: "Sales Performance",
//       icon: TrendingUp,
//       color: "pink",
//       keywords: ["sale", "sell", "thru", "average_store"]
//     },

//     product: {
//       title: "Product Attributes",
//       icon: Gem,
//       color: "violet",
//       keywords: ["birthstone", "considered_birthstone", "red_box", ""]
//     },

//     flags: {
//       title: "Status Flags & Alerts",
//       icon: AlertTriangle,
//       color: "amber",
//       keywords: ["below_min", "over_macys", "needs_review", "Need_to_review", "Added_only", "macys_soq_only"]
//     }
//   };

//   // Color schemes for each group
//   const colorSchemes = {
//     blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
//     rose: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
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

//   // Dynamic variable configuration (from your original code)
//   const getDynamicVariableConfig = (data) => {
//     const excludeFields = ["id", "category", "pid"];
//     const allKeys = Object.keys(data).filter(
//       (key) => !excludeFields.includes(key) &&
//                data[key] !== null &&
//                data[key] !== undefined
//     );

//     return allKeys.map((key) => {
//       const value = data[key];
//       const config = {
//         key,
//         label: formatFieldName(key),
//         icon: getIconForField(key, value),
//         type: getFieldType(value),
//         groupKey: determineGroupForField(key)
//       };

//       if (key.includes("forecast_month_required_quantity")) {
//         config.clickable = true;
//         config.modalType = "required_quantity";
//       }

//       return config;
//     });
//   };

//   const formatFieldName = (key) => {
//     return key
//       .split("_")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ")
//       .replace(/([A-Z])/g, " $1")
//       .replace(/\s+/g, " ")
//       .trim();
//   };

//   const getFieldType = (value) => {
//     if (typeof value === "boolean") return "boolean";
//     if (Array.isArray(value)) return "array";
//     if (typeof value === "number" && value >= 0 && value <= 1)
//       return "percentage";
//     return "default";
//   };

//   const getIconForField = (key, value) => {
//     const keyLower = key.toLowerCase();

//     // Special days and holidays first
//     if (keyLower.includes("holiday") || keyLower.includes("valentine") ||
//         keyLower.includes("mothers") || keyLower.includes("fathers") ||
//         keyLower.includes("mens_day") || keyLower.includes("womens_day") ||
//         keyLower.includes("christmas") || keyLower.includes("easter")) return Calendar;

//     if (keyLower.includes("time") || keyLower.includes("lead")) return Clock;
//     if (keyLower.includes("month") || keyLower.includes("date"))
//       return Calendar;
//     if (keyLower.includes("qty") || keyLower.includes("quantity") || keyLower.includes("shipment") || keyLower.includes("order"))
//       return Package;
//     if (keyLower.includes("oh") || keyLower.includes("inventory")) return Box;
//     if (keyLower.includes("trend") || keyLower.includes("index") || keyLower.includes("fc"))
//       return BarChart3;
//     if (keyLower.includes("loss") || keyLower.includes("diff"))
//       return TrendingDown;
//     if (keyLower.includes("sale") || keyLower.includes("sell") || keyLower.includes("thru"))
//       return TrendingUp;
//     if (keyLower.includes("macys") || keyLower.includes("soq")) return Star;
//     if (keyLower.includes("percentage") || keyLower.includes("percent"))
//       return Percent;
//     if (keyLower.includes("door") || keyLower.includes("count")) return Building2;
//     if (keyLower.includes("fldc") || keyLower.includes("location")) return MapPin;
//     if (keyLower.includes("birthstone") || keyLower.includes("gem")) return Gem;
//     if (keyLower.includes("forecast") || keyLower.includes("method"))
//       return Settings;
//     if (keyLower.includes("vendor") || keyLower.includes("supplier"))
//       return Truck;

//     if (typeof value === "boolean") {
//       if (keyLower.includes("review") || keyLower.includes("need"))
//         return AlertCircle;
//       if (keyLower.includes("over") || keyLower.includes("below") || keyLower.includes("error"))
//         return AlertTriangle;
//       if (keyLower.includes("maintained") || keyLower.includes("status") || keyLower.includes("added"))
//         return CheckCircle;
//       if (keyLower.includes("box") || keyLower.includes("item")) return Box;
//       return CheckCircle;
//     }

//     return Info;
//   };

//   // Determine which group a field belongs to
//   const determineGroupForField = (key) => {
//     const keyLower = key.toLowerCase();

//     for (const [groupKey, group] of Object.entries(variableGroups)) {
//       if (group.keywords.some(keyword => keyLower.includes(keyword.toLowerCase()))) {
//         return groupKey;
//       }
//     }

//     return 'other'; // Default group for unmatched fields
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

//         // Handle special cases that should show as percentages
//         if (config.key === "trend_index_difference" || config.key === "loss") {
//           return `${formattedValue}%`;
//         }

//         return config.suffix
//           ? `${formattedValue}${config.suffix}`
//           : formattedValue;
//     }
//   };

//   // Get all variables from data (dynamic approach)
//   const getAllVariablesFromData = (data) => {
//     return getDynamicVariableConfig(data);
//   };

//   // Filter variables based on search
//   const getFilteredVariables = (variables, data) => {
//     return variables.filter(variable => {
//       const matchesSearch = !searchQuery ||
//                            variable.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                            variable.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                            String(data[variable.key] || "").toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesGroup = selectedGroup === "all" || selectedGroup === variable.groupKey;

//       return matchesSearch && matchesGroup;
//     });
//   };

//   // Render individual variable card
//   const renderVariableCard = (variable, value, data, bgColor, iconColor) => {
//     const IconComponent = variable.icon || Info;

//     return (
//       <div
//         key={variable.key}
//         className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
//           variable.clickable ? "cursor-pointer hover:border-blue-300 hover:scale-105" : ""
//         }`}
//       >
//         <div className="p-4">
//           <div className="flex items-start gap-3 mb-3">
//             <div className={`p-1.5 ${bgColor} rounded-md flex-shrink-0`}>
//               <IconComponent className={iconColor} size={14} />
//             </div>
//             <div className="flex-1">
//               <span className="text-xs font-medium text-gray-600 leading-tight block">
//                 {variable.label}
//               </span>
//               {viewMode === "flat" && variable.groupKey !== 'other' && (
//                 <span className="text-xs text-gray-400 mt-1 block">
//                   {variableGroups[variable.groupKey]?.title || 'Other'}
//                 </span>
//               )}
//             </div>
//             {variable.clickable && (
//               <div className="ml-auto">
//                 <Info className="text-blue-500" size={12} />
//               </div>
//             )}
//           </div>
//           <div className="text-sm font-bold text-gray-900 break-words">
//             {formatVariableValue(value, variable)}
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
//     const allVariables = getAllVariablesFromData(data);
//     const filteredVariables = getFilteredVariables(allVariables, data);

//     // Group variables by their determined group
//     const groupedVariables = {};
//     filteredVariables.forEach(variable => {
//       const groupKey = variable.groupKey || 'other';
//       if (!groupedVariables[groupKey]) {
//         groupedVariables[groupKey] = [];
//       }
//       groupedVariables[groupKey].push(variable);
//     });

//     // Only show groups that have variables
//     const visibleGroups = Object.keys(groupedVariables).filter(groupKey =>
//       groupedVariables[groupKey].length > 0
//     );

//     if (visibleGroups.length === 0) {
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

//         <div className="space-y-8">
//           {visibleGroups.map((groupKey) => {
//             const group = variableGroups[groupKey] || {
//               title: 'Other Variables',
//               icon: Info,
//               color: 'gray'
//             };
//             const groupVariables = groupedVariables[groupKey];
//             const colorScheme = colorSchemes[group.color] || colorSchemes.blue;
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
//                       return renderVariableCard(variable, value, data, colorScheme.bg, colorScheme.text);
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
//     const allVariables = getAllVariablesFromData(data);
//     const filteredVariables = getFilteredVariables(allVariables, data);

//     if (filteredVariables.length === 0) {
//       return (
//         <div className="text-center py-8 bg-gray-50 rounded-xl">
//           <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-600">No variables match your search criteria</p>
//         </div>
//       );
//     }

//     const bgColor = type === "store" ? "bg-blue-50" : type === "com" ? "bg-green-50" : "bg-purple-50";
//     const iconColor = type === "store" ? "text-blue-600" : type === "com" ? "text-green-600" : "text-purple-600";

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
//             return renderVariableCard(variable, value, data, bgColor, iconColor);
//           })}
//         </div>
//       </div>
//     );
//   };

//   // Get available forecast types for filter
//   const availableForecastTypes = [
//     { value: "all", label: "All Forecast Types" },
//     ...(hasStoreData ? [{ value: "store", label: "Store" }] : []),
//     ...(hasComData ? [{ value: "com", label: "COM" }] : []),
//     ...(hasOmniData ? [{ value: "omni", label: "Omni" }] : []),
//   ];

//   // Get unique groups that actually exist in data
//   const getAvailableGroups = () => {
//     const allGroups = new Set();

//     [store_forecast, com_forecast, omni_forecast].forEach(forecast => {
//       if (forecast && forecast[0]) {
//         const variables = getAllVariablesFromData(forecast[0]);
//         variables.forEach(variable => {
//           if (variable.groupKey && variable.groupKey !== 'other') {
//             allGroups.add(variable.groupKey);
//           }
//         });
//       }
//     });

//     return [
//       { value: "all", label: "All Groups" },
//       ...Array.from(allGroups).map(groupKey => ({
//         value: groupKey,
//         label: variableGroups[groupKey]?.title || groupKey
//       }))
//     ];
//   };

//   const availableGroups = getAvailableGroups();

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

//             {/* Forecast Type Filter */}
//             <select
//               value={selectedForecastType}
//               onChange={(e) => setSelectedForecastType(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//             >
//               {availableForecastTypes.map(type => (
//                 <option key={type.value} value={type.value}>{type.label}</option>
//               ))}
//             </select>

//             {/* Group Filter */}
//             {availableGroups.length > 1 && (
//               <select
//                 value={selectedGroup}
//                 onChange={(e) => setSelectedGroup(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//               >
//                 {availableGroups.map(group => (
//                   <option key={group.value} value={group.value}>{group.label}</option>
//                 ))}
//               </select>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       {(selectedForecastType === "all" || selectedForecastType === "store") &&
//        hasStoreData && (
//         viewMode === "grouped"
//           ? renderGroupedView(store_forecast, "store", "Store Forecast Variables", "bg-blue-50")
//           : renderFlatView(store_forecast, "store", "Store Forecast Variables", "bg-blue-50")
//       )}

//       {(selectedForecastType === "all" || selectedForecastType === "com") &&
//        hasComData && (
//         viewMode === "grouped"
//           ? renderGroupedView(com_forecast, "com", "COM Forecast Variables", "bg-green-50")
//           : renderFlatView(com_forecast, "com", "COM Forecast Variables", "bg-green-50")
//       )}

//       {(selectedForecastType === "all" || selectedForecastType === "omni") &&
//        hasOmniData && (
//         viewMode === "grouped"
//           ? renderGroupedView(omni_forecast, "omni", "Omni Forecast Variables", "bg-purple-50")
//           : renderFlatView(omni_forecast, "omni", "Omni Forecast Variables", "bg-purple-50")
//       )}

//     </div>
//   );
// };

// export default ForecastVariableCards;

import React, { useState } from "react";
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
  AlertCircle,
} from "lucide-react";

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

  // Modal Component for Required Quantity Calculation
const RequiredQuantityModal = ({ isOpen, onClose, data, type, forecastMonth }) => {
  if (!isOpen) return null;

 const doorCount = data?.door_count || 0;
const averageComOh = data?.average_com_oh || 0;
const fldc = data?.fldc || 0;
const requiredQuantity = data?.forecast_month_required_quantity || 0;

// Next forecast month data
const nextForecastMonth = data?.next_forecast_month || "Unknown";
const nextRequiredQuantity = data?.next_forecast_month_required_quantity || 0;
const currentForecastMonth = data?.forecast_month || "Unknown";

const displayMonth = forecastMonth === "next" ? nextForecastMonth : currentForecastMonth;
const displayRequiredQuantity = forecastMonth === "next" ? nextRequiredQuantity : requiredQuantity;

// Calculate the sum dynamically
const calculatedSum = doorCount + averageComOh + fldc;

  const getTypeColor = () => {
    switch (type) {
      case "store": return { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" };
      case "com": return { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" };
      case "omni": return { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" };
      default: return { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };
    }
  };

  const colors = getTypeColor();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Calculator className="text-white" size={24} />
              </div>
              <h2 className="text-xl font-bold">Required EOH Quantity Calculation</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="text-white" size={20} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Forecast Info */}
          <div className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
            <div className="flex items-center gap-3 mb-2">
              {type === "store" && <Building2 className={colors.text} size={20} />}
              {type === "com" && <ShoppingCart className={colors.text} size={20} />}
              {type === "omni" && <Layers className={colors.text} size={20} />}
              <h3 className="font-semibold text-gray-800">
                {type?.toUpperCase()} Forecast - {displayMonth}
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Required EOH Quantity for Lead guideline month calculation
            </p>
          </div>

          {/* Formula Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="text-gray-600" size={20} />
              <h4 className="font-semibold text-gray-800">Calculation Formula</h4>
            </div>
            <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
              Required EOH for {displayMonth} = KPI Door Count + Average COM EOM OH + FLDC
            </div>
          </div>

          {/* Variables Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* KPI Door Count */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="text-blue-600" size={16} />
                <span className="font-medium text-blue-700">KPI Door Count</span>
              </div>
              <div className="text-2xl font-bold text-blue-800">{doorCount.toLocaleString()}</div>
            </div>

            {/* Average COM EOM OH */}
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="text-green-600" size={16} />
                <span className="font-medium text-green-700">Average COM EOM OH</span>
              </div>
              <div className="text-2xl font-bold text-green-800">{averageComOh.toLocaleString()}</div>
            </div>

            {/* FLDC */}
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="text-purple-600" size={16} />
                <span className="font-medium text-purple-700">FLDC</span>
              </div>
              <div className="text-2xl font-bold text-purple-800">{fldc.toLocaleString()}</div>
            </div>
          </div>

          {/* Calculation Steps */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-gray-600" size={20} />
              <h4 className="font-semibold text-gray-800">Calculation Steps</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">KPI Door Count:</span>
                <span className="font-medium">{doorCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">+ Average COM EOM OH:</span>
                <span className="font-medium">{averageComOh.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">+ FLDC:</span>
                <span className="font-medium">{fldc.toLocaleString()}</span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between items-center py-2 bg-emerald-50 px-3 rounded-md">
                <span className="font-semibold text-emerald-800">Required EOH for {displayMonth}:</span>
                <span className="text-xl font-bold text-emerald-800">{calculatedSum.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Validation Check */}
{calculatedSum !== displayRequiredQuantity && displayRequiredQuantity > 0 && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <AlertTriangle className="text-yellow-600 mt-0.5" size={16} />
      <div>
        <h5 className="font-medium text-yellow-800 mb-1">Calculation Note</h5>
        <p className="text-yellow-700 text-sm">
          Calculated value ({calculatedSum.toLocaleString()}) differs from stored value ({displayRequiredQuantity.toLocaleString()}). 
          This may indicate additional factors in the actual calculation.
        </p>
      </div>
    </div>
  </div>
)}

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="text-blue-600 mt-0.5" size={16} />
              <div>
                <h5 className="font-medium text-blue-800 mb-1">About This Calculation</h5>
                <p className="text-blue-700 text-sm">
                  The Required EOH (End of Hand) quantity represents the minimum inventory level needed 
                  at the end of the forecast month to maintain adequate stock levels across all locations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const [modalState, setModalState] = useState({
  isOpen: false,
  type: null,
  data: null,
  forecastMonth: null
});

// Handle opening modal for required quantity calculation
const openRequiredQuantityModal = (data, type, forecastMonth = "current") => {
  setModalState({
    isOpen: true,
    type,
    data,
    forecastMonth
  });
};

const closeModal = () => {
  setModalState({
    isOpen: false,
    type: null,
    data: null,
    forecastMonth: null
  });
};

const handleVariableClick = (variable, value, data, type) => {
  if (variable.clickable && variable.modalType === "required_quantity") {
    openRequiredQuantityModal(data, type, variable.forecastMonth);
  }
};

  // Define variable groups with their relationships
 // Updated variable groups with Special Days section
const variableGroups = {
  leadtime: {
    title: "Lead Time Calculation",
    icon: Clock,
    color: "blue",
    keywords: ["vendor", "leadtime_holiday_adjustment", "lead_time"],
  },

  trends_index: {
    title: "Trend And Index Calculation",
    icon: BarChart3,
    color: "purple",
    keywords: [
      "selected_months",
      "std_index",
      "month_12_fc_index",
      "loss",
      "month_12_fc_index_loss",
      "trend",
    ],
  },

  forecasting_method: {
    title: "Selecting Forecasting Method",
    icon: Settings,
    color: "indigo",
    keywords: [
      "inventory_maintained",
      "trend_index_difference",
      "red_box_item",
      "forecasting_method",
    ],
  },

  forecast_month_req: {
    title: "Required Qty For Forecast Month",
    icon: Target,
    color: "green",
    keywords: [
      "forecast_month",
      "door_count",
      "minimum",
      "average_com_oh",
      "fldc",
      "birthstone",
      "birthstone_month",
      "considered_birthstone",
      "considered_birthstone_required_quantity",
      "forecast_month_required_quantity_store",
      "forecast_month_required_quantity",
    ],
  },

  next_forecast_month_req: {
    title: "Required Qty For Next Forecast Month",
    icon: Calendar,
    color: "emerald",
    keywords: [
      "next_forecast_month",
      "door_count",
      "minimum_required_oh",
      "average_com_oh",
      "next_forecast_month_required_quantity",
    ],
  },

  planned_shipment: {
    title: "Planned Shipment",
    icon: Truck,
    color: "cyan",
    keywords: [
      "forecast_month_planned_oh",
      "forecast_month_planned_shipment",
    ],
  },

  next_planned_shipment: {
    title: "Next Planned Shipment",
    icon: Package,
    color: "teal",
    keywords: [
      "next_forecast_month_planned_oh",
      "next_forecast_month_planned_shipment",
    ],
  },

  macys_soq: {
    title: "Macy's SOQ",
    icon: Star,
    color: "yellow",
    keywords: [
      "Macys_SOQ",
      "Qty_given_to_macys",
      "average_store_sale_thru",
      "macys_owned_retail",
      "macy_SOQ_percentage",
      "qty_added_to_balance_SOQ_forecast_month",
    ],
  },

  final_qty: {
    title: "Final Qty",
    icon: Calculator,
    color: "red",
    keywords: [
      "qty_added_to_maintain_OH_forecast_month",
      "qty_added_to_maintain_OH_next_forecast_month",
      "Min_order",
      "Added_qty_using_macys_SOQ",
      "Below_min_order",
      "Over_macys_SOQ",
      "Need_to_review_first",
      "total_added_qty",
      "vdf_added",
      "vdf_status",
    ],
  },

  // Add Special Days section for holiday-related variables
  special_days: {
    title: "Special Days",
    icon: Calendar,
    color: "gray",
    keywords: [
      "holiday",
      "valentine",
      "mothers_day", 
      "fathers_day",
      "mens_day",
      "womens_day", 
      "christmas",
      "easter",
      "thanksgiving",
      "new_year",
      "special_day",
      "seasonal"
    ],
  },
};

  // Color schemes for each group
 const colorSchemes = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
  },
  cyan: {
    bg: "bg-cyan-50",
    text: "text-cyan-600",
    border: "border-cyan-200",
  },
  teal: {
    bg: "bg-teal-50",
    text: "text-teal-600",
    border: "border-teal-200",
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    border: "border-yellow-200",
  },
  red: { 
    bg: "bg-red-50", 
    text: "text-red-600", 
    border: "border-red-200" 
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200",
  },
  pink: {
    bg: "bg-pink-50",
    text: "text-pink-600",
    border: "border-pink-200",
  },
  violet: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-200",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
  },
  // Add gray color scheme for "Other Variables" group
  gray: {
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-200",
  },
};

  // Dynamic variable configuration (from your original code)
  const getDynamicVariableConfig = (data) => {
    const excludeFields = ["id", "category", "pid"];
    const allKeys = Object.keys(data).filter(
      (key) =>
        !excludeFields.includes(key) &&
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
        groupKey: determineGroupForField(key),
      };

      if (key === "forecast_month_required_quantity") {
  config.clickable = true;
  config.modalType = "required_quantity";
}

      return config;
    });
  };

  const formatFieldName = (key) => {
  return key
    .split("_")
    .map((word) => {
      // Handle common abbreviations that should stay together
      const abbreviations = ['SOQ', 'OH', 'STD', 'FC', 'VDF', 'QTY', 'MIN', 'MAX', 'AVG', 'COM', 'PID', 'ID'];
      const upperWord = word.toUpperCase();
      
      if (abbreviations.includes(upperWord)) {
        return upperWord;
      }
      
      // For regular words, just capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
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
    if (
      keyLower.includes("holiday") ||
      keyLower.includes("valentine") ||
      keyLower.includes("mothers") ||
      keyLower.includes("fathers") ||
      keyLower.includes("mens_day") ||
      keyLower.includes("womens_day") ||
      keyLower.includes("christmas") ||
      keyLower.includes("easter")
    )
      return Calendar;

    if (keyLower.includes("time") || keyLower.includes("lead")) return Clock;
    if (keyLower.includes("month") || keyLower.includes("date"))
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
    if (keyLower.includes("door") || keyLower.includes("count"))
      return Building2;
    if (keyLower.includes("fldc") || keyLower.includes("location"))
      return MapPin;
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

  // Determine which group a field belongs to
  const determineGroupForField = (key) => {
    const keyLower = key.toLowerCase();

    // Exact matches first for better accuracy
    const exactMatches = {
      leadtime_holiday_adjustment: "leadtime",
      lead_time: "leadtime",
      selected_months: "trends_index",
      month_12_fc_index: "trends_index",
      loss: "trends_index",
      month_12_fc_index_loss: "trends_index",
      trend: "trends_index",
      inventory_maintained: "forecasting_method",
      trend_index_difference: "forecasting_method",
      red_box_item: "forecasting_method",
      forecasting_method: "forecasting_method",
      forecast_month: "forecast_month_req",
      door_count: "forecast_month_req",
      average_com_oh: "forecast_month_req",
      fldc: "forecast_month_req",
      birthstone: "forecast_month_req",
      birthstone_month: "forecast_month_req",
      considered_birthstone: "forecast_month_req",
      considered_birthstone_required_quantity: "forecast_month_req",
      forecast_month_required_quantity: "forecast_month_req",
      next_forecast_month: "next_forecast_month_req",
      next_forecast_month_required_quantity: "next_forecast_month_req",
      forecast_month_planned_oh: "planned_shipment",
      forecast_month_planned_shipment: "planned_shipment",
      next_forecast_month_planned_oh: "next_planned_shipment",
      next_forecast_month_planned_shipment: "next_planned_shipment",
      macys_soq: "macys_soq",
      qty_given_to_macys: "macys_soq",
      average_store_sale_thru: "macys_soq",
      macys_owned_retail: "macys_soq",
      macy_soq_percentage: "macys_soq",
      macys_soq_qty_added: "macys_soq",
      qty_added_to_balance_soq_forecast_month: "macys_soq",
      qty_added_to_maintain_oh_forecast_month: "final_qty",
      qty_added_to_maintain_oh_next_forecast_month: "final_qty",
      min_order: "final_qty",
      added_qty_using_macys_soq: "final_qty",
      below_min_order: "final_qty",
      over_macys_soq: "final_qty",
      need_to_review_first: "final_qty",
      total_added_qty: "final_qty",
    };

    if (exactMatches[keyLower]) {
      return exactMatches[keyLower];
    }

    // Fallback to keyword matching
    for (const [groupKey, group] of Object.entries(variableGroups)) {
      if (
        group.keywords.some((keyword) =>
          keyLower.includes(keyword.toLowerCase())
        )
      ) {
        return groupKey;
      }
    }

    return "other"; // Default group for unmatched fields
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
    return variables.filter((variable) => {
      const matchesSearch =
        !searchQuery ||
        variable.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        variable.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(data[variable.key] || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesGroup =
        selectedGroup === "all" || selectedGroup === variable.groupKey;

      return matchesSearch && matchesGroup;
    });
  };

  // Render individual variable card
  const renderVariableCard = (variable, value, data, bgColor, iconColor, type) => {
  const IconComponent = variable.icon || Info;

  return (
    <div
      key={variable.key}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
        variable.clickable
          ? "cursor-pointer hover:border-blue-300 hover:scale-105"
          : ""
      }`}
      onClick={() => handleVariableClick(variable, value, data, type)}
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
            {viewMode === "flat" && variable.groupKey !== "other" && (
              <span className="text-xs text-gray-400 mt-1 block">
                {variableGroups[variable.groupKey]?.title || "Other"}
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
    filteredVariables.forEach((variable) => {
      const groupKey = variable.groupKey || "other";
      if (!groupedVariables[groupKey]) {
        groupedVariables[groupKey] = [];
      }
      groupedVariables[groupKey].push(variable);
    });

    // Only show groups that have variables
    const visibleGroups = Object.keys(groupedVariables).filter(
      (groupKey) => groupedVariables[groupKey].length > 0
    );

    if (visibleGroups.length === 0) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No variables match your search criteria
          </p>
        </div>
      );
    }

    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 ${groupBgColor} rounded-xl`}>
            {type === "store" && (
              <Building2 className="text-blue-600" size={24} />
            )}
            {type === "com" && (
              <ShoppingCart className="text-green-600" size={24} />
            )}
            {type === "omni" && (
              <Layers className="text-purple-600" size={24} />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600">
              {filteredVariables.length} variables found
            </p>
          </div>
        </div>

        <div className="space-y-8">
         {visibleGroups.map((groupKey) => {
  const group = variableGroups[groupKey] || {
    title: "Other Variables", // Changed from "Special Days"
    icon: Info,
    color: "gray",
  };
  const groupVariables = groupedVariables[groupKey];
  const colorScheme = colorSchemes[group.color] || colorSchemes.blue;
  const IconComponent = group.icon;

  return (
    <div
      key={groupKey}
      className={`border-2 ${colorScheme.border} rounded-xl overflow-hidden`}
    >
                {/* Group Header */}
                <div
                  className={`${colorScheme.bg} px-6 py-4 border-b ${colorScheme.border}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                      <IconComponent className={colorScheme.text} size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {group.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {groupVariables.length} variables
                      </p>
                    </div>
                  </div>
                </div>

                {/* Group Variables */}
                <div className="p-6 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {groupVariables.map((variable) => {
                      const value = data[variable.key];
                      return renderVariableCard(
                        variable,
                        value,
                        data,
                        colorScheme.bg,
                        colorScheme.text,
                        type
                      );
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
          <p className="text-gray-600">
            No variables match your search criteria
          </p>
        </div>
      );
    }

    const bgColor =
      type === "store"
        ? "bg-blue-50"
        : type === "com"
        ? "bg-green-50"
        : "bg-purple-50";
    const iconColor =
      type === "store"
        ? "text-blue-600"
        : type === "com"
        ? "text-green-600"
        : "text-purple-600";

    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 ${groupBgColor} rounded-xl`}>
            {type === "store" && (
              <Building2 className="text-blue-600" size={24} />
            )}
            {type === "com" && (
              <ShoppingCart className="text-green-600" size={24} />
            )}
            {type === "omni" && (
              <Layers className="text-purple-600" size={24} />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600">
              {filteredVariables.length} variables found
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVariables.map((variable) => {
            const value = data[variable.key];
            return renderVariableCard(
              variable,
              value,
              data,
              bgColor,
              iconColor
            );
          })}
        </div>
      </div>
    );
  };

  // Get available forecast types for filter
  const availableForecastTypes = [
    
    ...(hasStoreData ? [{ value: "store", label: "Store" }] : []),
    ...(hasComData ? [{ value: "com", label: "COM" }] : []),
    ...(hasOmniData ? [{ value: "omni", label: "Omni" }] : []),
  ];

  // Get unique groups that actually exist in data
  const getAvailableGroups = () => {
    const allGroups = new Set();

    [store_forecast, com_forecast, omni_forecast].forEach((forecast) => {
      if (forecast && forecast[0]) {
        const variables = getAllVariablesFromData(forecast[0]);
        variables.forEach((variable) => {
          if (variable.groupKey && variable.groupKey !== "other") {
            allGroups.add(variable.groupKey);
          }
        });
      }
    });

    return [
      { value: "all", label: "All Groups" },
      ...Array.from(allGroups).map((groupKey) => ({
        value: groupKey,
        label: variableGroups[groupKey]?.title || groupKey,
      })),
    ];
  };

  const availableGroups = getAvailableGroups();

  return (
    <div className="space-y-8">
       {/* Required Quantity Modal */}
    <RequiredQuantityModal
      isOpen={modalState.isOpen}
      onClose={closeModal}
      data={modalState.data}
      type={modalState.type}
      forecastMonth={modalState.forecastMonth}
    />
      {/* Header with Controls */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Description */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Forecast Algorithm Variables
              </h1>
              
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
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
              {availableForecastTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Group Filter */}
            {availableGroups.length > 1 && (
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {availableGroups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {(selectedForecastType === "all" || selectedForecastType === "store") &&
        hasStoreData &&
        (viewMode === "grouped"
          ? renderGroupedView(
              store_forecast,
              "store",
              "Store Forecast Variables",
              "bg-blue-50"
            )
          : renderFlatView(
              store_forecast,
              "store",
              "Store Forecast Variables",
              "bg-blue-50"
            ))}

      {(selectedForecastType === "all" || selectedForecastType === "com") &&
        hasComData &&
        (viewMode === "grouped"
          ? renderGroupedView(
              com_forecast,
              "com",
              "COM Forecast Variables",
              "bg-green-50"
            )
          : renderFlatView(
              com_forecast,
              "com",
              "COM Forecast Variables",
              "bg-green-50"
            ))}

      {(selectedForecastType === "all" || selectedForecastType === "omni") &&
        hasOmniData &&
        (viewMode === "grouped"
          ? renderGroupedView(
              omni_forecast,
              "omni",
              "Omni Forecast Variables",
              "bg-purple-50"
            )
          : renderFlatView(
              omni_forecast,
              "omni",
              "Omni Forecast Variables",
              "bg-purple-50"
            ))}
    </div>
  );
};

export default ForecastVariableCards;
