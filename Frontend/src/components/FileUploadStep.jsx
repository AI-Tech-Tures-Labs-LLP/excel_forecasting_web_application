// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Upload,
//   FileSpreadsheet,
//   CheckCircle,
//   ArrowRight,
//   ArrowLeft,
//   HardDrive,
//   Search,
//   List,
//   FolderOpen,
//   ChevronDown,
//   ChevronRight,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { formatDateTime } from "../utils/dateFormat";
// import { getAllFiles } from "../services/forecast.service";
// import { setCurrentSession, setFiles } from "../redux/forecastSlice";

// function FileUploadStep() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [expandedFolders, setExpandedFolders] = useState({});

//   // Get files from Redux store
//   const files = useSelector((state) => state.forecast.files);
//   console.log("Files from Redux:", files);

//   // Helper function to extract year and month from uploaded_at
//   const getFileHierarchy = (uploadedAt) => {
//     const date = new Date(uploadedAt);
//     const year = date.getFullYear();

//     // Get month as full name (January, February, etc.)
//     const month = date.toLocaleString("default", { month: "long" });

//     return {
//       year,
//       month,
//       monthOrder: date.getMonth(), // 0-11 for sorting
//     };
//   };

//   const handleFileClick = (file) => {
//     setSelectedFile(file);

//     const fileData = {
//       id: file.id,
//       name: file.name,
//       file_url: file.file,
//       summary_url: file.summary,
//       month_from: file.month_from,
//       month_to: file.month_to,
//       categories: JSON.parse(file.categories || "[]"),
//       output_folder: file.output_folder,
//       uploaded_at: file.uploaded_at,
//       percentage: file.percentage,
//     };
//     dispatch(setCurrentSession(fileData));
//     setTimeout(() => {
//       navigate(`/products/${file.id}`);
//     }, 500);
//   };

//   const handleUploadClick = () => {
//     navigate("/forecast");
//   };

//   const handleBack = () => {
//     navigate("/");
//   };

//   const getFileIcon = (file) => {
//     return <FileSpreadsheet className="text-green-600" size={20} />;
//   };

//   const getFiles = async () => {
//     try {
//       const res = await getAllFiles();
//       console.log("Fetched files:", res.data);
//       dispatch(setFiles(res.data));
//     } catch (err) {
//       console.error("Error fetching files:", err);
//       return [];
//     }
//   };

//   const formatCategories = (categoriesJson) => {
//     try {
//       const categories = JSON.parse(categoriesJson || "[]");
//       return categories
//         .slice(0, 2)
//         .map((cat) => cat.name)
//         .join(", ");
//     } catch {
//       return "";
//     }
//   };

//   // Group files by year → month (no weeks)
//   const groupFilesByDate = (files) => {
//     const grouped = {};
//     const currentYear = new Date().getFullYear();

//     // Initialize all months for current year and any years with files
//     const allMonths = [
//       { name: "January", order: 0 },
//       { name: "February", order: 1 },
//       { name: "March", order: 2 },
//       { name: "April", order: 3 },
//       { name: "May", order: 4 },
//       { name: "June", order: 5 },
//       { name: "July", order: 6 },
//       { name: "August", order: 7 },
//       { name: "September", order: 8 },
//       { name: "October", order: 9 },
//       { name: "November", order: 10 },
//       { name: "December", order: 11 },
//     ];

//     // Get all years that have files
//     const yearsWithFiles = new Set();
//     files.forEach((file) => {
//       const { year } = getFileHierarchy(file.uploaded_at);
//       yearsWithFiles.add(year);
//     });

//     // Always include current year
//     yearsWithFiles.add(currentYear);

//     // Initialize all years and months
//     yearsWithFiles.forEach((year) => {
//       if (!grouped[year]) grouped[year] = {};

//       allMonths.forEach((month) => {
//         grouped[year][month.name] = {
//           monthOrder: month.order,
//           files: [],
//         };
//       });
//     });

//     // Populate with actual files
//     files.forEach((file) => {
//       const { year, month } = getFileHierarchy(file.uploaded_at);
//       if (grouped[year] && grouped[year][month]) {
//         grouped[year][month].files.push(file);
//       }
//     });

//     return grouped;
//   };

//   // Toggle folder expansion
//   const toggleFolder = (path) => {
//     setExpandedFolders((prev) => ({
//       ...prev,
//       [path]: !prev[path],
//     }));
//   };

//   // Check if folder is expanded
//   const isFolderExpanded = (path) => {
//     return expandedFolders[path] || false;
//   };

//   useEffect(() => {
//     getFiles();
//   }, []);

//   const filteredFiles = files.filter((file) =>
//     file.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const structuredFiles = groupFilesByDate(filteredFiles);

//   const renderListView = () => (
//     <div className="space-y-4">
//       {Object.entries(structuredFiles).map(([year, months]) => (
//         <div
//           key={year}
//           className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg"
//         >
//           {/* Year Header - Folder Style */}
//           <div
//             className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 cursor-pointer hover:from-indigo-700 hover:to-blue-700 transition-all duration-200"
//             onClick={() => toggleFolder(`list-year-${year}`)}
//           >
//             <div className="flex items-center gap-4">
//               {isFolderExpanded(`list-year-${year}`) ? (
//                 <ChevronDown size={22} className="text-white" />
//               ) : (
//                 <ChevronRight size={22} className="text-white" />
//               )}
//               <FolderOpen size={24} className="text-white" />
//               <h2 className="text-2xl font-bold text-white">{year}</h2>
//               <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm">
//                 {Object.values(months).reduce(
//                   (acc, monthData) => acc + (monthData.files?.length || 0),
//                   0
//                 )}{" "}
//                 files
//               </span>
//             </div>
//           </div>

//           {/* Year Content */}
//           {isFolderExpanded(`list-year-${year}`) && (
//             <div className="bg-white">
//               {Object.entries(months).map(([month, monthData]) => (
//                 <div
//                   key={month}
//                   className="border-b border-gray-100 last:border-b-0"
//                 >
//                   {/* Month Header - Folder Style */}
//                   <div
//                     className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-3 cursor-pointer hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
//                     onClick={() => toggleFolder(`list-month-${year}-${month}`)}
//                   >
//                     <div className="flex items-center gap-3">
//                       {isFolderExpanded(`list-month-${year}-${month}`) ? (
//                         <ChevronDown size={18} className="text-white" />
//                       ) : (
//                         <ChevronRight size={18} className="text-white" />
//                       )}
//                       <FolderOpen size={20} className="text-white" />
//                       <h3 className="text-lg font-semibold text-white">
//                         {month}
//                       </h3>
//                       <span className="px-2 py-1 bg-white/20 text-white rounded-full text-xs font-medium backdrop-blur-sm">
//                         {monthData.files?.length || 0} files
//                       </span>
//                     </div>
//                   </div>

//                   {/* Month Content - Files List */}
//                   {isFolderExpanded(`list-month-${year}-${month}`) && (
//                     <div className="bg-white">
//                       {monthData.files && monthData.files.length > 0 ? (
//                         <>
//                           {/* List Header */}
//                           <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             <div className="col-span-4">Name</div>
//                             <div className="col-span-2">Date Range</div>
//                             <div className="col-span-3">Categories</div>
//                             <div className="col-span-2">Uploaded</div>
//                             <div className="col-span-1">Status</div>
//                           </div>

//                           {/* Files */}
//                           {monthData.files.map((file, index) => (
//                             <div
//                               key={file.id}
//                               onClick={() => handleFileClick(file)}
//                               className={`grid grid-cols-12 gap-4 p-3 transition-colors cursor-pointer hover:bg-green-50 ${
//                                 index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                               } ${
//                                 selectedFile?.id === file.id
//                                   ? "bg-indigo-50 border-l-4 border-indigo-500"
//                                   : ""
//                               }`}
//                             >
//                               <div className="col-span-4 flex items-center gap-3">
//                                 {getFileIcon(file)}
//                                 <div>
//                                   <p className="text-sm font-medium text-gray-900">
//                                     {file.name}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     {file.output_folder}
//                                   </p>
//                                 </div>
//                               </div>
//                               <div className="col-span-2 flex items-center text-sm text-gray-500">
//                                 {file.month_from} - {file.month_to}
//                               </div>
//                               <div className="col-span-3 flex items-center text-sm text-gray-500">
//                                 {formatCategories(file.categories)}
//                               </div>
//                               <div className="col-span-2 flex items-center text-sm text-gray-500">
//                                 {formatDateTime(file.uploaded_at)}
//                               </div>
//                               <div className="col-span-1 flex items-center">
//                                 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                   Ready
//                                 </span>
//                               </div>
//                             </div>
//                           ))}
//                         </>
//                       ) : (
//                         <div className="p-8 text-center">
//                           <FileSpreadsheet
//                             className="mx-auto text-gray-300 mb-3"
//                             size={32}
//                           />
//                           <p className="text-sm text-gray-500">
//                             No files in {month} {year}
//                           </p>
//                           <p className="text-xs text-gray-400 mt-1">
//                             Upload files to see them here
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
//           <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-8 py-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={handleBack}
//                   className="text-white opacity-80 hover:opacity-100 flex items-center gap-2 transition-opacity"
//                 >
//                   <ArrowLeft size={16} />
//                   <span className="font-medium">Back to Dashboard</span>
//                 </button>
//               </div>

//               <button
//                 onClick={handleUploadClick}
//                 className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
//               >
//                 <Upload size={18} />
//                 <span>Create New Forecast</span>
//               </button>
//             </div>

//             <div className="mt-4">
//               <h1 className="text-3xl font-bold text-white mb-2">
//                 Select Forecast File
//               </h1>
//               <p className="text-indigo-100">
//                 Choose an existing forecast file or create a new one - organized
//                 by year and month
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Drive Interface */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {/* Drive Header */}
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <HardDrive className="text-gray-600" size={24} />
//                 <h2 className="text-xl font-semibold text-gray-900">
//                   My Drive - Organized by Year & Month
//                 </h2>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
//                   <List size={18} />
//                 </div>
//               </div>
//             </div>

//             {/* Search Bar */}
//             <div className="relative mb-4">
//               <Search
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 size={20}
//               />
//               <input
//                 type="text"
//                 placeholder="Search forecast files..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>

//             {/* Breadcrumb */}
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <FolderOpen size={16} />
//               <span>My Drive</span>
//               <span>›</span>
//               <span>Year & Month View</span>
//             </div>
//           </div>

//           {/* File Content */}
//           <div className="p-6">
//             {filteredFiles.length === 0 ? (
//               <div className="text-center py-12">
//                 <FileSpreadsheet
//                   className="mx-auto text-gray-300 mb-4"
//                   size={64}
//                 />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   {files.length === 0
//                     ? "No files yet"
//                     : "No files match your search"}
//                 </h3>
//                 <p className="text-gray-500 mb-4">
//                   {files.length === 0
//                     ? "Create your first forecast to get started"
//                     : "Try adjusting your search terms"}
//                 </p>
//                 {files.length === 0 && (
//                   <button
//                     onClick={handleUploadClick}
//                     className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
//                   >
//                     Create New Forecast
//                   </button>
//                 )}
//               </div>
//             ) : (
//               renderListView()
//             )}
//           </div>

//           {/* Selected File Info */}
//           {selectedFile && (
//             <div className="border-t border-gray-200 p-6 bg-green-50">
//               <div className="flex items-center gap-4">
//                 <div className="bg-green-100 p-3 rounded-lg">
//                   <CheckCircle className="text-green-600" size={24} />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-green-900 mb-1">
//                     File Selected
//                   </h3>
//                   <p className="text-green-800 font-medium">
//                     {selectedFile.name}
//                   </p>
//                   <p className="text-green-600 text-sm">
//                     {selectedFile.month_from} - {selectedFile.month_to}
//                   </p>
//                   <p className="text-green-600 text-xs mt-1">
//                     Categories: {formatCategories(selectedFile.categories)}
//                   </p>
//                 </div>
//                 <div className="text-green-600">
//                   <ArrowRight size={20} />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="border-t border-gray-200 p-6 flex justify-between items-center bg-gray-50">
//             <button
//               onClick={handleBack}
//               className="flex items-center gap-2 px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <ArrowLeft size={16} />
//               Back to Dashboard
//             </button>

//             <div className="text-sm text-gray-500">
//               {files.length} files available in{" "}
//               {Object.keys(structuredFiles).length} years
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FileUploadStep;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  HardDrive,
  Search,
  List,
  FolderOpen,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { formatDateTime } from "../utils/dateFormat";
import { getAllFiles } from "../services/forecast.service";
import { setCurrentSession, setFiles } from "../redux/forecastSlice";

function FileUploadStep() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFolders, setExpandedFolders] = useState({});

  // Get current user role
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  // Get files from Redux store
  const files = useSelector((state) => state.forecast.files);
  console.log("Files from Redux:", files);

  // Helper function to extract year and month from uploaded_at
  const getFileHierarchy = (uploadedAt) => {
    const date = new Date(uploadedAt);
    const year = date.getFullYear();

    // Get month as full name (January, February, etc.)
    const month = date.toLocaleString("default", { month: "long" });

    return {
      year,
      month,
      monthOrder: date.getMonth(), // 0-11 for sorting
    };
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);

    const fileData = {
      id: file.id,
      name: file.name,
      file_url: file.file,
      summary_url: file.summary,
      month_from: file.month_from,
      month_to: file.month_to,
      categories: JSON.parse(file.categories || "[]"),
      output_folder: file.output_folder,
      uploaded_at: file.uploaded_at,
      percentage: file.percentage,
    };
    dispatch(setCurrentSession(fileData));
    setTimeout(() => {
      navigate(`/products/${file.id}`);
    }, 500);
  };

  const handleUploadClick = () => {
    navigate("/forecast");
  };

  const handleBack = () => {
    // Role-based back navigation
    if (isAdmin) {
      navigate("/");
    } else {
      navigate("/dashboard");
    }
  };

  const getFileIcon = (file) => {
    return <FileSpreadsheet className="text-green-600" size={20} />;
  };

  const getFiles = async () => {
    try {
      const res = await getAllFiles();
      console.log("Fetched files:", res.data);
      dispatch(setFiles(res.data));
    } catch (err) {
      console.error("Error fetching files:", err);
      return [];
    }
  };

  const formatCategories = (categoriesJson) => {
    try {
      const categories = JSON.parse(categoriesJson || "[]");
      return categories
        .slice(0, 2)
        .map((cat) => cat.name)
        .join(", ");
    } catch {
      return "";
    }
  };

  // Group files by year → month (no weeks)
  const groupFilesByDate = (files) => {
    const grouped = {};
    const currentYear = new Date().getFullYear();

    // Initialize all months for current year and any years with files
    const allMonths = [
      { name: "January", order: 0 },
      { name: "February", order: 1 },
      { name: "March", order: 2 },
      { name: "April", order: 3 },
      { name: "May", order: 4 },
      { name: "June", order: 5 },
      { name: "July", order: 6 },
      { name: "August", order: 7 },
      { name: "September", order: 8 },
      { name: "October", order: 9 },
      { name: "November", order: 10 },
      { name: "December", order: 11 },
    ];

    // Get all years that have files
    const yearsWithFiles = new Set();
    files.forEach((file) => {
      const { year } = getFileHierarchy(file.uploaded_at);
      yearsWithFiles.add(year);
    });

    // Always include current year
    yearsWithFiles.add(currentYear);

    // Initialize all years and months
    yearsWithFiles.forEach((year) => {
      if (!grouped[year]) grouped[year] = {};

      allMonths.forEach((month) => {
        grouped[year][month.name] = {
          monthOrder: month.order,
          files: [],
        };
      });
    });

    // Populate with actual files
    files.forEach((file) => {
      const { year, month } = getFileHierarchy(file.uploaded_at);
      if (grouped[year] && grouped[year][month]) {
        grouped[year][month].files.push(file);
      }
    });

    return grouped;
  };

  // Toggle folder expansion
  const toggleFolder = (path) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  // Check if folder is expanded
  const isFolderExpanded = (path) => {
    return expandedFolders[path] || false;
  };

  useEffect(() => {
    getFiles();
  }, []);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const structuredFiles = groupFilesByDate(filteredFiles);

  const renderListView = () => (
    <div className="space-y-4">
      {Object.entries(structuredFiles).map(([year, months]) => (
        <div
          key={year}
          className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg"
        >
          {/* Year Header - Folder Style */}
          <div
            className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 cursor-pointer hover:from-indigo-700 hover:to-blue-700 transition-all duration-200"
            onClick={() => toggleFolder(`list-year-${year}`)}
          >
            <div className="flex items-center gap-4">
              {isFolderExpanded(`list-year-${year}`) ? (
                <ChevronDown size={22} className="text-white" />
              ) : (
                <ChevronRight size={22} className="text-white" />
              )}
              <FolderOpen size={24} className="text-white" />
              <h2 className="text-2xl font-bold text-white">{year}</h2>
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                {Object.values(months).reduce(
                  (acc, monthData) => acc + (monthData.files?.length || 0),
                  0
                )}{" "}
                files
              </span>
            </div>
          </div>

          {/* Year Content */}
          {isFolderExpanded(`list-year-${year}`) && (
            <div className="bg-white">
              {Object.entries(months).map(([month, monthData]) => (
                <div
                  key={month}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  {/* Month Header - Folder Style */}
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-3 cursor-pointer hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
                    onClick={() => toggleFolder(`list-month-${year}-${month}`)}
                  >
                    <div className="flex items-center gap-3">
                      {isFolderExpanded(`list-month-${year}-${month}`) ? (
                        <ChevronDown size={18} className="text-white" />
                      ) : (
                        <ChevronRight size={18} className="text-white" />
                      )}
                      <FolderOpen size={20} className="text-white" />
                      <h3 className="text-lg font-semibold text-white">
                        {month}
                      </h3>
                      <span className="px-2 py-1 bg-white/20 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                        {monthData.files?.length || 0} files
                      </span>
                    </div>
                  </div>

                  {/* Month Content - Files List */}
                  {isFolderExpanded(`list-month-${year}-${month}`) && (
                    <div className="bg-white">
                      {monthData.files && monthData.files.length > 0 ? (
                        <>
                          {/* List Header */}
                          <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="col-span-4">Name</div>
                            <div className="col-span-2">Date Range</div>
                            <div className="col-span-3">Categories</div>
                            <div className="col-span-2">Uploaded</div>
                            <div className="col-span-1">Status</div>
                          </div>

                          {/* Files */}
                          {monthData.files.map((file, index) => (
                            <div
                              key={file.id}
                              onClick={() => handleFileClick(file)}
                              className={`grid grid-cols-12 gap-4 p-3 transition-colors cursor-pointer hover:bg-green-50 ${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              } ${
                                selectedFile?.id === file.id
                                  ? "bg-indigo-50 border-l-4 border-indigo-500"
                                  : ""
                              }`}
                            >
                              <div className="col-span-4 flex items-center gap-3">
                                {getFileIcon(file)}
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {file.output_folder}
                                  </p>
                                </div>
                              </div>
                              <div className="col-span-2 flex items-center text-sm text-gray-500">
                                {file.month_from} - {file.month_to}
                              </div>
                              <div className="col-span-3 flex items-center text-sm text-gray-500">
                                {formatCategories(file.categories)}
                              </div>
                              <div className="col-span-2 flex items-center text-sm text-gray-500">
                                {formatDateTime(file.uploaded_at)}
                              </div>
                              <div className="col-span-1 flex items-center">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Ready
                                </span>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="p-8 text-center">
                          <FileSpreadsheet
                            className="mx-auto text-gray-300 mb-3"
                            size={32}
                          />
                          <p className="text-sm text-gray-500">
                            No files in {month} {year}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {isAdmin
                              ? "Upload files to see them here"
                              : "No files available for this period"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="text-white opacity-80 hover:opacity-100 flex items-center gap-2 transition-opacity"
                >
                  <ArrowLeft size={16} />
                  <span className="font-medium">
                    Back to {isAdmin ? "Home" : "Dashboard"}
                  </span>
                </button>
              </div>

              {/* Only show Create New Forecast button for admins */}
              {isAdmin && (
                <button
                  onClick={handleUploadClick}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                >
                  <Upload size={18} />
                  <span>Create New Forecast</span>
                </button>
              )}
            </div>

            <div className="mt-4">
              <h1 className="text-3xl font-bold text-white mb-2">
                {isAdmin ? "Select Forecast File" : "Available Forecast Files"}
              </h1>
              <p className="text-indigo-100">
                {isAdmin
                  ? "Choose an existing forecast file or create a new one - organized by year and month"
                  : "Browse and select available forecast files organized by year and month"}
              </p>
            </div>
          </div>
        </div>

        {/* Drive Interface */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Drive Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <HardDrive className="text-gray-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">
                  {isAdmin ? "My Drive" : "Available Files"} - Organized by Year
                  & Month
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                  <List size={18} />
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search forecast files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FolderOpen size={16} />
              <span>{isAdmin ? "My Drive" : "Available Files"}</span>
              <span>›</span>
              <span>Year & Month View</span>
            </div>
          </div>

          {/* File Content */}
          <div className="p-6">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <FileSpreadsheet
                  className="mx-auto text-gray-300 mb-4"
                  size={64}
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {files.length === 0
                    ? "No files yet"
                    : "No files match your search"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {files.length === 0
                    ? isAdmin
                      ? "Create your first forecast to get started"
                      : "No forecast files are available yet"
                    : "Try adjusting your search terms"}
                </p>
                {files.length === 0 && isAdmin && (
                  <button
                    onClick={handleUploadClick}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Create New Forecast
                  </button>
                )}
              </div>
            ) : (
              renderListView()
            )}
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="border-t border-gray-200 p-6 bg-green-50">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-1">
                    File Selected
                  </h3>
                  <p className="text-green-800 font-medium">
                    {selectedFile.name}
                  </p>
                  <p className="text-green-600 text-sm">
                    {selectedFile.month_from} - {selectedFile.month_to}
                  </p>
                  <p className="text-green-600 text-xs mt-1">
                    Categories: {formatCategories(selectedFile.categories)}
                  </p>
                </div>
                <div className="text-green-600">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t border-gray-200 p-6 flex justify-between items-center bg-gray-50">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to {isAdmin ? "Home" : "Dashboard"}
            </button>

            <div className="text-sm text-gray-500">
              {files.length} files available in{" "}
              {Object.keys(structuredFiles).length} years
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUploadStep;
