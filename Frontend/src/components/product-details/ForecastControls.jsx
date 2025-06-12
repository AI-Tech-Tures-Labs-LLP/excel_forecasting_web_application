import React from "react";
import PropTypes from "prop-types";

const ForecastControls = ({
  selectedIndex,
  setSelectedIndex,
  rollingMethod,
  setRollingMethod,
  forecastingMethod,
  setForecastingMethod,
  editableTrend,
  setEditableTrend,
  editable12MonthFC,
  setEditable12MonthFC,
  lastChangedField,
  handleFieldChange,
}) => {
  const indexOptions = [
    "BT",
    "Citrine",
    "Cross",
    "CZ",
    "Dia",
    "Ear",
    "EMER",
    "Garnet",
    "Gem",
    "GEM EAR",
    "Gold Chain",
    "GOLD EAR",
    "Amy",
    "Anklet",
    "Aqua",
    "Bridal",
    "Heart",
    "Heavy Gold Chain",
    "Jade",
    "KIDS",
    "Locket",
    "Mens Gold Bracelet",
    "Mens Misc",
    "Mens Silver chain",
    "Mom",
    "MOP",
    "Neck",
    "Onyx",
    "Opal",
    "Pearl",
    "Peridot",
    "Religious",
    "Ring",
    "Ruby",
    "Saph",
    "Womens Silver Chain",
    "Wrist",
    "Grand Total",
  ];

  const rollingMethodOptions = [
    "YTD",
    "Current MTH",
    "SPRING",
    "FALL",
    "LY FALL",
  ];

  const forecastingMethodOptions = [
    "FC By Index",
    "FC By Trend",
    "Average",
    "Current Year",
    "Last Year",
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Select Index */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Select Index
        </label>
        <select
          value={selectedIndex}
          onChange={(e) =>
            handleFieldChange("Current_FC_Index", e.target.value)
          }
          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          disabled={lastChangedField && lastChangedField !== "Current_FC_Index"}
        >
          {indexOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Rolling Method Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Rolling Method
        </label>
        <select
          value={rollingMethod}
          onChange={(e) => handleFieldChange("Rolling_method", e.target.value)}
          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          disabled={lastChangedField && lastChangedField !== "Rolling_method"}
        >
          {rollingMethodOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Forecasting Method Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Forecasting Method
        </label>
        <select
          value={forecastingMethod}
          onChange={(e) =>
            handleFieldChange("Forecasting_Method", e.target.value)
          }
          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          disabled={
            lastChangedField && lastChangedField !== "Forecasting_Method"
          }
        >
          {forecastingMethodOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Editable Trend */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Trend %
        </label>
        <input
          type="number"
          value={
            editableTrend !== "" &&
            editableTrend !== null &&
            !isNaN(editableTrend)
              ? (parseFloat(editableTrend) * 100)
                  .toFixed(2)
                  .replace(/\.00$/, "")
              : ""
          }
          onChange={(e) => {
            const percentageValue = parseFloat(e.target.value);
            if (isNaN(percentageValue)) {
              handleFieldChange("Trend", "");
            } else {
              const decimalValue = percentageValue / 100;
              handleFieldChange("Trend", decimalValue.toString());
            }
          }}
          step="any"
          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Enter any percentage (e.g., 55.75, -12.3, 0.5)"
          disabled={lastChangedField && lastChangedField !== "Trend"}
        />
      </div>

      {/* Editable 12 Month FC */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          12 Month FC
        </label>
        <input
          type="number"
          value={editable12MonthFC}
          onChange={(e) =>
            handleFieldChange("month_12_fc_index", e.target.value)
          }
          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Enter 12 month FC"
          disabled={
            lastChangedField && lastChangedField !== "month_12_fc_index"
          }
        />
      </div>
    </div>
  );
};

ForecastControls.propTypes = {
  selectedIndex: PropTypes.string.isRequired,
  setSelectedIndex: PropTypes.func.isRequired,
  rollingMethod: PropTypes.string.isRequired,
  setRollingMethod: PropTypes.func.isRequired,
  forecastingMethod: PropTypes.string.isRequired,
  setForecastingMethod: PropTypes.func.isRequired,
  editableTrend: PropTypes.string.isRequired,
  setEditableTrend: PropTypes.func.isRequired,
  editable12MonthFC: PropTypes.string.isRequired,
  setEditable12MonthFC: PropTypes.func.isRequired,
  lastChangedField: PropTypes.string,
  handleFieldChange: PropTypes.func.isRequired,
};

export default ForecastControls;
