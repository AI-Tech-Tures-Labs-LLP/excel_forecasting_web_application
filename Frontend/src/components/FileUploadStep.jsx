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
//   Grid3X3,
//   List,
//   FolderOpen,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { formatDateTime } from "../utils/dateFormat";
// import { getAllFiles } from "../services/forecast.service";
// import { setFiles } from "../redux/forecastSlice";

// function FileUploadStep() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [viewMode, setViewMode] = useState("grid");
//   const [searchTerm, setSearchTerm] = useState("");

//   // Get files from Redux store
//   const files = useSelector((state) => state.forecast.files);
//   console.log("Files from Redux:", files);
//   const handleFileClick = (file) => {
//     setSelectedFile(file);

//     // Store file data for navigation
//     // const fileData = {
//     //   id: file.id,
//     //   name: file.name,
//     //   file_url: file.file,
//     //   summary_url: file.summary,
//     //   month_from: file.month_from,
//     //   month_to: file.month_to,
//     //   categories: JSON.parse(file.categories || "[]"),
//     //   output_folder: file.output_folder,
//     //   uploaded_at: file.uploaded_at,
//     // };
//     // sessionStorage.setItem("selectedFile", JSON.stringify(fileData));

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
//     return (
//       <FileSpreadsheet
//         className="text-green-600"
//         size={viewMode === "grid" ? 32 : 20}
//       />
//     );
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

//   const getFileCardClasses = (file) => {
//     let baseClasses = "p-4 rounded-lg border-2 transition-all duration-200";

//     if (selectedFile?.id === file.id) {
//       return `${baseClasses} border-indigo-500 bg-indigo-50 shadow-md cursor-pointer`;
//     } else {
//       return `${baseClasses} border-green-200 hover:border-green-300 hover:bg-green-50 cursor-pointer hover:shadow-md`;
//     }
//   };

//   const getStatusBadge = (file) => {
//     return (
//       <div className="mt-2">
//         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//           Ready
//         </span>
//       </div>
//     );
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

//   useEffect(() => {
//     getFiles();
//   }, []);

//   const filteredFiles = files.filter((file) =>
//     file.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const renderGridView = () => (
//     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//       {filteredFiles.map((file) => (
//         <div
//           key={file.id}
//           onClick={() => handleFileClick(file)}
//           className={getFileCardClasses(file)}
//         >
//           <div className="flex flex-col items-center text-center">
//             <div className="mb-3">{getFileIcon(file)}</div>
//             <h3
//               className="text-sm font-medium text-gray-900 truncate w-full"
//               title={file.name}
//             >
//               {file.name}
//             </h3>
//             <p className="text-xs text-gray-400">
//               {formatDateTime(file.uploaded_at)}
//             </p>
//             <div className="flex flex-col items-center justify-between">
//               <p className="text-xs text-gray-400">from: {file.month_from}</p>
//               <p className="text-xs text-gray-400">to: {file.month_to}</p>
//             </div>
//             <p
//               className="text-xs text-gray-400 truncate w-full"
//               title={formatCategories(file.categories)}
//             >
//               {formatCategories(file.categories)}
//             </p>
//             {getStatusBadge(file)}
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   const renderListView = () => (
//     <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//       <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
//         <div className="col-span-4">Name</div>
//         <div className="col-span-2">Date Range</div>
//         <div className="col-span-3">Categories</div>
//         <div className="col-span-2">Uploaded</div>
//         <div className="col-span-1">Status</div>
//       </div>
//       {filteredFiles.map((file, index) => (
//         <div
//           key={file.id}
//           onClick={() => handleFileClick(file)}
//           className={`grid grid-cols-12 gap-4 p-3 transition-colors ${
//             index % 2 === 0 ? "bg-white" : "bg-gray-50"
//           } ${
//             selectedFile?.id === file.id
//               ? "bg-indigo-50 border-l-4 border-indigo-500 cursor-pointer"
//               : "hover:bg-green-50 cursor-pointer"
//           }`}
//         >
//           <div className="col-span-4 flex items-center gap-3">
//             {getFileIcon(file)}
//             <div>
//               <p className="text-sm font-medium text-gray-900">{file.name}</p>
//               <p className="text-xs text-gray-500">{file.output_folder}</p>
//             </div>
//           </div>
//           <div className="col-span-2 flex items-center text-sm text-gray-500">
//             {file.month_from} - {file.month_to}
//           </div>
//           <div className="col-span-3 flex items-center text-sm text-gray-500">
//             {formatCategories(file.categories)}
//           </div>
//           <div className="col-span-2 flex items-center text-sm text-gray-500">
//             {formatDateTime(file.uploaded_at)}
//           </div>
//           <div className="col-span-1 flex items-center">
//             <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//               Ready
//             </span>
//           </div>
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
//                 Choose an existing forecast file or create a new one
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
//                   My Drive
//                 </h2>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setViewMode("grid")}
//                   className={`p-2 rounded-lg transition-colors ${
//                     viewMode === "grid"
//                       ? "bg-indigo-100 text-indigo-600"
//                       : "text-gray-500 hover:bg-gray-100"
//                   }`}
//                 >
//                   <Grid3X3 size={18} />
//                 </button>
//                 <button
//                   onClick={() => setViewMode("list")}
//                   className={`p-2 rounded-lg transition-colors ${
//                     viewMode === "list"
//                       ? "bg-indigo-100 text-indigo-600"
//                       : "text-gray-500 hover:bg-gray-100"
//                   }`}
//                 >
//                   <List size={18} />
//                 </button>
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
//             </div>
//           </div>

//           {/* File Grid/List */}
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
//             ) : viewMode === "grid" ? (
//               renderGridView()
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
//               {files.length} files available
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
  Grid3X3,
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
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFolders, setExpandedFolders] = useState({});

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
    navigate("/");
  };

  const getFileIcon = (file) => {
    return (
      <FileSpreadsheet
        className="text-green-600"
        size={viewMode === "grid" ? 32 : 20}
      />
    );
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

  const getFileCardClasses = (file) => {
    let baseClasses = "p-4 rounded-lg border-2 transition-all duration-200";

    if (selectedFile?.id === file.id) {
      return `${baseClasses} border-indigo-500 bg-indigo-50 shadow-md cursor-pointer`;
    } else {
      return `${baseClasses} border-green-200 hover:border-green-300 hover:bg-green-50 cursor-pointer hover:shadow-md`;
    }
  };

  const getStatusBadge = (file) => {
    return (
      <div className="mt-2">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Ready
        </span>
      </div>
    );
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

    files.forEach((file) => {
      const { year, month, monthOrder } = getFileHierarchy(file.uploaded_at);

      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][month]) {
        grouped[year][month] = {
          monthOrder,
          files: [],
        };
      }

      grouped[year][month].files.push(file);
    });

    // Sort months in proper order (Jan to Dec)
    Object.keys(grouped).forEach((year) => {
      const sortedMonths = {};
      const monthEntries = Object.entries(grouped[year]).sort(
        ([, a], [, b]) => a.monthOrder - b.monthOrder
      );

      monthEntries.forEach(([monthName, monthData]) => {
        sortedMonths[monthName] = monthData;
      });

      grouped[year] = sortedMonths;
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

  const renderGridView = () => (
    <div className="space-y-6">
      {Object.entries(structuredFiles).map(([year, months]) => (
        <div
          key={year}
          className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg"
        >
          {/* Year Header - Folder Style */}
          <div
            className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 cursor-pointer hover:from-indigo-700 hover:to-blue-700 transition-all duration-200"
            onClick={() => toggleFolder(`year-${year}`)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {isFolderExpanded(`year-${year}`) ? (
                    <ChevronDown size={22} className="text-white" />
                  ) : (
                    <ChevronRight size={22} className="text-white" />
                  )}
                  <FolderOpen size={24} className="text-white" />
                  <h2 className="text-2xl font-bold text-white">{year}</h2>
                </div>
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                  {Object.values(months).reduce(
                    (acc, monthData) => acc + (monthData.files?.length || 0),
                    0
                  )}{" "}
                  files
                </span>
              </div>
            </div>
          </div>

          {/* Year Content */}
          {isFolderExpanded(`year-${year}`) && (
            <div className="bg-gray-50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.entries(months).map(([month, monthData]) => (
                  <div
                    key={month}
                    className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    {/* Month Header - Folder Style */}
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-3 cursor-pointer hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
                      onClick={() => toggleFolder(`month-${year}-${month}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isFolderExpanded(`month-${year}-${month}`) ? (
                            <ChevronDown size={18} className="text-white" />
                          ) : (
                            <ChevronRight size={18} className="text-white" />
                          )}
                          <FolderOpen size={20} className="text-white" />
                          <h3 className="text-lg font-semibold text-white">
                            {month}
                          </h3>
                        </div>
                      </div>
                      <div className="mt-1">
                        <span className="px-2 py-1 bg-white/20 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                          {monthData.files?.length || 0} files
                        </span>
                      </div>
                    </div>

                    {/* Month Content - Files */}
                    {isFolderExpanded(`month-${year}-${month}`) && (
                      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                        {(monthData.files || []).map((file) => (
                          <div
                            key={file.id}
                            onClick={() => handleFileClick(file)}
                            className="p-3 bg-white rounded-md border border-gray-200 hover:border-green-300 hover:bg-green-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                {getFileIcon(file)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5
                                  className="text-sm font-medium text-gray-900 truncate"
                                  title={file.name}
                                >
                                  {file.name}
                                </h5>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDateTime(file.uploaded_at)}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-400">
                                    {file.month_from} → {file.month_to}
                                  </span>
                                </div>
                                <p
                                  className="text-xs text-gray-400 truncate mt-1"
                                  title={formatCategories(file.categories)}
                                >
                                  {formatCategories(file.categories)}
                                </p>
                                <div className="mt-2">
                                  {getStatusBadge(file)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

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
                      {/* List Header */}
                      <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="col-span-4">Name</div>
                        <div className="col-span-2">Date Range</div>
                        <div className="col-span-3">Categories</div>
                        <div className="col-span-2">Uploaded</div>
                        <div className="col-span-1">Status</div>
                      </div>

                      {/* Files */}
                      {(monthData.files || []).map((file, index) => (
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
                  <span className="font-medium">Back to Dashboard</span>
                </button>
              </div>

              <button
                onClick={handleUploadClick}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              >
                <Upload size={18} />
                <span>Create New Forecast</span>
              </button>
            </div>

            <div className="mt-4">
              <h1 className="text-3xl font-bold text-white mb-2">
                Select Forecast File
              </h1>
              <p className="text-indigo-100">
                Choose an existing forecast file or create a new one - organized
                by year and month
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
                  My Drive - Organized by Year & Month
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <List size={18} />
                </button>
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
              <span>My Drive</span>
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
                    ? "Create your first forecast to get started"
                    : "Try adjusting your search terms"}
                </p>
                {files.length === 0 && (
                  <button
                    onClick={handleUploadClick}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Create New Forecast
                  </button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              renderGridView()
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
              Back to Dashboard
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
