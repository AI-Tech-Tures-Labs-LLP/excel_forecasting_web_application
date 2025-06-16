// // ProductSelector/TableHeaderFilters.jsx
// import React, { useState, useEffect } from "react";
// import {
//   ChevronDown,
//   Filter,
//   Search,
//   X,
//   Check,
//   ArrowUpDown,
//   ChevronUp,
// } from "lucide-react";

// const TableHeaderFilters = ({
//   selectedFilters,
//   setSelectedFilters,
//   availableFilters,
//   setCurrentPage,
// }) => {
//   // Dropdown states
//   const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
//   const [categorySearchTerm, setCategorySearchTerm] = useState("");
//   const [taggedToDropdownOpen, setTaggedToDropdownOpen] = useState(false);
//   const [taggedToSearchTerm, setTaggedToSearchTerm] = useState("");
//   const [notesDropdownOpen, setNotesDropdownOpen] = useState(false);
//   const [forecastMonthDropdownOpen, setForecastMonthDropdownOpen] =
//     useState(false);
//   const [forecastMonthSearchTerm, setForecastMonthSearchTerm] = useState("");
//   const [addedQtyDropdownOpen, setAddedQtyDropdownOpen] = useState(false);
//   const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
//   const [lastReviewedDropdownOpen, setLastReviewedDropdownOpen] =
//     useState(false);

//   // Handle click outside to close dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const categoryDropdown = event.target.closest(".category-dropdown");
//       const taggedToDropdown = event.target.closest(".tagged-to-dropdown");
//       const notesDropdown = event.target.closest(".notes-dropdown");
//       const forecastMonthDropdown = event.target.closest(
//         ".forecast-month-dropdown"
//       );
//       const addedQtyDropdown = event.target.closest(".added-qty-dropdown");
//       const statusDropdown = event.target.closest(".status-dropdown");
//       const lastReviewedDropdown = event.target.closest(
//         ".last-reviewed-dropdown"
//       );

//       if (
//         !categoryDropdown &&
//         !taggedToDropdown &&
//         !notesDropdown &&
//         !forecastMonthDropdown &&
//         !addedQtyDropdown &&
//         !statusDropdown &&
//         !lastReviewedDropdown &&
//         !event.target.closest("th")
//       ) {
//         closeAllDropdowns();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // ESC key handling
//   useEffect(() => {
//     const handleEscKey = (event) => {
//       if (event.key === "Escape") {
//         closeAllDropdowns();
//       }
//     };

//     document.addEventListener("keydown", handleEscKey);
//     return () => document.removeEventListener("keydown", handleEscKey);
//   }, []);

//   const closeAllDropdowns = () => {
//     setCategoryDropdownOpen(false);
//     setCategorySearchTerm("");
//     setTaggedToDropdownOpen(false);
//     setTaggedToSearchTerm("");
//     setNotesDropdownOpen(false);
//     setForecastMonthDropdownOpen(false);
//     setForecastMonthSearchTerm("");
//     setAddedQtyDropdownOpen(false);
//     setStatusDropdownOpen(false);
//     setLastReviewedDropdownOpen(false);
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

//   // Handle single-select filter changes
//   const handleSingleSelectFilterChange = (filterKey, value) => {
//     setSelectedFilters((prev) => ({
//       ...prev,
//       [filterKey]: value === "" ? null : value,
//     }));
//     setCurrentPage(1);
//   };

//   return (
//     <>
//       {/* Category Filter Header */}
//       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider relative">
//         <button
//           onClick={() => {
//             closeAllDropdowns();
//             setCategoryDropdownOpen(!categoryDropdownOpen);
//             setCategorySearchTerm("");
//           }}
//           className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
//             selectedFilters.category.length > 0
//               ? "text-indigo-600 font-semibold"
//               : ""
//           }`}
//         >
//           <span className="flex items-center gap-1">
//             {selectedFilters.category.length > 0 && <Filter size={14} />}
//             Category
//           </span>
//           <ChevronDown
//             size={14}
//             className={`transition-transform duration-200 ${
//               categoryDropdownOpen ? "rotate-180" : ""
//             }`}
//           />
//           {selectedFilters.category.length > 0 && (
//             <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
//               {selectedFilters.category.length}
//             </span>
//           )}
//         </button>

//         {categoryDropdownOpen && (
//           <div
//             className="category-dropdown absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-3 border-b border-gray-100">
//               <div className="relative">
//                 <Search
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   size={16}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search categories..."
//                   value={categorySearchTerm}
//                   onChange={(e) => setCategorySearchTerm(e.target.value)}
//                   className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//                 {categorySearchTerm && (
//                   <button
//                     onClick={() => setCategorySearchTerm("")}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     <X size={16} />
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="p-2 border-b border-gray-100 flex justify-between">
//               <button
//                 onClick={() => {
//                   const filteredCategories = availableFilters.categories.filter(
//                     (cat) =>
//                       cat
//                         .toLowerCase()
//                         .includes(categorySearchTerm.toLowerCase())
//                   );
//                   setSelectedFilters((prev) => ({
//                     ...prev,
//                     category: [
//                       ...new Set([...prev.category, ...filteredCategories]),
//                     ],
//                   }));
//                 }}
//                 className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
//               >
//                 Select All{" "}
//                 {categorySearchTerm &&
//                   `(${
//                     availableFilters.categories.filter((cat) =>
//                       cat
//                         .toLowerCase()
//                         .includes(categorySearchTerm.toLowerCase())
//                     ).length
//                   })`}
//               </button>
//               <button
//                 onClick={() =>
//                   setSelectedFilters((prev) => ({
//                     ...prev,
//                     category: [],
//                   }))
//                 }
//                 className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
//               >
//                 Clear All
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               {availableFilters.categories
//                 .filter((cat) =>
//                   cat.toLowerCase().includes(categorySearchTerm.toLowerCase())
//                 )
//                 .map((cat) => (
//                   <label
//                     key={cat}
//                     className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
//                   >
//                     <div className="relative">
//                       <input
//                         type="checkbox"
//                         checked={selectedFilters.category.includes(cat)}
//                         onChange={(e) =>
//                           handleMultiSelectFilterChange(
//                             "category",
//                             cat,
//                             e.target.checked
//                           )
//                         }
//                         className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
//                       />
//                       {selectedFilters.category.includes(cat) && (
//                         <Check
//                           size={12}
//                           className="absolute top-0.5 left-0.5 text-white pointer-events-none"
//                         />
//                       )}
//                     </div>
//                     <span className="text-sm text-gray-700 flex-1">{cat}</span>
//                   </label>
//                 ))}

//               {categorySearchTerm &&
//                 availableFilters.categories.filter((cat) =>
//                   cat.toLowerCase().includes(categorySearchTerm.toLowerCase())
//                 ).length === 0 && (
//                   <div className="p-4 text-center text-gray-500 text-sm">
//                     No categories found matching "{categorySearchTerm}"
//                   </div>
//                 )}
//             </div>

//             {selectedFilters.category.length > 0 && (
//               <div className="p-2 border-t border-gray-100 bg-gray-50">
//                 <span className="text-xs text-gray-600">
//                   {selectedFilters.category.length} of{" "}
//                   {availableFilters.categories.length} categories selected
//                 </span>
//               </div>
//             )}
//           </div>
//         )}
//       </th>

//       {/* Tagged To Filter Header */}
//       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
//         <button
//           onClick={() => {
//             closeAllDropdowns();
//             setTaggedToDropdownOpen(!taggedToDropdownOpen);
//             setTaggedToSearchTerm("");
//           }}
//           className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
//             selectedFilters.tagged_to?.length > 0
//               ? "text-indigo-600 font-semibold"
//               : ""
//           }`}
//         >
//           <span className="flex items-center gap-1">
//             {selectedFilters.tagged_to?.length > 0 && <Filter size={14} />}
//             Tagged To
//           </span>
//           <ChevronDown
//             size={14}
//             className={`transition-transform duration-200 ${
//               taggedToDropdownOpen ? "rotate-180" : ""
//             }`}
//           />
//           {selectedFilters.tagged_to?.length > 0 && (
//             <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
//               {selectedFilters.tagged_to.length}
//             </span>
//           )}
//         </button>

//         {taggedToDropdownOpen && (
//           <div
//             className="tagged-to-dropdown absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-3 border-b border-gray-100">
//               <div className="relative">
//                 <Search
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   size={16}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search tagged to..."
//                   value={taggedToSearchTerm}
//                   onChange={(e) => setTaggedToSearchTerm(e.target.value)}
//                   className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//                 {taggedToSearchTerm && (
//                   <button
//                     onClick={() => setTaggedToSearchTerm("")}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     <X size={16} />
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="p-2 border-b border-gray-100 flex justify-between">
//               <button
//                 onClick={() => {
//                   const filteredTaggedTo = (
//                     availableFilters.tagged_to || []
//                   ).filter((user) =>
//                     user
//                       .toLowerCase()
//                       .includes(taggedToSearchTerm.toLowerCase())
//                   );
//                   setSelectedFilters((prev) => ({
//                     ...prev,
//                     tagged_to: [
//                       ...new Set([
//                         ...(prev.tagged_to || []),
//                         ...filteredTaggedTo,
//                       ]),
//                     ],
//                   }));
//                 }}
//                 className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
//               >
//                 Select All{" "}
//                 {taggedToSearchTerm &&
//                   `(${
//                     (availableFilters.tagged_to || []).filter((user) =>
//                       user
//                         .toLowerCase()
//                         .includes(taggedToSearchTerm.toLowerCase())
//                     ).length
//                   })`}
//               </button>
//               <button
//                 onClick={() =>
//                   setSelectedFilters((prev) => ({
//                     ...prev,
//                     tagged_to: [],
//                   }))
//                 }
//                 className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
//               >
//                 Clear All
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               {(availableFilters.tagged_to || [])
//                 .filter((user) =>
//                   user.toLowerCase().includes(taggedToSearchTerm.toLowerCase())
//                 )
//                 .map((user) => (
//                   <label
//                     key={user}
//                     className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
//                   >
//                     <div className="relative">
//                       <input
//                         type="checkbox"
//                         checked={(selectedFilters.tagged_to || []).includes(
//                           user
//                         )}
//                         onChange={(e) =>
//                           handleMultiSelectFilterChange(
//                             "tagged_to",
//                             user,
//                             e.target.checked
//                           )
//                         }
//                         className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
//                       />
//                       {(selectedFilters.tagged_to || []).includes(user) && (
//                         <Check
//                           size={12}
//                           className="absolute top-0.5 left-0.5 text-white pointer-events-none"
//                         />
//                       )}
//                     </div>
//                     <span className="text-sm text-gray-700 flex-1">{user}</span>
//                   </label>
//                 ))}

//               {taggedToSearchTerm &&
//                 (availableFilters.tagged_to || []).filter((user) =>
//                   user.toLowerCase().includes(taggedToSearchTerm.toLowerCase())
//                 ).length === 0 && (
//                   <div className="p-4 text-center text-gray-500 text-sm">
//                     No users found matching "{taggedToSearchTerm}"
//                   </div>
//                 )}
//             </div>

//             {(selectedFilters.tagged_to?.length || 0) > 0 && (
//               <div className="p-2 border-t border-gray-100 bg-gray-50">
//                 <span className="text-xs text-gray-600">
//                   {selectedFilters.tagged_to.length} of{" "}
//                   {(availableFilters.tagged_to || []).length} users selected
//                 </span>
//               </div>
//             )}
//           </div>
//         )}
//       </th>

//       {/* Notes Filter Header */}
//       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider relative">
//         <button
//           onClick={() => {
//             closeAllDropdowns();
//             setNotesDropdownOpen(!notesDropdownOpen);
//           }}
//           className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
//             selectedFilters.notes_sort ? "text-indigo-600 font-semibold" : ""
//           }`}
//         >
//           <span className="flex items-center gap-1">
//             {selectedFilters.notes_sort && <Filter size={14} />}
//             Notes
//           </span>
//           <ChevronDown
//             size={14}
//             className={`transition-transform duration-200 ${
//               notesDropdownOpen ? "rotate-180" : ""
//             }`}
//           />
//           {selectedFilters.notes_sort && (
//             <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
//               {selectedFilters.notes_sort === "latest" ? "Latest" : "Oldest"}
//             </span>
//           )}
//         </button>

//         {notesDropdownOpen && (
//           <div
//             className="notes-dropdown absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-3 border-b border-gray-100">
//               <span className="text-sm font-medium text-gray-700">
//                 Sort by Notes
//               </span>
//             </div>

//             <div className="p-2">
//               <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
//                 <input
//                   type="radio"
//                   name="added_qty_sort"
//                   value="asc"
//                   checked={selectedFilters.added_qty_sort === "asc"}
//                   onChange={() =>
//                     setSelectedFilters((prev) => ({
//                       ...prev,
//                       added_qty_sort: "asc",
//                     }))
//                   }
//                   className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                 />
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-700">Ascending</span>
//                   <span className="text-xs text-gray-500">(Low to High)</span>
//                   <ArrowUpDown size={14} className="text-gray-400 rotate-180" />
//                 </div>
//               </label>

//               <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
//                 <input
//                   type="radio"
//                   name="added_qty_sort"
//                   value="desc"
//                   checked={selectedFilters.added_qty_sort === "desc"}
//                   onChange={() =>
//                     setSelectedFilters((prev) => ({
//                       ...prev,
//                       added_qty_sort: "desc",
//                     }))
//                   }
//                   className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                 />
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-700">Descending</span>
//                   <span className="text-xs text-gray-500">(High to Low)</span>
//                   <ArrowUpDown size={14} className="text-gray-400" />
//                 </div>
//               </label>
//             </div>

//             {selectedFilters.added_qty_sort && (
//               <div className="p-2 border-t border-gray-100">
//                 <button
//                   onClick={() =>
//                     setSelectedFilters((prev) => ({
//                       ...prev,
//                       added_qty_sort: null,
//                     }))
//                   }
//                   className="w-full px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
//                 >
//                   Clear Sorting
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </th>

//       {/* Status Filter Header */}
//       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
//         <button
//           onClick={() => {
//             closeAllDropdowns();
//             setStatusDropdownOpen(!statusDropdownOpen);
//           }}
//           className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
//             selectedFilters.status?.length > 0
//               ? "text-indigo-600 font-semibold"
//               : ""
//           }`}
//         >
//           <span className="flex items-center gap-1">
//             {selectedFilters.status?.length > 0 && <Filter size={14} />}
//             Status
//           </span>
//           <ChevronDown
//             size={14}
//             className={`transition-transform duration-200 ${
//               statusDropdownOpen ? "rotate-180" : ""
//             }`}
//           />
//           {selectedFilters.status?.length > 0 && (
//             <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
//               {selectedFilters.status.length}
//             </span>
//           )}
//         </button>

//         {statusDropdownOpen && (
//           <div
//             className="status-dropdown absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-3 border-b border-gray-100">
//               <span className="text-sm font-medium text-gray-700">
//                 Filter by Status
//               </span>
//             </div>

//             <div className="p-2 border-b border-gray-100 flex justify-between">
//               <button
//                 onClick={() => {
//                   setSelectedFilters((prev) => ({
//                     ...prev,
//                     status: [...availableFilters.statuses],
//                   }));
//                 }}
//                 className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
//               >
//                 Select All
//               </button>
//               <button
//                 onClick={() =>
//                   setSelectedFilters((prev) => ({
//                     ...prev,
//                     status: [],
//                   }))
//                 }
//                 className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
//               >
//                 Clear All
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               {availableFilters.statuses.map((status) => (
//                 <label
//                   key={status}
//                   className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
//                 >
//                   <div className="relative">
//                     <input
//                       type="checkbox"
//                       checked={(selectedFilters.status || []).includes(status)}
//                       onChange={(e) =>
//                         handleMultiSelectFilterChange(
//                           "status",
//                           status,
//                           e.target.checked
//                         )
//                       }
//                       className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
//                     />
//                     {(selectedFilters.status || []).includes(status) && (
//                       <Check
//                         size={12}
//                         className="absolute top-0.5 left-0.5 text-white pointer-events-none"
//                       />
//                     )}
//                   </div>
//                   <div className="flex items-center gap-2 flex-1">
//                     {status === "Reviewed" && (
//                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                     )}
//                     {status === "Not Reviewed" && (
//                       <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                     )}
//                     {status === "Pending" && (
//                       <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                     )}
//                     <span className="text-sm text-gray-700">{status}</span>
//                   </div>
//                 </label>
//               ))}
//             </div>

//             {(selectedFilters.status?.length || 0) > 0 && (
//               <div className="p-2 border-t border-gray-100 bg-gray-50">
//                 <span className="text-xs text-gray-600">
//                   {selectedFilters.status.length} of{" "}
//                   {availableFilters.statuses.length} statuses selected
//                 </span>
//               </div>
//             )}
//           </div>
//         )}
//       </th>

//       {/* Last Reviewed Filter Header */}
//       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
//         <button
//           onClick={() => {
//             closeAllDropdowns();
//             setLastReviewedDropdownOpen(!lastReviewedDropdownOpen);
//           }}
//           className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
//             selectedFilters.last_reviewed_sort
//               ? "text-indigo-600 font-semibold"
//               : ""
//           }`}
//         >
//           <span className="flex items-center gap-1">
//             {selectedFilters.last_reviewed_sort && <Filter size={14} />}
//             Last Reviewed At
//           </span>
//           <ChevronDown
//             size={14}
//             className={`transition-transform duration-200 ${
//               lastReviewedDropdownOpen ? "rotate-180" : ""
//             }`}
//           />
//           {selectedFilters.last_reviewed_sort && (
//             <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
//               {selectedFilters.last_reviewed_sort === "newest" ? "↓" : "↑"}
//             </span>
//           )}
//         </button>

//         {lastReviewedDropdownOpen && (
//           <div
//             className="last-reviewed-dropdown absolute top-full left-[-40px] mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-3 border-b border-gray-100">
//               <span className="text-sm font-medium text-gray-700">
//                 Sort by Last Reviewed Date
//               </span>
//             </div>

//             <div className="p-2">
//               <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
//                 <input
//                   type="radio"
//                   name="last_reviewed_sort"
//                   value=""
//                   checked={!selectedFilters.last_reviewed_sort}
//                   onChange={() =>
//                     setSelectedFilters((prev) => ({
//                       ...prev,
//                       last_reviewed_sort: null,
//                     }))
//                   }
//                   className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                 />
//                 <span className="text-sm text-gray-700">No Sorting</span>
//               </label>

//               <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
//                 <input
//                   type="radio"
//                   name="last_reviewed_sort"
//                   value="newest"
//                   checked={selectedFilters.last_reviewed_sort === "newest"}
//                   onChange={() =>
//                     setSelectedFilters((prev) => ({
//                       ...prev,
//                       last_reviewed_sort: "newest",
//                     }))
//                   }
//                   className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                 />
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-700">Newest First</span>
//                   <span className="text-xs text-gray-500">(Recent to Old)</span>
//                   <ChevronDown size={14} className="text-gray-400" />
//                 </div>
//               </label>

//               <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
//                 <input
//                   type="radio"
//                   name="last_reviewed_sort"
//                   value="oldest"
//                   checked={selectedFilters.last_reviewed_sort === "oldest"}
//                   onChange={() =>
//                     setSelectedFilters((prev) => ({
//                       ...prev,
//                       last_reviewed_sort: "oldest",
//                     }))
//                   }
//                   className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                 />
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-gray-700">Oldest First</span>
//                   <span className="text-xs text-gray-500">(Old to Recent)</span>
//                   <ChevronUp size={14} className="text-gray-400" />
//                 </div>
//               </label>
//             </div>

//             <div className="border-t border-gray-100 p-2">
//               <div className="text-xs font-medium text-gray-600 mb-2 px-3">
//                 Quick Filters
//               </div>

//               <button
//                 onClick={() => {
//                   setSelectedFilters((prev) => ({
//                     ...prev,
//                     last_reviewed_sort: "newest",
//                   }));
//                 }}
//                 className="w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
//               >
//                 📅 Last 7 days
//               </button>

//               <button
//                 onClick={() => {
//                   setSelectedFilters((prev) => ({
//                     ...prev,
//                     last_reviewed_sort: "newest",
//                   }));
//                 }}
//                 className="w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
//               >
//                 📅 Last 30 days
//               </button>

//               <button
//                 onClick={() => {
//                   setSelectedFilters((prev) => ({
//                     ...prev,
//                     last_reviewed_sort: "oldest",
//                   }));
//                 }}
//                 className="w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
//               >
//                 ⏰ Never reviewed
//               </button>
//             </div>

//             {selectedFilters.last_reviewed_sort && (
//               <div className="p-2 border-t border-gray-100">
//                 <button
//                   onClick={() =>
//                     setSelectedFilters((prev) => ({
//                       ...prev,
//                       last_reviewed_sort: null,
//                     }))
//                   }
//                   className="w-full px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
//                 >
//                   Clear Sorting
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </th>
//     </>
//   );
// };

// export default TableHeaderFilters;

// ProductSelector/TableHeaderFilters.jsx - PART 1 of 3
import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Filter,
  Search,
  X,
  Check,
  ArrowUpDown,
  ChevronUp,
} from "lucide-react";

const TableHeaderFilters = ({
  selectedFilters = {}, // Added default value
  setSelectedFilters,
  availableFilters = {}, // Added default value
  setCurrentPage,
}) => {
  // Dropdown states
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [taggedToDropdownOpen, setTaggedToDropdownOpen] = useState(false);
  const [taggedToSearchTerm, setTaggedToSearchTerm] = useState("");
  const [notesDropdownOpen, setNotesDropdownOpen] = useState(false);
  const [forecastMonthDropdownOpen, setForecastMonthDropdownOpen] =
    useState(false);
  const [forecastMonthSearchTerm, setForecastMonthSearchTerm] = useState("");
  const [addedQtyDropdownOpen, setAddedQtyDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [lastReviewedDropdownOpen, setLastReviewedDropdownOpen] =
    useState(false);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const categoryDropdown = event.target.closest(".category-dropdown");
      const taggedToDropdown = event.target.closest(".tagged-to-dropdown");
      const notesDropdown = event.target.closest(".notes-dropdown");
      const forecastMonthDropdown = event.target.closest(
        ".forecast-month-dropdown"
      );
      const addedQtyDropdown = event.target.closest(".added-qty-dropdown");
      const statusDropdown = event.target.closest(".status-dropdown");
      const lastReviewedDropdown = event.target.closest(
        ".last-reviewed-dropdown"
      );

      if (
        !categoryDropdown &&
        !taggedToDropdown &&
        !notesDropdown &&
        !forecastMonthDropdown &&
        !addedQtyDropdown &&
        !statusDropdown &&
        !lastReviewedDropdown &&
        !event.target.closest("th")
      ) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ESC key handling
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        closeAllDropdowns();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  const closeAllDropdowns = () => {
    setCategoryDropdownOpen(false);
    setCategorySearchTerm("");
    setTaggedToDropdownOpen(false);
    setTaggedToSearchTerm("");
    setNotesDropdownOpen(false);
    setForecastMonthDropdownOpen(false);
    setForecastMonthSearchTerm("");
    setAddedQtyDropdownOpen(false);
    setStatusDropdownOpen(false);
    setLastReviewedDropdownOpen(false);
  };

  // Handle multi-select filter changes
  const handleMultiSelectFilterChange = (filterKey, value, checked) => {
    const currentValues = selectedFilters?.[filterKey] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((item) => item !== value);

    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: newValues,
    }));
    setCurrentPage(1);
  };

  // Handle single-select filter changes
  const handleSingleSelectFilterChange = (filterKey, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: value === "" ? null : value,
    }));
    setCurrentPage(1);
  };

  return (
    <>
      {/* Category Filter Header */}
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider relative">
        <button
          onClick={() => {
            closeAllDropdowns();
            setCategoryDropdownOpen(!categoryDropdownOpen);
            setCategorySearchTerm("");
          }}
          className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
            (selectedFilters?.category?.length || 0) > 0
              ? "text-indigo-600 font-semibold"
              : ""
          }`}
        >
          <span className="flex items-center gap-1">
            {(selectedFilters?.category?.length || 0) > 0 && (
              <Filter size={14} />
            )}
            Category
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              categoryDropdownOpen ? "rotate-180" : ""
            }`}
          />
          {(selectedFilters?.category?.length || 0) > 0 && (
            <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
              {selectedFilters?.category?.length}
            </span>
          )}
        </button>

        {categoryDropdownOpen && (
          <div
            className="category-dropdown absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearchTerm}
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {categorySearchTerm && (
                  <button
                    onClick={() => setCategorySearchTerm("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="p-2 border-b border-gray-100 flex justify-between">
              <button
                onClick={() => {
                  const filteredCategories = (
                    availableFilters?.categories || []
                  ).filter((cat) =>
                    cat.toLowerCase().includes(categorySearchTerm.toLowerCase())
                  );
                  setSelectedFilters((prev) => ({
                    ...prev,
                    category: [
                      ...new Set([
                        ...(prev?.category || []),
                        ...filteredCategories,
                      ]),
                    ],
                  }));
                }}
                className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
              >
                Select All{" "}
                {categorySearchTerm &&
                  `(${
                    (availableFilters?.categories || []).filter((cat) =>
                      cat
                        .toLowerCase()
                        .includes(categorySearchTerm.toLowerCase())
                    ).length
                  })`}
              </button>
              <button
                onClick={() =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    category: [],
                  }))
                }
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {(availableFilters?.categories || [])
                .filter((cat) =>
                  cat.toLowerCase().includes(categorySearchTerm.toLowerCase())
                )
                .map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={(selectedFilters?.category || []).includes(
                          cat
                        )}
                        onChange={(e) =>
                          handleMultiSelectFilterChange(
                            "category",
                            cat,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                      {(selectedFilters?.category || []).includes(cat) && (
                        <Check
                          size={12}
                          className="absolute top-0.5 left-0.5 text-white pointer-events-none"
                        />
                      )}
                    </div>
                    <span className="text-sm text-gray-700 flex-1">{cat}</span>
                  </label>
                ))}

              {categorySearchTerm &&
                (availableFilters?.categories || []).filter((cat) =>
                  cat.toLowerCase().includes(categorySearchTerm.toLowerCase())
                ).length === 0 && (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No categories found matching "{categorySearchTerm}"
                  </div>
                )}
            </div>

            {(selectedFilters?.category?.length || 0) > 0 && (
              <div className="p-2 border-t border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-600">
                  {selectedFilters?.category?.length} of{" "}
                  {(availableFilters?.categories || []).length} categories
                  selected
                </span>
              </div>
            )}
          </div>
        )}
      </th>
      {/* Tagged To Filter Header */}
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
        <button
          onClick={() => {
            closeAllDropdowns();
            setTaggedToDropdownOpen(!taggedToDropdownOpen);
            setTaggedToSearchTerm("");
          }}
          className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
            (selectedFilters?.tagged_to?.length || 0) > 0
              ? "text-indigo-600 font-semibold"
              : ""
          }`}
        >
          <span className="flex items-center gap-1">
            {(selectedFilters?.tagged_to?.length || 0) > 0 && (
              <Filter size={14} />
            )}
            Tagged To
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              taggedToDropdownOpen ? "rotate-180" : ""
            }`}
          />
          {(selectedFilters?.tagged_to?.length || 0) > 0 && (
            <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
              {selectedFilters?.tagged_to?.length}
            </span>
          )}
        </button>

        {taggedToDropdownOpen && (
          <div
            className="tagged-to-dropdown absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search tagged to..."
                  value={taggedToSearchTerm}
                  onChange={(e) => setTaggedToSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {taggedToSearchTerm && (
                  <button
                    onClick={() => setTaggedToSearchTerm("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="p-2 border-b border-gray-100 flex justify-between">
              <button
                onClick={() => {
                  const filteredTaggedTo = (
                    availableFilters?.tagged_to || []
                  ).filter((user) =>
                    user
                      .toLowerCase()
                      .includes(taggedToSearchTerm.toLowerCase())
                  );
                  setSelectedFilters((prev) => ({
                    ...prev,
                    tagged_to: [
                      ...new Set([
                        ...(prev?.tagged_to || []),
                        ...filteredTaggedTo,
                      ]),
                    ],
                  }));
                }}
                className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
              >
                Select All{" "}
                {taggedToSearchTerm &&
                  `(${
                    (availableFilters?.tagged_to || []).filter((user) =>
                      user
                        .toLowerCase()
                        .includes(taggedToSearchTerm.toLowerCase())
                    ).length
                  })`}
              </button>
              <button
                onClick={() =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    tagged_to: [],
                  }))
                }
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {(availableFilters?.tagged_to || [])
                .filter((user) =>
                  user.toLowerCase().includes(taggedToSearchTerm.toLowerCase())
                )
                .map((user) => (
                  <label
                    key={user}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={(selectedFilters?.tagged_to || []).includes(
                          user
                        )}
                        onChange={(e) =>
                          handleMultiSelectFilterChange(
                            "tagged_to",
                            user,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                      {(selectedFilters?.tagged_to || []).includes(user) && (
                        <Check
                          size={12}
                          className="absolute top-0.5 left-0.5 text-white pointer-events-none"
                        />
                      )}
                    </div>
                    <span className="text-sm text-gray-700 flex-1">{user}</span>
                  </label>
                ))}

              {taggedToSearchTerm &&
                (availableFilters?.tagged_to || []).filter((user) =>
                  user.toLowerCase().includes(taggedToSearchTerm.toLowerCase())
                ).length === 0 && (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No users found matching "{taggedToSearchTerm}"
                  </div>
                )}
            </div>

            {(selectedFilters?.tagged_to?.length || 0) > 0 && (
              <div className="p-2 border-t border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-600">
                  {selectedFilters?.tagged_to?.length} of{" "}
                  {(availableFilters?.tagged_to || []).length} users selected
                </span>
              </div>
            )}
          </div>
        )}
      </th>

      {/* Notes Filter Header */}
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider relative">
        <button
          onClick={() => {
            closeAllDropdowns();
            setNotesDropdownOpen(!notesDropdownOpen);
          }}
          className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
            selectedFilters?.notes_sort ? "text-indigo-600 font-semibold" : ""
          }`}
        >
          <span className="flex items-center gap-1">
            {selectedFilters?.notes_sort && <Filter size={14} />}
            Notes
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              notesDropdownOpen ? "rotate-180" : ""
            }`}
          />
          {selectedFilters?.notes_sort && (
            <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
              {selectedFilters?.notes_sort === "latest" ? "Latest" : "Oldest"}
            </span>
          )}
        </button>

        {notesDropdownOpen && (
          <div
            className="notes-dropdown absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">
                Sort by Notes
              </span>
            </div>

            <div className="p-2">
              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                <input
                  type="radio"
                  name="added_qty_sort"
                  value="asc"
                  checked={selectedFilters?.added_qty_sort === "asc"}
                  onChange={() =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      added_qty_sort: "asc",
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Ascending</span>
                  <span className="text-xs text-gray-500">(Low to High)</span>
                  <ArrowUpDown size={14} className="text-gray-400 rotate-180" />
                </div>
              </label>

              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                <input
                  type="radio"
                  name="added_qty_sort"
                  value="desc"
                  checked={selectedFilters?.added_qty_sort === "desc"}
                  onChange={() =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      added_qty_sort: "desc",
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Descending</span>
                  <span className="text-xs text-gray-500">(High to Low)</span>
                  <ArrowUpDown size={14} className="text-gray-400" />
                </div>
              </label>
            </div>

            {selectedFilters?.added_qty_sort && (
              <div className="p-2 border-t border-gray-100">
                <button
                  onClick={() =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      added_qty_sort: null,
                    }))
                  }
                  className="w-full px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Clear Sorting
                </button>
              </div>
            )}
          </div>
        )}
      </th>

      {/* Forecast Month Filter Header */}
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider relative">
        <button
          onClick={() => {
            closeAllDropdowns();
            setForecastMonthDropdownOpen(!forecastMonthDropdownOpen);
            setForecastMonthSearchTerm("");
          }}
          className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
            (selectedFilters?.forecast_month?.length || 0) > 0
              ? "text-indigo-600 font-semibold"
              : ""
          }`}
        >
          <span className="flex items-center gap-1">
            {(selectedFilters?.forecast_month?.length || 0) > 0 && (
              <Filter size={14} />
            )}
            Forecast Month
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              forecastMonthDropdownOpen ? "rotate-180" : ""
            }`}
          />
          {(selectedFilters?.forecast_month?.length || 0) > 0 && (
            <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
              {selectedFilters?.forecast_month?.length}
            </span>
          )}
        </button>

        {forecastMonthDropdownOpen && (
          <div
            className="forecast-month-dropdown absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search forecast months..."
                  value={forecastMonthSearchTerm}
                  onChange={(e) => setForecastMonthSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {forecastMonthSearchTerm && (
                  <button
                    onClick={() => setForecastMonthSearchTerm("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="p-2 border-b border-gray-100 flex justify-between">
              <button
                onClick={() => {
                  const filteredMonths = (
                    availableFilters?.forecast_months || []
                  ).filter((month) =>
                    month
                      .toLowerCase()
                      .includes(forecastMonthSearchTerm.toLowerCase())
                  );
                  setSelectedFilters((prev) => ({
                    ...prev,
                    forecast_month: [
                      ...new Set([
                        ...(prev?.forecast_month || []),
                        ...filteredMonths,
                      ]),
                    ],
                  }));
                }}
                className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={() =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    forecast_month: [],
                  }))
                }
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {(availableFilters?.forecast_months || [])
                .filter((month) =>
                  month
                    .toLowerCase()
                    .includes(forecastMonthSearchTerm.toLowerCase())
                )
                .map((month) => (
                  <label
                    key={month}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={(
                          selectedFilters?.forecast_month || []
                        ).includes(month)}
                        onChange={(e) =>
                          handleMultiSelectFilterChange(
                            "forecast_month",
                            month,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                      {(selectedFilters?.forecast_month || []).includes(
                        month
                      ) && (
                        <Check
                          size={12}
                          className="absolute top-0.5 left-0.5 text-white pointer-events-none"
                        />
                      )}
                    </div>
                    <span className="text-sm text-gray-700 flex-1">
                      {month}
                    </span>
                  </label>
                ))}
            </div>
          </div>
        )}
      </th>

      {/* Status Filter Header */}
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
        <button
          onClick={() => {
            closeAllDropdowns();
            setStatusDropdownOpen(!statusDropdownOpen);
          }}
          className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
            (selectedFilters?.status?.length || 0) > 0
              ? "text-indigo-600 font-semibold"
              : ""
          }`}
        >
          <span className="flex items-center gap-1">
            {(selectedFilters?.status?.length || 0) > 0 && <Filter size={14} />}
            Status
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              statusDropdownOpen ? "rotate-180" : ""
            }`}
          />
          {(selectedFilters?.status?.length || 0) > 0 && (
            <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
              {selectedFilters?.status?.length}
            </span>
          )}
        </button>

        {statusDropdownOpen && (
          <div
            className="status-dropdown absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">
                Filter by Status
              </span>
            </div>

            <div className="p-2 border-b border-gray-100 flex justify-between">
              <button
                onClick={() => {
                  setSelectedFilters((prev) => ({
                    ...prev,
                    status: [...(availableFilters?.statuses || [])],
                  }));
                }}
                className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={() =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    status: [],
                  }))
                }
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {(availableFilters?.statuses || []).map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={(selectedFilters?.status || []).includes(status)}
                      onChange={(e) =>
                        handleMultiSelectFilterChange(
                          "status",
                          status,
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    {(selectedFilters?.status || []).includes(status) && (
                      <Check
                        size={12}
                        className="absolute top-0.5 left-0.5 text-white pointer-events-none"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    {status === "Reviewed" && (
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                    {status === "Not Reviewed" && (
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                    {status === "Pending" && (
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    )}
                    <span className="text-sm text-gray-700">{status}</span>
                  </div>
                </label>
              ))}
            </div>

            {(selectedFilters?.status?.length || 0) > 0 && (
              <div className="p-2 border-t border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-600">
                  {selectedFilters?.status?.length} of{" "}
                  {(availableFilters?.statuses || []).length} statuses selected
                </span>
              </div>
            )}
          </div>
        )}
      </th>

      {/* Last Reviewed Filter Header */}
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
        <button
          onClick={() => {
            closeAllDropdowns();
            setLastReviewedDropdownOpen(!lastReviewedDropdownOpen);
          }}
          className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
            selectedFilters?.last_reviewed_sort
              ? "text-indigo-600 font-semibold"
              : ""
          }`}
        >
          <span className="flex items-center gap-1">
            {selectedFilters?.last_reviewed_sort && <Filter size={14} />}
            Last Reviewed At
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              lastReviewedDropdownOpen ? "rotate-180" : ""
            }`}
          />
          {selectedFilters?.last_reviewed_sort && (
            <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
              {selectedFilters?.last_reviewed_sort === "newest" ? "↓" : "↑"}
            </span>
          )}
        </button>

        {lastReviewedDropdownOpen && (
          <div
            className="last-reviewed-dropdown absolute top-full left-[-40px] mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">
                Sort by Last Reviewed Date
              </span>
            </div>

            <div className="p-2">
              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                <input
                  type="radio"
                  name="last_reviewed_sort"
                  value=""
                  checked={!selectedFilters?.last_reviewed_sort}
                  onChange={() =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      last_reviewed_sort: null,
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">No Sorting</span>
              </label>

              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                <input
                  type="radio"
                  name="last_reviewed_sort"
                  value="newest"
                  checked={selectedFilters?.last_reviewed_sort === "newest"}
                  onChange={() =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      last_reviewed_sort: "newest",
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Newest First</span>
                  <span className="text-xs text-gray-500">(Recent to Old)</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
              </label>

              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                <input
                  type="radio"
                  name="last_reviewed_sort"
                  value="oldest"
                  checked={selectedFilters?.last_reviewed_sort === "oldest"}
                  onChange={() =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      last_reviewed_sort: "oldest",
                    }))
                  }
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Oldest First</span>
                  <span className="text-xs text-gray-500">(Old to Recent)</span>
                  <ChevronUp size={14} className="text-gray-400" />
                </div>
              </label>
            </div>

            <div className="border-t border-gray-100 p-2">
              <div className="text-xs font-medium text-gray-600 mb-2 px-3">
                Quick Filters
              </div>

              <button
                onClick={() => {
                  setSelectedFilters((prev) => ({
                    ...prev,
                    last_reviewed_sort: "newest",
                  }));
                }}
                className="w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
              >
                📅 Last 7 days
              </button>

              <button
                onClick={() => {
                  setSelectedFilters((prev) => ({
                    ...prev,
                    last_reviewed_sort: "newest",
                  }));
                }}
                className="w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
              >
                📅 Last 30 days
              </button>

              <button
                onClick={() => {
                  setSelectedFilters((prev) => ({
                    ...prev,
                    last_reviewed_sort: "oldest",
                  }));
                }}
                className="w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
              >
                ⏰ Never reviewed
              </button>
            </div>

            {selectedFilters?.last_reviewed_sort && (
              <div className="p-2 border-t border-gray-100">
                <button
                  onClick={() =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      last_reviewed_sort: null,
                    }))
                  }
                  className="w-full px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Clear Sorting
                </button>
              </div>
            )}
          </div>
        )}
      </th>
    </>
  );
};

export default TableHeaderFilters;
