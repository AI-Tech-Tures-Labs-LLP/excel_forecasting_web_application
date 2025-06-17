import React from "react";
import PropTypes from "prop-types";
import { Calendar, ChevronDown, Activity } from "lucide-react";
import MonthlyForecastTables from "./MonthlyForecastTables";

const MonthlyForecast = ({ productData, expandedSections, toggleSection }) => {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const currentYearRows = [
    { key: "ty_total_sales_units", label: "Total Sales Units" },
    { key: "ty_store_sales_units", label: "Store Sales Units" },
    { key: "ty_com_sales_units", label: "COM Sales Units" },
    {
      key: "ty_com_to_ttl_sales_pct",
      label: "COM % to TTL (Sales)",
      isPercentage: true,
    },
    { key: "ty_total_eom_oh", label: "TOTAL EOM OH" },
    { key: "ty_store_eom_oh", label: "STORE EOM OH" },
    { key: "ty_com_eom_oh", label: "COM EOH OH" },
    {
      key: "ty_com_to_ttl_eoh_pct",
      label: "COM % to TTL (EOH)",
      isPercentage: true,
    },
    { key: "ty_omni_sales_usd", label: "Omni Sales $" },
    { key: "ty_com_sales_usd", label: "COM Sales $" },
  ];

  const lastYearRows = [
    { key: "ly_total_sales_units", label: "Total Sales Units" },
    { key: "ly_store_sales_units", label: "Store Sales Units" },
    { key: "ly_com_sales_units", label: "COM Sales Units" },
    {
      key: "ly_com_to_ttl_sales_pct",
      label: "COM % to TTL (Sales)",
      isPercentage: true,
    },
    { key: "ly_total_eom_oh", label: "TOTAL EOM OH" },
    { key: "ly_store_eom_oh", label: "STORE EOM OH" },
    { key: "ly_com_eom_oh", label: "COM EOH OH" },
    {
      key: "ly_com_to_ttl_eoh_pct",
      label: "COM % to TTL (EOH)",
      isPercentage: true,
    },
    { key: "ly_omni_sales_usd", label: "Omni Sales $" },
    { key: "ly_com_sales_usd", label: "COM Sales $" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div
        className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => toggleSection("monthlyForecast")}
      >
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="text-indigo-600" size={20} />
          Monthly Forecast
        </h3>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform duration-200 ${
            expandedSections.monthlyForecast ? "rotate-180" : ""
          }`}
        />
      </div>
      {expandedSections.monthlyForecast && (
        <div className="p-6 space-y-8">
          {/* Current Year Data */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-blue-600" size={18} />
              <h4 className="text-lg font-semibold text-gray-700">
                TOTAL {currentYear}
              </h4>
            </div>
            <MonthlyForecastTables
              productData={productData}
              year={currentYear}
              forecastRows={currentYearRows}
            />
          </div>

          {/* Last Year Data */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-gray-600" size={18} />
              <h4 className="text-lg font-semibold text-gray-700">
                TOTAL {lastYear}
              </h4>
            </div>
            <MonthlyForecastTables
              productData={productData}
              year={lastYear}
              forecastRows={lastYearRows}
            />
          </div>
        </div>
      )}
    </div>
  );
};

MonthlyForecast.propTypes = {
  productData: PropTypes.object,
  expandedSections: PropTypes.object.isRequired,
  toggleSection: PropTypes.func.isRequired,
};

export default MonthlyForecast;
