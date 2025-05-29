// // Complete ProductSelector.jsx with enhanced dropdown filters and separate notes column
// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   ChevronDown,
//   Filter,
//   X,
//   Eye,
//   Package,
//   Store,
//   Globe,
//   FileDown,
//   ArrowLeft,
//   Search,
//   CheckCircle,
//   Clock,
//   User,
//   FileText,
//   Plus,
//   AlertCircle,
//   MessageSquare,
//   RefreshCw,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import ProductDetailsView from "./ProductDetailsView";
// import NotesModal from "./NotesModal";

// // Import Redux actions and selectors
// import {
//   fetchProducts,
//   setSelectedProductType,
//   setSelectedProduct,
//   clearSelectedProduct,
//   selectCurrentProducts,
//   selectProductsLoading,
//   selectSelectedProductType,
//   selectSelectedProduct,
//   selectStoreProducts,
//   selectComProducts,
//   selectOmniProducts,
// } from "../redux/productSlice";

// import { setCurrentView, addToast, selectCurrentView } from "../redux/uiSlice";
// import { selectCurrentSession } from "../redux/forecastSlice";

// function ProductSelector() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Redux state
//   const products = useSelector(selectCurrentProducts);
//   const loading = useSelector(selectProductsLoading);
//   const selectedProductType = useSelector(selectSelectedProductType);
//   const currentView = useSelector(selectCurrentView);
//   const forecastSession = useSelector(selectCurrentSession);
//   const selectedProduct = useSelector(selectSelectedProduct);

//   // Individual product type selectors for correct counts
//   const storeProducts = useSelector(selectStoreProducts);
//   const comProducts = useSelector(selectComProducts);
//   const omniProducts = useSelector(selectOmniProducts);

//   // Enhanced filter state based on API
//   const [selectedFilters, setSelectedFilters] = useState({
//     category: [],
//     birthstone: [],
//     red_box_item: [],
//     vdf_status: [],
//     considered_birthstone: null,
//     added_qty_macys_soq: null,
//     below_min_order: null,
//     over_macys_soq: null,
//     added_only_to_balance_soq: null,
//     need_to_review_first: null,
//     // Holiday filters
//     valentine_day: null,
//     mothers_day: null,
//     fathers_day: null,
//     mens_day: null,
//     womens_day: null,
//   });

//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [availableFilters, setAvailableFilters] = useState({
//     categories: [],
//     birthstones: [],
//     red_box_items: [],
//     vdf_statuses: [],
//   });

//   const [filtersLoading, setFiltersLoading] = useState(true);

//   // Notes modal state
//   const [notesModal, setNotesModal] = useState({
//     isOpen: false,
//     productId: null,
//     productName: "",
//   });

//   // Product notes state
//   const [productNotesData, setProductNotesData] = useState({});

//   // Special days dropdown state
//   const [specialDaysDropdownOpen, setSpecialDaysDropdownOpen] = useState(false);

//   const itemsPerPage = 50;

//   // Product type configuration
//   const productTypeConfig = {
//     store: {
//       icon: Store,
//       label: "Store Products",
//       color: "blue",
//     },
//     com: {
//       icon: Package,
//       label: "COM Products",
//       color: "green",
//     },
//     omni: {
//       icon: Globe,
//       label: "Omni Products",
//       color: "purple",
//     },
//   };

//   // Boolean filter options
//   const booleanOptions = [
//     { value: "", label: "All" },
//     { value: "true", label: "Yes" },
//     { value: "false", label: "No" },
//   ];

//   // Special Day (Holiday) filter configuration
//   const specialDayFilters = [
//     { key: "valentine_day", label: "Valentine's Day" },
//     { key: "mothers_day", label: "Mother's Day" },
//     { key: "fathers_day", label: "Father's Day" },
//     { key: "mens_day", label: "Men's Day" },
//     { key: "womens_day", label: "Women's Day" },
//   ];

//   // Additional boolean filters configuration
//   const additionalBooleanFilters = [
//     {
//       key: "considered_birthstone",
//       label: "Considered Birthstone",
//       showFor: ["store", "omni"],
//     },
//     {
//       key: "added_qty_macys_soq",
//       label: "Added Qty Macy's SOQ",
//       showFor: ["store", "com", "omni"],
//     },
//     {
//       key: "below_min_order",
//       label: "Below Min Order",
//       showFor: ["store", "com", "omni"],
//     },
//     {
//       key: "over_macys_soq",
//       label: "Over Macy's SOQ",
//       showFor: ["store", "com", "omni"],
//     },
//     {
//       key: "added_only_to_balance_soq",
//       label: "Added Only to Balance SOQ",
//       showFor: ["store", "com", "omni"],
//     },
//     {
//       key: "need_to_review_first",
//       label: "Need to Review First",
//       showFor: ["store", "com", "omni"],
//     },
//   ];

//   // Initialize data and filters
//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         await loadAvailableFilters();
//         dispatch(
//           fetchProducts({
//             productType: selectedProductType,
//             filters: selectedFilters,
//           })
//         );
//       } catch (error) {
//         dispatch(
//           addToast({
//             type: "error",
//             message: "Failed to initialize data",
//             duration: 5000,
//           })
//         );
//       }
//     };

//     initializeData();
//   }, [dispatch, selectedProductType]);

//   // Refetch products when filters change
//   useEffect(() => {
//     if (!filtersLoading) {
//       dispatch(
//         fetchProducts({
//           productType: selectedProductType,
//           filters: selectedFilters,
//         })
//       );
//     }
//   }, [dispatch, selectedProductType, selectedFilters, filtersLoading]);

//   // Load forecast data from session
//   useEffect(() => {
//     if (forecastSession?.selectedCategories) {
//       const selectedCategoryNames = forecastSession.selectedCategories.map(
//         (cat) => cat.name
//       );
//       setSelectedFilters((prev) => ({
//         ...prev,
//         category: selectedCategoryNames,
//       }));
//     }
//   }, [forecastSession]);

//   // Load product notes data when products change
//   useEffect(() => {
//     if (products.length > 0) {
//       loadProductNotesData();
//     }
//   }, [products]);

//   // Load comprehensive product notes data
//   const loadProductNotesData = async () => {
//     try {
//       const productIds = products.map((p) => p.pid);
//       const uniqueIds = [...new Set(productIds)];

//       const response = await fetch(
//         `${import.meta.env.VITE_API_BASE_URL}/forecast/forecast-notes/`
//       );
//       const allNotes = await response.json();

//       const notesData = {};
//       const notes = allNotes.results || allNotes;

//       uniqueIds.forEach((pid) => {
//         const productNotes = notes.filter((note) => note.pid === pid);

//         if (productNotes.length > 0) {
//           const sortedNotes = productNotes.sort(
//             (a, b) => new Date(b.created_at) - new Date(a.created_at)
//           );
//           const latestNote = sortedNotes[0];

//           const hasUnreviewed = productNotes.some((note) => !note.reviewed);
//           const allReviewed = productNotes.every((note) => note.reviewed);

//           let status = "pending";
//           if (allReviewed && productNotes.length > 0) {
//             status = "reviewed";
//           } else if (hasUnreviewed) {
//             status = "not_reviewed";
//           }

//           notesData[pid] = {
//             notes: sortedNotes,
//             latestNote: latestNote,
//             assignedTo: latestNote.assigned_to || "Unassigned",
//             status: status,
//             count: productNotes.length,
//             hasUnreviewed: hasUnreviewed,
//           };
//         } else {
//           notesData[pid] = {
//             notes: [],
//             latestNote: null,
//             assignedTo: "Unassigned",
//             status: "pending",
//             count: 0,
//             hasUnreviewed: false,
//           };
//         }
//       });

//       setProductNotesData(notesData);
//     } catch (error) {
//       console.error("Error loading product notes data:", error);
//     }
//   };

//   // Memoized filtered and sorted products
//   const processedProducts = useMemo(() => {
//     let filteredProducts = [...products];

//     // Apply search filter
//     if (searchQuery) {
//       filteredProducts = filteredProducts.filter(
//         (product) =>
//           product.pid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           product.category?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     return filteredProducts;
//   }, [products, searchQuery]);

//   // Pagination calculations
//   const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentProducts = processedProducts.slice(startIndex, endIndex);

//   // Load available filter options from API
//   const loadAvailableFilters = async () => {
//     setFiltersLoading(true);
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_API_BASE_URL}/forecast/query/filter_products/`
//       );
//       const data = await response.json();

//       const allProducts = [
//         ...(data.store_products || []),
//         ...(data.com_products || []),
//         ...(data.omni_products || []),
//       ];

//       // Extract unique values for each filter
//       const categories = [
//         ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
//       ];

//       const birthstones = [
//         ...new Set(allProducts.map((p) => p.birthstone).filter(Boolean)),
//       ];

//       const redBoxItems = ["Yes", "No"];
//       const vdfStatuses = ["Active", "Inactive"];

//       setAvailableFilters({
//         categories: categories.sort(),
//         birthstones: birthstones.sort(),
//         red_box_items: redBoxItems,
//         vdf_statuses: vdfStatuses,
//       });
//     } catch (error) {
//       console.error("Error loading filter options:", error);
//       dispatch(
//         addToast({
//           type: "error",
//           message: "Failed to load filter options",
//           duration: 5000,
//         })
//       );
//     } finally {
//       setFiltersLoading(false);
//     }
//   };

//   // Handle product type change
//   const handleProductTypeChange = (productType) => {
//     dispatch(setSelectedProductType(productType));
//     setCurrentPage(1);
//   };

//   // Handle multi-select filter changes
//   const handleMultiSelectFilterChange = (filterKey, value, checked) => {
//     const currentValues = selectedFilters[filterKey] || [];
//     const newValues = checked
//       ? [...currentValues, value]
//       : currentValues.filter((item) => item !== value);

//     setSelectedFilters((prev) => ({
//       ...prev,
//       [filterKey]: newValues,
//     }));
//     setCurrentPage(1);
//   };

//   // Handle single-select filter changes (for boolean filters)
//   const handleSingleSelectFilterChange = (filterKey, value) => {
//     setSelectedFilters((prev) => ({
//       ...prev,
//       [filterKey]: value === "" ? null : value,
//     }));
//     setCurrentPage(1);
//   };

//   // Handle search
//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     setCurrentPage(1);
//   };

//   // Handle view details
//   const handleViewDetails = (product) => {
//     dispatch(setSelectedProduct(product));
//     dispatch(setCurrentView("details"));
//   };

//   // Handle back to selector
//   const handleBackToSelector = () => {
//     dispatch(clearSelectedProduct());
//     dispatch(setCurrentView("selector"));
//   };

//   // Handle notes modal
//   const handleOpenNotes = (product) => {
//     setNotesModal({
//       isOpen: true,
//       productId: product.pid,
//       productName: product.category || "",
//     });
//   };

//   const handleCloseNotes = () => {
//     setNotesModal({
//       isOpen: false,
//       productId: null,
//       productName: "",
//     });
//     loadProductNotesData();
//   };

//   // Clear all filters
//   const clearAllFilters = () => {
//     setSelectedFilters({
//       category: [],
//       birthstone: [],
//       red_box_item: [],
//       vdf_status: [],
//       considered_birthstone: null,
//       added_qty_macys_soq: null,
//       below_min_order: null,
//       over_macys_soq: null,
//       added_only_to_balance_soq: null,
//       need_to_review_first: null,
//       valentine_day: null,
//       mothers_day: null,
//       fathers_day: null,
//       mens_day: null,
//       womens_day: null,
//     });
//     setSearchQuery("");
//   };

//   // Refresh data
//   const handleRefresh = () => {
//     loadAvailableFilters();
//     dispatch(
//       fetchProducts({
//         productType: selectedProductType,
//         filters: selectedFilters,
//       })
//     );
//   };

//   // Format status display
//   const formatStatusDisplay = (product) => {
//     const notesData = productNotesData[product.pid];

//     if (!notesData) {
//       return (
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
//           <Clock size={12} className="mr-1" />
//           Pending
//         </span>
//       );
//     }

//     switch (notesData.status) {
//       case "reviewed":
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//             <CheckCircle size={12} className="mr-1" />
//             Reviewed
//           </span>
//         );
//       case "not_reviewed":
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//             <AlertCircle size={12} className="mr-1" />
//             Not Reviewed
//           </span>
//         );
//       default:
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//             <Clock size={12} className="mr-1" />
//             Pending
//           </span>
//         );
//     }
//   };

//   // Format notes display in separate column
//   const formatNotesDisplay = (product) => {
//     const notesData = productNotesData[product.pid];

//     if (!notesData || notesData.count === 0) {
//       return (
//         <div className="flex items-center justify-center gap-1 text-gray-400 hover:text-indigo-600 cursor-pointer">
//           <MessageSquare size={14} />
//           <span className="text-xs">Add note</span>
//         </div>
//       );
//     }

//     return (
//       <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
//         <MessageSquare size={14} className="text-blue-500" />
//         <span className="text-sm font-medium text-blue-600">
//           {notesData.count}
//         </span>
//         {notesData.hasUnreviewed && (
//           <div
//             className="w-2 h-2 bg-red-500 rounded-full"
//             title="Has unreviewed notes"
//           ></div>
//         )}
//       </div>
//     );
//   };

//   // Format assigned to display
//   const formatAssignedToDisplay = (product) => {
//     const notesData = productNotesData[product.pid];
//     const assignedTo = notesData?.assignedTo || "Unassigned";

//     return (
//       <div className="flex items-center gap-1">
//         <User size={14} className="text-gray-400" />
//         <span className="text-sm">{assignedTo}</span>
//       </div>
//     );
//   };

//   // Get added qty
//   const getAddedQty = (product) => {
//     return product.total_added_qty || product.added_qty_macys_soq || 0;
//   };

//   // Get the correct count for each product type
//   const getProductCount = (productType) => {
//     switch (productType) {
//       case "store":
//         return storeProducts.length;
//       case "com":
//         return comProducts.length;
//       case "omni":
//         return omniProducts.length;
//       default:
//         return 0;
//     }
//   };

//   // Check if filters have active values
//   const hasActiveFilters =
//     Object.values(selectedFilters).some((filterValue) => {
//       if (Array.isArray(filterValue)) {
//         return filterValue.length > 0;
//       }
//       return filterValue !== null;
//     }) || searchQuery.length > 0;

//   // Render multi-select dropdown
//   const renderMultiSelectDropdown = (filterKey, options, label) => {
//     if (!options || options.length === 0) return null;

//     const selectedValues = selectedFilters[filterKey] || [];

//     return (
//       <div className="space-y-2">
//         <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
//           {label}
//         </label>
//         <div className="relative">
//           <div className="border border-gray-300 rounded-lg p-2 bg-white min-h-[40px] max-h-32 overflow-y-auto">
//             {options.map((option) => (
//               <label
//                 key={option}
//                 className="flex items-center gap-2 py-1 hover:bg-gray-50 cursor-pointer"
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedValues.includes(option)}
//                   onChange={(e) =>
//                     handleMultiSelectFilterChange(
//                       filterKey,
//                       option,
//                       e.target.checked
//                     )
//                   }
//                   className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                 />
//                 <span className="text-sm text-gray-700">{option}</span>
//               </label>
//             ))}
//           </div>
//           {selectedValues.length > 0 && (
//             <div className="mt-1 flex items-center justify-between">
//               <span className="text-xs text-indigo-600">
//                 {selectedValues.length} selected
//               </span>
//               <button
//                 onClick={() =>
//                   setSelectedFilters((prev) => ({ ...prev, [filterKey]: [] }))
//                 }
//                 className="text-xs text-gray-400 hover:text-gray-600"
//               >
//                 Clear
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Render single-select dropdown
//   const renderSingleSelectDropdown = (filterKey, label) => {
//     return (
//       <div className="space-y-2">
//         <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
//           {label}
//         </label>
//         <select
//           value={selectedFilters[filterKey] || ""}
//           onChange={(e) =>
//             handleSingleSelectFilterChange(filterKey, e.target.value)
//           }
//           className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
//         >
//           {booleanOptions.map((option) => (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//       </div>
//     );
//   };

//   // Render special day filters as checkbox dropdown
//   const renderSpecialDayFilters = () => {
//     const selectedSpecialDays = specialDayFilters.filter(
//       (filter) => selectedFilters[filter.key] === "true"
//     );

//     return (
//       <div className="space-y-2">
//         <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
//           Special Days
//         </label>
//         <div className="relative">
//           <button
//             type="button"
//             onClick={() => setSpecialDaysDropdownOpen(!specialDaysDropdownOpen)}
//             className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//           >
//             <span className="text-gray-700">
//               {selectedSpecialDays.length > 0
//                 ? `${selectedSpecialDays.length} selected`
//                 : "Select special days"}
//             </span>
//             <ChevronDown
//               size={16}
//               className={`text-gray-400 transition-transform ${
//                 specialDaysDropdownOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {specialDaysDropdownOpen && (
//             <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
//               <div className="p-2 max-h-48 overflow-y-auto">
//                 {specialDayFilters.map((filter) => (
//                   <label
//                     key={filter.key}
//                     className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 cursor-pointer rounded"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedFilters[filter.key] === "true"}
//                       onChange={(e) =>
//                         handleSingleSelectFilterChange(
//                           filter.key,
//                           e.target.checked ? "true" : ""
//                         )
//                       }
//                       className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                     />
//                     <span className="text-sm text-gray-700">
//                       {filter.label}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//               {selectedSpecialDays.length > 0 && (
//                 <div className="border-t border-gray-200 p-2">
//                   <button
//                     onClick={() => {
//                       const clearedFilters = { ...selectedFilters };
//                       specialDayFilters.forEach((filter) => {
//                         clearedFilters[filter.key] = null;
//                       });
//                       setSelectedFilters(clearedFilters);
//                     }}
//                     className="text-xs text-gray-400 hover:text-gray-600"
//                   >
//                     Clear all special days
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//         {selectedSpecialDays.length > 0 && (
//           <div className="mt-1">
//             <span className="text-xs text-indigo-600">
//               {selectedSpecialDays.length} selected
//             </span>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Show details view if in details mode
//   if (currentView === "details") {
//     return (
//       <ProductDetailsView
//         productId={selectedProduct?.pid}
//         onBack={handleBackToSelector}
//       />
//     );
//   }

//   return (
//     <>
//       <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6">
//           <div className="flex justify-between items-start">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <button
//                   onClick={() => navigate("/forecast")}
//                   className="text-white opacity-80 hover:opacity-100 flex items-center gap-2"
//                 >
//                   <ArrowLeft size={16} />
//                   Back to Forecast
//                 </button>
//                 {forecastSession?.downloadUrl && (
//                   <a
//                     href={forecastSession.downloadUrl}
//                     className="text-white opacity-80 hover:opacity-100 flex items-center gap-2 ml-4"
//                     download
//                   >
//                     <FileDown size={16} />
//                     Download Forecast
//                   </a>
//                 )}
//               </div>
//               <h1 className="text-2xl font-bold text-white">
//                 Product Selector
//               </h1>
//               <p className="text-indigo-100 mt-1">
//                 Enhanced filtering with dropdown controls and separate notes
//               </p>
//             </div>
//             <button
//               onClick={handleRefresh}
//               className="text-white opacity-80 hover:opacity-100 p-2 rounded-lg hover:bg-white/10"
//               title="Refresh Data"
//             >
//               <RefreshCw size={18} />
//             </button>
//           </div>
//         </div>

//         <div className="p-6">
//           {/* Forecast Information Banner */}
//           {forecastSession && (
//             <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-sm font-medium text-indigo-800 mb-2">
//                     Active Forecast Session
//                   </h3>
//                   <div className="text-sm text-indigo-700 space-y-1">
//                     <p>
//                       <strong>Categories:</strong>{" "}
//                       {forecastSession.selectedCategories
//                         ?.map((cat) => `${cat.name} (${cat.value})`)
//                         .join(", ")}
//                     </p>
//                     <p>
//                       <strong>Period:</strong> {forecastSession.monthFrom} to{" "}
//                       {forecastSession.monthTo} ({forecastSession.percentage}%)
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Search Bar */}
//           <div className="mb-6">
//             <div className="relative">
//               <Search
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 size={20}
//               />
//               <input
//                 type="text"
//                 placeholder="Search products by ID or category..."
//                 value={searchQuery}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//           </div>

//           {/* Product Type Tabs */}
//           <div className="border-b border-gray-200 mb-6">
//             <nav className="-mb-px flex space-x-8">
//               {Object.entries(productTypeConfig).map(([type, config]) => {
//                 const IconComponent = config.icon;
//                 return (
//                   <button
//                     key={type}
//                     onClick={() => handleProductTypeChange(type)}
//                     className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
//                       selectedProductType === type
//                         ? "border-indigo-500 text-indigo-600"
//                         : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                     }`}
//                   >
//                     <IconComponent size={18} />
//                     {config.label}
//                     <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
//                       {getProductCount(type)}
//                     </span>
//                   </button>
//                 );
//               })}
//             </nav>
//           </div>

//           {/* Enhanced Filters Section */}
//           <div className="bg-gray-50 rounded-lg p-6 mb-6">
//             <div className="flex items-center gap-2 mb-6">
//               <Filter size={16} className="text-gray-600" />
//               <span className="text-sm font-medium text-gray-700">
//                 Advanced Filters:
//               </span>
//               {hasActiveFilters && (
//                 <button
//                   onClick={clearAllFilters}
//                   className="ml-auto text-sm text-indigo-600 hover:text-indigo-800 font-medium"
//                 >
//                   Clear All Filters
//                 </button>
//               )}
//             </div>

//             {filtersLoading ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="flex items-center gap-2">
//                   <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//                   <span className="text-sm text-gray-600">
//                     Loading filters...
//                   </span>
//                 </div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {/* Multi-select Dropdown Filters */}
//                 <div className="space-y-4">
//                   {renderMultiSelectDropdown(
//                     "category",
//                     availableFilters.categories,
//                     "Categories"
//                   )}

//                   {(selectedProductType === "store" ||
//                     selectedProductType === "omni") &&
//                     renderMultiSelectDropdown(
//                       "birthstone",
//                       availableFilters.birthstones,
//                       "Birthstones"
//                     )}

//                   {renderMultiSelectDropdown(
//                     "red_box_item",
//                     availableFilters.red_box_items,
//                     "Red Box Items"
//                   )}

//                   {selectedProductType === "com" &&
//                     renderMultiSelectDropdown(
//                       "vdf_status",
//                       availableFilters.vdf_statuses,
//                       "VDF Status"
//                     )}
//                 </div>

//                 {/* Additional Boolean Filters */}
//                 <div className="space-y-4">
//                   {additionalBooleanFilters
//                     .filter((filter) =>
//                       filter.showFor.includes(selectedProductType)
//                     )
//                     .slice(0, 3)
//                     .map((filter) =>
//                       renderSingleSelectDropdown(filter.key, filter.label)
//                     )}
//                 </div>

//                 <div className="space-y-4">
//                   {additionalBooleanFilters
//                     .filter((filter) =>
//                       filter.showFor.includes(selectedProductType)
//                     )
//                     .slice(3)
//                     .map((filter) =>
//                       renderSingleSelectDropdown(filter.key, filter.label)
//                     )}
//                 </div>

//                 {/* Special Days Filter */}
//                 <div className="space-y-4">{renderSpecialDayFilters()}</div>
//               </div>
//             )}
//           </div>

//           {/* Products Display */}
//           <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//             <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
//               <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                 {React.createElement(
//                   productTypeConfig[selectedProductType].icon,
//                   { size: 20 }
//                 )}
//                 {productTypeConfig[selectedProductType].label}
//               </h3>
//               <div className="flex items-center gap-4">
//                 <span className="text-sm text-gray-500">
//                   {processedProducts.length} products found
//                 </span>
//                 {loading && (
//                   <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//                 )}
//               </div>
//             </div>

//             {loading ? (
//               <div className="flex justify-center items-center py-12">
//                 <div className="text-center">
//                   <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
//                   <p className="text-gray-600">Loading products...</p>
//                 </div>
//               </div>
//             ) : currentProducts.length === 0 ? (
//               <div className="text-center py-12 text-gray-500">
//                 <Package size={64} className="mx-auto mb-4 text-gray-300" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   No Products Found
//                 </h3>
//                 <p className="mb-4">
//                   {hasActiveFilters || searchQuery
//                     ? "No products match the current filters or search query."
//                     : "No products available for this category."}
//                 </p>
//                 {(hasActiveFilters || searchQuery) && (
//                   <button
//                     onClick={clearAllFilters}
//                     className="text-indigo-600 hover:text-indigo-800 font-medium"
//                   >
//                     Clear all filters and search
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Product ID
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Category
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Assigned To
//                       </th>
//                       <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Notes
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Forecast Month
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Added Qty
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {currentProducts.map((product, index) => (
//                       <tr
//                         key={`${product.pid}-${index}`}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           <div className="flex items-center">
//                             <span className="font-mono">{product.pid}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                             {product.category}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {formatAssignedToDisplay(product)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           <div
//                             className="flex justify-center cursor-pointer p-2 rounded hover:bg-gray-100"
//                             onClick={() => handleOpenNotes(product)}
//                             title="Click to manage notes"
//                           >
//                             {formatNotesDisplay(product)}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {product.forecast_month ? (
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//                               {product.forecast_month}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">-</span>
//                           )}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                             {getAddedQty(product).toLocaleString()}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {formatStatusDisplay(product)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
//                           <div className="flex items-center justify-center gap-3">
//                             <button
//                               onClick={() => handleViewDetails(product)}
//                               className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded hover:bg-indigo-50"
//                               title="View Details"
//                             >
//                               <Eye size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleOpenNotes(product)}
//                               className="text-green-600 hover:text-green-900 transition-colors p-1 rounded hover:bg-green-50"
//                               title="Manage Notes"
//                             >
//                               <FileText size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="mt-6 flex items-center justify-between">
//               <div className="text-sm text-gray-500">
//                 Showing {startIndex + 1} to{" "}
//                 {Math.min(endIndex, processedProducts.length)} of{" "}
//                 {processedProducts.length} products
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//                 >
//                   Previous
//                 </button>

//                 {[...Array(Math.min(5, totalPages))].map((_, i) => {
//                   const pageNum = Math.max(1, currentPage - 2) + i;
//                   if (pageNum > totalPages) return null;

//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => setCurrentPage(pageNum)}
//                       className={`px-3 py-1 border rounded text-sm ${
//                         currentPage === pageNum
//                           ? "border-indigo-500 bg-indigo-50 text-indigo-600"
//                           : "border-gray-300 hover:bg-gray-50"
//                       }`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 })}

//                 <button
//                   onClick={() =>
//                     setCurrentPage(Math.min(totalPages, currentPage + 1))
//                   }
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Summary Cards */}
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-blue-800">
//                     Total Products
//                   </p>
//                   <p className="text-2xl font-bold text-blue-900">
//                     {processedProducts.length}
//                   </p>
//                 </div>
//                 <Package className="text-blue-600" size={24} />
//               </div>
//             </div>

//             <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-green-800">Reviewed</p>
//                   <p className="text-2xl font-bold text-green-900">
//                     {
//                       Object.values(productNotesData).filter(
//                         (data) => data.status === "reviewed"
//                       ).length
//                     }
//                   </p>
//                 </div>
//                 <CheckCircle className="text-green-600" size={24} />
//               </div>
//             </div>

//             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-red-800">
//                     Not Reviewed
//                   </p>
//                   <p className="text-2xl font-bold text-red-900">
//                     {
//                       Object.values(productNotesData).filter(
//                         (data) => data.status === "not_reviewed"
//                       ).length
//                     }
//                   </p>
//                 </div>
//                 <AlertCircle className="text-red-600" size={24} />
//               </div>
//             </div>

//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-yellow-800">Pending</p>
//                   <p className="text-2xl font-bold text-yellow-900">
//                     {
//                       Object.values(productNotesData).filter(
//                         (data) => data.status === "pending"
//                       ).length
//                     }
//                   </p>
//                 </div>
//                 <Clock className="text-yellow-600" size={24} />
//               </div>
//             </div>
//           </div>

//           {/* Active Filters Summary */}
//           {hasActiveFilters && (
//             <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <h4 className="text-sm font-medium text-blue-800 mb-3">
//                 Active Filters:
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {Object.entries(selectedFilters).map(
//                   ([filterKey, filterValue]) => {
//                     if (Array.isArray(filterValue) && filterValue.length > 0) {
//                       return filterValue.map((value) => (
//                         <span
//                           key={`${filterKey}-${value}`}
//                           className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200"
//                         >
//                           <span className="font-medium">
//                             {filterKey.replace("_", " ")}:
//                           </span>{" "}
//                           {value}
//                           <button
//                             onClick={() =>
//                               handleMultiSelectFilterChange(
//                                 filterKey,
//                                 value,
//                                 false
//                               )
//                             }
//                             className="text-blue-600 hover:text-blue-800 ml-1 hover:bg-blue-200 rounded-full p-0.5"
//                           >
//                             <X size={12} />
//                           </button>
//                         </span>
//                       ));
//                     } else if (filterValue !== null && filterValue !== "") {
//                       const displayValue =
//                         filterValue === "true"
//                           ? "Yes"
//                           : filterValue === "false"
//                           ? "No"
//                           : filterValue;
//                       return (
//                         <span
//                           key={filterKey}
//                           className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200"
//                         >
//                           <span className="font-medium">
//                             {filterKey === "valentine_day"
//                               ? "Valentine's Day"
//                               : filterKey === "mothers_day"
//                               ? "Mother's Day"
//                               : filterKey === "fathers_day"
//                               ? "Father's Day"
//                               : filterKey === "mens_day"
//                               ? "Men's Day"
//                               : filterKey === "womens_day"
//                               ? "Women's Day"
//                               : filterKey.replace("_", " ")}
//                             :
//                           </span>{" "}
//                           {displayValue}
//                           <button
//                             onClick={() =>
//                               handleSingleSelectFilterChange(filterKey, "")
//                             }
//                             className="text-blue-600 hover:text-blue-800 ml-1 hover:bg-blue-200 rounded-full p-0.5"
//                           >
//                             <X size={12} />
//                           </button>
//                         </span>
//                       );
//                     }
//                     return null;
//                   }
//                 )}
//                 {searchQuery && (
//                   <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200">
//                     <span className="font-medium">search:</span> {searchQuery}
//                     <button
//                       onClick={() => setSearchQuery("")}
//                       className="text-blue-600 hover:text-blue-800 ml-1 hover:bg-blue-200 rounded-full p-0.5"
//                     >
//                       <X size={12} />
//                     </button>
//                   </span>
//                 )}
//               </div>
//               <div className="mt-3 text-xs text-blue-600">
//                 {Object.values(selectedFilters)
//                   .flat()
//                   .filter((v) => v !== null && v !== "").length +
//                   (searchQuery ? 1 : 0)}{" "}
//                 filters applied
//               </div>
//             </div>
//           )}

//           {/* Help Text */}
//           <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
//             <h4 className="text-sm font-medium text-gray-800 mb-2">
//               Filter Guide:
//             </h4>
//             <div className="text-xs text-gray-600 space-y-1">
//               <p>
//                 • <strong>Multi-select filters:</strong> You can select multiple
//                 options for Categories, Birthstones, Red Box Items, and VDF
//                 Status
//               </p>
//               <p>
//                 • <strong>Boolean filters:</strong> Choose Yes/No/All for
//                 options like "Below Min Order", "Need to Review First", etc.
//               </p>
//               <p>
//                 • <strong>Special Days:</strong> Select holidays using the
//                 dropdown with checkboxes
//               </p>
//               <p>
//                 • <strong>Notes column:</strong> Click on the notes indicator to
//                 add or manage notes for each product
//               </p>
//               <p>
//                 • <strong>Search:</strong> Search by Product ID or Category name
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Notes Modal for adding/editing notes */}
//       <NotesModal
//         isOpen={notesModal.isOpen}
//         onClose={handleCloseNotes}
//         productId={notesModal.productId}
//         productName={notesModal.productName}
//       />
//     </>
//   );
// }

// export default ProductSelector;

// Complete ProductSelector.jsx with enhanced dropdown filters and separate notes column
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  Filter,
  X,
  Eye,
  Package,
  Store,
  Globe,
  FileDown,
  ArrowLeft,
  Search,
  CheckCircle,
  Clock,
  User,
  FileText,
  Plus,
  AlertCircle,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductDetailsView from "./ProductDetailsView";
import NotesModal from "./NotesModal";

// Import Redux actions and selectors
import {
  fetchProducts,
  setSelectedProductType,
  setSelectedProduct,
  clearSelectedProduct,
  selectCurrentProducts,
  selectProductsLoading,
  selectSelectedProductType,
  selectSelectedProduct,
  selectStoreProducts,
  selectComProducts,
  selectOmniProducts,
} from "../redux/productSlice";

import { setCurrentView, addToast, selectCurrentView } from "../redux/uiSlice";
import { selectCurrentSession } from "../redux/forecastSlice";

function ProductSelector() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const products = useSelector(selectCurrentProducts);
  const loading = useSelector(selectProductsLoading);
  const selectedProductType = useSelector(selectSelectedProductType);
  const currentView = useSelector(selectCurrentView);
  const forecastSession = useSelector(selectCurrentSession);
  const selectedProduct = useSelector(selectSelectedProduct);

  // Individual product type selectors for correct counts
  const storeProducts = useSelector(selectStoreProducts);
  const comProducts = useSelector(selectComProducts);
  const omniProducts = useSelector(selectOmniProducts);

  // Enhanced filter state based on API
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    birthstone: [],
    red_box_item: [],
    vdf_status: [],
    considered_birthstone: null,
    added_qty_macys_soq: null,
    below_min_order: null,
    over_macys_soq: null,
    added_only_to_balance_soq: null,
    need_to_review_first: null,
    // Holiday filters
    valentine_day: null,
    mothers_day: null,
    fathers_day: null,
    mens_day: null,
    womens_day: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    birthstones: [],
    red_box_items: [],
    vdf_statuses: [],
  });

  const [filtersLoading, setFiltersLoading] = useState(true);

  // Notes modal state
  const [notesModal, setNotesModal] = useState({
    isOpen: false,
    productId: null,
    productName: "",
  });

  // Product notes state
  const [productNotesData, setProductNotesData] = useState({});

  // Special days dropdown state
  const [specialDaysDropdownOpen, setSpecialDaysDropdownOpen] = useState(false);
  // Category download modal state
  const [categoryDownloadModal, setCategoryDownloadModal] = useState({
    isOpen: false,
    selectedCategories: [],
    availableCategories: [],
    isDownloading: false,
  });

  const itemsPerPage = 50;

  // Product type configuration
  const productTypeConfig = {
    store: {
      icon: Store,
      label: "Store Products",
      color: "blue",
    },
    com: {
      icon: Package,
      label: "COM Products",
      color: "green",
    },
    omni: {
      icon: Globe,
      label: "Omni Products",
      color: "purple",
    },
  };

  // Boolean filter options
  const booleanOptions = [
    { value: "", label: "All" },
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  // Special Day (Holiday) filter configuration
  const specialDayFilters = [
    { key: "valentine_day", label: "Valentine's Day" },
    { key: "mothers_day", label: "Mother's Day" },
    { key: "fathers_day", label: "Father's Day" },
    { key: "mens_day", label: "Men's Day" },
    { key: "womens_day", label: "Women's Day" },
  ];

  // Additional boolean filters configuration
  const additionalBooleanFilters = [
    {
      key: "considered_birthstone",
      label: "Considered Birthstone",
      showFor: ["store", "omni"],
    },
    {
      key: "added_qty_macys_soq",
      label: "Added Qty Macy's SOQ",
      showFor: ["store", "com", "omni"],
    },
    {
      key: "below_min_order",
      label: "Below Min Order",
      showFor: ["store", "com", "omni"],
    },
    {
      key: "over_macys_soq",
      label: "Over Macy's SOQ",
      showFor: ["store", "com", "omni"],
    },
    {
      key: "added_only_to_balance_soq",
      label: "Added Only to Balance SOQ",
      showFor: ["store", "com", "omni"],
    },
    {
      key: "need_to_review_first",
      label: "Need to Review First",
      showFor: ["store", "com", "omni"],
    },
  ];

  // Initialize data and filters
  useEffect(() => {
    const initializeData = async () => {
      try {
        await loadAvailableFilters();
        dispatch(
          fetchProducts({
            productType: selectedProductType,
            filters: selectedFilters,
          })
        );
      } catch (error) {
        dispatch(
          addToast({
            type: "error",
            message: "Failed to initialize data",
            duration: 5000,
          })
        );
      }
    };

    initializeData();
  }, [dispatch, selectedProductType]);

  // Refetch products when filters change
  useEffect(() => {
    if (!filtersLoading) {
      dispatch(
        fetchProducts({
          productType: selectedProductType,
          filters: selectedFilters,
        })
      );
    }
  }, [dispatch, selectedProductType, selectedFilters, filtersLoading]);

  // Load forecast data from session
  useEffect(() => {
    if (forecastSession?.selectedCategories) {
      const selectedCategoryNames = forecastSession.selectedCategories.map(
        (cat) => cat.name
      );
      setSelectedFilters((prev) => ({
        ...prev,
        category: selectedCategoryNames,
      }));
    }
  }, [forecastSession]);

  // Load product notes data when products change
  useEffect(() => {
    if (products.length > 0) {
      loadProductNotesData();
    }
  }, [products]);

  // Load comprehensive product notes data
  const loadProductNotesData = async () => {
    try {
      const productIds = products.map((p) => p.pid);
      const uniqueIds = [...new Set(productIds)];

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/forecast-notes/`
      );
      const allNotes = await response.json();

      const notesData = {};
      const notes = allNotes.results || allNotes;

      uniqueIds.forEach((pid) => {
        const productNotes = notes.filter((note) => note.pid === pid);

        if (productNotes.length > 0) {
          const sortedNotes = productNotes.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          const latestNote = sortedNotes[0];

          const hasUnreviewed = productNotes.some((note) => !note.reviewed);
          const allReviewed = productNotes.every((note) => note.reviewed);

          let status = "pending";
          if (allReviewed && productNotes.length > 0) {
            status = "reviewed";
          } else if (hasUnreviewed) {
            status = "not_reviewed";
          }

          notesData[pid] = {
            notes: sortedNotes,
            latestNote: latestNote,
            assignedTo: latestNote.assigned_to || "Unassigned",
            status: status,
            count: productNotes.length,
            hasUnreviewed: hasUnreviewed,
          };
        } else {
          notesData[pid] = {
            notes: [],
            latestNote: null,
            assignedTo: "Unassigned",
            status: "pending",
            count: 0,
            hasUnreviewed: false,
          };
        }
      });

      setProductNotesData(notesData);
    } catch (error) {
      console.error("Error loading product notes data:", error);
    }
  };

  // Memoized filtered and sorted products
  const processedProducts = useMemo(() => {
    let filteredProducts = [...products];

    // Apply search filter
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.pid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredProducts;
  }, [products, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = processedProducts.slice(startIndex, endIndex);

  // Load available filter options from API
  const loadAvailableFilters = async () => {
    setFiltersLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/query/filter_products/`
      );
      const data = await response.json();

      const allProducts = [
        ...(data.store_products || []),
        ...(data.com_products || []),
        ...(data.omni_products || []),
      ];

      // Extract unique values for each filter
      const categories = [
        ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
      ];

      const birthstones = [
        ...new Set(allProducts.map((p) => p.birthstone).filter(Boolean)),
      ];

      const redBoxItems = ["Yes", "No"];
      const vdfStatuses = ["Active", "Inactive"];

      setAvailableFilters({
        categories: categories.sort(),
        birthstones: birthstones.sort(),
        red_box_items: redBoxItems,
        vdf_statuses: vdfStatuses,
      });
      setCategoryDownloadModal((prev) => ({
        ...prev,
        availableCategories: categories.sort(),
      }));
    } catch (error) {
      console.error("Error loading filter options:", error);
      dispatch(
        addToast({
          type: "error",
          message: "Failed to load filter options",
          duration: 5000,
        })
      );
    } finally {
      setFiltersLoading(false);
    }
  };

  // Handle product type change
  const handleProductTypeChange = (productType) => {
    dispatch(setSelectedProductType(productType));
    setCurrentPage(1);
  };

  // Handle multi-select filter changes
  const handleMultiSelectFilterChange = (filterKey, value, checked) => {
    const currentValues = selectedFilters[filterKey] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((item) => item !== value);

    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: newValues,
    }));
    setCurrentPage(1);
  };

  // Handle single-select filter changes (for boolean filters)
  const handleSingleSelectFilterChange = (filterKey, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: value === "" ? null : value,
    }));
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Handle view details
  const handleViewDetails = (product) => {
    dispatch(setSelectedProduct(product));
    dispatch(setCurrentView("details"));
  };

  // Handle back to selector
  const handleBackToSelector = () => {
    dispatch(clearSelectedProduct());
    dispatch(setCurrentView("selector"));
  };

  // Handle notes modal
  const handleOpenNotes = (product) => {
    setNotesModal({
      isOpen: true,
      productId: product.pid,
      productName: product.category || "",
    });
  };

  const handleCloseNotes = () => {
    setNotesModal({
      isOpen: false,
      productId: null,
      productName: "",
    });
    loadProductNotesData();
  };

  const handleOpenCategoryDownload = () => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      isOpen: true,
      selectedCategories: [],
    }));
  };

  const handleCloseCategoryDownload = () => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      isOpen: false,
      selectedCategories: [],
      isDownloading: false,
    }));
  };

  const handleCategorySelectionChange = (category, checked) => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      selectedCategories: checked
        ? [...prev.selectedCategories, category]
        : prev.selectedCategories.filter((cat) => cat !== category),
    }));
  };

  const handleSelectAllCategories = () => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      selectedCategories: [...prev.availableCategories],
    }));
  };

  const handleDeselectAllCategories = () => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      selectedCategories: [],
    }));
  };

  const handleDownloadSelectedCategories = async () => {
    if (categoryDownloadModal.selectedCategories.length === 0) {
      dispatch(
        addToast({
          type: "error",
          message: "Please select at least one category to download",
          duration: 3000,
        })
      );
      return;
    }

    setCategoryDownloadModal((prev) => ({ ...prev, isDownloading: true }));

    try {
      const categoriesParam =
        categoryDownloadModal.selectedCategories.join(",");
      const filePath = forecastSession?.filePath || ""; // You need to get the file path from your session

      const downloadUrl = `${
        import.meta.env.VITE_API_BASE_URL
      }/forecast/download-category-sheet/?category=${encodeURIComponent(
        categoriesParam
      )}&file_path=${encodeURIComponent(filePath)}`;

      // Create a temporary link to trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download =
        categoryDownloadModal.selectedCategories.length === 1
          ? `${categoryDownloadModal.selectedCategories[0]}.xlsx`
          : "categories.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      dispatch(
        addToast({
          type: "success",
          message: `Downloaded ${categoryDownloadModal.selectedCategories.length} category file(s)`,
          duration: 3000,
        })
      );

      handleCloseCategoryDownload();
    } catch (error) {
      console.error("Error downloading categories:", error);
      dispatch(
        addToast({
          type: "error",
          message: "Failed to download category files",
          duration: 5000,
        })
      );
    } finally {
      setCategoryDownloadModal((prev) => ({ ...prev, isDownloading: false }));
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      category: [],
      birthstone: [],
      red_box_item: [],
      vdf_status: [],
      considered_birthstone: null,
      added_qty_macys_soq: null,
      below_min_order: null,
      over_macys_soq: null,
      added_only_to_balance_soq: null,
      need_to_review_first: null,
      valentine_day: null,
      mothers_day: null,
      fathers_day: null,
      mens_day: null,
      womens_day: null,
    });
    setSearchQuery("");
  };

  // Refresh data
  const handleRefresh = () => {
    loadAvailableFilters();
    dispatch(
      fetchProducts({
        productType: selectedProductType,
        filters: selectedFilters,
      })
    );
  };

  // Format status display
  const formatStatusDisplay = (product) => {
    const notesData = productNotesData[product.pid];

    if (!notesData) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          <Clock size={12} className="mr-1" />
          Pending
        </span>
      );
    }

    switch (notesData.status) {
      case "reviewed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Reviewed
          </span>
        );
      case "not_reviewed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle size={12} className="mr-1" />
            Not Reviewed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
    }
  };

  const generateMacysUrl = (product) => {
    // Use marketing_id for the Macy's product link
    const marketingId = product.marketing_id;
    const webidDescription = product.webid_description;

    if (!marketingId || !webidDescription) {
      return "#"; // Return placeholder if either field is not available
    }

    // Convert webid_description to URL-friendly slug
    const urlSlug = webidDescription
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // Remove special characters except spaces
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

    return `https://www.macys.com/shop/product/${urlSlug}?ID=${marketingId}&intnl=true`;
  };

  // Helper function to check if Macy's link can be generated
  const canGenerateMacysLink = (product) => {
    return product.marketing_id && product.webid_description;
  };

  // Format notes display in separate column
  const formatNotesDisplay = (product) => {
    const notesData = productNotesData[product.pid];

    if (!notesData || notesData.count === 0) {
      return (
        <div className="flex items-center justify-center gap-1 text-gray-400 hover:text-indigo-600 cursor-pointer">
          <MessageSquare size={14} />
          <span className="text-xs">Add note</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
        <MessageSquare size={14} className="text-blue-500" />
        <span className="text-sm font-medium text-blue-600">
          {notesData.count}
        </span>
        {notesData.hasUnreviewed && (
          <div
            className="w-2 h-2 bg-red-500 rounded-full"
            title="Has unreviewed notes"
          ></div>
        )}
      </div>
    );
  };

  // Format assigned to display
  const formatAssignedToDisplay = (product) => {
    const notesData = productNotesData[product.pid];
    const assignedTo = notesData?.assignedTo || "Unassigned";

    return (
      <div className="flex items-center gap-1">
        <User size={14} className="text-gray-400" />
        <span className="text-sm">{assignedTo}</span>
      </div>
    );
  };

  // Get added qty
  const getAddedQty = (product) => {
    return product.total_added_qty || product.added_qty_macys_soq || 0;
  };

  // Get the correct count for each product type
  const getProductCount = (productType) => {
    switch (productType) {
      case "store":
        return storeProducts.length;
      case "com":
        return comProducts.length;
      case "omni":
        return omniProducts.length;
      default:
        return 0;
    }
  };

  // Check if filters have active values
  const hasActiveFilters =
    Object.values(selectedFilters).some((filterValue) => {
      if (Array.isArray(filterValue)) {
        return filterValue.length > 0;
      }
      return filterValue !== null;
    }) || searchQuery.length > 0;

  // Render multi-select dropdown
  const renderMultiSelectDropdown = (filterKey, options, label) => {
    if (!options || options.length === 0) return null;

    const selectedValues = selectedFilters[filterKey] || [];

    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </label>
        <div className="relative">
          <div className="border border-gray-300 rounded-lg p-2 bg-white min-h-[40px] max-h-32 overflow-y-auto">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 py-1 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) =>
                    handleMultiSelectFilterChange(
                      filterKey,
                      option,
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          {selectedValues.length > 0 && (
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-indigo-600">
                {selectedValues.length} selected
              </span>
              <button
                onClick={() =>
                  setSelectedFilters((prev) => ({ ...prev, [filterKey]: [] }))
                }
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render single-select dropdown
  const renderSingleSelectDropdown = (filterKey, label) => {
    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </label>
        <select
          value={selectedFilters[filterKey] || ""}
          onChange={(e) =>
            handleSingleSelectFilterChange(filterKey, e.target.value)
          }
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
        >
          {booleanOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Render special day filters as checkbox dropdown
  const renderSpecialDayFilters = () => {
    const selectedSpecialDays = specialDayFilters.filter(
      (filter) => selectedFilters[filter.key] === "true"
    );

    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Special Days
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSpecialDaysDropdownOpen(!specialDaysDropdownOpen)}
            className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <span className="text-gray-700">
              {selectedSpecialDays.length > 0
                ? `${selectedSpecialDays.length} selected`
                : "Select special days"}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${
                specialDaysDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {specialDaysDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="p-2 max-h-48 overflow-y-auto">
                {specialDayFilters.map((filter) => (
                  <label
                    key={filter.key}
                    className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 cursor-pointer rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters[filter.key] === "true"}
                      onChange={(e) =>
                        handleSingleSelectFilterChange(
                          filter.key,
                          e.target.checked ? "true" : ""
                        )
                      }
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">
                      {filter.label}
                    </span>
                  </label>
                ))}
              </div>
              {selectedSpecialDays.length > 0 && (
                <div className="border-t border-gray-200 p-2">
                  <button
                    onClick={() => {
                      const clearedFilters = { ...selectedFilters };
                      specialDayFilters.forEach((filter) => {
                        clearedFilters[filter.key] = null;
                      });
                      setSelectedFilters(clearedFilters);
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear all special days
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {selectedSpecialDays.length > 0 && (
          <div className="mt-1">
            <span className="text-xs text-indigo-600">
              {selectedSpecialDays.length} selected
            </span>
          </div>
        )}
      </div>
    );
  };

  // Show details view if in details mode
  if (currentView === "details") {
    const handleNavigateToProduct = (productId) => {
      console.log("ProductSelector: Navigating to product:", productId);

      // Find the product in the current products list
      const allProducts = [...storeProducts, ...comProducts, ...omniProducts];
      const targetProduct = allProducts.find((p) => p.pid === productId);

      if (targetProduct) {
        dispatch(setSelectedProduct(targetProduct));
        // currentView stays as "details" so we stay in details view
      } else {
        console.error("Product not found:", productId);
      }
    };

    // Show details view if in details mode
    if (currentView === "details") {
      return (
        <ProductDetailsView
          productId={selectedProduct?.pid}
          onBack={handleBackToSelector}
          onNavigateToProduct={handleNavigateToProduct} // ADD THIS LINE
        />
      );
    }
    return (
      <ProductDetailsView
        productId={selectedProduct?.pid}
        onBack={handleBackToSelector}
      />
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate("/forecast")}
                  className="text-white opacity-80 hover:opacity-100 flex items-center gap-2 transition-opacity"
                >
                  <ArrowLeft size={16} />
                  Back to Forecast
                </button>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Product Selector
              </h1>
              <p className="text-indigo-100 mt-1">
                Enhanced filtering with dropdown controls and separate notes
              </p>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Download Button - More prominent */}
              {forecastSession?.downloadUrl && (
                <button
                  onClick={handleOpenCategoryDownload}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 border border-white/20"
                  title="Download Category Files"
                >
                  <FileDown size={18} />
                  <span className="hidden sm:inline">Download Categories</span>
                  <span className="sm:hidden">Download</span>
                </button>
              )}

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="text-white opacity-80 hover:opacity-100 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                title="Refresh Data"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Forecast Information Banner */}
          {forecastSession && (
            <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-indigo-800 mb-2">
                    Active Forecast Session
                  </h3>
                  <div className="text-sm text-indigo-700 space-y-1">
                    <p>
                      <strong>Categories:</strong>{" "}
                      {forecastSession.selectedCategories
                        ?.map((cat) => `${cat.name} (${cat.value})`)
                        .join(", ")}
                    </p>
                    <p>
                      <strong>Period:</strong> {forecastSession.monthFrom} to{" "}
                      {forecastSession.monthTo} ({forecastSession.percentage}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products by ID or category..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Product Type Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {Object.entries(productTypeConfig).map(([type, config]) => {
                const IconComponent = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => handleProductTypeChange(type)}
                    className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      selectedProductType === type
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent size={18} />
                    {config.label}
                    <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {getProductCount(type)}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Enhanced Filters Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Filter size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Advanced Filters:
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="ml-auto text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {filtersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">
                    Loading filters...
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Multi-select Dropdown Filters */}
                <div className="space-y-4">
                  {renderMultiSelectDropdown(
                    "category",
                    availableFilters.categories,
                    "Categories"
                  )}

                  {(selectedProductType === "store" ||
                    selectedProductType === "omni") &&
                    renderMultiSelectDropdown(
                      "birthstone",
                      availableFilters.birthstones,
                      "Birthstones"
                    )}

                  {renderMultiSelectDropdown(
                    "red_box_item",
                    availableFilters.red_box_items,
                    "Red Box Items"
                  )}

                  {selectedProductType === "com" &&
                    renderMultiSelectDropdown(
                      "vdf_status",
                      availableFilters.vdf_statuses,
                      "VDF Status"
                    )}
                </div>

                {/* Additional Boolean Filters */}
                <div className="space-y-4">
                  {additionalBooleanFilters
                    .filter((filter) =>
                      filter.showFor.includes(selectedProductType)
                    )
                    .slice(0, 3)
                    .map((filter) =>
                      renderSingleSelectDropdown(filter.key, filter.label)
                    )}
                </div>

                <div className="space-y-4">
                  {additionalBooleanFilters
                    .filter((filter) =>
                      filter.showFor.includes(selectedProductType)
                    )
                    .slice(3)
                    .map((filter) =>
                      renderSingleSelectDropdown(filter.key, filter.label)
                    )}
                </div>

                {/* Special Days Filter */}
                <div className="space-y-4">{renderSpecialDayFilters()}</div>
              </div>
            )}
          </div>

          {/* Products Display */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {React.createElement(
                  productTypeConfig[selectedProductType].icon,
                  { size: 20 }
                )}
                {productTypeConfig[selectedProductType].label}
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {processedProducts.length} products found
                </span>
                {loading && (
                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="mb-4">
                  {hasActiveFilters || searchQuery
                    ? "No products match the current filters or search query."
                    : "No products available for this category."}
                </p>
                {(hasActiveFilters || searchQuery) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Clear all filters and search
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tagged To
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Forecast Month
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Added Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Macy's Link
                      </th>

                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentProducts.map((product, index) => (
                      <tr
                        key={`${product.pid}-${index}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <span className="font-mono">{product.pid}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatAssignedToDisplay(product)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div
                            className="flex justify-center cursor-pointer p-2 rounded hover:bg-gray-100"
                            onClick={() => handleOpenNotes(product)}
                            title="Click to manage notes"
                          >
                            {formatNotesDisplay(product)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.forecast_month ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {product.forecast_month}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {getAddedQty(product).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatStatusDisplay(product)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          {canGenerateMacysLink(product) ? (
                            <a
                              href={generateMacysUrl(product)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2"
                              title={`View ${product.webid_description} on Macy's Website`}
                            >
                              <Globe size={16} />
                              <span className="text-sm font-medium">
                                View Online
                              </span>
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              No Link
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(product)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors p-2 rounded-lg hover:bg-indigo-50 flex items-center gap-2"
                            title="View Details"
                          >
                            <Eye size={16} />
                            <span className="text-sm font-medium">
                              View Details
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, processedProducts.length)} of{" "}
                {processedProducts.length} products
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded text-sm ${
                        currentPage === pageNum
                          ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {processedProducts.length}
                  </p>
                </div>
                <Package className="text-blue-600" size={24} />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Reviewed</p>
                  <p className="text-2xl font-bold text-green-900">
                    {
                      Object.values(productNotesData).filter(
                        (data) => data.status === "reviewed"
                      ).length
                    }
                  </p>
                </div>
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Not Reviewed
                  </p>
                  <p className="text-2xl font-bold text-red-900">
                    {
                      Object.values(productNotesData).filter(
                        (data) => data.status === "not_reviewed"
                      ).length
                    }
                  </p>
                </div>
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {
                      Object.values(productNotesData).filter(
                        (data) => data.status === "pending"
                      ).length
                    }
                  </p>
                </div>
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-3">
                Active Filters:
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedFilters).map(
                  ([filterKey, filterValue]) => {
                    if (Array.isArray(filterValue) && filterValue.length > 0) {
                      return filterValue.map((value) => (
                        <span
                          key={`${filterKey}-${value}`}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200"
                        >
                          <span className="font-medium">
                            {filterKey.replace("_", " ")}:
                          </span>{" "}
                          {value}
                          <button
                            onClick={() =>
                              handleMultiSelectFilterChange(
                                filterKey,
                                value,
                                false
                              )
                            }
                            className="text-blue-600 hover:text-blue-800 ml-1 hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ));
                    } else if (filterValue !== null && filterValue !== "") {
                      const displayValue =
                        filterValue === "true"
                          ? "Yes"
                          : filterValue === "false"
                          ? "No"
                          : filterValue;
                      return (
                        <span
                          key={filterKey}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200"
                        >
                          <span className="font-medium">
                            {filterKey === "valentine_day"
                              ? "Valentine's Day"
                              : filterKey === "mothers_day"
                              ? "Mother's Day"
                              : filterKey === "fathers_day"
                              ? "Father's Day"
                              : filterKey === "mens_day"
                              ? "Men's Day"
                              : filterKey === "womens_day"
                              ? "Women's Day"
                              : filterKey.replace("_", " ")}
                            :
                          </span>{" "}
                          {displayValue}
                          <button
                            onClick={() =>
                              handleSingleSelectFilterChange(filterKey, "")
                            }
                            className="text-blue-600 hover:text-blue-800 ml-1 hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      );
                    }
                    return null;
                  }
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200">
                    <span className="font-medium">search:</span> {searchQuery}
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-blue-600 hover:text-blue-800 ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
              <div className="mt-3 text-xs text-blue-600">
                {Object.values(selectedFilters)
                  .flat()
                  .filter((v) => v !== null && v !== "").length +
                  (searchQuery ? 1 : 0)}{" "}
                filters applied
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 mb-2">
              Filter Guide:
            </h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                • <strong>Multi-select filters:</strong> You can select multiple
                options for Categories, Birthstones, Red Box Items, and VDF
                Status
              </p>
              <p>
                • <strong>Boolean filters:</strong> Choose Yes/No/All for
                options like "Below Min Order", "Need to Review First", etc.
              </p>
              <p>
                • <strong>Special Days:</strong> Select holidays using the
                dropdown with checkboxes
              </p>
              <p>
                • <strong>Notes column:</strong> Click on the notes indicator to
                add or manage notes for each product
              </p>
              <p>
                • <strong>Search:</strong> Search by Product ID or Category name
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal for adding/editing notes */}
      <NotesModal
        isOpen={notesModal.isOpen}
        onClose={handleCloseNotes}
        productId={notesModal.productId}
        productName={notesModal.productName}
      />
      {/* Category Download Modal */}
      {categoryDownloadModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Categories to Download
              </h3>
              <button
                onClick={handleCloseCategoryDownload}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {categoryDownloadModal.availableCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No categories available for download</p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={handleSelectAllCategories}
                    className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleDeselectAllCategories}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Deselect All
                  </button>
                </div>

                <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                  {categoryDownloadModal.availableCategories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={categoryDownloadModal.selectedCategories.includes(
                          category
                        )}
                        onChange={(e) =>
                          handleCategorySelectionChange(
                            category,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {categoryDownloadModal.selectedCategories.length} categories
                    selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCloseCategoryDownload}
                      className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDownloadSelectedCategories}
                      disabled={
                        categoryDownloadModal.selectedCategories.length === 0 ||
                        categoryDownloadModal.isDownloading
                      }
                      className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {categoryDownloadModal.isDownloading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <FileDown size={16} />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ProductSelector;
