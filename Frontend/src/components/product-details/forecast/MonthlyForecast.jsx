import React from "react";
import PropTypes from "prop-types";
import { Calendar, ChevronDown, Activity } from "lucide-react";
import MonthlyForecastTables from "./MonthlyForecastTables";

const MonthlyForecast = ({ productData, expandedSections, toggleSection }) => {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const currentYearRows = [
    { key: "TY_Unit_Sales", label: "Total Sales Units" },
    { key: "TY_store_unit_sales", label: "Store Sales Units" },
    { key: "TY_MCOM_Unit_Sales", label: "COM Sales Units" },
    {
      key: "TY_COM_to_TTL",
      label: "COM % to TTL (Sales)",
      isPercentage: true,
    },
    { key: "TY_OH_Units", label: "TOTAL EOM OH" },
    { key: "TY_store_EOM_OH", label: "STORE EOM OH" },
    { key: "TY_OH_MCOM_Units", label: "COM EOH OH" },
    {
      key: "TY_COM_to_TTL_OH",
      label: "COM % to TTL (EOH)",
      isPercentage: true,
    },
    { key: "PTD_TY_Sales", label: "Omni Sales $" },
    { key: "MCOM_PTD_TY_Sales", label: "COM Sales $" },
  ];

  const lastYearRows = [
    { key: "LY_Unit_Sales", label: "Total Sales Units" },
    { key: "LY_store_unit_sales", label: "Store Sales Units" },
    { key: "LY_MCOM_Unit_Sales", label: "COM Sales Units" },
    {
      key: "LY_COM_to_TTL",
      label: "COM % to TTL (Sales)",
      isPercentage: true,
    },
    { key: "LY_OH_Units", label: "TOTAL EOM OH" },
    { key: "LY_store_EOM_OH", label: "STORE EOM OH" },
    { key: "LY_MCOM_OH_Units", label: "COM EOH OH" },
    {
      key: "LY_COM_to_TTL_OH",
      label: "COM % to TTL (EOH)",
      isPercentage: true,
    },
    { key: "LY_PTD_Sales", label: "Omni Sales $" },
    { key: "MCOM_PTD_LY_Sales", label: "COM Sales $" },
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
