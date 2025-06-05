// ForecastVariableCard.jsx
import React, { useState } from "react";
import {
  Clock,
  Calendar,
  BarChart3,
  TrendingDown,
  AlertTriangle,
  TrendingUp,
  Package,
  Box,
  Settings,
  Building2,
  MapPin,
  Gem,
  Star,
  ShoppingCart,
  Percent,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
  Calculator,
  Target,
} from "lucide-react";

// Modal Components
const RequiredQuantityModal = ({ data, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Calculator className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">
            Required EOH Quantity Calculation
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="text-white" size={24} />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Header Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Calendar className="text-blue-600" size={18} />
              {data.forecastType.toUpperCase()} Forecast - {data.forecastMonth}
            </h3>
            <p className="text-sm text-gray-600">
              Required EOH Quantity for Lead guideline month calculation
            </p>
          </div>

          {/* Formula Display */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calculator className="text-gray-600" size={16} />
              Calculation Formula
            </h4>
            <div className="bg-white rounded-lg p-4 border border-gray-300 font-mono text-sm text-gray-700">
              Required EOH for {data.forecastMonth} = KPI Door Count + Average
              COM EOM OH + FLDC
            </div>
          </div>

          {/* Component Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Building2 className="text-blue-600" size={16} />
                </div>
                <h5 className="text-sm font-semibold text-gray-700">
                  KPI Door Count
                </h5>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {data.kpiDoorCount?.toLocaleString() || "0"}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Package className="text-green-600" size={16} />
                </div>
                <h5 className="text-sm font-semibold text-gray-700">
                  Average COM EOM OH
                </h5>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {data.avgComEOMOH?.toLocaleString() || "0"}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <MapPin className="text-purple-600" size={16} />
                </div>
                <h5 className="text-sm font-semibold text-gray-700">FLDC</h5>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {data.fldc?.toLocaleString() || "0"}
              </div>
            </div>
          </div>

          {/* Calculation Steps */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
            <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Target className="text-amber-600" size={16} />
              Calculation Steps
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">KPI Door Count:</span>
                <span className="font-medium">
                  {data.kpiDoorCount?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">+ Average COM EOM OH:</span>
                <span className="font-medium">
                  {data.avgComEOMOH?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">+ FLDC:</span>
                <span className="font-medium">
                  {data.fldc?.toLocaleString() || "0"}
                </span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-gray-800">
                  Required EOH for {data.forecastMonth}:
                </span>
                <span className="text-indigo-600">
                  {(
                    (data.kpiDoorCount || 0) +
                    (data.avgComEOMOH || 0) +
                    (data.fldc || 0)
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Generic Modal for other variables
const GenericVariableModal = ({ data, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Info className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Variable Information</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="text-white" size={24} />
        </button>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {data.label}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {data.forecastType.toUpperCase()} Forecast Variable
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Current Value:</span>
              <span className="font-bold text-lg text-gray-900">
                {data.value}
              </span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              This variable is part of the {data.forecastType} forecast
              calculations. Click on other variables to see their detailed
              breakdowns and calculations.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Variable Card Configuration
const getVariableConfig = (type) => {
  const baseConfig = [
    { key: "lead_time", label: "Lead Time", icon: Clock },
    {
      key: "leadtime_holiday_adjustment",
      label: "Country Holiday",
      type: "boolean",
      icon: Calendar,
    },
    { key: "month_12_fc_index", label: "12-Month FC Index", icon: BarChart3 },
    { key: "loss", label: "Loss (%)", icon: TrendingDown },
    {
      key: "month_12_fc_index_loss",
      label: "12-Month FC Index (Loss %)",
      icon: AlertTriangle,
    },
    {
      key: "selected_months",
      label: "STD Months",
      type: "array",
      icon: Calendar,
    },
    { key: "trend", label: "Trend", type: "percentage", icon: TrendingUp },
    {
      key: "inventory_maintained",
      label: "Inventory Maintained",
      type: "boolean",
      icon: Package,
    },
    {
      key: "trend_index_difference",
      label: "Trend Index Difference",
      icon: BarChart3,
    },
    { key: "red_box_item", label: "Red Box Item", type: "boolean", icon: Box },
    { key: "forecasting_method", label: "Forecasting Method", icon: Settings },
    { key: "door_count", label: "Door Count", icon: Building2 },
    { key: "average_com_oh", label: "Average Com OH", icon: Package },
    { key: "fldc", label: "FLDC", icon: MapPin },
    { key: "birthstone", label: "Birthstone", icon: Gem },
    { key: "birthstone_month", label: "Birthstone Month", icon: Calendar },
    {
      key: "considered_birthstone_required_quantity",
      label: "Considered Birthstone",
      type: "boolean",
      icon: Gem,
    },
    { key: "forecast_month", label: "Forecast Month", icon: Calendar },
    {
      key: "forecast_month_required_quantity",
      label: "Forecast Month - Required Qty",
      icon: Package,
      clickable: true,
      modalType: "required_quantity",
    },
    {
      key: "forecast_month_planned_oh",
      label: "Forecast Month - Planned OH",
      icon: Package,
    },
    {
      key: "next_forecast_month",
      label: "Next Forecast Month",
      icon: Calendar,
    },
    {
      key: "next_forecast_month_required_quantity",
      label: "Next Forecast Month - Required Qty",
      icon: Package,
      clickable: true,
      modalType: "required_quantity",
    },
    {
      key: "next_forecast_month_planned_oh",
      label: "Next Forecast Month - Planned OH",
      icon: Package,
    },
    {
      key: "forecast_month_planned_shipment",
      label: "Forecast Month - Planned Shipment",
      icon: Package,
    },
    {
      key: "next_forecast_month_planned_shipment",
      label: "Next Forecast Month - Planned Shipment",
      icon: Package,
    },
    {
      key: "qty_added_to_maintain_OH_forecast_month",
      label: "Forecast Month - Qty Added",
      icon: Package,
    },
    {
      key: "qty_added_to_maintain_OH_next_forecast_month",
      label: "Next Forecast Month - Qty Added",
      icon: Package,
    },
    {
      key: "qty_added_to_balance_SOQ_forecast_month",
      label: "Macys SOQ - Qty Added",
      icon: Star,
    },
    { key: "total_added_qty", label: "Total Added Qty", icon: Package },
    { key: "Min_order", label: "Min Order", icon: ShoppingCart },
    {
      key: "average_store_sale_thru",
      label: "Average Store SellThru",
      type: "percentage",
      icon: TrendingUp,
    },
    { key: "Macys_SOQ", label: "Macys SOQ - Total", icon: Star },
    {
      key: "macy_SOQ_percentage",
      label: "Macys SOQ - Percentage Required",
      type: "percentage",
      icon: Percent,
    },
    {
      key: "Qty_given_to_macys",
      label: "Macys SOQ - Actual Given",
      icon: Star,
    },
    {
      key: "Below_min_order",
      label: "Below Min Order",
      type: "boolean",
      icon: AlertTriangle,
    },
    {
      key: "Over_macys_SOQ",
      label: "Over Macys SOQ",
      type: "boolean",
      icon: AlertTriangle,
    },
    {
      key: "Added_only_to_balance_macys_SOQ",
      label: "Macys SOQ - Only Maintained",
      type: "boolean",
      icon: CheckCircle,
    },
    {
      key: "Need_to_review_first",
      label: "Needs Review",
      type: "boolean",
      icon: AlertCircle,
    },
  ];

  const typeSpecific = {
    store: [],
    com: [
      {
        key: "com_month_12_fc_index",
        label: "COM 12-Month FC Index",
        icon: BarChart3,
      },
      {
        key: "com_trend",
        label: "COM Trend",
        type: "percentage",
        icon: TrendingUp,
      },
      {
        key: "minimum_required_oh_for_com",
        label: "Min Required OH for COM",
        icon: Package,
      },
      {
        key: "vdf_status",
        label: "VDF Status",
        type: "boolean",
        icon: CheckCircle,
      },
      { key: "vdf_added_qty", label: "VDF Added Qty", icon: Package },
    ],
    omni: [
      {
        key: "com_month_12_fc_index",
        label: "COM 12-Month FC Index",
        icon: BarChart3,
      },
      {
        key: "com_trend",
        label: "COM Trend",
        type: "percentage",
        icon: TrendingUp,
      },
      {
        key: "com_inventory_maintained",
        label: "COM Inventory Maintained",
        type: "boolean",
        icon: CheckCircle,
      },
      {
        key: "minimum_required_oh_for_com",
        label: "Min Required OH for COM",
        icon: Package,
      },
      { key: "com_fldc", label: "COM FLDC", icon: MapPin },
      {
        key: "store_month_12_fc_index",
        label: "Store 12-Month FC Index",
        icon: BarChart3,
      },
      {
        key: "store_month_12_fc_index_loss",
        label: "Store 12-Month FC Index Loss",
        icon: AlertTriangle,
      },
      {
        key: "store_trend",
        label: "Store Trend",
        type: "percentage",
        icon: TrendingUp,
      },
      {
        key: "store_inventory_maintained",
        label: "Store Inventory Maintained",
        type: "boolean",
        icon: CheckCircle,
      },
      { key: "store_fldc", label: "Store FLDC", icon: MapPin },
      {
        key: "trend_index_difference_com",
        label: "Trend Index Diff (COM)",
        icon: BarChart3,
      },
      {
        key: "trend_index_difference_store",
        label: "Trend Index Diff (Store)",
        icon: BarChart3,
      },
      {
        key: "forecasting_method_com",
        label: "Forecasting Method (COM)",
        icon: Settings,
      },
      {
        key: "forecasting_method_store",
        label: "Forecasting Method (Store)",
        icon: Settings,
      },
      {
        key: "forecast_month_required_quantity_total",
        label: "Total Req Qty (Forecast Month)",
        icon: Package,
        clickable: true,
        modalType: "required_quantity",
      },
      {
        key: "next_forecast_month_required_quantity_total",
        label: "Total Req Qty (Next Month)",
        icon: Package,
        clickable: true,
        modalType: "required_quantity",
      },
    ],
  };

  return [...baseConfig, ...(typeSpecific[type] || [])];
};

// Format value utility
const formatVariableValue = (value, config) => {
  if (value === null || value === undefined) return "-";

  switch (config.type) {
    case "boolean":
      return value ? "Yes" : "No";
    case "array":
      return Array.isArray(value) ? value.join(", ") : value;
    case "percentage":
      return typeof value === "number"
        ? `${(value * 100).toFixed(2)}%`
        : `${value}%`;
    default:
      const formattedValue =
        typeof value === "number" ? value.toLocaleString() : value;
      return config.suffix
        ? `${formattedValue}${config.suffix}`
        : formattedValue;
  }
};

// Individual Variable Card Component
const VariableCard = ({
  variable,
  value,
  bgColor,
  iconColor,
  forecastData,
  forecastType,
}) => {
  const [showModal, setShowModal] = useState(false);
  const IconComponent = variable.icon || Info;

  const handleCardClick = () => {
    if (!variable.clickable) return;

    if (variable.modalType === "required_quantity") {
      const forecastMonth = variable.key.includes("next")
        ? forecastData.next_forecast_month
        : forecastData.forecast_month;

      const modalData = {
        forecastType,
        forecastMonth,
        kpiDoorCount: forecastData?.door_count || 0,
        avgComEOMOH: forecastData?.average_com_oh || 0,
        fldc: forecastData?.fldc || 0,
        requiredQty: variable.key.includes("next")
          ? forecastData?.next_forecast_month_required_quantity || 0
          : forecastData?.forecast_month_required_quantity || 0,
      };

      setShowModal({ type: "required_quantity", data: modalData });
    } else {
      // Generic modal for other variables
      const modalData = {
        label: variable.label,
        value: formatVariableValue(value, variable),
        forecastType,
        key: variable.key,
      };

      setShowModal({ type: "generic", data: modalData });
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
          variable.clickable
            ? "cursor-pointer hover:border-blue-300 hover:scale-105"
            : ""
        }`}
        onClick={handleCardClick}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-1.5 ${bgColor} rounded-md`}>
              <IconComponent className={iconColor} size={14} />
            </div>
            <span className="text-xs font-medium text-gray-600 leading-tight">
              {variable.label}
            </span>
            {variable.clickable && (
              <div className="ml-auto">
                <Info className="text-blue-500" size={12} />
              </div>
            )}
          </div>
          <div className="text-sm font-bold text-gray-900">
            {variable.key === "trend_index_difference" ||
            variable.key === "loss"
              ? `${formatVariableValue(value, variable)}%`
              : formatVariableValue(value, variable)}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && showModal.type === "required_quantity" && (
        <RequiredQuantityModal
          data={showModal.data}
          onClose={() => setShowModal(false)}
        />
      )}

      {showModal && showModal.type === "generic" && (
        <GenericVariableModal
          data={showModal.data}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

// Main Forecast Variables Cards Component
const ForecastVariableCards = ({ productData }) => {
  if (!productData) return null;

  const { store_forecast, com_forecast, omni_forecast } = productData;

  const renderForecastCards = (
    forecastData,
    type,
    title,
    bgColor,
    iconColor,
    Icon
  ) => {
    if (!forecastData || !forecastData[0]) return null;

    const data = forecastData[0];
    const variables = getVariableConfig(type);

    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 ${bgColor} rounded-lg`}>
            <Icon className={iconColor} size={20} />
          </div>
          <h5 className="text-lg font-semibold text-gray-800">{title}</h5>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {variables.map((variable) => {
            const value = data[variable.key];

            return (
              <VariableCard
                key={variable.key}
                variable={variable}
                value={value}
                bgColor={bgColor}
                iconColor={iconColor}
                forecastData={data}
                forecastType={type}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {store_forecast &&
        store_forecast.length > 0 &&
        renderForecastCards(
          store_forecast,
          "store",
          "Store Forecast Variables",
          "bg-blue-50",
          "text-blue-600",
          Building2
        )}

      {com_forecast &&
        com_forecast.length > 0 &&
        renderForecastCards(
          com_forecast,
          "com",
          "COM Forecast Variables",
          "bg-green-50",
          "text-green-600",
          ShoppingCart
        )}

      {omni_forecast &&
        omni_forecast.length > 0 &&
        renderForecastCards(
          omni_forecast,
          "omni",
          "Omni Forecast Variables",
          "bg-purple-50",
          "text-purple-600",
          Package
        )}
    </div>
  );
};

export default ForecastVariableCards;
