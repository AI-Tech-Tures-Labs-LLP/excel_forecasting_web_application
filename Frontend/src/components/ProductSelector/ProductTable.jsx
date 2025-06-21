// Fixed ProductTable.jsx - Notes sorting functionality
import React, { useState, useEffect } from "react";
import {
  Package,
  MessageSquare,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  Check,
  ChevronDown,
  Filter,
  Search,
  X,
  ArrowUpDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { formatDateTime } from "../../utils/dateFormat";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ProductTable = ({
  loading,
  currentProducts,
  productNotesData,
  selectedProductIds,
  setSelectedProductIds,
  processedProducts,
  onViewDetails,
  onOpenNotes,
  searchQuery,
  selectedFilters,
  setSelectedFilters,
  availableFilters,
  setCurrentPage,
}) => {
  // Get data from Redux store (from fetchProducts response)
  const assignedUsers = useSelector(
    (state) => state.products.assignedUsers || []
  );
  const categories = useSelector((state) => state.products.categories || []);

  // Dropdown states
  const { sheetId } = useParams();
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [assignedToDropdownOpen, setAssignedToDropdownOpen] = useState(false);
  const [assignedToSearchTerm, setAssignedToSearchTerm] = useState("");
  const [notesDropdownOpen, setNotesDropdownOpen] = useState(false);
  const [forecastMonthDropdownOpen, setForecastMonthDropdownOpen] =
    useState(false);
  const [forecastMonthSearchTerm, setForecastMonthSearchTerm] = useState("");
  const [addedQtyDropdownOpen, setAddedQtyDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [lastReviewedDropdownOpen, setLastReviewedDropdownOpen] =
    useState(false);
  const [finalQtyDropdownOpen, setFinalQtyDropdownOpen] = useState(false);
  const users = useSelector((state) => state.products.assignedUsers);
  // No need for separate API call - use Redux data
  const [usersData, setUsersData] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Update usersData when Redux assignedUsers changes
  useEffect(() => {
    setUsersData(assignedUsers);
  }, [assignedUsers]);

  const isAllSelected =
    processedProducts.length > 0 &&
    processedProducts.every((p) => selectedProductIds.includes(p.product_id));

  const isSomeSelected = selectedProductIds.length > 0 && !isAllSelected;

  // Get unique forecast months from current products
  const getUniqueForecastMonths = () => {
    const months = new Set();
    currentProducts.forEach((product) => {
      if (product.forecast_month) {
        months.add(product.forecast_month);
      }
    });
    return Array.from(months).sort();
  };

  // Status options
  const statusOptions = [
    {
      value: "not_reviewed",
      label: "Not Reviewed",
      icon: AlertCircle,
      color: "red",
    },
    { value: "pending", label: "Pending", icon: Clock, color: "yellow" },
    { value: "reviewed", label: "Reviewed", icon: CheckCircle, color: "green" },
  ];

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const categoryDropdown = event.target.closest(".category-dropdown");
      const assignedToDropdown = event.target.closest(".assigned-to-dropdown");
      const notesDropdown = event.target.closest(".notes-dropdown");
      const forecastMonthDropdown = event.target.closest(
        ".forecast-month-dropdown"
      );
      const addedQtyDropdown = event.target.closest(".added-qty-dropdown");
      const statusDropdown = event.target.closest(".status-dropdown");
      const lastReviewedDropdown = event.target.closest(
        ".last-reviewed-dropdown"
      );
      const finalQtyDropdown = event.target.closest(".final-qty-dropdown");

      if (
        !categoryDropdown &&
        !assignedToDropdown &&
        !notesDropdown &&
        !forecastMonthDropdown &&
        !addedQtyDropdown &&
        !statusDropdown &&
        !lastReviewedDropdown &&
        !finalQtyDropdown &&
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
    setAssignedToDropdownOpen(false);
    setAssignedToSearchTerm("");
    setNotesDropdownOpen(false);
    setForecastMonthDropdownOpen(false);
    setForecastMonthSearchTerm("");
    setAddedQtyDropdownOpen(false);
    setStatusDropdownOpen(false);
    setLastReviewedDropdownOpen(false);
    setFinalQtyDropdownOpen(false);
  };

  const getFinalQty = (product) => {
    if (
      product.user_updated_final_quantity !== null &&
      product.user_updated_final_quantity !== undefined
    ) {
      return parseInt(product.user_updated_final_quantity);
    } else if (
      product.external_factor_percentage !== null &&
      product.external_factor_percentage !== undefined
    ) {
      const baseQty =
        product.user_updated_final_quantity != null &&
        product.user_updated_final_quantity !== 0
          ? product.user_updated_final_quantity
          : product.recommended_total_quantity || 0;

      return Math.round(
        baseQty * (1 + product.external_factor_percentage / 100)
      );
    } else {
      return product.recommended_total_quantity || 0;
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allProductIds = processedProducts.map((p) => p.product_id);
      setSelectedProductIds(allProductIds);
    } else {
      setSelectedProductIds([]);
    }
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

  // Fixed: Handle sorting changes with proper parameter mapping
  const handleSortChange = (sortKey, direction) => {
    // Map frontend sort keys to backend API parameters
    const sortKeyMapping = {
      note_created_at: "note_created_at", // Use note_created_at for notes sorting
      created_at: "note_created_at", // Fallback mapping
      recommended_total_quantity: "recommended_total_quantity",
      user_updated_final_quantity: "user_updated_final_quantity",
      updated_at: "updated_at",
    };

    const backendSortKey = sortKeyMapping[sortKey] || sortKey;

    setSelectedFilters((prev) => ({
      ...prev,
      sort_by: backendSortKey,
      sort_direction: direction,
      // Clear legacy sorting parameters
      notes_sort: null,
      added_qty_sort: null,
      final_qty_sort: null,
      last_reviewed_sort: null,
    }));
    setCurrentPage(1);
  };

  // Fixed: Get sort icon for column headers with proper mapping
  const getSortIcon = (sortKey) => {
    const currentSort = selectedFilters?.sort_by;
    const currentDirection = selectedFilters?.sort_direction;

    // Map display sort keys to backend parameters for comparison
    const sortKeyMapping = {
      note_created_at: "note_created_at",
      created_at: "note_created_at",
      recommended_total_quantity: "recommended_total_quantity",
      user_updated_final_quantity: "user_updated_final_quantity",
      updated_at: "updated_at",
    };

    const mappedSortKey = sortKeyMapping[sortKey] || sortKey;

    if (currentSort !== mappedSortKey) {
      return <ArrowUpDown size={14} className="text-gray-400" />;
    }

    if (currentDirection === "asc") {
      return <ArrowUp size={14} className="text-indigo-600" />;
    } else {
      return <ArrowDown size={14} className="text-indigo-600" />;
    }
  };

  // Helper function to check if a column is currently sorted
  const isColumnSorted = (sortKey) => {
    const currentSort = selectedFilters?.sort_by;
    const sortKeyMapping = {
      note_created_at: "note_created_at",
      created_at: "note_created_at",
      recommended_total_quantity: "recommended_total_quantity",
      user_updated_final_quantity: "user_updated_final_quantity",
      updated_at: "updated_at",
    };

    const mappedSortKey = sortKeyMapping[sortKey] || sortKey;
    return currentSort === mappedSortKey;
  };

  const formatStatusDisplay = (product) => {
    const status = product.status;

    const statusConfig = {
      reviewed: {
        icon: <CheckCircle size={12} className="mr-1" />,
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Reviewed",
      },
      not_reviewed: {
        icon: <AlertCircle size={12} className="mr-1" />,
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Not Reviewed",
      },
      pending: {
        icon: <Clock size={12} className="mr-1" />,
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
    };

    const fallback = {
      icon: <AlertCircle size={12} className="mr-1" />,
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: "Unknown",
    };

    const { icon, bg, text, label } = statusConfig[status] || fallback;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}
      >
        {icon}
        {label}
      </span>
    );
  };

  // Updated function to use assigned_to from the product data with Redux data lookup
  const formatAssignedToDisplay = (product) => {
    const assignedTo = product.assigned_to;

    if (assignedTo) {
      // If assigned_to is an object with user details
      if (typeof assignedTo === "object") {
        const displayName =
          assignedTo.first_name && assignedTo.last_name
            ? `${assignedTo.first_name} ${assignedTo.last_name}`
            : assignedTo.username || assignedTo.email || "Unknown User";

        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <User size={14} className="text-indigo-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {displayName}
              </span>
              {assignedTo.username && (
                <span className="text-xs text-gray-500">
                  @{assignedTo.username}
                </span>
              )}
            </div>
          </div>
        );
      }

      // If assigned_to is a number (user ID), look up from Redux data
      if (typeof assignedTo === "number") {
        const assignedUser = usersData.find((user) => user.id === assignedTo);

        if (assignedUser) {
          const displayName =
            assignedUser.first_name && assignedUser.last_name
              ? `${assignedUser.first_name} ${assignedUser.last_name}`
              : assignedUser.username || assignedUser.email || "Unknown User";

          return (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User size={14} className="text-indigo-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {assignedUser.username}
                </span>
                {assignedUser.email && (
                  <span className="text-xs text-gray-500">
                    {assignedUser.email}
                  </span>
                )}
                {assignedUser.role && (
                  <span className="text-xs text-blue-600 capitalize">
                    {assignedUser.role.name}
                  </span>
                )}
              </div>
            </div>
          );
        } else {
          // User not found in Redux data
          return (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <User size={14} className="text-gray-400" />
              </div>
              <span className="text-sm text-gray-500">
                User ID: {assignedTo}
              </span>
            </div>
          );
        }
      }

      // If assigned_to is just a string (username/name)
      if (typeof assignedTo === "string") {
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <User size={14} className="text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">
              {assignedTo}
            </span>
          </div>
        );
      }
    }

    // Fallback to productNotesData if no direct assigned_to
    const notesData = productNotesData[product.product_id];
    const fallbackAssignedTo =
      notesData?.assignedTo || notesData?.productAssignedTo;

    if (fallbackAssignedTo && fallbackAssignedTo !== "Unassigned") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <User size={14} className="text-indigo-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">
            {fallbackAssignedTo}
          </span>
        </div>
      );
    }

    // Unassigned state
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <User size={14} className="text-gray-400" />
        </div>
        <span className="text-sm text-gray-500">Unassigned</span>
      </div>
    );
  };

  const formatNotesDisplay = (product) => {
    const notesData = productNotesData[product.product_id];

    if (!notesData || notesData.count === 0) {
      return (
        <div className="flex items-center justify-center gap-1 text-blue-400 hover:text-indigo-600 cursor-pointer w-16 h-8 relative">
          <MessageSquare size={16} />
          <span className="text-sm">0</span>
          <div className="w-2 h-2 invisible"></div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-indigo-600 w-16 h-8 relative">
        <MessageSquare size={16} className="text-blue-500" />
        <span className="text-sm font-medium text-blue-600">
          {notesData.count}
        </span>
        <div className="w-2 h-2 flex-shrink-0">
          {notesData.hasUnreviewed && (
            <div
              className="w-2 h-2 bg-red-500 rounded-full"
              title="Has unreviewed notes"
            ></div>
          )}
        </div>
      </div>
    );
  };

  // Get unique assigned user IDs from current products
  const getAssignedUserIds = () => {
    const assignedIds = new Set();
    currentProducts.forEach((product) => {
      if (product.assigned_to && typeof product.assigned_to === "number") {
        assignedIds.add(product.assigned_to);
      }
    });
    return Array.from(assignedIds);
  };

  // Get users that are actually assigned to products from Redux data
  const getAssignedUsers = () => {
    const assignedUserIds = getAssignedUserIds();
    return usersData.filter((user) => assignedUserIds.includes(user.id));
  };

  // Check if there are any unassigned products
  const hasUnassignedProducts = () => {
    return currentProducts.some((product) => !product.assigned_to);
  };

  const getAddedQty = (product) => {
    return product.recommended_total_quantity || 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (currentProducts.length === 0) {
    const hasActiveFilters = searchQuery.length > 0;

    return (
      <div className="text-center py-12 text-gray-500">
        <Package size={64} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Products Found
        </h3>
        <p className="mb-4">
          {hasActiveFilters
            ? "No products match the current filters or search query."
            : "No products available for this category."}
        </p>
        {hasActiveFilters && (
          <button
            onClick={() => {}}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear all filters and search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto min-h-[500px]">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Checkbox Column */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center justify-center flex-col">
                <input
                  type="checkbox"
                  ref={(el) => {
                    if (el) el.indeterminate = isSomeSelected;
                  }}
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                {selectedProductIds.length > 0 && (
                  <span className="mt-2 text-xs text-indigo-600 font-medium">
                    {selectedProductIds.length}
                  </span>
                )}
              </div>
            </th>

            {/* Product ID Column */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
              Product ID
            </th>

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
                        const filteredCategories = categories.filter((cat) =>
                          cat
                            .toLowerCase()
                            .includes(categorySearchTerm.toLowerCase())
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
                      Select All
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
                    {categories
                      .filter((cat) =>
                        cat
                          .toLowerCase()
                          .includes(categorySearchTerm.toLowerCase())
                      )
                      .map((cat) => (
                        <label
                          key={cat}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={(
                                selectedFilters?.category || []
                              ).includes(cat)}
                              onChange={(e) =>
                                handleMultiSelectFilterChange(
                                  "category",
                                  cat,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                            />
                            {(selectedFilters?.category || []).includes(
                              cat
                            ) && (
                              <Check
                                size={12}
                                className="absolute top-0.5 left-0.5 text-white pointer-events-none"
                              />
                            )}
                          </div>
                          <span className="text-sm text-gray-700 flex-1">
                            {cat}
                          </span>
                        </label>
                      ))}

                    {categorySearchTerm &&
                      categories.filter((cat) =>
                        cat
                          .toLowerCase()
                          .includes(categorySearchTerm.toLowerCase())
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
                        {categories.length} categories selected
                      </span>
                    </div>
                  )}
                </div>
              )}
            </th>

            {/* Assigned To Filter Header */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setAssignedToDropdownOpen(!assignedToDropdownOpen);
                  setAssignedToSearchTerm("");
                }}
                className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
                  (selectedFilters?.assigned_to?.length || 0) > 0
                    ? "text-indigo-600 font-semibold"
                    : ""
                }`}
              >
                <span className="flex items-center gap-1">
                  {(selectedFilters?.assigned_to?.length || 0) > 0 && (
                    <Filter size={14} />
                  )}
                  Assigned To
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    assignedToDropdownOpen ? "rotate-180" : ""
                  }`}
                />
                {(selectedFilters?.assigned_to?.length || 0) > 0 && (
                  <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                    {selectedFilters?.assigned_to?.length}
                  </span>
                )}
              </button>

              {assignedToDropdownOpen && (
                <div
                  className="assigned-to-dropdown absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 flex flex-col"
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
                        placeholder="Search users..."
                        value={assignedToSearchTerm}
                        onChange={(e) =>
                          setAssignedToSearchTerm(e.target.value)
                        }
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {assignedToSearchTerm && (
                        <button
                          onClick={() => setAssignedToSearchTerm("")}
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
                        const allUsers = assignedUsers; // Changed from getAssignedUsers()
                        const filteredUsers = allUsers.filter((user) =>
                          (user.username || user.email || "")
                            .toLowerCase()
                            .includes(assignedToSearchTerm.toLowerCase())
                        );
                        const userIds = filteredUsers.map((user) => user.id);
                        const allSelections = hasUnassignedProducts()
                          ? [...userIds, "unassigned"]
                          : userIds;

                        setSelectedFilters((prev) => ({
                          ...prev,
                          assigned_to: [
                            ...new Set([
                              ...(prev?.assigned_to || []),
                              ...allSelections,
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
                          assigned_to: [],
                        }))
                      }
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {hasUnassignedProducts() && (
                      <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={(
                              selectedFilters?.assigned_to || []
                            ).includes("unassigned")}
                            onChange={(e) =>
                              handleMultiSelectFilterChange(
                                "assigned_to",
                                "unassigned",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                          />
                          {(selectedFilters?.assigned_to || []).includes(
                            "unassigned"
                          ) && (
                            <Check
                              size={12}
                              className="absolute top-0.5 left-0.5 text-white pointer-events-none"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <User size={12} className="text-gray-400" />
                          </div>
                          <span className="text-sm text-gray-700">
                            Unassigned
                          </span>
                        </div>
                      </label>
                    )}

                    {assignedUsers // Changed from getAssignedUsers()
                      .filter((user) => {
                        const searchText = assignedToSearchTerm.toLowerCase();
                        if (!searchText) return true;

                        return (
                          (user.username || "")
                            .toLowerCase()
                            .includes(searchText) ||
                          (user.email || "")
                            .toLowerCase()
                            .includes(searchText) ||
                          (user.first_name || "")
                            .toLowerCase()
                            .includes(searchText) ||
                          (user.last_name || "")
                            .toLowerCase()
                            .includes(searchText)
                        );
                      })
                      .map((user) => {
                        const displayName =
                          user.first_name && user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : user.username || user.email || "Unknown User";

                        return (
                          <label
                            key={user.id}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={(
                                  selectedFilters?.assigned_to || []
                                ).includes(user.id)}
                                onChange={(e) =>
                                  handleMultiSelectFilterChange(
                                    "assigned_to",
                                    user.id,
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                              />
                              {(selectedFilters?.assigned_to || []).includes(
                                user.id
                              ) && (
                                <Check
                                  size={12}
                                  className="absolute top-0.5 left-0.5 text-white pointer-events-none"
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                                <User size={12} className="text-indigo-600" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-700">
                                  {user.username}
                                </span>
                                {user.email && (
                                  <span className="text-xs text-gray-500">
                                    {user.email}
                                  </span>
                                )}
                                {user.role && (
                                  <span className="text-xs text-blue-600 capitalize">
                                    {user.role.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })}

                    {assignedUsers.length === 0 && // Changed from getAssignedUsers()
                      !hasUnassignedProducts() && (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No users found
                        </div>
                      )}

                    {assignedToSearchTerm &&
                      assignedUsers.filter((user) => {
                        // Changed from getAssignedUsers()
                        const searchText = assignedToSearchTerm.toLowerCase();
                        return (
                          (user.username || "")
                            .toLowerCase()
                            .includes(searchText) ||
                          (user.email || "")
                            .toLowerCase()
                            .includes(searchText) ||
                          (user.first_name || "")
                            .toLowerCase()
                            .includes(searchText) ||
                          (user.last_name || "")
                            .toLowerCase()
                            .includes(searchText)
                        );
                      }).length === 0 && (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No users found matching "{assignedToSearchTerm}"
                        </div>
                      )}
                  </div>

                  {(selectedFilters?.assigned_to?.length || 0) > 0 && (
                    <div className="p-2 border-t border-gray-100 bg-gray-50">
                      <span className="text-xs text-gray-600">
                        {selectedFilters?.assigned_to?.length} of{" "}
                        {assignedUsers.length + // Changed from getAssignedUsers()
                          (hasUnassignedProducts() ? 1 : 0)}{" "}
                        users selected
                      </span>
                    </div>
                  )}
                </div>
              )}
            </th>

            {/* FIXED: Notes Column with Sorting */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setNotesDropdownOpen(!notesDropdownOpen);
                }}
                className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
                  isColumnSorted("note_created_at")
                    ? "text-indigo-600 font-semibold"
                    : ""
                }`}
              >
                <span>Notes</span>
                {getSortIcon("note_created_at")}
              </button>

              {notesDropdownOpen && (
                <div
                  className="notes-dropdown absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        handleSortChange("note_created_at", "desc");
                        setNotesDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 flex items-center gap-2 ${
                        selectedFilters?.sort_by === "note_created_at" &&
                        selectedFilters?.sort_direction === "desc"
                          ? "text-indigo-600 bg-indigo-50"
                          : "text-gray-700"
                      }`}
                    >
                      <ArrowDown size={14} />
                      Latest Notes First
                    </button>
                    <button
                      onClick={() => {
                        handleSortChange("note_created_at", "asc");
                        setNotesDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 flex items-center gap-2 ${
                        selectedFilters?.sort_by === "note_created_at" &&
                        selectedFilters?.sort_direction === "asc"
                          ? "text-indigo-600 bg-indigo-50"
                          : "text-gray-700"
                      }`}
                    >
                      <ArrowUp size={14} />
                      Oldest Notes First
                    </button>
                    {selectedFilters?.sort_by === "note_created_at" && (
                      <div className="border-t border-gray-100 pt-2 mt-2">
                        <button
                          onClick={() => {
                            setSelectedFilters((prev) => ({
                              ...prev,
                              sort_by: null,
                              sort_direction: null,
                            }));
                            setNotesDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 text-gray-500"
                        >
                          Clear Sort
                        </button>
                      </div>
                    )}
                  </div>
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
                  className="forecast-month-dropdown absolute top-full left-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 flex flex-col"
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
                        placeholder="Search months..."
                        value={forecastMonthSearchTerm}
                        onChange={(e) =>
                          setForecastMonthSearchTerm(e.target.value)
                        }
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
                        const filteredMonths = getUniqueForecastMonths().filter(
                          (month) =>
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
                    {getUniqueForecastMonths()
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

                    {forecastMonthSearchTerm &&
                      getUniqueForecastMonths().filter((month) =>
                        month
                          .toLowerCase()
                          .includes(forecastMonthSearchTerm.toLowerCase())
                      ).length === 0 && (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No months found matching "{forecastMonthSearchTerm}"
                        </div>
                      )}
                  </div>

                  {(selectedFilters?.forecast_month?.length || 0) > 0 && (
                    <div className="p-2 border-t border-gray-100 bg-gray-50">
                      <span className="text-xs text-gray-600">
                        {selectedFilters?.forecast_month?.length} of{" "}
                        {getUniqueForecastMonths().length} months selected
                      </span>
                    </div>
                  )}
                </div>
              )}
            </th>

            {/* Recommended Qty Column with Sorting */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setAddedQtyDropdownOpen(!addedQtyDropdownOpen);
                }}
                className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
                  isColumnSorted("recommended_total_quantity")
                    ? "text-indigo-600 font-semibold"
                    : ""
                }`}
              >
                <span>Recommended Qty</span>
                {getSortIcon("recommended_total_quantity")}
              </button>

              {addedQtyDropdownOpen && (
                <div
                  className="added-qty-dropdown absolute top-full left-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        handleSortChange("recommended_total_quantity", "desc");
                        setAddedQtyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 flex items-center gap-2 ${
                        selectedFilters?.sort_by ===
                          "recommended_total_quantity" &&
                        selectedFilters?.sort_direction === "desc"
                          ? "text-indigo-600 bg-indigo-50"
                          : "text-gray-700"
                      }`}
                    >
                      <ArrowDown size={14} />
                      Highest First
                    </button>
                    <button
                      onClick={() => {
                        handleSortChange("recommended_total_quantity", "asc");
                        setAddedQtyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 flex items-center gap-2 ${
                        selectedFilters?.sort_by ===
                          "recommended_total_quantity" &&
                        selectedFilters?.sort_direction === "asc"
                          ? "text-indigo-600 bg-indigo-50"
                          : "text-gray-700"
                      }`}
                    >
                      <ArrowUp size={14} />
                      Lowest First
                    </button>
                    {selectedFilters?.sort_by ===
                      "recommended_total_quantity" && (
                      <div className="border-t border-gray-100 pt-2 mt-2">
                        <button
                          onClick={() => {
                            setSelectedFilters((prev) => ({
                              ...prev,
                              sort_by: null,
                              sort_direction: null,
                            }));
                            setAddedQtyDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 text-gray-500"
                        >
                          Clear Sort
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </th>

            {/* Status Filter Header */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider relative">
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
                  {(selectedFilters?.status?.length || 0) > 0 && (
                    <Filter size={14} />
                  )}
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
                  className="status-dropdown absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2 border-b border-gray-100 flex justify-between">
                    <button
                      onClick={() => {
                        setSelectedFilters((prev) => ({
                          ...prev,
                          status: statusOptions.map((opt) => opt.value),
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

                  <div className="p-2">
                    {statusOptions.map((status) => {
                      const IconComponent = status.icon;
                      return (
                        <label
                          key={status.value}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={(selectedFilters?.status || []).includes(
                                status.value
                              )}
                              onChange={(e) =>
                                handleMultiSelectFilterChange(
                                  "status",
                                  status.value,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                            />
                            {(selectedFilters?.status || []).includes(
                              status.value
                            ) && (
                              <Check
                                size={12}
                                className="absolute top-0.5 left-0.5 text-white pointer-events-none"
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-1">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center bg-${status.color}-100`}
                            >
                              <IconComponent
                                size={12}
                                className={`text-${status.color}-600`}
                              />
                            </div>
                            <span className="text-sm text-gray-700">
                              {status.label}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {(selectedFilters?.status?.length || 0) > 0 && (
                    <div className="p-2 border-t border-gray-100 bg-gray-50">
                      <span className="text-xs text-gray-600">
                        {selectedFilters?.status?.length} of{" "}
                        {statusOptions.length} statuses selected
                      </span>
                    </div>
                  )}
                </div>
              )}
            </th>

            {/* Last Reviewed At Column */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
              Last Reviewed At
            </th>

            {/* Final Qty Column with Sorting */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setFinalQtyDropdownOpen(!finalQtyDropdownOpen);
                }}
                className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
                  isColumnSorted("user_updated_final_quantity")
                    ? "text-indigo-600 font-semibold"
                    : ""
                }`}
              >
                <span>Final Qty</span>
                {getSortIcon("user_updated_final_quantity")}
              </button>

              {finalQtyDropdownOpen && (
                <div
                  className="final-qty-dropdown absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        handleSortChange("user_updated_final_quantity", "desc");
                        setFinalQtyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 flex items-center gap-2 ${
                        selectedFilters?.sort_by ===
                          "user_updated_final_quantity" &&
                        selectedFilters?.sort_direction === "desc"
                          ? "text-indigo-600 bg-indigo-50"
                          : "text-gray-700"
                      }`}
                    >
                      <ArrowDown size={14} />
                      Highest First
                    </button>
                    <button
                      onClick={() => {
                        handleSortChange("user_updated_final_quantity", "asc");
                        setFinalQtyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 flex items-center gap-2 ${
                        selectedFilters?.sort_by ===
                          "user_updated_final_quantity" &&
                        selectedFilters?.sort_direction === "asc"
                          ? "text-indigo-600 bg-indigo-50"
                          : "text-gray-700"
                      }`}
                    >
                      <ArrowUp size={14} />
                      Lowest First
                    </button>
                    {selectedFilters?.sort_by ===
                      "user_updated_final_quantity" && (
                      <div className="border-t border-gray-100 pt-2 mt-2">
                        <button
                          onClick={() => {
                            setSelectedFilters((prev) => ({
                              ...prev,
                              sort_by: null,
                              sort_direction: null,
                            }));
                            setFinalQtyDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 text-gray-500"
                        >
                          Clear Sort
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentProducts.map((product, index) => (
            <tr
              key={`${product.product_id}-${index}`}
              onClick={() => onViewDetails(product)}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              title="Click to view details"
            >
              <td
                className="px-6 py-4 whitespace-nowrap text-sm text-left font-medium text-gray-900"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selectedProductIds.includes(product.product_id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedProductIds((prev) =>
                      checked
                        ? [...prev, product.product_id]
                        : prev.filter((id) => id !== product.product_id)
                    );
                  }}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-left font-medium text-gray-900">
                <div className="flex items-center">
                  <span className="font-mono">{product.product_id}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-900">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {product.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-900">
                {formatAssignedToDisplay(product)}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="flex justify-center cursor-pointer p-2 rounded hover:bg-gray-100"
                  onClick={() => onOpenNotes(product)}
                  title="Click to manage notes"
                >
                  {formatNotesDisplay(product)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-900">
                {product.forecast_month ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {product.forecast_month}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-left font-medium text-gray-900">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {getAddedQty(product).toLocaleString()}
                </span>
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-900"
                onClick={(e) => e.stopPropagation()}
              >
                <StatusDropdownWithBadge product={product} sheetId={sheetId} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                {productNotesData[product.product_id]?.latestNote?.updated_at
                  ? (() => {
                      const [date, time] = formatDateTime(
                        productNotesData[product.product_id].latestNote
                          .updated_at
                      ).split(", ");
                      return (
                        <>
                          <div>{date}</div>
                          <div className="text-xs text-gray-500">{time}</div>
                        </>
                      );
                    })()
                  : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-900">
                {(() => {
                  if (
                    product.user_updated_final_quantity !== null &&
                    product.user_updated_final_quantity !== undefined
                  ) {
                    return (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {parseInt(
                          product.user_updated_final_quantity
                        ).toLocaleString()}
                      </span>
                    );
                  } else if (
                    product.external_factor_percentage !== null &&
                    product.external_factor_percentage !== undefined
                  ) {
                    const baseQty =
                      product.user_updated_final_quantity != null &&
                      product.user_updated_final_quantity !== 0
                        ? product.user_updated_final_quantity
                        : product.recommended_total_quantity || 0;

                    const calculatedQty = Math.round(
                      baseQty * (1 + product.external_factor_percentage / 100)
                    );
                    return (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {calculatedQty.toLocaleString()}
                        <span className="ml-1 text-xs bg-blue-200 text-blue-700 px-1 rounded">
                          {product.external_factor_percentage > 0 ? "+" : ""}
                          {product.external_factor_percentage}%
                        </span>
                      </span>
                    );
                  } else {
                    return (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {(
                          product.recommended_total_quantity || 0
                        ).toLocaleString()}
                        <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 rounded">
                          Default
                        </span>
                      </span>
                    );
                  }
                })()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Status Dropdown Component
const StatusDropdownWithBadge = ({ product }) => {
  const currentStatus = product.status;

  const statusConfig = {
    reviewed: {
      icon: <CheckCircle size={12} className="mr-1" />,
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Reviewed",
    },
    not_reviewed: {
      icon: <AlertCircle size={12} className="mr-1" />,
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Not Reviewed",
    },
    pending: {
      icon: <Clock size={12} className="mr-1" />,
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "Pending",
    },
  };

  const fallback = {
    icon: <AlertCircle size={12} className="mr-1" />,
    bg: "bg-gray-100",
    text: "text-gray-800",
    label: "Unknown",
  };

  const { icon, bg, text, label } = statusConfig[currentStatus] || fallback;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      {icon}
      {label}
    </span>
  );
};

export default ProductTable;
