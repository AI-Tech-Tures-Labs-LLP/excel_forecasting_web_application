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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Loading Modal Component
const LoadingModal = ({ isOpen, progress, onComplete, onError }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          {/* Header */}
          <div className="mb-6">
            <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Generating Forecast
            </h3>
            <p className="text-gray-600 text-sm">
              Please wait while we process your data and generate the forecast
              file.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.round(progress)}%` }}
              ></div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="space-y-2 text-sm text-gray-600">
            {progress < 20 && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span>Uploading and validating file...</span>
              </div>
            )}
            {progress >= 20 && progress < 40 && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span>Processing data structure...</span>
              </div>
            )}
            {progress >= 40 && progress < 70 && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span>Analyzing patterns and trends...</span>
              </div>
            )}
            {progress >= 70 && progress < 95 && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span>Generating forecast calculations...</span>
              </div>
            )}
            {progress >= 95 && progress < 100 && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span>Finalizing and preparing download...</span>
              </div>
            )}
            {progress === 100 && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle size={16} />
                <span>Forecast generated successfully!</span>
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle size={16} />
              <span className="text-xs">
                Please do not close this window while processing
              </span>
            </div>
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
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const [checkedItems, setCheckedItems] = useState(
    new Array(categoryTuples.length).fill(false)
  );
  const [isSelectAll, setIsSelectAll] = useState(false);

  // More realistic progress simulation
  useEffect(() => {
    let interval;
    if (loading && showModal) {
      interval = setInterval(() => {
        setProgress((prev) => {
          // Different progress speeds for different stages
          let increment;
          if (prev < 20) {
            // Initial upload stage - slower
            increment = Math.random() * 3 + 1; // 1-4%
          } else if (prev < 40) {
            // Processing stage - medium speed
            increment = Math.random() * 2 + 1; // 1-3%
          } else if (prev < 70) {
            // Analysis stage - medium speed
            increment = Math.random() * 2 + 0.5; // 0.5-2.5%
          } else if (prev < 90) {
            // Generation stage - slower
            increment = Math.random() * 1.5 + 0.5; // 0.5-2%
          } else {
            // Final stage - very slow, wait for actual completion
            increment = Math.random() * 0.5; // 0-0.5%
          }

          return Math.min(prev + increment, 95);
        });
      }, 1200 + Math.random() * 800); // Slower intervals: 1200-2000ms
    }
    return () => clearInterval(interval);
  }, [loading, showModal]);

  const handleCheckboxChange = (index) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);
    setIsSelectAll(updatedCheckedItems.every((item) => item));
  };

  const handleSelectAllChange = () => {
    const newState = !isSelectAll;
    setIsSelectAll(newState);
    setCheckedItems(new Array(categoryTuples.length).fill(newState));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileNameChange = (event) => {
    setOutputFileName(event.target.value);
  };

  const handleMonthFromChange = (event) => {
    setMonthFrom(event.target.value);
  };

  const handleMonthToChange = (event) => {
    setMonthTo(event.target.value);
  };

  const handlePercentageChange = (event) => {
    const value = event.target.value;
    if (value < 0 || value > 100) alert("Percentage must be between 0 and 100");
    else setPercentage(value);
  };

  // Function to add file to FileUploadStep with loading state
  const addFileToUploadStep = (forecastData) => {
    const newFile = {
      id: Date.now(), // Use timestamp as unique ID
      name: `${outputFileName}_forecast.xlsx`,
      type: "file",
      extension: "xlsx",
      icon: "FileSpreadsheet",
      modified: new Date().toLocaleString(),
      size: "Processing...",
      isSpreadsheet: true,
      isGenerated: true,
      status: "loading", // Start with loading status
      forecastData: forecastData,
    };

    // Get existing files from session storage
    const existingFiles = JSON.parse(
      sessionStorage.getItem("generatedFiles") || "[]"
    );

    // Add new file
    const updatedFiles = [...existingFiles, newFile];
    sessionStorage.setItem("generatedFiles", JSON.stringify(updatedFiles));

    return newFile.id;
  };

  // Function to update file status in FileUploadStep
  const updateFileStatus = (
    fileId,
    status,
    downloadUrl = null,
    size = null
  ) => {
    const existingFiles = JSON.parse(
      sessionStorage.getItem("generatedFiles") || "[]"
    );

    const updatedFiles = existingFiles.map((file) => {
      if (file.id === fileId) {
        return {
          ...file,
          status: status,
          size: size || file.size,
          downloadUrl: downloadUrl,
        };
      }
      return file;
    });

    sessionStorage.setItem("generatedFiles", JSON.stringify(updatedFiles));
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
      alert("Please fill out all fields correctly.");
      return;
    }

    const selectedCategories = categoryTuples
      .filter((_, index) => checkedItems[index])
      .map(([name, value]) => ({ name, value }));

    if (selectedCategories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("output_filename", outputFileName);
    formData.append("month_from", monthFrom);
    formData.append("month_to", monthTo);
    formData.append("percentage", percentage);
    formData.append("categories", JSON.stringify(selectedCategories));

    setLoading(true);
    setShowModal(true);
    setProgress(0);
    setErrorMessage("");

    // Create forecast data object
    const forecastData = {
      selectedCategories,
      outputFileName,
      monthFrom,
      monthTo,
      percentage,
      timestamp: new Date().toISOString(),
    };

    // Add file to FileUploadStep with loading state
    const fileId = addFileToUploadStep(forecastData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/upload/`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            // Real upload progress for first 20%
            const uploadPercent = Math.round(
              (progressEvent.loaded * 20) / progressEvent.total
            );
            setProgress(Math.min(uploadPercent, 20));
          },
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const filePathFromServer = response.data.file_url;

      // Complete the progress
      setProgress(100);

      // Wait a moment to show completion
      setTimeout(() => {
        // Update forecast data with download URL
        const finalForecastData = {
          ...forecastData,
          downloadUrl: filePathFromServer,
          filePath: response.data.file_path,
        };

        // Update file status to completed
        updateFileStatus(fileId, "completed", filePathFromServer, "2.4 MB");

        // Store forecast data in localStorage for the Product Selector page
        localStorage.setItem("forecastData", JSON.stringify(finalForecastData));
        localStorage.setItem("file_path", outputFileName);

        setDownloadUrl(filePathFromServer);
        setShowModal(false);
        setLoading(false);

        // Navigate to FileUploadStep
        navigate("/file-upload");
      }, 1500);
    } catch (error) {
      console.error("Error uploading the file:", error);

      // Update file status to error
      updateFileStatus(fileId, "error");

      setErrorMessage(
        error.response ? error.response.data.error : "An error occurred"
      );
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

  const SelectedCategoriesCount = checkedItems.filter((item) => item).length;

  const handleBackPage = () => {
    navigate("/file-upload");
  };

  return (
    <>
      <div className="max-w-6xl mx-auto my-8 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-10 relative">
          <div
            className="flex items-center gap-3 mb-2 pb-2"
            onClick={handleBackPage}
          >
            <button className="text-white opacity-80 hover:opacity-100 flex items-center gap-2 transition-opacity">
              <ArrowLeft size={16} />
              Back to Forecast
            </button>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Forecast Upload Dashboard
              </h1>
              <p className="text-indigo-100 mt-1 max-w-xl">
                Generate accurate sales forecasts by uploading your data and
                selecting parameters
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Upload and filename section */}
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Forecasting Sheet
                </label>
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                  <input
                    type="file"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
                {file && (
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <CheckCircle size={14} className="text-green-500 mr-1" />
                    <span>{file.name} selected</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Output Filename
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    placeholder="Enter output file name"
                    value={outputFileName}
                    onChange={handleFileNameChange}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FileDown size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Categories section */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div
                className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => setShowCategories(!showCategories)}
              >
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-indigo-600" />
                  <h3 className="text-base font-semibold text-gray-800">
                    Product Categories
                  </h3>
                  <div className="ml-2 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                    {SelectedCategoriesCount} selected
                  </div>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-500 transition-transform duration-200 ${
                    showCategories ? "rotate-180" : ""
                  }`}
                />
              </div>

              {showCategories && (
                <div className="p-6">
                  <div className="mb-4 flex items-center">
                    <label className="inline-flex items-center gap-2 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-indigo-600 rounded"
                        checked={isSelectAll}
                        onChange={handleSelectAllChange}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Select All Categories
                      </span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categoryTuples.map(([name, value], index) => (
                      <label
                        key={value}
                        className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer border transition-colors ${
                          checkedItems[index]
                            ? "bg-indigo-50 border-indigo-200"
                            : "bg-white border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-indigo-600 rounded"
                          checked={checkedItems[index]}
                          onChange={() => handleCheckboxChange(index)}
                        />
                        <span
                          className={`text-sm ${
                            checkedItems[index]
                              ? "text-indigo-900 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {name}
                          <span className="ml-1 text-xs text-gray-500">
                            ({value})
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Month and percentage section */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <Calendar size={16} className="text-indigo-500" />
                  Month From
                </label>
                <select
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                  value={monthFrom}
                  onChange={handleMonthFromChange}
                >
                  <option value="">Select Month</option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <Calendar size={16} className="text-indigo-500" />
                  Month To
                </label>
                <select
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                  value={monthTo}
                  onChange={handleMonthToChange}
                  disabled={!monthFrom}
                >
                  <option value="">Select Month</option>
                  {monthFrom &&
                    months
                      .slice(months.indexOf(monthFrom) + 1)
                      .map((month, index) => (
                        <option key={index} value={month}>
                          {month}
                        </option>
                      ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <Percent size={16} className="text-indigo-500" />
                  Current Month Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all pr-10"
                    placeholder="0-100"
                    value={percentage}
                    onChange={handlePercentageChange}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    %
                  </div>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-3 hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Generate Forecast
                </>
              )}
            </button>
          </form>

          {/* Error message */}
          {errorMessage && (
            <div className="mt-8 p-5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <div className="text-red-500 mt-0.5">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className="font-medium text-red-800">
                  Error Processing Forecast
                </h4>
                <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Download section - for completed forecasts */}
          {downloadUrl && (
            <div className="mt-10 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <CheckCircle className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-800">
                      Forecast Generated Successfully
                    </h3>
                    <p className="text-sm text-emerald-700">
                      File is ready in your drive
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={downloadUrl}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm hover:shadow"
                    download={outputFileName + ".zip"}
                  >
                    <FileDown size={18} />
                    Download Forecast
                  </a>
                  <button
                    onClick={() => navigate("/file-upload")}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow"
                  >
                    Go to Drive
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Modal */}
      <LoadingModal
        isOpen={showModal}
        progress={progress}
        onComplete={() => setShowModal(false)}
        onError={() => setShowModal(false)}
      />
    </>
  );
}

export default Forecast;

// import React, { useState, useEffect } from "react";
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
//   Loader2,
//   Database,
//   BarChart3,
//   Calculator,
// } from "lucide-react";

// // Enhanced Loading Modal Component with realistic timing
// const LoadingModal = ({ isOpen, progress, onComplete, onError, currentStage }) => {
//   if (!isOpen) return null;

//   const stages = [
//     {
//       name: "Uploading File",
//       icon: Upload,
//       range: [0, 15],
//       description: "Uploading and validating your Excel file..."
//     },
//     {
//       name: "Processing Data",
//       icon: Database,
//       range: [15, 35],
//       description: "Reading spreadsheet structure and extracting data..."
//     },
//     {
//       name: "Analyzing Patterns",
//       icon: BarChart3,
//       range: [35, 65],
//       description: "Analyzing historical trends and seasonal patterns..."
//     },
//     {
//       name: "Generating Forecasts",
//       icon: Calculator,
//       range: [65, 90],
//       description: "Calculating forecasts for selected categories..."
//     },
//     {
//       name: "Finalizing Output",
//       icon: FileDown,
//       range: [90, 100],
//       description: "Preparing your forecast file for download..."
//     }
//   ];

//   const getCurrentStage = () => {
//     return stages.find(stage => progress >= stage.range[0] && progress < stage.range[1]) || stages[stages.length - 1];
//   };

//   const currentStageInfo = getCurrentStage();
//   const CurrentIcon = currentStageInfo.icon;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
//         <div className="text-center">
//           {/* Header */}
//           <div className="mb-8">
//             <div className="bg-indigo-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center relative">
//               <CurrentIcon className="text-indigo-600" size={36} />
//               {progress < 100 && (
//                 <div className="absolute inset-0 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin"></div>
//               )}
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-2">
//               {progress === 100 ? "Forecast Complete!" : "Generating Forecast"}
//             </h3>
//             <p className="text-gray-600 text-sm max-w-md mx-auto">
//               {currentStageInfo.description}
//             </p>
//           </div>

//           {/* Progress Bar */}
//           <div className="mb-8">
//             <div className="flex justify-between text-sm text-gray-600 mb-3">
//               <span className="font-medium">{currentStageInfo.name}</span>
//               <span className="font-bold">{Math.round(progress)}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
//               <div
//                 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out relative"
//                 style={{ width: `${Math.round(progress)}%` }}
//               >
//                 <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-pulse"></div>
//               </div>
//             </div>
//             <div className="mt-2 text-xs text-gray-500">
//               Step {stages.findIndex(s => s === currentStageInfo) + 1} of {stages.length}
//             </div>
//           </div>

//           {/* Stage Progress Indicators */}
//           <div className="mb-8">
//             <div className="flex justify-between items-center space-x-2">
//               {stages.map((stage, index) => {
//                 const StageIcon = stage.icon;
//                 const isCompleted = progress > stage.range[1];
//                 const isCurrent = progress >= stage.range[0] && progress <= stage.range[1];
//                 const isUpcoming = progress < stage.range[0];

//                 return (
//                   <div key={index} className="flex flex-col items-center flex-1">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all duration-500 ${
//                       isCompleted
//                         ? 'bg-green-100 text-green-600'
//                         : isCurrent
//                           ? 'bg-indigo-100 text-indigo-600 animate-pulse'
//                           : 'bg-gray-100 text-gray-400'
//                     }`}>
//                       {isCompleted ? (
//                         <CheckCircle size={16} />
//                       ) : (
//                         <StageIcon size={14} />
//                       )}
//                     </div>
//                     <div className={`text-xs text-center transition-colors duration-500 ${
//                       isCompleted
//                         ? 'text-green-600 font-medium'
//                         : isCurrent
//                           ? 'text-indigo-600 font-medium'
//                           : 'text-gray-400'
//                     }`}>
//                       {stage.name.split(' ')[0]}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Estimated Time */}
//           <div className="mb-6">
//             {progress < 100 ? (
//               <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
//                 <Loader2 size={16} className="animate-spin" />
//                 <span>
//                   Estimated time remaining: {
//                     progress < 20 ? "2-3 minutes" :
//                     progress < 50 ? "1-2 minutes" :
//                     progress < 80 ? "30-60 seconds" :
//                     "Almost done..."
//                   }
//                 </span>
//               </div>
//             ) : (
//               <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg p-3">
//                 <CheckCircle size={16} />
//                 <span className="font-medium">Forecast generated successfully!</span>
//               </div>
//             )}
//           </div>

//           {/* Warning */}
//           <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
//             <div className="flex items-start gap-3 text-amber-800">
//               <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
//               <div className="text-left">
//                 <p className="text-sm font-medium mb-1">Please wait</p>
//                 <p className="text-xs">
//                   This process analyzes your data thoroughly. Closing this window will cancel the forecast generation.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function Forecast() {
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

//   // Much more realistic progress simulation
//   useEffect(() => {
//     let interval;
//     if (loading && showModal) {
//       interval = setInterval(() => {
//         setProgress((prev) => {
//           // Define stages with different speeds and behaviors
//           let increment;
//           let nextValue;

//           if (prev < 5) {
//             // Initial connection - very slow start
//             increment = Math.random() * 0.8 + 0.2; // 0.2-1%
//           } else if (prev < 15) {
//             // File upload simulation - steady but slow
//             increment = Math.random() * 1.2 + 0.5; // 0.5-1.7%
//           } else if (prev < 25) {
//             // File processing - can be variable
//             increment = Math.random() * 0.8 + 0.3; // 0.3-1.1%
//           } else if (prev < 35) {
//             // Data extraction - steady
//             increment = Math.random() * 1.0 + 0.4; // 0.4-1.4%
//           } else if (prev < 50) {
//             // Analysis phase - slower, more complex
//             increment = Math.random() * 0.6 + 0.2; // 0.2-0.8%
//           } else if (prev < 65) {
//             // Pattern recognition - variable speed
//             increment = Math.random() * 0.9 + 0.3; // 0.3-1.2%
//           } else if (prev < 80) {
//             // Calculations - can be intensive
//             increment = Math.random() * 0.5 + 0.2; // 0.2-0.7%
//           } else if (prev < 90) {
//             // Final processing - slow down
//             increment = Math.random() * 0.4 + 0.1; // 0.1-0.5%
//           } else if (prev < 95) {
//             // Almost done - very slow
//             increment = Math.random() * 0.2 + 0.05; // 0.05-0.25%
//           } else {
//             // Wait for actual completion
//             increment = 0;
//           }

//           nextValue = prev + increment;

//           // Add some randomness to make it feel more realistic
//           if (Math.random() < 0.15) {
//             // 15% chance of a small pause
//             increment *= 0.3;
//           }

//           if (Math.random() < 0.08) {
//             // 8% chance of a slight speed boost
//             increment *= 1.8;
//           }

//           return Math.min(nextValue, 95);
//         });
//       }, 2000 + Math.random() * 2500); // Much slower: 2-4.5 second intervals
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

//   const handleSubmit = () => {

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

//     setLoading(true);
//     setShowModal(true);
//     setProgress(0);
//     setErrorMessage("");

//     // Simulate API call with realistic timing
//     try {
//       // Simulate the actual processing time
//       const processingTime = 45000 + Math.random() * 30000; // 45-75 seconds

//       setTimeout(() => {
//         // Complete the progress
//         setProgress(100);

//         // Wait a moment to show completion
//         setTimeout(() => {
//           const fakeDownloadUrl = "https://example.com/forecast.zip";
//           setDownloadUrl(fakeDownloadUrl);
//           setShowModal(false);
//           setLoading(false);

//           console.log("Forecast generation completed!");
//         }, 2000);

//       }, processingTime);

//     } catch (error) {
//       console.error("Error uploading the file:", error);
//       setErrorMessage("An error occurred while processing your forecast.");
//       setShowModal(false);
//       setLoading(false);
//       setProgress(0);
//     }
//   };

//   const months = [
//     "February", "March", "April", "May", "June", "July",
//     "August", "September", "October", "November", "December", "January",
//   ];

//   const SelectedCategoriesCount = checkedItems.filter((item) => item).length;

//   return (
//     <>
//       <div className="max-w-6xl mx-auto my-8 bg-white rounded-2xl shadow-xl overflow-hidden">
//         {/* Header with gradient */}
//         <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-10 relative">
//           <div className="flex items-start gap-4">
//             <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
//               <TrendingUp className="text-white" size={28} />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-white">
//                 Forecast Upload Dashboard
//               </h1>
//               <p className="text-indigo-100 mt-1 max-w-xl">
//                 Generate accurate sales forecasts by uploading your data and selecting parameters
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Main content */}
//         <div className="p-10">
//           <div className="space-y-8">
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
//                     accept=".xlsx,.xls,.csv"
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
//                 className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
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
//                     min="0"
//                     max="100"
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
//               onClick={handleSubmit}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 size={18} className="animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <Upload size={18} />
//                   Generate Forecast
//                 </>
//               )}
//             </button>
//           </div>

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

//           {/* Download section */}
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
//                       Your forecast file is ready for download
//                     </p>
//                   </div>
//                 </div>

//                 <a
//                   href={downloadUrl}
//                   className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm hover:shadow"
//                   download={`${outputFileName}_forecast.zip`}
//                 >
//                   <FileDown size={18} />
//                   Download Forecast
//                 </a>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Enhanced Loading Modal */}
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
