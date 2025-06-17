// ProductSelector/ProductTable.jsx
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
} from "lucide-react";
import { formatDateTime } from "../../utils/dateFormat";

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

  const isAllSelected =
    processedProducts.length > 0 &&
    processedProducts.every((p) => selectedProductIds.includes(p.product_id));

  const isSomeSelected = selectedProductIds.length > 0 && !isAllSelected;

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

  const formatAssignedToDisplay = (product) => {
    const notesData = productNotesData[product.product_id];
    const assignedTo = notesData?.assignedTo || "Unassigned";
    const productAssignedTo = notesData?.productAssignedTo || "Unassigned";
    return (
      <div className="flex items-center gap-1">
        <User size={14} className="text-gray-400" />
        <span className="text-sm">{productAssignedTo}</span>
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
                        const filteredCategories = (
                          availableFilters?.categories || []
                        ).filter((cat) =>
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
                      (availableFilters?.categories || []).filter((cat) =>
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
                        {(availableFilters?.categories || []).length} categories
                        selected
                      </span>
                    </div>
                  )}
                </div>
              )}
            </th>

            {/* Assigned To Header */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider relative">
              Assigned To
            </th>

            {/* Notes Filter Header */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setNotesDropdownOpen(!notesDropdownOpen);
                }}
                className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
                  selectedFilters?.notes_sort
                    ? "text-indigo-600 font-semibold"
                    : ""
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
                    {selectedFilters?.notes_sort === "latest"
                      ? "Latest"
                      : "Oldest"}
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
                        name="notes_sort"
                        value=""
                        checked={!selectedFilters?.notes_sort}
                        onChange={() =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            notes_sort: null,
                          }))
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">No Sorting</span>
                    </label>

                    <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                      <input
                        type="radio"
                        name="notes_sort"
                        value="latest"
                        checked={selectedFilters?.notes_sort === "latest"}
                        onChange={() =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            notes_sort: "latest",
                          }))
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">
                        Latest Notes First
                      </span>
                    </label>

                    <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                      <input
                        type="radio"
                        name="notes_sort"
                        value="oldest"
                        checked={selectedFilters?.notes_sort === "oldest"}
                        onChange={() =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            notes_sort: "oldest",
                          }))
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">
                        Oldest Notes First
                      </span>
                    </label>
                  </div>

                  {selectedFilters?.notes_sort && (
                    <div className="p-2 border-t border-gray-100">
                      <button
                        onClick={() =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            notes_sort: null,
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

            {/* Forecast Month Header */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
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

            {/* Added Qty Header */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setAddedQtyDropdownOpen(!addedQtyDropdownOpen);
                }}
                className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
                  selectedFilters?.added_qty_sort
                    ? "text-indigo-600 font-semibold"
                    : ""
                }`}
              >
                <span className="flex items-center gap-1">
                  {selectedFilters?.added_qty_sort && <Filter size={14} />}
                  Added Qty
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    addedQtyDropdownOpen ? "rotate-180" : ""
                  }`}
                />
                {selectedFilters?.added_qty_sort && (
                  <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                    {selectedFilters?.added_qty_sort === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>

              {addedQtyDropdownOpen && (
                <div
                  className="added-qty-dropdown absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">
                      Sort by Added Quantity
                    </span>
                  </div>

                  <div className="p-2">
                    <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                      <input
                        type="radio"
                        name="added_qty_sort"
                        value=""
                        checked={!selectedFilters?.added_qty_sort}
                        onChange={() =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            added_qty_sort: null,
                          }))
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">No Sorting</span>
                    </label>

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
                        <span className="text-xs text-gray-500">
                          (Low to High)
                        </span>
                        <ArrowUpDown
                          size={14}
                          className="text-gray-400 rotate-180"
                        />
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
                        <span className="text-sm text-gray-700">
                          Descending
                        </span>
                        <span className="text-xs text-gray-500">
                          (High to Low)
                        </span>
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
                            checked={(selectedFilters?.status || []).includes(
                              status
                            )}
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
                          <span className="text-sm text-gray-700">
                            {status}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {(selectedFilters?.status?.length || 0) > 0 && (
                    <div className="p-2 border-t border-gray-100 bg-gray-50">
                      <span className="text-xs text-gray-600">
                        {selectedFilters?.status?.length} of{" "}
                        {(availableFilters?.statuses || []).length} statuses
                        selected
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
                    {selectedFilters?.last_reviewed_sort === "newest"
                      ? "↓"
                      : "↑"}
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
                        checked={
                          selectedFilters?.last_reviewed_sort === "newest"
                        }
                        onChange={() =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            last_reviewed_sort: "newest",
                          }))
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                          Newest First
                        </span>
                        <span className="text-xs text-gray-500">
                          (Recent to Old)
                        </span>
                        <ChevronDown size={14} className="text-gray-400" />
                      </div>
                    </label>

                    <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                      <input
                        type="radio"
                        name="last_reviewed_sort"
                        value="oldest"
                        checked={
                          selectedFilters?.last_reviewed_sort === "oldest"
                        }
                        onChange={() =>
                          setSelectedFilters((prev) => ({
                            ...prev,
                            last_reviewed_sort: "oldest",
                          }))
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                          Oldest First
                        </span>
                        <span className="text-xs text-gray-500">
                          (Old to Recent)
                        </span>
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

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
              Final Qty
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
                {/* {formatStatusDisplay(product)} */}
                <StatusDropdownWithBadge product={product} />
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
                          product.user_updated_final_quantity || 0
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

export default ProductTable;

const StatusDropdownWithBadge = ({ product, onStatusChange }) => {
  const [currentStatus, setCurrentStatus] = useState(product.status);

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

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/forecast-notes/${
          product.latest_note_id
        }/`,
        { status: newStatus }
      );
      setCurrentStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Could not update status");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}
      >
        {icon}
        {label}
      </span> */}
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        className={`text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 border ${
          currentStatus === "reviewed"
            ? "bg-green-100 text-green-800"
            : currentStatus === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        <option value="not_reviewed">Not Reviewed</option>
        <option value="pending">Pending</option>
        <option value="reviewed">Reviewed</option>
      </select>
    </div>
  );
};
