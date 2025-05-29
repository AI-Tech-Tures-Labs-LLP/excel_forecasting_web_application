import React, { useState, useEffect } from "react";
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
  Loader2,
  Clock,
  XCircle
} from "lucide-react";

function FileUploadStep() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPath, setCurrentPath] = useState("My Drive");
  const [generatedFiles, setGeneratedFiles] = useState([]);

  // Static files to show initially
  const staticFiles = [
    {
      id: 1,
      name: "Sales_Report_Q4.xlsx",
      type: "file",
      extension: "xlsx",
      icon: FileSpreadsheet,
      modified: "3 hours ago",
      size: "1.8 MB",
      isSpreadsheet: true,
      status: 'completed'
    },
    {
      id: 2,
      name: "Inventory_Data_2024.xlsx",
      type: "file",
      extension: "xlsx",
      icon: FileSpreadsheet,
      modified: "1 day ago",
      size: "3.2 MB",
      isSpreadsheet: true,
      status: 'completed'
    }
  ];

  // Load generated files from session storage and listen for updates
  useEffect(() => {
    const loadGeneratedFiles = () => {
      const stored = JSON.parse(sessionStorage.getItem('generatedFiles') || '[]');
      setGeneratedFiles(stored);
    };

    loadGeneratedFiles();
    
    // Poll for updates every 2 seconds to check for new files and status changes
    const interval = setInterval(loadGeneratedFiles, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Combine static and generated files
  const allFiles = [...staticFiles, ...generatedFiles];

  const handleFileClick = (file) => {
    if (file.isSpreadsheet && file.status === 'completed') {
      setSelectedFile(file);
      
      if (file.isGenerated && file.forecastData) {
        // Store forecast data for generated files
        localStorage.setItem("forecastData", JSON.stringify(file.forecastData));
      } else {
        // Store file data for static files
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.extension,
          lastModified: file.modified
        };
        sessionStorage.setItem("selectedFile", JSON.stringify(fileData));
      }
      
      // Auto-navigate to products after selection
      setTimeout(() => {
        navigate("/products");
      }, 500);
    } else if (file.status === 'loading') {
      // Don't allow selection of loading files
      return;
    } else if (file.status === 'error') {
      // Show error message
      alert("This file failed to generate. Please try again.");
    }
  };

  const handleUploadClick = () => {
    navigate("/forecast");
  };

  const handleBack = () => {
    navigate("/");
  };

  const getFileIcon = (file) => {
    const IconComponent = file.icon;
    let colorClass = "text-gray-500";
    
    if (file.status === 'loading') {
      return <Loader2 className="text-blue-500 animate-spin" size={viewMode === "grid" ? 32 : 20} />;
    } else if (file.status === 'error') {
      colorClass = "text-red-500";
    } else if (file.isSpreadsheet) {
      colorClass = "text-green-600";
    }
    
    return <IconComponent className={colorClass} size={viewMode === "grid" ? 32 : 20} />;
  };

  const getFileCardClasses = (file) => {
    let baseClasses = "p-4 rounded-lg border-2 transition-all duration-200";
    
    if (file.status === 'loading') {
      return `${baseClasses} border-blue-200 bg-blue-50 cursor-not-allowed opacity-75`;
    } else if (file.status === 'error') {
      return `${baseClasses} border-red-200 bg-red-50 cursor-pointer hover:border-red-300`;
    } else if (selectedFile?.id === file.id) {
      return `${baseClasses} border-indigo-500 bg-indigo-50 shadow-md cursor-pointer`;
    } else if (file.isSpreadsheet) {
      return `${baseClasses} border-green-200 hover:border-green-300 hover:bg-green-50 cursor-pointer hover:shadow-md`;
    } else {
      return `${baseClasses} border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer hover:shadow-md`;
    }
  };

  const getStatusBadge = (file) => {
    if (file.status === 'loading') {
      return (
        <div className="mt-2 flex items-center gap-1">
          <Clock size={12} className="text-blue-500" />
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Generating...
          </span>
        </div>
      );
    } else if (file.status === 'error') {
      return (
        <div className="mt-2 flex items-center gap-1">
          <XCircle size={12} className="text-red-500" />
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Failed
          </span>
        </div>
      );
    } else if (file.isGenerated) {
      return (
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Generated
          </span>
        </div>
      );
    } else if (file.isSpreadsheet) {
      return (
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Spreadsheet
          </span>
        </div>
      );
    }
    return null;
  };

  const renderGridView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {allFiles.map((file) => (
        <div
          key={file.id}
          onClick={() => handleFileClick(file)}
          className={getFileCardClasses(file)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-3">
              {getFileIcon(file)}
            </div>
            <h3 className="text-sm font-medium text-gray-900 truncate w-full" title={file.name}>
              {file.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{file.size}</p>
            <p className="text-xs text-gray-400">{file.modified}</p>
            {getStatusBadge(file)}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="col-span-5">Name</div>
        <div className="col-span-2">Modified</div>
        <div className="col-span-2">Size</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-1">Status</div>
      </div>
      {allFiles.map((file, index) => (
        <div
          key={file.id}
          onClick={() => handleFileClick(file)}
          className={`grid grid-cols-12 gap-4 p-3 transition-colors ${
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          } ${
            file.status === 'loading' 
              ? "cursor-not-allowed opacity-75" 
              : selectedFile?.id === file.id
                ? "bg-indigo-50 border-l-4 border-indigo-500 cursor-pointer"
                : file.isSpreadsheet
                  ? "hover:bg-green-50 cursor-pointer"
                  : "hover:bg-gray-100 cursor-pointer"
          }`}
        >
          <div className="col-span-5 flex items-center gap-3">
            {getFileIcon(file)}
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              {file.status === 'loading' && (
                <p className="text-xs text-blue-600">Generating forecast...</p>
              )}
              {file.status === 'error' && (
                <p className="text-xs text-red-600">Generation failed</p>
              )}
            </div>
          </div>
          <div className="col-span-2 flex items-center text-sm text-gray-500">
            {file.modified}
          </div>
          <div className="col-span-2 flex items-center text-sm text-gray-500">
            {file.size}
          </div>
          <div className="col-span-2 flex items-center text-sm text-gray-500">
            {file.extension?.toUpperCase()}
          </div>
          <div className="col-span-1 flex items-center">
            {file.status === 'loading' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Loading
              </span>
            )}
            {file.status === 'error' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Error
              </span>
            )}
            {file.status === 'completed' && file.isGenerated && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Ready
              </span>
            )}
          </div>
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
              
              {/* Upload Button */}
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
                Choose an existing spreadsheet file or create a new forecast
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
                <h2 className="text-xl font-semibold text-gray-900">My Drive</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-indigo-100 text-indigo-600" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-indigo-100 text-indigo-600" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search files and folders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FolderOpen size={16} />
              <span>{currentPath}</span>
            </div>
          </div>

          {/* File Grid/List */}
          <div className="p-6">
            {allFiles.length === 0 ? (
              <div className="text-center py-12">
                <FileSpreadsheet className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
                <p className="text-gray-500 mb-4">Create your first forecast to get started</p>
                <button
                  onClick={handleUploadClick}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Create New Forecast
                </button>
              </div>
            ) : (
              viewMode === "grid" ? renderGridView() : renderListView()
            )}
          </div>

          {/* Selected File Info */}
          {selectedFile && selectedFile.status === 'completed' && (
            <div className="border-t border-gray-200 p-6 bg-green-50">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-1">File Selected</h3>
                  <p className="text-green-800 font-medium">{selectedFile.name}</p>
                  <p className="text-green-600 text-sm">{selectedFile.size} • {selectedFile.modified}</p>
                  {selectedFile.isGenerated && (
                    <p className="text-green-600 text-xs mt-1">Generated forecast file</p>
                  )}
                </div>
                <div className="text-green-600">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="border-t border-gray-200 p-6 bg-blue-50">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileSpreadsheet className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">How to use:</h4>
                <div className="text-blue-800 text-sm space-y-1">
                  <p>• <strong>Click on a completed spreadsheet file</strong> to select and view products</p>
                  <p>• <strong>Files marked "Generating..."</strong> are currently being processed</p>
                  <p>• <strong>"Create New Forecast"</strong> to upload and configure a new file</p>
                  <p>• <strong>Generated files</strong> contain your forecast data and settings</p>
                </div>
              </div>
            </div>
          </div>

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
              {allFiles.filter(f => f.isSpreadsheet && f.status === 'completed').length} files available •{' '}
              {allFiles.filter(f => f.status === 'loading').length} generating
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUploadStep;