// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Upload,
//   FileDown,
//   Calendar,
//   Percent,
//   CheckCircle,
//   AlertCircle,
//   TrendingUp,
//   ChevronDown,
//   Filter,
//   ArrowLeft,
//   X,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// // Loading Modal Component
// const LoadingModal = ({ isOpen, progress, onComplete, onError }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
//         <div className="text-center">
//           {/* Header */}
//           <div className="mb-6">
//             <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//               <TrendingUp className="text-indigo-600" size={32} />
//             </div>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">
//               Generating Forecast
//             </h3>
//             <p className="text-gray-600 text-sm">
//               Please wait while we process your data and generate the forecast
//               file.
//             </p>
//           </div>

//           {/* Progress Bar */}
//           <div className="mb-6">
//             <div className="flex justify-between text-sm text-gray-600 mb-2">
//               <span>Processing...</span>
//               <span>{Math.round(progress)}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//               <div
//                 className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
//                 style={{ width: `${Math.round(progress)}%` }}
//               ></div>
//             </div>
//           </div>

//           {/* Status Messages */}
//           <div className="space-y-2 text-sm text-gray-600">
//             {progress < 20 && (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
//                 <span>Uploading and validating file...</span>
//               </div>
//             )}
//             {progress >= 20 && progress < 40 && (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
//                 <span>Processing data structure...</span>
//               </div>
//             )}
//             {progress >= 40 && progress < 70 && (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
//                 <span>Analyzing patterns and trends...</span>
//               </div>
//             )}
//             {progress >= 70 && progress < 95 && (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
//                 <span>Generating forecast calculations...</span>
//               </div>
//             )}
//             {progress >= 95 && progress < 100 && (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
//                 <span>Finalizing and preparing download...</span>
//               </div>
//             )}
//             {progress === 100 && (
//               <div className="flex items-center justify-center gap-2 text-green-600">
//                 <CheckCircle size={16} />
//                 <span>Forecast generated successfully!</span>
//               </div>
//             )}
//           </div>

//           {/* Warning */}
//           <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
//             <div className="flex items-center gap-2 text-amber-800">
//               <AlertCircle size={16} />
//               <span className="text-xs">
//                 Please do not close this window while processing
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function Forecast() {
//   const navigate = useNavigate();
//   const [file, setFile] = useState(null);
//   const [outputFileName, setOutputFileName] = useState("");
//   const [monthFrom, setMonthFrom] = useState("");
//   const [monthTo, setMonthTo] = useState("");
//   const [percentage, setPercentage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [downloadUrl, setDownloadUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showCategories, setShowCategories] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const categoryTuples = [
//     ["Bridge Gem", "742"],
//     ["Gold", "746"],
//     ["Gold", "262&270"],
//     ["Womens Silver", "260&404"],
//     ["Precious", "264&268"],
//     ["Fine Pearl", "265&271"],
//     ["Semi", "272&733"],
//     ["Diamond", "734&737&748"],
//     ["Bridal", "739&267&263"],
//     ["Men's", "768&771"],
//   ];

//   const [checkedItems, setCheckedItems] = useState(
//     new Array(categoryTuples.length).fill(false)
//   );
//   const [isSelectAll, setIsSelectAll] = useState(false);

//   // More realistic progress simulation
//   useEffect(() => {
//     let interval;
//     if (loading && showModal) {
//       interval = setInterval(() => {
//         setProgress((prev) => {
//           // Different progress speeds for different stages
//           let increment;
//           if (prev < 20) {
//             // Initial upload stage - slower
//             increment = Math.random() * 3 + 1; // 1-4%
//           } else if (prev < 40) {
//             // Processing stage - medium speed
//             increment = Math.random() * 2 + 1; // 1-3%
//           } else if (prev < 70) {
//             // Analysis stage - medium speed
//             increment = Math.random() * 2 + 0.5; // 0.5-2.5%
//           } else if (prev < 90) {
//             // Generation stage - slower
//             increment = Math.random() * 1.5 + 0.5; // 0.5-2%
//           } else {
//             // Final stage - very slow, wait for actual completion
//             increment = Math.random() * 0.5; // 0-0.5%
//           }

//           return Math.min(prev + increment, 95);
//         });
//       }, 1200 + Math.random() * 800); // Slower intervals: 1200-2000ms
//     }
//     return () => clearInterval(interval);
//   }, [loading, showModal]);

//   const handleCheckboxChange = (index) => {
//     const updatedCheckedItems = [...checkedItems];
//     updatedCheckedItems[index] = !updatedCheckedItems[index];
//     setCheckedItems(updatedCheckedItems);
//     setIsSelectAll(updatedCheckedItems.every((item) => item));
//   };

//   const handleSelectAllChange = () => {
//     const newState = !isSelectAll;
//     setIsSelectAll(newState);
//     setCheckedItems(new Array(categoryTuples.length).fill(newState));
//   };

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleFileNameChange = (event) => {
//     setOutputFileName(event.target.value);
//   };

//   const handleMonthFromChange = (event) => {
//     setMonthFrom(event.target.value);
//   };

//   const handleMonthToChange = (event) => {
//     setMonthTo(event.target.value);
//   };

//   const handlePercentageChange = (event) => {
//     const value = event.target.value;
//     if (value < 0 || value > 100) alert("Percentage must be between 0 and 100");
//     else setPercentage(value);
//   };

//   // Function to add file to FileUploadStep with loading state
//   const addFileToUploadStep = (forecastData) => {
//     const newFile = {
//       id: Date.now(), // Use timestamp as unique ID
//       name: `${outputFileName}_forecast.xlsx`,
//       type: "file",
//       extension: "xlsx",
//       icon: "FileSpreadsheet",
//       modified: new Date().toLocaleString(),
//       size: "Processing...",
//       isSpreadsheet: true,
//       isGenerated: true,
//       status: "loading", // Start with loading status
//       forecastData: forecastData,
//     };

//     // Get existing files from session storage
//     const existingFiles = JSON.parse(
//       sessionStorage.getItem("generatedFiles") || "[]"
//     );

//     // Add new file
//     const updatedFiles = [...existingFiles, newFile];
//     sessionStorage.setItem("generatedFiles", JSON.stringify(updatedFiles));

//     return newFile.id;
//   };

//   // Function to update file status in FileUploadStep
//   const updateFileStatus = (
//     fileId,
//     status,
//     downloadUrl = null,
//     size = null
//   ) => {
//     const existingFiles = JSON.parse(
//       sessionStorage.getItem("generatedFiles") || "[]"
//     );

//     const updatedFiles = existingFiles.map((file) => {
//       if (file.id === fileId) {
//         return {
//           ...file,
//           status: status,
//           size: size || file.size,
//           downloadUrl: downloadUrl,
//         };
//       }
//       return file;
//     });

//     sessionStorage.setItem("generatedFiles", JSON.stringify(updatedFiles));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (
//       !file ||
//       !outputFileName ||
//       !monthFrom ||
//       !monthTo ||
//       !percentage ||
//       isNaN(percentage)
//     ) {
//       alert("Please fill out all fields correctly.");
//       return;
//     }

//     const selectedCategories = categoryTuples
//       .filter((_, index) => checkedItems[index])
//       .map(([name, value]) => ({ name, value }));

//     if (selectedCategories.length === 0) {
//       alert("Please select at least one category.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("output_filename", outputFileName);
//     formData.append("month_from", monthFrom);
//     formData.append("month_to", monthTo);
//     formData.append("percentage", percentage);
//     formData.append("categories", JSON.stringify(selectedCategories));

//     setLoading(true);
//     setShowModal(true);
//     setProgress(0);
//     setErrorMessage("");

//     // Create forecast data object
//     const forecastData = {
//       selectedCategories,
//       outputFileName,
//       monthFrom,
//       monthTo,
//       percentage,
//       timestamp: new Date().toISOString(),
//     };

//     // Add file to FileUploadStep with loading state
//     const fileId = addFileToUploadStep(forecastData);

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/forecast/upload/`,
//         formData,
//         {
//           onUploadProgress: (progressEvent) => {
//             // Real upload progress for first 20%
//             const uploadPercent = Math.round(
//               (progressEvent.loaded * 20) / progressEvent.total
//             );
//             setProgress(Math.min(uploadPercent, 20));
//           },
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           }
//         }
//       );

//       const filePathFromServer = response.data.file_url;

//       // Complete the progress
//       setProgress(100);

//       // Wait a moment to show completion
//       setTimeout(() => {
//         // Update forecast data with download URL
//         const finalForecastData = {
//           ...forecastData,
//           downloadUrl: filePathFromServer,
//           filePath: response.data.file_path,
//         };

//         // Update file status to completed
//         updateFileStatus(fileId, "completed", filePathFromServer, "2.4 MB");

//         // Store forecast data in localStorage for the Product Selector page
//         localStorage.setItem("forecastData", JSON.stringify(finalForecastData));
//         localStorage.setItem("file_path", outputFileName);

//         setDownloadUrl(filePathFromServer);
//         setShowModal(false);
//         setLoading(false);

//         // Navigate to FileUploadStep
//         navigate("/file-upload");
//       }, 1500);
//     } catch (error) {
//       console.error("Error uploading the file:", error);

//       // Update file status to error
//       updateFileStatus(fileId, "error");

//       setErrorMessage(
//         error.response ? error.response.data.error : "An error occurred"
//       );
//       setShowModal(false);
//       setLoading(false);
//       setProgress(0);
//     }
//   };

//   const months = [
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//     "January",
//   ];

//   const SelectedCategoriesCount = checkedItems.filter((item) => item).length;

//   const handleBackPage = () => {
//     navigate("/file-upload");
//   };

//   return (
//     <>
//       <div className="max-w-6xl mx-auto my-8 bg-white rounded-2xl shadow-xl overflow-hidden">
//         {/* Header with gradient */}
//         <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-10 relative">
//           <div
//             className="flex items-center gap-3 mb-2 pb-2"
//             onClick={handleBackPage}
//           >
//             <button className="text-white opacity-80 hover:opacity-100 flex items-center gap-2 transition-opacity">
//               <ArrowLeft size={16} />
//               Back to Forecast
//             </button>
//           </div>
//           <div className="flex items-start gap-4">
//             <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
//               <TrendingUp className="text-white" size={28} />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-white">
//                 Forecast Upload Dashboard
//               </h1>
//               <p className="text-indigo-100 mt-1 max-w-xl">
//                 Generate accurate sales forecasts by uploading your data and
//                 selecting parameters
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Main content */}
//         <div className="p-10">
//           <form className="space-y-8" onSubmit={handleSubmit}>
//             {/* Upload and filename section */}
//             <div className="grid sm:grid-cols-2 gap-8">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Upload Forecasting Sheet
//                 </label>
//                 <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
//                   <input
//                     type="file"
//                     className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
//                     onChange={handleFileChange}
//                   />
//                 </div>
//                 {file && (
//                   <div className="flex items-center mt-2 text-xs text-gray-500">
//                     <CheckCircle size={14} className="text-green-500 mr-1" />
//                     <span>{file.name} selected</span>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Output Filename
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
//                     placeholder="Enter output file name"
//                     value={outputFileName}
//                     onChange={handleFileNameChange}
//                   />
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                     <FileDown size={18} />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Categories section */}
//             <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
//               <div
//                 className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50"
//                 onClick={() => setShowCategories(!showCategories)}
//               >
//                 <div className="flex items-center gap-2">
//                   <Filter size={18} className="text-indigo-600" />
//                   <h3 className="text-base font-semibold text-gray-800">
//                     Product Categories
//                   </h3>
//                   <div className="ml-2 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
//                     {SelectedCategoriesCount} selected
//                   </div>
//                 </div>
//                 <ChevronDown
//                   size={20}
//                   className={`text-gray-500 transition-transform duration-200 ${
//                     showCategories ? "rotate-180" : ""
//                   }`}
//                 />
//               </div>

//               {showCategories && (
//                 <div className="p-6">
//                   <div className="mb-4 flex items-center">
//                     <label className="inline-flex items-center gap-2 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
//                       <input
//                         type="checkbox"
//                         className="w-4 h-4 accent-indigo-600 rounded"
//                         checked={isSelectAll}
//                         onChange={handleSelectAllChange}
//                       />
//                       <span className="text-sm font-medium text-gray-700">
//                         Select All Categories
//                       </span>
//                     </label>
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//                     {categoryTuples.map(([name, value], index) => (
//                       <label
//                         key={value}
//                         className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer border transition-colors ${
//                           checkedItems[index]
//                             ? "bg-indigo-50 border-indigo-200"
//                             : "bg-white border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30"
//                         }`}
//                       >
//                         <input
//                           type="checkbox"
//                           className="w-4 h-4 accent-indigo-600 rounded"
//                           checked={checkedItems[index]}
//                           onChange={() => handleCheckboxChange(index)}
//                         />
//                         <span
//                           className={`text-sm ${
//                             checkedItems[index]
//                               ? "text-indigo-900 font-medium"
//                               : "text-gray-700"
//                           }`}
//                         >
//                           {name}
//                           <span className="ml-1 text-xs text-gray-500">
//                             ({value})
//                           </span>
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Month and percentage section */}
//             <div className="grid sm:grid-cols-3 gap-6">
//               <div className="space-y-2">
//                 <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
//                   <Calendar size={16} className="text-indigo-500" />
//                   Month From
//                 </label>
//                 <select
//                   className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
//                   value={monthFrom}
//                   onChange={handleMonthFromChange}
//                 >
//                   <option value="">Select Month</option>
//                   {months.map((month, index) => (
//                     <option key={index} value={month}>
//                       {month}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="space-y-2">
//                 <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
//                   <Calendar size={16} className="text-indigo-500" />
//                   Month To
//                 </label>
//                 <select
//                   className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
//                   value={monthTo}
//                   onChange={handleMonthToChange}
//                   disabled={!monthFrom}
//                 >
//                   <option value="">Select Month</option>
//                   {monthFrom &&
//                     months
//                       .slice(months.indexOf(monthFrom) + 1)
//                       .map((month, index) => (
//                         <option key={index} value={month}>
//                           {month}
//                         </option>
//                       ))}
//                 </select>
//               </div>

//               <div className="space-y-2">
//                 <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
//                   <Percent size={16} className="text-indigo-500" />
//                   Current Month Percentage
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="number"
//                     className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all pr-10"
//                     placeholder="0-100"
//                     value={percentage}
//                     onChange={handlePercentageChange}
//                   />
//                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
//                     %
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Submit button */}
//             <button
//               className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-3 hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <Upload size={18} />
//                   Generate Forecast
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Error message */}
//           {errorMessage && (
//             <div className="mt-8 p-5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
//               <div className="text-red-500 mt-0.5">
//                 <AlertCircle size={20} />
//               </div>
//               <div>
//                 <h4 className="font-medium text-red-800">
//                   Error Processing Forecast
//                 </h4>
//                 <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
//               </div>
//             </div>
//           )}

//           {/* Download section - for completed forecasts */}
//           {downloadUrl && (
//             <div className="mt-10 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 shadow-sm">
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-emerald-100 p-2 rounded-full">
//                     <CheckCircle className="text-emerald-600" size={24} />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-emerald-800">
//                       Forecast Generated Successfully
//                     </h3>
//                     <p className="text-sm text-emerald-700">
//                       File is ready in your drive
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-3">
//                   <a
//                     href={downloadUrl}
//                     className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm hover:shadow"
//                     download={outputFileName + ".zip"}
//                   >
//                     <FileDown size={18} />
//                     Download Forecast
//                   </a>
//                   <button
//                     onClick={() => navigate("/file-upload")}
//                     className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow"
//                   >
//                     Go to Drive
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Loading Modal */}
//       <LoadingModal
//         isOpen={showModal}
//         progress={progress}
//         onComplete={() => setShowModal(false)}
//         onError={() => setShowModal(false)}
//       />
//     </>
//   );
// }

// export default Forecast;

// // import React, { useState, useEffect } from "react";
// // import {
// //   Upload,
// //   FileDown,
// //   Calendar,
// //   Percent,
// //   CheckCircle,
// //   AlertCircle,
// //   TrendingUp,
// //   ChevronDown,
// //   Filter,
// //   ArrowLeft,
// //   X,
// //   Loader2,
// //   Database,
// //   BarChart3,
// //   Calculator,
// // } from "lucide-react";

// // // Enhanced Loading Modal Component with realistic timing
// // const LoadingModal = ({ isOpen, progress, onComplete, onError, currentStage }) => {
// //   if (!isOpen) return null;

// //   const stages = [
// //     {
// //       name: "Uploading File",
// //       icon: Upload,
// //       range: [0, 15],
// //       description: "Uploading and validating your Excel file..."
// //     },
// //     {
// //       name: "Processing Data",
// //       icon: Database,
// //       range: [15, 35],
// //       description: "Reading spreadsheet structure and extracting data..."
// //     },
// //     {
// //       name: "Analyzing Patterns",
// //       icon: BarChart3,
// //       range: [35, 65],
// //       description: "Analyzing historical trends and seasonal patterns..."
// //     },
// //     {
// //       name: "Generating Forecasts",
// //       icon: Calculator,
// //       range: [65, 90],
// //       description: "Calculating forecasts for selected categories..."
// //     },
// //     {
// //       name: "Finalizing Output",
// //       icon: FileDown,
// //       range: [90, 100],
// //       description: "Preparing your forecast file for download..."
// //     }
// //   ];

// //   const getCurrentStage = () => {
// //     return stages.find(stage => progress >= stage.range[0] && progress < stage.range[1]) || stages[stages.length - 1];
// //   };

// //   const currentStageInfo = getCurrentStage();
// //   const CurrentIcon = currentStageInfo.icon;

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
// //       <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
// //         <div className="text-center">
// //           {/* Header */}
// //           <div className="mb-8">
// //             <div className="bg-indigo-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center relative">
// //               <CurrentIcon className="text-indigo-600" size={36} />
// //               {progress < 100 && (
// //                 <div className="absolute inset-0 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin"></div>
// //               )}
// //             </div>
// //             <h3 className="text-2xl font-bold text-gray-800 mb-2">
// //               {progress === 100 ? "Forecast Complete!" : "Generating Forecast"}
// //             </h3>
// //             <p className="text-gray-600 text-sm max-w-md mx-auto">
// //               {currentStageInfo.description}
// //             </p>
// //           </div>

// //           {/* Progress Bar */}
// //           <div className="mb-8">
// //             <div className="flex justify-between text-sm text-gray-600 mb-3">
// //               <span className="font-medium">{currentStageInfo.name}</span>
// //               <span className="font-bold">{Math.round(progress)}%</span>
// //             </div>
// //             <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
// //               <div
// //                 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out relative"
// //                 style={{ width: `${Math.round(progress)}%` }}
// //               >
// //                 <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-pulse"></div>
// //               </div>
// //             </div>
// //             <div className="mt-2 text-xs text-gray-500">
// //               Step {stages.findIndex(s => s === currentStageInfo) + 1} of {stages.length}
// //             </div>
// //           </div>

// //           {/* Stage Progress Indicators */}
// //           <div className="mb-8">
// //             <div className="flex justify-between items-center space-x-2">
// //               {stages.map((stage, index) => {
// //                 const StageIcon = stage.icon;
// //                 const isCompleted = progress > stage.range[1];
// //                 const isCurrent = progress >= stage.range[0] && progress <= stage.range[1];
// //                 const isUpcoming = progress < stage.range[0];

// //                 return (
// //                   <div key={index} className="flex flex-col items-center flex-1">
// //                     <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all duration-500 ${
// //                       isCompleted
// //                         ? 'bg-green-100 text-green-600'
// //                         : isCurrent
// //                           ? 'bg-indigo-100 text-indigo-600 animate-pulse'
// //                           : 'bg-gray-100 text-gray-400'
// //                     }`}>
// //                       {isCompleted ? (
// //                         <CheckCircle size={16} />
// //                       ) : (
// //                         <StageIcon size={14} />
// //                       )}
// //                     </div>
// //                     <div className={`text-xs text-center transition-colors duration-500 ${
// //                       isCompleted
// //                         ? 'text-green-600 font-medium'
// //                         : isCurrent
// //                           ? 'text-indigo-600 font-medium'
// //                           : 'text-gray-400'
// //                     }`}>
// //                       {stage.name.split(' ')[0]}
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {/* Estimated Time */}
// //           <div className="mb-6">
// //             {progress < 100 ? (
// //               <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
// //                 <Loader2 size={16} className="animate-spin" />
// //                 <span>
// //                   Estimated time remaining: {
// //                     progress < 20 ? "2-3 minutes" :
// //                     progress < 50 ? "1-2 minutes" :
// //                     progress < 80 ? "30-60 seconds" :
// //                     "Almost done..."
// //                   }
// //                 </span>
// //               </div>
// //             ) : (
// //               <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg p-3">
// //                 <CheckCircle size={16} />
// //                 <span className="font-medium">Forecast generated successfully!</span>
// //               </div>
// //             )}
// //           </div>

// //           {/* Warning */}
// //           <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
// //             <div className="flex items-start gap-3 text-amber-800">
// //               <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
// //               <div className="text-left">
// //                 <p className="text-sm font-medium mb-1">Please wait</p>
// //                 <p className="text-xs">
// //                   This process analyzes your data thoroughly. Closing this window will cancel the forecast generation.
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // function Forecast() {
// //   const [file, setFile] = useState(null);
// //   const [outputFileName, setOutputFileName] = useState("");
// //   const [monthFrom, setMonthFrom] = useState("");
// //   const [monthTo, setMonthTo] = useState("");
// //   const [percentage, setPercentage] = useState("");
// //   const [errorMessage, setErrorMessage] = useState("");
// //   const [downloadUrl, setDownloadUrl] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [showCategories, setShowCategories] = useState(true);
// //   const [showModal, setShowModal] = useState(false);
// //   const [progress, setProgress] = useState(0);

// //   const categoryTuples = [
// //     ["Bridge Gem", "742"],
// //     ["Gold", "746"],
// //     ["Gold", "262&270"],
// //     ["Womens Silver", "260&404"],
// //     ["Precious", "264&268"],
// //     ["Fine Pearl", "265&271"],
// //     ["Semi", "272&733"],
// //     ["Diamond", "734&737&748"],
// //     ["Bridal", "739&267&263"],
// //     ["Men's", "768&771"],
// //   ];

// //   const [checkedItems, setCheckedItems] = useState(
// //     new Array(categoryTuples.length).fill(false)
// //   );
// //   const [isSelectAll, setIsSelectAll] = useState(false);

// //   // Much more realistic progress simulation
// //   useEffect(() => {
// //     let interval;
// //     if (loading && showModal) {
// //       interval = setInterval(() => {
// //         setProgress((prev) => {
// //           // Define stages with different speeds and behaviors
// //           let increment;
// //           let nextValue;

// //           if (prev < 5) {
// //             // Initial connection - very slow start
// //             increment = Math.random() * 0.8 + 0.2; // 0.2-1%
// //           } else if (prev < 15) {
// //             // File upload simulation - steady but slow
// //             increment = Math.random() * 1.2 + 0.5; // 0.5-1.7%
// //           } else if (prev < 25) {
// //             // File processing - can be variable
// //             increment = Math.random() * 0.8 + 0.3; // 0.3-1.1%
// //           } else if (prev < 35) {
// //             // Data extraction - steady
// //             increment = Math.random() * 1.0 + 0.4; // 0.4-1.4%
// //           } else if (prev < 50) {
// //             // Analysis phase - slower, more complex
// //             increment = Math.random() * 0.6 + 0.2; // 0.2-0.8%
// //           } else if (prev < 65) {
// //             // Pattern recognition - variable speed
// //             increment = Math.random() * 0.9 + 0.3; // 0.3-1.2%
// //           } else if (prev < 80) {
// //             // Calculations - can be intensive
// //             increment = Math.random() * 0.5 + 0.2; // 0.2-0.7%
// //           } else if (prev < 90) {
// //             // Final processing - slow down
// //             increment = Math.random() * 0.4 + 0.1; // 0.1-0.5%
// //           } else if (prev < 95) {
// //             // Almost done - very slow
// //             increment = Math.random() * 0.2 + 0.05; // 0.05-0.25%
// //           } else {
// //             // Wait for actual completion
// //             increment = 0;
// //           }

// //           nextValue = prev + increment;

// //           // Add some randomness to make it feel more realistic
// //           if (Math.random() < 0.15) {
// //             // 15% chance of a small pause
// //             increment *= 0.3;
// //           }

// //           if (Math.random() < 0.08) {
// //             // 8% chance of a slight speed boost
// //             increment *= 1.8;
// //           }

// //           return Math.min(nextValue, 95);
// //         });
// //       }, 2000 + Math.random() * 2500); // Much slower: 2-4.5 second intervals
// //     }
// //     return () => clearInterval(interval);
// //   }, [loading, showModal]);

// //   const handleCheckboxChange = (index) => {
// //     const updatedCheckedItems = [...checkedItems];
// //     updatedCheckedItems[index] = !updatedCheckedItems[index];
// //     setCheckedItems(updatedCheckedItems);
// //     setIsSelectAll(updatedCheckedItems.every((item) => item));
// //   };

// //   const handleSelectAllChange = () => {
// //     const newState = !isSelectAll;
// //     setIsSelectAll(newState);
// //     setCheckedItems(new Array(categoryTuples.length).fill(newState));
// //   };

// //   const handleFileChange = (event) => {
// //     setFile(event.target.files[0]);
// //   };

// //   const handleFileNameChange = (event) => {
// //     setOutputFileName(event.target.value);
// //   };

// //   const handleMonthFromChange = (event) => {
// //     setMonthFrom(event.target.value);
// //   };

// //   const handleMonthToChange = (event) => {
// //     setMonthTo(event.target.value);
// //   };

// //   const handlePercentageChange = (event) => {
// //     const value = event.target.value;
// //     if (value < 0 || value > 100) alert("Percentage must be between 0 and 100");
// //     else setPercentage(value);
// //   };

// //   const handleSubmit = () => {

// //     if (
// //       !file ||
// //       !outputFileName ||
// //       !monthFrom ||
// //       !monthTo ||
// //       !percentage ||
// //       isNaN(percentage)
// //     ) {
// //       alert("Please fill out all fields correctly.");
// //       return;
// //     }

// //     const selectedCategories = categoryTuples
// //       .filter((_, index) => checkedItems[index])
// //       .map(([name, value]) => ({ name, value }));

// //     if (selectedCategories.length === 0) {
// //       alert("Please select at least one category.");
// //       return;
// //     }

// //     setLoading(true);
// //     setShowModal(true);
// //     setProgress(0);
// //     setErrorMessage("");

// //     // Simulate API call with realistic timing
// //     try {
// //       // Simulate the actual processing time
// //       const processingTime = 45000 + Math.random() * 30000; // 45-75 seconds

// //       setTimeout(() => {
// //         // Complete the progress
// //         setProgress(100);

// //         // Wait a moment to show completion
// //         setTimeout(() => {
// //           const fakeDownloadUrl = "https://example.com/forecast.zip";
// //           setDownloadUrl(fakeDownloadUrl);
// //           setShowModal(false);
// //           setLoading(false);

// //           console.log("Forecast generation completed!");
// //         }, 2000);

// //       }, processingTime);

// //     } catch (error) {
// //       console.error("Error uploading the file:", error);
// //       setErrorMessage("An error occurred while processing your forecast.");
// //       setShowModal(false);
// //       setLoading(false);
// //       setProgress(0);
// //     }
// //   };

// //   const months = [
// //     "February", "March", "April", "May", "June", "July",
// //     "August", "September", "October", "November", "December", "January",
// //   ];

// //   const SelectedCategoriesCount = checkedItems.filter((item) => item).length;

// //   return (
// //     <>
// //       <div className="max-w-6xl mx-auto my-8 bg-white rounded-2xl shadow-xl overflow-hidden">
// //         {/* Header with gradient */}
// //         <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-10 relative">
// //           <div className="flex items-start gap-4">
// //             <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
// //               <TrendingUp className="text-white" size={28} />
// //             </div>
// //             <div>
// //               <h1 className="text-3xl font-bold text-white">
// //                 Forecast Upload Dashboard
// //               </h1>
// //               <p className="text-indigo-100 mt-1 max-w-xl">
// //                 Generate accurate sales forecasts by uploading your data and selecting parameters
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Main content */}
// //         <div className="p-10">
// //           <div className="space-y-8">
// //             {/* Upload and filename section */}
// //             <div className="grid sm:grid-cols-2 gap-8">
// //               <div className="space-y-2">
// //                 <label className="block text-sm font-medium text-gray-700">
// //                   Upload Forecasting Sheet
// //                 </label>
// //                 <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
// //                   <input
// //                     type="file"
// //                     className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
// //                     onChange={handleFileChange}
// //                     accept=".xlsx,.xls,.csv"
// //                   />
// //                 </div>
// //                 {file && (
// //                   <div className="flex items-center mt-2 text-xs text-gray-500">
// //                     <CheckCircle size={14} className="text-green-500 mr-1" />
// //                     <span>{file.name} selected</span>
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="space-y-2">
// //                 <label className="block text-sm font-medium text-gray-700">
// //                   Output Filename
// //                 </label>
// //                 <div className="relative">
// //                   <input
// //                     type="text"
// //                     className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
// //                     placeholder="Enter output file name"
// //                     value={outputFileName}
// //                     onChange={handleFileNameChange}
// //                   />
// //                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
// //                     <FileDown size={18} />
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Categories section */}
// //             <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
// //               <div
// //                 className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
// //                 onClick={() => setShowCategories(!showCategories)}
// //               >
// //                 <div className="flex items-center gap-2">
// //                   <Filter size={18} className="text-indigo-600" />
// //                   <h3 className="text-base font-semibold text-gray-800">
// //                     Product Categories
// //                   </h3>
// //                   <div className="ml-2 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
// //                     {SelectedCategoriesCount} selected
// //                   </div>
// //                 </div>
// //                 <ChevronDown
// //                   size={20}
// //                   className={`text-gray-500 transition-transform duration-200 ${
// //                     showCategories ? "rotate-180" : ""
// //                   }`}
// //                 />
// //               </div>

// //               {showCategories && (
// //                 <div className="p-6">
// //                   <div className="mb-4 flex items-center">
// //                     <label className="inline-flex items-center gap-2 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
// //                       <input
// //                         type="checkbox"
// //                         className="w-4 h-4 accent-indigo-600 rounded"
// //                         checked={isSelectAll}
// //                         onChange={handleSelectAllChange}
// //                       />
// //                       <span className="text-sm font-medium text-gray-700">
// //                         Select All Categories
// //                       </span>
// //                     </label>
// //                   </div>
// //                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
// //                     {categoryTuples.map(([name, value], index) => (
// //                       <label
// //                         key={value}
// //                         className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer border transition-colors ${
// //                           checkedItems[index]
// //                             ? "bg-indigo-50 border-indigo-200"
// //                             : "bg-white border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30"
// //                         }`}
// //                       >
// //                         <input
// //                           type="checkbox"
// //                           className="w-4 h-4 accent-indigo-600 rounded"
// //                           checked={checkedItems[index]}
// //                           onChange={() => handleCheckboxChange(index)}
// //                         />
// //                         <span
// //                           className={`text-sm ${
// //                             checkedItems[index]
// //                               ? "text-indigo-900 font-medium"
// //                               : "text-gray-700"
// //                           }`}
// //                         >
// //                           {name}
// //                           <span className="ml-1 text-xs text-gray-500">
// //                             ({value})
// //                           </span>
// //                         </span>
// //                       </label>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Month and percentage section */}
// //             <div className="grid sm:grid-cols-3 gap-6">
// //               <div className="space-y-2">
// //                 <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
// //                   <Calendar size={16} className="text-indigo-500" />
// //                   Month From
// //                 </label>
// //                 <select
// //                   className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
// //                   value={monthFrom}
// //                   onChange={handleMonthFromChange}
// //                 >
// //                   <option value="">Select Month</option>
// //                   {months.map((month, index) => (
// //                     <option key={index} value={month}>
// //                       {month}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               <div className="space-y-2">
// //                 <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
// //                   <Calendar size={16} className="text-indigo-500" />
// //                   Month To
// //                 </label>
// //                 <select
// //                   className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
// //                   value={monthTo}
// //                   onChange={handleMonthToChange}
// //                   disabled={!monthFrom}
// //                 >
// //                   <option value="">Select Month</option>
// //                   {monthFrom &&
// //                     months
// //                       .slice(months.indexOf(monthFrom) + 1)
// //                       .map((month, index) => (
// //                         <option key={index} value={month}>
// //                           {month}
// //                         </option>
// //                       ))}
// //                 </select>
// //               </div>

// //               <div className="space-y-2">
// //                 <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
// //                   <Percent size={16} className="text-indigo-500" />
// //                   Current Month Percentage
// //                 </label>
// //                 <div className="relative">
// //                   <input
// //                     type="number"
// //                     min="0"
// //                     max="100"
// //                     className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all pr-10"
// //                     placeholder="0-100"
// //                     value={percentage}
// //                     onChange={handlePercentageChange}
// //                   />
// //                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
// //                     %
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Submit button */}
// //             <button
// //               className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-3 hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
// //               onClick={handleSubmit}
// //               disabled={loading}
// //             >
// //               {loading ? (
// //                 <>
// //                   <Loader2 size={18} className="animate-spin" />
// //                   Processing...
// //                 </>
// //               ) : (
// //                 <>
// //                   <Upload size={18} />
// //                   Generate Forecast
// //                 </>
// //               )}
// //             </button>
// //           </div>

// //           {/* Error message */}
// //           {errorMessage && (
// //             <div className="mt-8 p-5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
// //               <div className="text-red-500 mt-0.5">
// //                 <AlertCircle size={20} />
// //               </div>
// //               <div>
// //                 <h4 className="font-medium text-red-800">
// //                   Error Processing Forecast
// //                 </h4>
// //                 <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
// //               </div>
// //             </div>
// //           )}

// //           {/* Download section */}
// //           {downloadUrl && (
// //             <div className="mt-10 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 shadow-sm">
// //               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
// //                 <div className="flex items-center gap-3">
// //                   <div className="bg-emerald-100 p-2 rounded-full">
// //                     <CheckCircle className="text-emerald-600" size={24} />
// //                   </div>
// //                   <div>
// //                     <h3 className="font-semibold text-emerald-800">
// //                       Forecast Generated Successfully
// //                     </h3>
// //                     <p className="text-sm text-emerald-700">
// //                       Your forecast file is ready for download
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <a
// //                   href={downloadUrl}
// //                   className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm hover:shadow"
// //                   download={`${outputFileName}_forecast.zip`}
// //                 >
// //                   <FileDown size={18} />
// //                   Download Forecast
// //                 </a>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Enhanced Loading Modal */}
// //       <LoadingModal
// //         isOpen={showModal}
// //         progress={progress}
// //         onComplete={() => setShowModal(false)}
// //         onError={() => setShowModal(false)}
// //       />
// //     </>
// //   );
// // }

// // export default Forecast;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Upload,
  FileDown,
  Calendar,
  Percent,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ChevronDown,
  Filter,
  ArrowLeft,
  X,
  User,
  UserCheck,
  Users,
  Plus,
  Trash2,
  Check,
  Search,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Multi-select dropdown component
const MultiSelectDropdown = ({
  options,
  selected,
  onChange,
  placeholder,
  renderSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const dropdownRef = React.useRef(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (option) => {
    const isSelected = selected.some((item) => item.value === option.value);
    if (isSelected) {
      onChange(selected.filter((item) => item.value !== option.value));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === filteredOptions.length) {
      onChange([]);
    } else {
      onChange(filteredOptions);
    }
  };

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Calculate dropdown position
  React.useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white text-left flex items-center justify-between hover:border-indigo-300 transition-colors"
      >
        <div className="flex-1 truncate pr-2">
          {selected.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : renderSelected ? (
            renderSelected(selected)
          ) : (
            <span className="text-gray-700">{selected.length} selected</span>
          )}
        </div>
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className={`absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-hidden ${
              dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"
            }`}
            style={{
              maxWidth: "100vw",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
                />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-none text-sm bg-white"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-2 border-b border-gray-100">
              <button
                type="button"
                onClick={handleSelectAll}
                className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 rounded-md flex items-center gap-2 font-medium text-indigo-600 transition-colors"
              >
                <div
                  className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
                    selected.length === filteredOptions.length
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-indigo-300"
                  }`}
                >
                  {selected.length === filteredOptions.length && (
                    <Check size={12} className="text-white" />
                  )}
                </div>
                {selected.length === filteredOptions.length
                  ? "Deselect All"
                  : "Select All"}
                <span className="ml-auto text-xs text-gray-500">
                  ({selected.length}/{filteredOptions.length})
                </span>
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <div className="text-sm">No categories found</div>
                  <div className="text-xs mt-1">Try adjusting your search</div>
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = selected.some(
                    (item) => item.value === option.value
                  );
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleToggle(option)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-b-0 transition-colors ${
                        isSelected ? "bg-indigo-50" : ""
                      }`}
                    >
                      <div
                        className={`w-4 h-4 border rounded flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-600 scale-110"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium truncate ${
                            isSelected ? "text-indigo-900" : "text-gray-700"
                          }`}
                        >
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          Code: {option.code}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {selected.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <div className="text-xs text-gray-600 text-center">
                  {selected.length} of {options.length} categories assigned
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
const LoadingModal = ({ isOpen, progress }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Generating Forecasts
            </h3>
            <p className="text-gray-600 text-sm">
              Creating full forecasts for each assigned analyst...
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.round(progress)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            {progress < 25 && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                <span>Uploading files...</span>
              </div>
            )}
            {progress >= 25 && progress < 50 && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                <span>Processing data structure...</span>
              </div>
            )}
            {progress >= 50 && progress < 75 && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                <span>Generating analyst forecasts...</span>
              </div>
            )}
            {progress >= 75 && progress < 95 && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                <span>Creating download files...</span>
              </div>
            )}
            {progress >= 95 && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle size={16} />
                <span>Almost done...</span>
              </div>
            )}
          </div>

          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle size={16} />
              <span className="text-xs">Please don't close this window</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analyst Assignment Card Component
const AssignmentCard = ({
  assignment,
  assignmentId,
  analysts,
  categoryOptions,
  onUpdateAnalyst,
  onUpdateCategories,
  onRemove,
  assignedCategories,
}) => {
  const getAnalystDisplayName = (analyst) => {
    return analyst.first_name && analyst.last_name
      ? `${analyst.first_name} ${analyst.last_name}`
      : analyst.username;
  };

  const availableCategories = categoryOptions.filter(
    (cat) =>
      !assignedCategories.has(cat.value) ||
      assignment.categories.some((c) => c.value === cat.value)
  );

  const renderSelectedCategories = (selected) => {
    if (selected.length === 0) return "No categories assigned";
    if (selected.length <= 2) {
      return selected.map((cat) => cat.label).join(", ");
    }
    return `${selected
      .slice(0, 2)
      .map((cat) => cat.label)
      .join(", ")} +${selected.length - 2} more`;
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-100 hover:border-indigo-200 transition-all duration-200 shadow-sm hover:shadow-md">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserCheck size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">
                Assignment #{assignmentId.slice(-4)}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{assignment.categories.length} assigned categories</span>
                <span>•</span>
                <span className="text-green-600">Gets all 10 in file</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(assignmentId)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors self-start sm:self-center"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Analyst Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Analyst *
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                value={assignment.analyst?.username || ""}
                onChange={(e) => onUpdateAnalyst(assignmentId, e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
              >
                <option value="">Choose an analyst...</option>
                {analysts.map((analyst) => (
                  <option key={analyst.id} value={analyst.username}>
                    {getAnalystDisplayName(analyst)} ({analyst.username})
                  </option>
                ))}
              </select>
            </div>
            {assignment.analyst && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">
                <CheckCircle size={16} />
                <span>
                  Assigned to {getAnalystDisplayName(assignment.analyst)}
                </span>
              </div>
            )}
          </div>

          {/* Category Multi-Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Responsibility for Categories *
            </label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 text-blue-700 text-sm">
                <CheckCircle size={16} />
                <span>
                  File will contain all 10 categories, but analyst will be
                  responsible for selected ones
                </span>
              </div>
            </div>
            <MultiSelectDropdown
              options={availableCategories}
              selected={assignment.categories}
              onChange={(categories) =>
                onUpdateCategories(assignmentId, categories)
              }
              placeholder="Select categories this analyst will handle..."
              renderSelected={renderSelectedCategories}
            />
            {assignment.categories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {assignment.categories.map((category) => (
                  <span
                    key={category.value}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                  >
                    {category.label}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = assignment.categories.filter(
                          (c) => c.value !== category.value
                        );
                        onUpdateCategories(assignmentId, updated);
                      }}
                      className="hover:bg-indigo-200 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function Forecast() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [outputFileName, setOutputFileName] = useState("");
  const [monthFrom, setMonthFrom] = useState("");
  const [monthTo, setMonthTo] = useState("");
  const [percentage, setPercentage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysts, setAnalysts] = useState([]);

  // Store analyst assignments: { analystId: { analyst: analystData, categories: [categoryIndices] } }
  const [analystAssignments, setAnalystAssignments] = useState({});

  const categoryTuples = [
    ["Bridge Gem", "742"],
    ["Gold", "746"],
    ["Gold", "262&270"],
    ["Womens Silver", "260&404"],
    ["Precious", "264&268"],
    ["Fine Pearl", "265&271"],
    ["Semi", "272&733"],
    ["Diamond", "734&737&748"],
    ["Bridal", "739&267&263"],
    ["Men's", "768&771"],
  ];

  // Convert to options format for multiselect
  const categoryOptions = categoryTuples.map(([name, value]) => ({
    label: name,
    value: value,
    code: value,
  }));

  // All categories will be included in each forecast file
  const allCategories = categoryTuples.map(([name, value]) => ({
    name,
    value,
  }));

  useEffect(() => {
    fetchAnalysts();
  }, []);

  const fetchAnalysts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/users/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const analystUsers = response.data.filter(
        (user) => user.role?.name === "analyst"
      );
      setAnalysts(analystUsers);
    } catch (error) {
      console.error("Error fetching analysts:", error);
    }
  };

  // Progress simulation
  useEffect(() => {
    let interval;
    if (loading && showModal) {
      interval = setInterval(() => {
        setProgress((prev) => {
          let increment = Math.random() * 2 + 0.5;
          if (prev < 95) return prev + increment;
          return prev;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [loading, showModal]);

  // Add new analyst assignment
  const addAnalystAssignment = () => {
    const newId = Date.now().toString();
    setAnalystAssignments((prev) => ({
      ...prev,
      [newId]: {
        analyst: null,
        categories: [],
      },
    }));
  };

  // Remove analyst assignment
  const removeAnalystAssignment = (assignmentId) => {
    setAnalystAssignments((prev) => {
      const updated = { ...prev };
      delete updated[assignmentId];
      return updated;
    });
  };

  // Update analyst for an assignment
  const updateAssignmentAnalyst = (assignmentId, analystUsername) => {
    const selectedAnalyst = analysts.find(
      (a) => a.username === analystUsername
    );
    setAnalystAssignments((prev) => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        analyst: selectedAnalyst,
      },
    }));
  };

  // Update categories for an assignment
  const updateAssignmentCategories = (assignmentId, categories) => {
    setAnalystAssignments((prev) => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        categories: categories,
      },
    }));
  };

  // Get set of all assigned category values (excluding current assignment)
  const getAssignedCategories = (excludeAssignmentId = null) => {
    const assigned = new Set();
    Object.entries(analystAssignments).forEach(([id, assignment]) => {
      if (id !== excludeAssignmentId) {
        assignment.categories.forEach((cat) => assigned.add(cat.value));
      }
    });
    return assigned;
  };

  const getTotalAssignedCategories = () => {
    const assigned = new Set();
    Object.values(analystAssignments).forEach((assignment) => {
      assignment.categories.forEach((cat) => assigned.add(cat.value));
    });
    return assigned.size;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !file ||
      !outputFileName ||
      !monthFrom ||
      !monthTo ||
      !percentage ||
      isNaN(percentage)
    ) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    const assignments = Object.values(analystAssignments);

    if (assignments.length === 0) {
      alert("Please add at least one analyst assignment.");
      return;
    }

    // Validate each assignment
    for (const assignment of assignments) {
      if (!assignment.analyst) {
        alert("Please select an analyst for all assignments.");
        return;
      }
      if (assignment.categories.length === 0) {
        alert(
          `Please select at least one category for ${assignment.analyst.username}.`
        );
        return;
      }
    }

    // Check if all categories are assigned
    const totalCategories = categoryOptions.length;
    const assignedCount = getTotalAssignedCategories();

    if (assignedCount < totalCategories) {
      alert(
        `${
          totalCategories - assignedCount
        } categories are not assigned. Please assign all categories to analysts.`
      );
      return;
    }

    setLoading(true);
    setShowModal(true);
    setProgress(0);
    setErrorMessage("");
    setDownloadUrls([]);

    try {
      const results = [];

      // Create a single request with all categories and their assignments
      const categoriesWithAssignments = [];

      // Process each assignment to build the categories array
      Object.values(analystAssignments).forEach((assignment) => {
        assignment.categories.forEach((cat) => {
          categoriesWithAssignments.push({
            name: cat.label,
            value: cat.value,
            assigned_to: assignment.analyst.id, // Use analyst ID
          });
        });
      });

      // If we want to generate one file with all assignments
      if (categoriesWithAssignments.length > 0) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("output_filename", outputFileName);
        formData.append("month_from", monthFrom);
        formData.append("month_to", monthTo);
        formData.append("percentage", percentage);
        formData.append(
          "categories",
          JSON.stringify(categoriesWithAssignments)
        );

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/forecast/upload/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        results.push({
          assignments: Object.values(analystAssignments),
          categoriesWithAssignments: categoriesWithAssignments,
          downloadUrl: response.data.file_url,
          filePath: response.data.file_path,
          fileName: outputFileName,
        });
      }

      setProgress(100);

      setTimeout(() => {
        setDownloadUrls(results);
        setShowModal(false);
        setLoading(false);

        // Store results for navigation
        localStorage.setItem(
          "forecastResults",
          JSON.stringify({
            results,
            categoriesWithAssignments,
            timestamp: new Date().toISOString(),
            monthFrom,
            monthTo,
            percentage,
          })
        );

        navigate("/file-upload");
      }, 1000);
    } catch (error) {
      console.error("Error uploading the file:", error);
      setErrorMessage(error.response?.data?.error || "An error occurred");
      setShowModal(false);
      setLoading(false);
      setProgress(0);
    }
  };

  const months = [
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
  ];

  const getAnalystDisplayName = (analyst) => {
    return analyst.first_name && analyst.last_name
      ? `${analyst.first_name} ${analyst.last_name}`
      : analyst.username;
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 sm:p-10 relative">
              <button
                onClick={() => navigate("/file-upload")}
                className="text-white opacity-80 hover:opacity-100 flex items-center gap-2 transition-opacity mb-4"
              >
                <ArrowLeft size={16} />
                Back to Files
              </button>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <TrendingUp className="text-white" size={28} />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    Multi-Analyst Forecast Generator
                  </h1>
                  <p className="text-indigo-100 mt-2 text-sm sm:text-base max-w-2xl">
                    Generate complete forecasts for multiple analysts. Each
                    analyst will receive the full dataset with all categories.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="p-6 sm:p-10">
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* File Upload & Basic Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Forecasting Sheet *
                    </label>
                    <div className="bg-gray-50 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors">
                      <input
                        type="file"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </div>
                    {file && (
                      <div className="flex items-center mt-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-md">
                        <CheckCircle size={14} className="mr-2" />
                        <span>{file.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Base Filename *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        placeholder="e.g., quarterly_forecast"
                        value={outputFileName}
                        onChange={(e) => setOutputFileName(e.target.value)}
                      />
                      <FileDown
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Analyst usernames will be appended automatically
                    </p>
                  </div>
                </div>

                {/* Date & Percentage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Calendar size={16} className="text-indigo-500" />
                      From Month *
                    </label>
                    <select
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                      value={monthFrom}
                      onChange={(e) => setMonthFrom(e.target.value)}
                    >
                      <option value="">Select month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Calendar size={16} className="text-indigo-500" />
                      To Month *
                    </label>
                    <select
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                      value={monthTo}
                      onChange={(e) => setMonthTo(e.target.value)}
                      disabled={!monthFrom}
                    >
                      <option value="">Select month</option>
                      {monthFrom &&
                        months
                          .slice(months.indexOf(monthFrom) + 1)
                          .map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Percent size={16} className="text-indigo-500" />
                      Current Month % *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none pr-8"
                        placeholder="0-100"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Categories Info Banner */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">
                        Complete Dataset + Specific Assignments
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        Each forecast file contains all {categoryTuples.length}{" "}
                        categories, but analysts are assigned specific
                        categories to focus on:{" "}
                        {categoryTuples.map(([name]) => name).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Analyst Assignments Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 overflow-hidden">
                  <div className="bg-white px-6 py-4 border-b border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Users size={20} className="text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Analyst Category Assignments
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getTotalAssignedCategories()}/
                          {categoryOptions.length} categories assigned
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addAnalystAssignment}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Plus size={16} />
                      Add Assignment
                    </button>
                  </div>

                  <div className="p-6">
                    {Object.entries(analystAssignments).length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users size={24} className="text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-700 mb-2">
                          No assignments yet
                        </h4>
                        <p className="text-gray-500 mb-6">
                          Create assignments to specify which categories each
                          analyst will focus on
                        </p>
                        <button
                          type="button"
                          onClick={addAnalystAssignment}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Plus size={18} />
                          Create First Assignment
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {Object.entries(analystAssignments).map(
                          ([assignmentId, assignment]) => (
                            <AssignmentCard
                              key={assignmentId}
                              assignment={assignment}
                              assignmentId={assignmentId}
                              analysts={analysts}
                              categoryOptions={categoryOptions}
                              onUpdateAnalyst={updateAssignmentAnalyst}
                              onUpdateCategories={updateAssignmentCategories}
                              onRemove={removeAnalystAssignment}
                              assignedCategories={getAssignedCategories(
                                assignmentId
                              )}
                            />
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={
                      loading || Object.entries(analystAssignments).length === 0
                    }
                    className="flex-1 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-3 hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Generate All Analyst Forecasts
                        <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                          {Object.entries(analystAssignments).length} files
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-8 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-500 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-medium text-red-800">
                        Processing Error
                      </h4>
                      <p className="text-sm text-red-600 mt-1">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Download Results */}
              {downloadUrls.length > 0 && (
                <div className="mt-10 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-emerald-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-800">
                        Forecast Generated Successfully!
                      </h3>
                      <p className="text-emerald-700">
                        Single forecast file with category assignments created
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {downloadUrls.map((result, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-6 border border-emerald-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <TrendingUp
                                size={18}
                                className="text-indigo-600"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">
                                {result.fileName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {result.categoriesWithAssignments.length}{" "}
                                categories with analyst assignments
                              </div>
                            </div>
                          </div>
                          <a
                            href={result.downloadUrl}
                            download={`${result.fileName}.zip`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm justify-center sm:justify-start"
                          >
                            <FileDown size={16} />
                            Download Forecast
                          </a>
                        </div>

                        {/* Show assignment details */}
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-medium text-gray-800 mb-3">
                            Category Assignments:
                          </h4>
                          <div className="space-y-2">
                            {result.assignments.map((assignment, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 text-sm"
                              >
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                  <User size={14} className="text-indigo-600" />
                                </div>
                                <div>
                                  <span className="font-medium text-gray-800">
                                    {getAnalystDisplayName(assignment.analyst)}
                                  </span>
                                  <span className="text-gray-600 ml-2">
                                    ({assignment.categories.length} categories:{" "}
                                    {assignment.categories
                                      .map((c) => c.label)
                                      .join(", ")}
                                    )
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-emerald-200">
                    <button
                      onClick={() => navigate("/file-upload")}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Go to File Drive
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoadingModal isOpen={showModal} progress={progress} />
    </>
  );
}

export default Forecast;
