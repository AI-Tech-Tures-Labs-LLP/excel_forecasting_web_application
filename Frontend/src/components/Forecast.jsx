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
