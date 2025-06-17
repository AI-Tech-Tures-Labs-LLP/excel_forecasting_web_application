// ProductSelector/FilterPanel.jsx
import React, { useState } from "react";
import {
  Sliders,
  RefreshCw,
  Filter,
  Settings,
  Calendar,
  Star,
  Check,
  AlertCircle,
} from "lucide-react";

const FilterPanel = ({
  selectedFilters,
  setSelectedFilters,
  availableFilters,
  filtersLoading,
  selectedProductType,
  onClearFilters,
}) => {
  const [activeTab, setActiveTab] = useState("basic");

  // Boolean filter options
  const booleanOptions = [
    { value: "", label: "All" },
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  // Special Day (Holiday) filter configuration - UPDATED FIELD NAMES
  const specialDayFilters = [
    { key: "valentine_day", label: "Valentine's Day" }, // Changed from Valentine_day
    { key: "mothers_day", label: "Mother's Day" }, // Changed from Mothers_day
    { key: "fathers_day", label: "Father's Day" }, // Changed from Fathers_day
    { key: "mens_day", label: "Men's Day" }, // Changed from Mens_day
    { key: "womens_day", label: "Women's Day" }, // Changed from Womens_day
  ];

  // Additional boolean filters configuration - UPDATED FIELD NAMES
  const additionalBooleanFilters = [
    {
      key: "is_considered_birthstone",
      label: "Considered Birthstone",
      showFor: ["store", "omni"],
      priority: true,
    },
    {
      key: "is_added_quantity_using_macys_soq",
      label: "Added Qty Macy's SOQ",
      showFor: ["store", "com", "omni"],
    },
    {
      key: "is_below_min_order", // Changed from is_below_min_order
      label: "Below Min Order",
      showFor: ["store", "com", "omni"],
    },
    {
      key: "is_over_macys_soq", // Changed from over_macy_SOQ
      label: "Over Macy's SOQ",
      showFor: ["store", "com", "omni"],
      priority: true,
    },
    {
      key: "is_added_only_to_balance_macys_soq",
      label: "Added Only to Balance SOQ",
      showFor: ["store", "com", "omni"],
    },
    {
      key: "is_need_to_review_first",
      label: "Need to Review First",
      showFor: ["store", "com", "omni"],
      priority: true,
    },
  ];

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
  };

  // Handle single-select filter changes (for boolean filters)
  const handleSingleSelectFilterChange = (filterKey, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: value === "" ? null : value,
    }));
  };

  // Check if filters have active values
  const hasActiveFilters = Object.values(selectedFilters).some(
    (filterValue) => {
      if (Array.isArray(filterValue)) {
        return filterValue.length > 0;
      }
      return filterValue !== null;
    }
  );

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

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl shadow-xl overflow-hidden mb-6">
      {/* Filters Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Sliders size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Advanced Filters
              </h3>
              <p className="text-slate-300 text-sm">
                Refine your product search with precision
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 rounded-full">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-indigo-700">
                  {
                    Object.values(selectedFilters)
                      .flat()
                      .filter((v) => v && v !== "").length
                  }{" "}
                  active
                </span>
              </div>
            )}
            <button
              onClick={onClearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all duration-200 text-sm font-medium"
              disabled={!hasActiveFilters}
            >
              <RefreshCw size={16} />
              Reset All
            </button>
          </div>
        </div>
      </div>

      {filtersLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-600 font-medium">
              Loading intelligent filters...
            </span>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-8">
          {/* Filter Categories with Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
            {[
              { id: "basic", label: "Basic Filters", icon: Filter },
              { id: "business", label: "Business Logic", icon: Settings },
              { id: "special", label: "Special Days", icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-indigo-100 text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Basic Filters Tab */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Birthstones Filter */}
              {(selectedProductType === "store" ||
                selectedProductType === "omni") && (
                <div className="bg-white border-2 border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-purple-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Star size={18} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-purple-900">
                        Birthstones
                      </h4>
                      <p className="text-xs text-purple-600">
                        Filter by birthstone type
                      </p>
                    </div>
                    {selectedFilters.birthstone?.length > 0 && (
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-300">
                        {selectedFilters.birthstone.length}
                      </span>
                    )}
                  </div>

                  <div className="border border-purple-200 rounded-lg p-3 bg-purple-50/30 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {availableFilters.birthstones?.map((birthstone) => (
                        <label
                          key={birthstone}
                          className="flex items-center gap-3 p-2 hover:bg-purple-100 rounded-lg cursor-pointer transition-colors group"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={
                                selectedFilters.birthstone?.includes(
                                  birthstone
                                ) || false
                              }
                              onChange={(e) =>
                                handleMultiSelectFilterChange(
                                  "birthstone",
                                  birthstone,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500 focus:ring-2"
                            />
                            {selectedFilters.birthstone?.includes(
                              birthstone
                            ) && (
                              <Check
                                size={12}
                                className="absolute inset-0 m-auto text-white pointer-events-none"
                              />
                            )}
                          </div>
                          <span className="text-sm text-purple-800 group-hover:text-purple-900 font-medium capitalize">
                            {birthstone.toLowerCase()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Red Box Items Filter */}
              <div className="bg-white border-2 border-red-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-red-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-red-900">
                      Red Box Items
                    </h4>
                    <p className="text-xs text-red-600">
                      Special red box category
                    </p>
                  </div>
                  {selectedFilters.is_red_box_item?.length > 0 && (
                    <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-300">
                      {selectedFilters.is_red_box_item.length}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {availableFilters.is_red_box_items?.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 p-3 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer transition-all duration-200 hover:border-red-300 bg-red-50/30"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedFilters.is_red_box_item?.includes(item) ||
                          false
                        }
                        onChange={(e) =>
                          handleMultiSelectFilterChange(
                            "is_red_box_item",
                            item,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-red-600 border-red-300 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <span className="text-sm font-semibold text-red-800">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Boolean Filters */}
              <div className="bg-white border-2 border-indigo-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Settings size={18} className="text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-indigo-900">
                      Additional Filters
                    </h4>
                    <p className="text-xs text-indigo-600">
                      Quantity and SOQ filters
                    </p>
                  </div>
                </div>

                <div className="space-y-4 max-h-80">
                  {additionalBooleanFilters
                    .filter(
                      (filter) =>
                        filter.showFor.includes(selectedProductType) &&
                        ![
                          "is_below_min_order", // Updated field name
                          "is_over_macys_soq", // Updated field name
                          "is_need_to_review_first",
                        ].includes(filter.key)
                    )
                    .slice(0, 3)
                    .map((filter) => (
                      <div key={filter.key} className="space-y-2">
                        <label className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                          {filter.label}
                        </label>
                        <select
                          value={selectedFilters[filter.key] || ""}
                          onChange={(e) =>
                            handleSingleSelectFilterChange(
                              filter.key,
                              e.target.value
                            )
                          }
                          className="w-full p-3 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-indigo-50/30 hover:border-indigo-300 transition-colors font-medium text-indigo-800"
                        >
                          {booleanOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Business Logic Tab */}
          {activeTab === "business" && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-inner">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <AlertCircle size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-indigo-900">
                    Priority Business Filters
                  </h4>
                  <p className="text-sm text-indigo-700">
                    Critical business logic and decision-making filters
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Below Min Order - UPDATED FIELD NAME */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-indigo-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                    <label className="text-sm font-bold text-slate-800">
                      Below Min Order
                    </label>
                  </div>
                  <select
                    value={selectedFilters.is_below_min_order || ""} // Updated field name
                    onChange={(e) =>
                      handleSingleSelectFilterChange(
                        "is_below_min_order", // Updated field name
                        e.target.value
                      )
                    }
                    className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white font-semibold text-slate-700 hover:border-slate-300 transition-all duration-200"
                  >
                    {booleanOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-2">
                    Products below minimum order threshold
                  </p>
                </div>

                {/* Over Macy's SOQ - UPDATED FIELD NAME */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-indigo-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                    <label className="text-sm font-bold text-slate-800">
                      Over Macy's SOQ
                    </label>
                  </div>
                  <select
                    value={selectedFilters.is_over_macys_soq || ""} // Updated field name
                    onChange={(e) =>
                      handleSingleSelectFilterChange(
                        "is_over_macys_soq", // Updated field name
                        e.target.value
                      )
                    }
                    className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white font-semibold text-slate-700 hover:border-slate-300 transition-all duration-200"
                  >
                    {booleanOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-2">
                    Exceeds Macy's stock on quote
                  </p>
                </div>

                {/* Need to Review First */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-indigo-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                    <label className="text-sm font-bold text-slate-800">
                      Need to Review First
                    </label>
                  </div>
                  <select
                    value={selectedFilters.is_need_to_review_first || ""}
                    onChange={(e) =>
                      handleSingleSelectFilterChange(
                        "is_need_to_review_first",
                        e.target.value
                      )
                    }
                    className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white font-semibold text-slate-700 hover:border-slate-300 transition-all duration-200"
                  >
                    {booleanOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-2">
                    Requires management review
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Special Days Tab */}
          {activeTab === "special" && (
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar size={24} className="text-pink-600" />
                <div>
                  <h4 className="text-lg font-bold text-pink-900">
                    Holiday & Special Days
                  </h4>
                  <p className="text-sm text-pink-700">
                    Filter by seasonal and special occasion products
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specialDayFilters.map((filter) => (
                  <div
                    key={filter.key}
                    className="bg-white rounded-xl p-4 border border-pink-200 hover:shadow-md transition-all duration-200 hover:border-pink-300"
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedFilters[filter.key] === "true"}
                          onChange={(e) =>
                            handleSingleSelectFilterChange(
                              filter.key,
                              e.target.checked ? "true" : ""
                            )
                          }
                          className="w-5 h-5 text-pink-600 border-pink-300 rounded focus:ring-pink-500 focus:ring-2"
                        />
                        {selectedFilters[filter.key] === "true" && (
                          <Check
                            size={14}
                            className="absolute inset-0 m-auto text-white pointer-events-none"
                          />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-800">
                          {filter.label}
                        </span>
                        <p className="text-xs text-slate-500">
                          Products for {filter.label.toLowerCase()}
                        </p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-800">
                    Active Filters Summary
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedFilters.category?.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                  {selectedFilters.birthstone?.map((stone) => (
                    <span
                      key={stone}
                      className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                    >
                      {stone}
                    </span>
                  ))}
                  {specialDayFilters
                    .filter((f) => selectedFilters[f.key] === "true")
                    .map((f) => (
                      <span
                        key={f.key}
                        className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium"
                      >
                        {f.label}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
