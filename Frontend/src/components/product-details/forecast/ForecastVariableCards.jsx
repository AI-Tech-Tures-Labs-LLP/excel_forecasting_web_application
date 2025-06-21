import React, { useState } from "react";
import {
  Clock,
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  Building2,
  MapPin,
  Gem,
  ShoppingCart,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Percent,
  Box,
  Info,
  Target,
  Activity,
  Layers,
  Search,
  Grid,
  List,
  X,
  Calculator,
  Truck,
  AlertCircle,
  Check,
} from "lucide-react";

const renderMonthTags = (value) => {
  let selectedMonths = [];

  if (Array.isArray(value)) {
    selectedMonths = value;
  } else if (typeof value === "string") {
    try {
      selectedMonths = JSON.parse(value);
    } catch {
      selectedMonths = value
        .replace(/[\[\]'"\s]/g, "")
        .split(",")
        .filter(Boolean);
    }
  }

  const validMonths = selectedMonths.filter((month) => month && month.trim());

  const monthColors = {
    JAN: "bg-blue-100 text-blue-700",
    JANUARY: "bg-blue-100 text-blue-700",
    FEB: "bg-pink-100 text-pink-700",
    FEBRUARY: "bg-pink-100 text-pink-700",
    MAR: "bg-green-100 text-green-700",
    MARCH: "bg-green-100 text-green-700",
    APR: "bg-yellow-100 text-yellow-700",
    APRIL: "bg-yellow-100 text-yellow-700",
    MAY: "bg-purple-100 text-purple-700",
    JUN: "bg-indigo-100 text-indigo-700",
    JUNE: "bg-indigo-100 text-indigo-700",
    JUL: "bg-red-100 text-red-700",
    JULY: "bg-red-100 text-red-700",
    AUG: "bg-orange-100 text-orange-700",
    AUGUST: "bg-orange-100 text-orange-700",
    SEP: "bg-teal-100 text-teal-700",
    SEPTEMBER: "bg-teal-100 text-teal-700",
    OCT: "bg-amber-100 text-amber-700",
    OCTOBER: "bg-amber-100 text-amber-700",
    NOV: "bg-gray-100 text-gray-700",
    NOVEMBER: "bg-gray-100 text-gray-700",
    DEC: "bg-emerald-100 text-emerald-700",
    DECEMBER: "bg-emerald-100 text-emerald-700",
  };

  if (validMonths.length === 0) {
    return (
      <span className="text-xs text-gray-400 italic">No months selected</span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {validMonths.map((month, index) => (
        <span
          key={index}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-colors ${
            monthColors[month.trim().toUpperCase()] ||
            "bg-teal-100 text-teal-700"
          }`}
          title={month.trim()}
        >
          <Check size={10} />
          {month.trim()}
        </span>
      ))}
    </div>
  );
};

const ForecastVariableCards = ({ productData, onOpenModal }) => {
  console.log(productData);
  const attachModalConfig = (fields) => {
    const modalTypeMapping = {
      forecast_month_required_quantity: "required_quantity",
      next_forecast_month_required_quantity: "required_quantity",
      month_12_fc_index_original: "fc_index",
      new_month_12_fc_index: "fc_index",
      store_month_12_fc_index_original: "fc_index",
      com_month_12_fc_index: "fc_index",
      loss_updated: "loss",
      std_trend: "trend",
      com_trend_for_selected_month: "trend",
      store_trend: "trend",
      store_month_12_fc_index_loss: "fc_index_loss",
      qty_added_to_maintain_oh_forecast_month: "planned_shipment",
      qty_added_to_maintain_oh_next_forecast_month: "planned_shipment",
      recommended_total_quantity: "total_added_qty",
    };

    return fields.map((field) => {
      if (modalTypeMapping[field.key]) {
        return {
          ...field,
          clickable: true,
          modalType: modalTypeMapping[field.key],
          ...(field.forecastMonth === "next" && { forecastMonth: "next" }),
        };
      }
      return field;
    });
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grouped");
  const [selectedGroup, setSelectedGroup] = useState("all");

  if (!productData) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No product data available</p>
      </div>
    );
  }

  const { product_details, store_forecast, com_forecast, omni_forecast } =
    productData;
  const productType = product_details?.product_type?.toLowerCase();

  // Get data for the current product type
  const getCurrentTypeData = () => {
    switch (productType) {
      case "store":
        return store_forecast && store_forecast.length > 0
          ? store_forecast[0]
          : {};
      case "com":
        return com_forecast && com_forecast.length > 0 ? com_forecast[0] : {};
      case "omni":
        return omni_forecast && omni_forecast.length > 0
          ? omni_forecast[0]
          : {};
      default:
        return {};
    }
  };

  const currentTypeData = getCurrentTypeData();
  const allData = {
    ...currentTypeData,
    ...product_details, // Override only if exists
  };

  const getVariableConfigByType = (type) => {
    switch (type) {
      case "store": {
        const storeConfigRaw = [
          {
            key: "vendor_name",
            label: "Vendor",
            icon: Truck,
            groupKey: "leadtime",
          },
          {
            key: "country",
            label: "Country",
            icon: MapPin,
            groupKey: "leadtime",
          },
          {
            key: "lead_time",
            label: "Lead Time",
            icon: Clock,

            groupKey: "leadtime",
          },

          // Trend and Index Calculation
          {
            key: "selected_months",
            label: "STD Months",
            icon: Calendar,
            groupKey: "trends_index",
            type: "array",
          },

          {
            key: "month_12_fc_index_original",
            label: "12-Month FC Index",
            icon: BarChart3,
            groupKey: "trends_index",
          },
          {
            key: "loss_updated",
            label: "Loss (%)",
            icon: TrendingDown,
            groupKey: "trends_index",
            type: "percentage",
          },
          {
            key: "new_month_12_fc_index",
            label: "12-Month FC Index (Loss %)",
            icon: TrendingDown,
            groupKey: "trends_index",
          },
          {
            key: "std_trend",
            label: "Trend",
            icon: TrendingUp,
            groupKey: "trends_index",
            type: "trend",
          },

          // Selecting Forecasting Method
          {
            key: "is_inventory_maintained",
            label: "Inventory Maintained",
            icon: Box,
            groupKey: "forecasting_method",
            type: "boolean",
          },
          {
            key: "trend_index_difference",
            label: "Trend Index Difference",
            icon: BarChart3,
            groupKey: "forecasting_method",
            type: "raw_percentage",
          },
          {
            key: "is_red_box_item",
            label: "Red Box Item",
            icon: AlertTriangle,
            groupKey: "forecasting_method",
            type: "boolean",
          },
          {
            key: "forecasting_method",
            label: "Forecasting Method",
            icon: Settings,
            groupKey: "forecasting_method",
          },

          // Required Qty for Forecast Month
          {
            key: "forecast_month",
            label: "Forecast Month",
            icon: Calendar,
            groupKey: "forecast_month_req",
          },
          {
            key: "kpi_door_count",
            label: "Door Count",
            icon: Building2,
            groupKey: "forecast_month_req",
          },
          {
            key: "average_com_oh",
            label: "Average COM OH",
            icon: Box,
            groupKey: "forecast_month_req",
          },
          {
            key: "fldc",
            label: "FLDC",
            icon: MapPin,
            groupKey: "forecast_month_req",
          },
          // {
          //   key: "birthstone",
          //   label: "Birthstone",
          //   icon: Gem,
          //   groupKey: "forecast_month_req",
          // },
          // {
          //   key: "birthstone_month",
          //   label: "Birthstone Month",
          //   icon: Calendar,
          //   groupKey: "forecast_month_req",
          // },
          {
            key: "is_considered_birthstone",
            label: "Considered Birthstone",
            icon: Gem,
            groupKey: "forecast_month_req",
            type: "boolean",
          },
          {
            key: "forecast_month_required_quantity",
            label: "Forecast Month - Required Quantity",
            icon: Target,
            groupKey: "forecast_month_req",
            clickable: true,
            modalType: "required_quantity",
          },

          // Required Qty for Next Forecast Month
          {
            key: "next_forecast_month",
            label: "Next Forecast Month",
            icon: Calendar,
            groupKey: "next_forecast_month_req",
          },
          {
            key: "next_forecast_month_required_quantity",
            label: "Next Forecast Month - Required Quantity",
            icon: Target,
            groupKey: "next_forecast_month_req",
            clickable: true,
            modalType: "required_quantity",
            forecastMonth: "next",
          },

          // Planned Shipment
          {
            key: "forecast_month_planned_oh_before",
            label: "Forecast Month - Planned OH (Before Added Qty)",
            icon: Package,
            groupKey: "planned_shipment",
          },
          {
            key: "forecast_month_required_quantity",
            label: "Forecast Month - Required Quantity",
            icon: Target,
            groupKey: "planned_shipment",
          },
          {
            key: "qty_added_to_maintain_oh_forecast_month",
            label: "Forecast Month - Planned Shipment",
            icon: Truck,
            groupKey: "planned_shipment",
          },

          // Next Planned Shipment
          {
            key: "next_forecast_month_planned_oh_before",
            label: "Next Forecast Month - Planned OH (Before Added Qty)",
            icon: Package,
            groupKey: "next_planned_shipment",
          },
          {
            key: "next_forecast_month_required_quantity",
            label: "Next Forecast Month - Required Quantity",
            icon: Target,
            groupKey: "next_planned_shipment",
          },
          {
            key: "qty_added_to_maintain_oh_next_forecast_month",
            label: "Next Forecast Month - Planned Shipment",
            icon: Truck,
            groupKey: "next_planned_shipment",
          },

          // Macy's SOQ
          {
            key: "macys_proj_receipt_upto_forecast_month",
            label: "Macys SOQ - Total",
            icon: Star,
            groupKey: "macys_soq",
          },
          {
            key: "qty_given_to_macys",
            label: "Macys SOQ - Actual Given",
            icon: Star,
            groupKey: "macys_soq",
          },
          {
            key: "macy_soq_percentage",
            label: "Macys SOQ - Percentage Required",
            icon: Percent,
            groupKey: "macys_soq",
            type: "percentage",
          },
          {
            key: "qty_added_to_balance_soq_forecast_month",
            label: "Macys SOQ - Qty Added",
            icon: Star,
            groupKey: "macys_soq",
          },
          // Final Qty
          {
            key: "qty_added_to_maintain_oh_forecast_month",
            label: "Qty Added Forecast Month - Maintain OH",
            icon: Star,
            groupKey: "final_qty",
          },
          {
            key: "qty_added_to_maintain_oh_next_forecast_month",
            label: "Qty Added Next Forecast Month - Maintain OH",
            icon: Star,
            groupKey: "final_qty",
          },
          {
            key: "qty_added_to_balance_soq_forecast_month",
            label: "Macys SOQ - Qty Added",
            icon: Star,
            groupKey: "final_qty",
          },

          {
            key: "min_order",
            label: "Min Order",
            icon: Package,
            groupKey: "final_qty",
          },
          {
            key: "recommended_total_quantity",
            label: "Total Added Qty",
            icon: Calculator,
            groupKey: "final_qty",
          },
          {
            key: "is_need_to_review_first",
            label: "Needs Review (Below Planned OH)",
            icon: AlertTriangle,
            groupKey: "final_qty",
            type: "boolean",
          },
          {
            key: "is_added_only_to_balance_macys_soq",
            label: "Qty Added Only Macy Rule",
            icon: Star,
            groupKey: "final_qty",
            type: "boolean",
          },
          {
            key: "is_over_macys_soq",
            label: "Over Macys SOQ",
            icon: AlertCircle,
            groupKey: "final_qty",
            type: "boolean",
          },
          {
            key: "is_below_min_order",
            label: "Below Min Order",
            icon: AlertTriangle,
            groupKey: "final_qty",
            type: "boolean",
          },
        ];
        return attachModalConfig(storeConfigRaw);
      }
      case "com": {
        const comConfigRaw = [
          {
            key: "vendor_name",
            label: "Vendor",
            icon: Truck,
            groupKey: "leadtime",
          },
          {
            key: "country",
            label: "Country",
            icon: MapPin,
            groupKey: "leadtime",
          },
          {
            key: "lead_time",
            label: "Lead Time",
            icon: Clock,
            groupKey: "leadtime",
          },

          // Trend and Index Calculation
          {
            key: "selected_months",
            label: "STD Months",
            icon: Calendar,
            groupKey: "trends_index",
          },
          {
            key: "new_month_12_fc_index",
            label: "12-Month FC Index COM",
            icon: BarChart3,
            groupKey: "trends_index",
          },
          {
            key: "com_trend_for_selected_month",
            label: "Trend",
            icon: TrendingUp,
            groupKey: "trends_index",
            type: "trend",
          },

          // Selecting Forecasting Method
          {
            key: "is_com_inventory_maintained",
            label: "Inventory Maintained",
            icon: Box,
            groupKey: "forecasting_method",
            type: "boolean",
          },
          {
            key: "trend_index_difference",
            label: "Trend Index Difference",
            icon: BarChart3,
            groupKey: "forecasting_method",
            type: "raw_percentage",
          },
          {
            key: "is_red_box_item",
            label: "Red Box Item",
            icon: AlertTriangle,
            groupKey: "forecasting_method",
            type: "boolean",
          },
          {
            key: "forecasting_method",
            label: "Forecasting Method",
            icon: Settings,
            groupKey: "forecasting_method",
          },

          // Required Qty for Forecast Month
          {
            key: "forecast_month",
            label: "Forecast Month",
            icon: Calendar,
            groupKey: "forecast_month_req",
          },
          {
            key: "minimum_required_oh_for_com",
            label: "COM Average Maintain Value",
            icon: Box,
            groupKey: "forecast_month_req",
          },
          {
            key: "fldc",
            label: "COM FLDC",
            icon: Box,
            groupKey: "forecast_month_req",
          },
          {
            key: "forecast_month_required_quantity",
            label: "Forecast Month - Required Quantity",
            icon: Target,
            groupKey: "forecast_month_req",
            clickable: true,
            modalType: "required_quantity",
          },

          // Required Qty for Next Forecast Month
          {
            key: "next_forecast_month",
            label: "Next Forecast Month",
            icon: Calendar,
            groupKey: "next_forecast_month_req",
          },
          {
            key: "next_forecast_month_required_quantity",
            label: "Next Forecast Month - Required Quantity",
            icon: Target,
            groupKey: "next_forecast_month_req",
            clickable: true,
            modalType: "required_quantity",
            forecastMonth: "next",
          },

          // Planned Shipment
          {
            key: "forecast_month_planned_oh_before",
            label: "Forecast Month - Planned OH (Before Added Qty)",
            icon: Package,
            groupKey: "planned_shipment",
          },
          {
            key: "forecast_month_required_quantity",
            label: "Forecast Month - Required Quantity",
            icon: Target,
            groupKey: "planned_shipment",
          },
          {
            key: "qty_added_to_maintain_oh_forecast_month",
            label: "Forecast Month - Planned Shipment",
            icon: Truck,
            groupKey: "planned_shipment",
          },

          // Next Planned Shipment
          {
            key: "next_forecast_month_planned_oh_before",
            label: "Next Forecast Month - Planned OH (Before Added Qty)",
            icon: Package,
            groupKey: "next_planned_shipment",
          },
          {
            key: "next_forecast_month_required_quantity",
            label: "Next Forecast Month - Required Quantity",
            icon: Target,
            groupKey: "next_planned_shipment",
          },
          {
            key: "qty_added_to_maintain_oh_next_forecast_month",
            label: "Next Forecast Month - Planned Shipment",
            icon: Truck,
            groupKey: "next_planned_shipment",
          },

          // Macy's SOQ
          {
            key: "macys_proj_receipt_upto_forecast_month",
            label: "Macys SOQ - Total",
            icon: Star,
            groupKey: "macys_soq",
          },
          {
            key: "qty_given_to_macys",
            label: "Macys SOQ - Actual Given",
            icon: Star,
            groupKey: "macys_soq",
          },
          {
            key: "macy_soq_percentage",
            label: "Macys SOQ - Percentage Required",
            icon: Percent,
            groupKey: "macys_soq",
            type: "percentage",
          },
          {
            key: "qty_added_to_balance_soq_forecast_month",
            label: "Macys SOQ - Qty Added",
            icon: Star,
            groupKey: "macys_soq",
          },
          // Final Qty
          {
            key: "qty_added_to_maintain_oh_forecast_month",
            label: "Qty Added Forecast Month - Maintain OH",
            icon: Star,
            groupKey: "final_qty",
          },
          {
            key: "qty_added_to_maintain_oh_next_forecast_month",
            label: "Qty Added Next Forecast Month - Maintain OH",
            icon: Star,
            groupKey: "final_qty",
          },
          {
            key: "qty_added_to_balance_soq_forecast_month",
            label: "Macys SOQ - Qty Added",
            icon: Star,
            groupKey: "final_qty",
          },

          {
            key: "min_order",
            label: "Min Order",
            icon: Package,
            groupKey: "final_qty",
          },
          {
            key: "recommended_total_quantity",
            label: "Total Added Qty",
            icon: Calculator,
            groupKey: "final_qty",
          },
          {
            key: "is_need_to_review_first",
            label: "Needs Review (Below Planned OH)",
            icon: AlertTriangle,
            groupKey: "final_qty",
            type: "boolean",
          },
          {
            key: "is_added_only_to_balance_macys_soq",
            label: "Qty Added Only Macy Rule",
            icon: Star,
            groupKey: "final_qty",
            type: "boolean",
          },
          {
            key: "is_over_macys_soq",
            label: "Over Macys SOQ",
            icon: AlertCircle,
            groupKey: "final_qty",
            type: "boolean",
          },
          {
            key: "is_below_min_order",
            label: "Below Min Order",
            icon: AlertTriangle,
            groupKey: "final_qty",
            type: "boolean",
          },
        ];
        return attachModalConfig(comConfigRaw);
      }
      case "omni": {
        const omniConfigRaw = [
          // Lead Time Calculation
          {
            key: "vendor_name",
            label: "Vendor",
            icon: Truck,
            groupKey: "leadtime",
          },
          {
            key: "country",
            label: "Country",
            icon: MapPin,
            groupKey: "leadtime",
          },
          {
            key: "lead_time",
            label: "Lead Time",
            icon: Clock,
            groupKey: "leadtime",
          },

          // Trend and Index Calculation - Store
          {
            key: "selected_months",
            label: "STD Months (Store)",
            icon: Calendar,
            groupKey: "trends_index",
          },
          {
            key: "store_month_12_fc_index_original",
            label: "12-Month FC Index (Store)",
            icon: BarChart3,
            groupKey: "trends_index",
          },
          {
            key: "loss_updated",
            label: "Loss (%)",
            icon: TrendingDown,
            groupKey: "trends_index",
            type: "percentage",
          },
          {
            key: "store_month_12_fc_index_loss",
            label: "12-Month FC Index (Loss %) (Store)",
            icon: TrendingDown,
            groupKey: "trends_index",
          },
          {
            key: "store_trend",
            label: "Trend (Store)",
            icon: TrendingUp,
            groupKey: "trends_index",
            type: "trend",
          },

          // Trend and Index Calculation - COM
          {
            key: "com_month_12_fc_index",
            label: "12-Month FC Index (COM)",
            icon: BarChart3,
            groupKey: "trends_index",
          },
          {
            key: "com_trend_for_selected_month",
            label: "Trend (COM)",
            icon: TrendingUp,
            groupKey: "trends_index",
            type: "trend",
          },

          // Selecting Forecasting Method - Store
          {
            key: "is_red_box_item",
            label: "Red Box Item",
            icon: AlertTriangle,
            groupKey: "forecasting_method",
            type: "boolean",
          },
          {
            key: "is_store_inventory_maintained",
            label: "Inventory Maintained (Store)",
            icon: Box,
            groupKey: "forecasting_method",
            type: "boolean",
          },
          {
            key: "trend_index_difference_store",
            label: "Trend Index Difference (Store)",
            icon: BarChart3,
            groupKey: "forecasting_method",
            type: "raw_percentage",
          },
          {
            key: "forecasting_method_for_store",
            label: "Forecasting Method (Store)",
            icon: Settings,
            groupKey: "forecasting_method",
          },

          // Selecting Forecasting Method - COM
          {
            key: "is_com_inventory_maintained",
            label: "Inventory Maintained (COM)",
            icon: Box,
            groupKey: "forecasting_method",
            type: "boolean",
          },
          {
            key: "trend_index_difference_com",
            label: "Trend Index Difference (COM)",
            icon: BarChart3,
            groupKey: "forecasting_method",
            type: "raw_percentage",
          },
          {
            key: "forecasting_method_for_com",
            label: "Forecasting Method (COM)",
            icon: Settings,
            groupKey: "forecasting_method",
          },

          // Required Qty for Forecast Month
          {
            key: "forecast_month",
            label: "Forecast Month",
            icon: Calendar,
            groupKey: "forecast_month_req",
          },
          {
            key: "kpi_door_count",
            label: "Door Count (Store)",
            icon: Building2,
            groupKey: "forecast_month_req",
          },
          {
            key: "store_fldc",
            label: "FLDC (Store)",
            icon: MapPin,
            groupKey: "forecast_month_req",
          },
          // {
          //   key: "birthstone",
          //   label: "Birthstone",
          //   icon: Gem,
          //   groupKey: "forecast_month_req",
          // },
          // {
          //   key: "birthstone_month",
          //   label: "Birthstone Month",
          //   icon: Calendar,
          //   groupKey: "forecast_month_req",
          // },
          {
            key: "is_considered_birthstone",
            label: "Considered Birthstone",
            icon: Gem,
            groupKey: "forecast_month_req",
            type: "boolean",
          },
          {
            key: "forecast_month_required_quantity_store",
            label: "Forecast Month - Required Quantity (Store)",
            icon: Target,
            groupKey: "forecast_month_req",
          },
          {
            key: "minimum_required_oh_for_com",
            label: "COM Average Maintain Value",
            icon: Box,
            groupKey: "forecast_month_req",
          },
          {
            key: "com_fldc",
            label: "FLDC (COM)",
            icon: MapPin,
            groupKey: "forecast_month_req",
          },
          {
            key: "forecast_month_required_quantity_com",
            label: "Forecast Month - Required Quantity (COM)",
            icon: Target,
            groupKey: "forecast_month_req",
          },
          {
            key: "forecast_month_required_quantity",
            label: "Forecast Month - Required Quantity (Combined)",
            icon: Target,
            groupKey: "forecast_month_req",
            clickable: true,
            modalType: "required_quantity",
          },

          // Required Qty for Next Forecast Month
          {
            key: "next_forecast_month",
            label: "Next Forecast Month",
            icon: Calendar,
            groupKey: "next_forecast_month_req",
          },
          {
            key: "next_forecast_month_required_quantity_store",
            label: "Next Forecast Month - Required Quantity (Store)",
            icon: Target,
            groupKey: "next_forecast_month_req",
          },
          {
            key: "next_forecast_month_required_quantity_com",
            label: "Next Forecast Month - Required Quantity (COM)",
            icon: Target,
            groupKey: "next_forecast_month_req",
          },
          {
            key: "next_forecast_month_required_quantity",
            label: "Next Forecast Month - Required Quantity (Combined)",
            icon: Target,
            groupKey: "next_forecast_month_req",
            clickable: true,
            modalType: "required_quantity",
            forecastMonth: "next",
          },

          // Planned Shipment
          {
            key: "forecast_month_planned_oh_before",
            label: "Forecast Month - Planned OH (Before Added Qty)",
            icon: Package,
            groupKey: "planned_shipment",
          },
          {
            key: "forecast_month_required_quantity",
            label: "Next Forecast Month - Required Quantity",
            icon: Target,
            groupKey: "planned_shipment",
          },
          {
            key: "qty_added_to_maintain_oh_forecast_month",
            label: "Forecast Month - Planned Shipment",
            icon: Truck,
            groupKey: "planned_shipment",
          },

          // Next Planned Shipment
          {
            key: "next_forecast_month_planned_oh_before",
            label: "Next Forecast Month - Planned OH (Before Added Qty)",
            icon: Package,
            groupKey: "next_planned_shipment",
          },
          {
            key: "next_forecast_month_required_quantity",
            label: "Next Forecast Month - Required Quantity",
            icon: Target,
            groupKey: "next_planned_shipment",
          },
          {
            key: "qty_added_to_maintain_oh_next_forecast_month",
            label: "Next Forecast Month - Planned Shipment",
            icon: Truck,
            groupKey: "next_planned_shipment",
          },

          // Macy's SOQ
          {
            key: "macys_proj_receipt_upto_forecast_month",
            label: "Macys SOQ - Total",
            icon: Star,
            groupKey: "macys_soq",
          },
          {
            key: "qty_given_to_macys",
            label: "Macys SOQ - Actual Given",
            icon: Star,
            groupKey: "macys_soq",
          },
          {
            key: "macy_soq_percentage",
            label: "Macys SOQ - Percentage Required",
            icon: Percent,
            groupKey: "macys_soq",
            type: "percentage",
          },
          {
            key: "qty_added_to_balance_soq_forecast_month",
            label: "Macys SOQ - Qty Added",
            icon: Star,
            groupKey: "macys_soq",
          },
          // Final Qty
          {
            key: "qty_added_to_maintain_oh_forecast_month",
            label: "Qty Added Forecast Month - Maintain OH",
            icon: Star,
            groupKey: "final_qty",
          },
          {
            key: "qty_added_to_maintain_oh_next_forecast_month",
            label: "Qty Added Next Forecast Month - Maintain OH",
            icon: Star,
            groupKey: "final_qty",
          },
          {
            key: "qty_added_to_balance_soq_forecast_month",
            label: "Macys SOQ - Qty Added",
            icon: Star,
            groupKey: "final_qty",
          },

          {
            key: "min_order",
            label: "Min Order",
            icon: Package,
            groupKey: "final_qty",
          },
          {
            key: "recommended_total_quantity",
            label: "Total Added Qty",
            icon: Calculator,
            groupKey: "final_qty",
          },
          {
            key: "is_need_to_review_first",
            label: "Needs Review (Below Planned OH)",
            icon: AlertTriangle,
            groupKey: "final_qty",
            type: "boolean",
          },
          {
            key: "is_added_only_to_balance_macys_soq",
            label: "Qty Added Only Macy Rule",
            icon: Star,
            groupKey: "final_qty",
            type: "boolean",
          },
          {
            key: "is_over_macys_soq",
            label: "Over Macys SOQ",
            icon: AlertCircle,
            groupKey: "final_qty",
            type: "boolean",
          },
          {
            key: "is_below_min_order",
            label: "Below Min Order",
            icon: AlertTriangle,
            groupKey: "final_qty",
            type: "boolean",
          },
        ];
        return attachModalConfig(omniConfigRaw);
      }
      default:
        return [];
    }
  };

  const variableConfigs = getVariableConfigByType(productType);

  // Show all variables regardless of data availability
  const availableVariables = variableConfigs;

  if (availableVariables.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <p className="text-gray-600">
          No forecast variables defined for this {productType?.toUpperCase()}{" "}
          product
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Product Type: {productType?.toUpperCase() || "Unknown"}
        </p>
      </div>
    );
  }

  // Define variable groups
  const variableGroups = {
    leadtime: {
      title: "Lead Time Calculation",
      icon: Clock,
      color: "blue",
    },
    trends_index: {
      title: "Trend And Index Calculation",
      icon: BarChart3,
      color: "purple",
    },
    forecasting_method: {
      title: "Selecting Forecasting Method",
      icon: Settings,
      color: "indigo",
    },
    forecast_month_req: {
      title: "Required Qty For Forecast Month",
      icon: Target,
      color: "green",
    },
    next_forecast_month_req: {
      title: "Required Qty For Next Forecast Month",
      icon: Calendar,
      color: "emerald",
    },
    planned_shipment: {
      title: "Planned Shipment",
      icon: Truck,
      color: "cyan",
    },
    next_planned_shipment: {
      title: "Next Planned Shipment",
      icon: Package,
      color: "teal",
    },
    macys_soq: {
      title: "Macy's SOQ",
      icon: Star,
      color: "yellow",
    },
    final_qty: {
      title: "Final Qty",
      icon: Calculator,
      color: "red",
    },
  };

  // Color schemes for each group
  const colorSchemes = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200",
    },
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-200",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },
    cyan: {
      bg: "bg-cyan-50",
      text: "text-cyan-600",
      border: "border-cyan-200",
    },
    teal: {
      bg: "bg-teal-50",
      text: "text-teal-600",
      border: "border-teal-200",
    },
    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-200",
    },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  };

  // Modal Component for Required Quantity Calculation
  const RequiredQuantityModal = ({
    isOpen,
    onClose,
    data,
    type,
    forecastMonth,
  }) => {
    if (!isOpen) return null;

    const doorCount = data?.kpi_door_count || 0;
    const averageComOh = data?.average_com_oh || 0;
    const fldc = data?.fldc || 0;
    const requiredQuantity = data?.forecast_month_required_quantity || 0;

    const nextForecastMonth = data?.next_forecast_month || "Unknown";
    const nextRequiredQuantity =
      data?.next_forecast_month_required_quantity || 0;
    const currentForecastMonth = data?.forecast_month || "Unknown";

    const displayMonth =
      forecastMonth === "next" ? nextForecastMonth : currentForecastMonth;
    const displayRequiredQuantity =
      forecastMonth === "next" ? nextRequiredQuantity : requiredQuantity;

    const calculatedSum = doorCount + averageComOh + fldc;

    const getTypeColor = () => {
      switch (type) {
        case "store":
          return {
            bg: "bg-blue-50",
            text: "text-blue-600",
            border: "border-blue-200",
          };
        case "com":
          return {
            bg: "bg-green-50",
            text: "text-green-600",
            border: "border-green-200",
          };
        case "omni":
          return {
            bg: "bg-purple-50",
            text: "text-purple-600",
            border: "border-purple-200",
          };
        default:
          return {
            bg: "bg-gray-50",
            text: "text-gray-600",
            border: "border-gray-200",
          };
      }
    };

    const colors = getTypeColor();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <Calculator className="text-white" size={24} />
                </div>
                <h2 className="text-xl font-bold">
                  Required EOH Quantity Calculation
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="text-white" size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div
              className={`${colors.bg} border ${colors.border} rounded-lg p-4`}
            >
              <div className="flex items-center gap-3 mb-2">
                {type === "store" && (
                  <Building2 className={colors.text} size={20} />
                )}
                {type === "com" && (
                  <ShoppingCart className={colors.text} size={20} />
                )}
                {type === "omni" && (
                  <Layers className={colors.text} size={20} />
                )}
                <h3 className="font-semibold text-gray-800">
                  {type?.toUpperCase()} Forecast - {displayMonth}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Required EOH Quantity for Lead guideline month calculation
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="text-gray-600" size={20} />
                <h4 className="font-semibold text-gray-800">
                  Calculation Formula
                </h4>
              </div>
              <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
                Required EOH for {displayMonth} = KPI Door Count + Average COM
                EOM OH + FLDC
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="text-blue-600" size={16} />
                  <span className="font-medium text-blue-700">
                    KPI Door Count
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {doorCount.toLocaleString()}
                </div>
              </div>

              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="text-green-600" size={16} />
                  <span className="font-medium text-green-700">
                    Average COM EOM OH
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-800">
                  {averageComOh.toLocaleString()}
                </div>
              </div>

              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-purple-600" size={16} />
                  <span className="font-medium text-purple-700">FLDC</span>
                </div>
                <div className="text-2xl font-bold text-purple-800">
                  {fldc.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-gray-600" size={20} />
                <h4 className="font-semibold text-gray-800">
                  Calculation Steps
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">KPI Door Count:</span>
                  <span className="font-medium">
                    {doorCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">+ Average COM EOM OH:</span>
                  <span className="font-medium">
                    {averageComOh.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">+ FLDC:</span>
                  <span className="font-medium">{fldc.toLocaleString()}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between items-center py-2 bg-emerald-50 px-3 rounded-md">
                  <span className="font-semibold text-emerald-800">
                    Required EOH for {displayMonth}:
                  </span>
                  <span className="text-xl font-bold text-emerald-800">
                    {calculatedSum.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {calculatedSum !== displayRequiredQuantity &&
              displayRequiredQuantity > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className="text-yellow-600 mt-0.5"
                      size={16}
                    />
                    <div>
                      <h5 className="font-medium text-yellow-800 mb-1">
                        Calculation Note
                      </h5>
                      <p className="text-yellow-700 text-sm">
                        Calculated value ({calculatedSum.toLocaleString()})
                        differs from stored value (
                        {displayRequiredQuantity.toLocaleString()}). This may
                        indicate additional factors in the actual calculation.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="text-blue-600 mt-0.5" size={16} />
                <div>
                  <h5 className="font-medium text-blue-800 mb-1">
                    About This Calculation
                  </h5>
                  <p className="text-blue-700 text-sm">
                    The Required EOH (End of Hand) quantity represents the
                    minimum inventory level needed at the end of the forecast
                    month to maintain adequate stock levels across all
                    locations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    data: null,
    forecastMonth: null,
  });

  const openRequiredQuantityModal = (data, type, forecastMonth = "current") => {
    setModalState({ isOpen: true, type, data, forecastMonth });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      data: null,
      forecastMonth: null,
    });
  };

  const handleVariableClick = (variable, value, data, type) => {
    console.log("=== Variable Click Debug ===");
    console.log("Variable:", variable.key);
    console.log("Is clickable:", variable.clickable);
    console.log("Modal type:", variable.modalType);
    console.log("onOpenModal exists:", !!onOpenModal);
    console.log("Data:", data);
    console.log("Type:", type);

    if (variable.clickable) {
      if (onOpenModal) {
        console.log("Calling onOpenModal...");
        onOpenModal(data, type, variable.modalType, variable.forecastMonth);
      } else {
        console.log("No onOpenModal, using fallback...");
        if (variable.modalType === "required_quantity") {
          openRequiredQuantityModal(data, type, variable.forecastMonth);
        }
      }
    } else {
      console.log("Variable is not clickable");
    }
  };
  const formatVariableValue = (value, config, productDetailsFallback = {}) => {
    if (value === null || value === undefined) {
      // Try to fallback to productDetails
      const fallbackValue = productDetailsFallback[config.key];
      if (fallbackValue !== null && fallbackValue !== undefined) {
        value = fallbackValue;
      } else {
        return "No Details";
      }
    }

    switch (config.type) {
      case "boolean":
        return value ? "Yes" : "No";
      case "array":
        if (typeof value === "string") {
          try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) && parsed.length > 0
              ? parsed.join(", ")
              : "No Details";
          } catch {
            return value;
          }
        }
        return Array.isArray(value) && value.length > 0
          ? value.join(", ")
          : "No Details";
      case "percentage":
        if (config.key === "loss" && value === 0) return "0%";
        return typeof value === "number"
          ? `${(value * 100).toFixed(2)}%`
          : `${value}%`;
      case "trend":
        return typeof value === "number"
          ? `${(value * 100).toFixed(1)}%`
          : `${value}%`;
      case "raw_percentage":
        return typeof value === "number" ? `${value.toFixed(2)}%` : `${value}%`;
      default:
        const formattedValue =
          typeof value === "number" ? value.toLocaleString() : value;

        if (
          config.key === "macy_soq_percentage" ||
          config.key === "average_store_sale_thru"
        ) {
          return typeof value === "number"
            ? `${(value * 100).toFixed(2)}%`
            : `${value}%`;
        }

        return config.suffix
          ? `${formattedValue}${config.suffix}`
          : formattedValue;
    }
  };

  // Filter variables based on search
  const getFilteredVariables = (variables) => {
    return variables.filter((variable) => {
      const value = allData[variable.key];
      const matchesSearch =
        !searchQuery ||
        variable.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        variable.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(value !== null && value !== undefined ? value : "No Details")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesGroup =
        selectedGroup === "all" || selectedGroup === variable.groupKey;

      return matchesSearch && matchesGroup;
    });
  };

  // Render individual variable card
  const renderVariableCard = (
    variable,
    value,
    data,
    bgColor,
    iconColor,
    type,
    productDetailsFallback
  ) => {
    const IconComponent = variable.icon || Info;
    const isDataMissing = value === null || value === undefined;

    return (
      <div
        key={variable.key}
        className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
          variable.clickable
            ? "cursor-pointer hover:border-blue-300 hover:scale-105"
            : ""
        } ${isDataMissing ? "opacity-75" : ""}`}
        onClick={() => handleVariableClick(variable, value, data, type)}
      >
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className={`p-1.5 ${bgColor} rounded-md flex-shrink-0`}>
              <IconComponent className={iconColor} size={14} />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-gray-600 leading-tight block">
                {variable.label}
              </span>
              {viewMode === "flat" && variable.groupKey && (
                <span className="text-xs text-gray-400 mt-1 block">
                  {variableGroups[variable.groupKey]?.title || "Other"}
                </span>
              )}
            </div>
            {variable.clickable && (
              <div className="ml-auto">
                <Info className="text-blue-500" size={12} />
              </div>
            )}
          </div>

          <div
            className={`text-sm font-bold break-words ${
              isDataMissing ? "text-gray-400" : "text-gray-900"
            }`}
          >
            {variable.key === "selected_months"
              ? renderMonthTags(value)
              : formatVariableValue(value, variable, product_details)}
          </div>

          {/* Visual indicators */}
          {isDataMissing && (
            <div className="mt-2 flex justify-end">
              <AlertCircle className="text-gray-400" size={16} />
            </div>
          )}

          {variable.type === "boolean" && !isDataMissing && (
            <div className="mt-2 flex justify-end">
              {value ? (
                <CheckCircle className="text-green-500" size={16} />
              ) : (
                <XCircle className="text-red-500" size={16} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const filteredVariables = getFilteredVariables(availableVariables);

  // Group variables by their group key
  const groupedVariables = {};
  filteredVariables.forEach((variable) => {
    const groupKey = variable.groupKey || "other";
    if (!groupedVariables[groupKey]) {
      groupedVariables[groupKey] = [];
    }
    groupedVariables[groupKey].push(variable);
  });

  const visibleGroups = Object.keys(groupedVariables).filter(
    (groupKey) => groupedVariables[groupKey].length > 0
  );

  if (visibleGroups.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No variables match your search criteria</p>
      </div>
    );
  }

  // Get available groups for filter
  const getAvailableGroups = () => {
    const allGroups = new Set(
      availableVariables.map((v) => v.groupKey).filter(Boolean)
    );
    return [
      { value: "all", label: "All Groups" },
      ...Array.from(allGroups).map((groupKey) => ({
        value: groupKey,
        label: variableGroups[groupKey]?.title || groupKey,
      })),
    ];
  };

  const availableGroups = getAvailableGroups();

  // Get title and color based on product type
  const getTypeInfo = () => {
    switch (productType) {
      case "store":
        return {
          title: "Store Forecast Variables",
          color: "blue",
          icon: Building2,
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
        };
      case "com":
        return {
          title: "COM Forecast Variables",
          color: "green",
          icon: ShoppingCart,
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
        };
      case "omni":
        return {
          title: "Omni Forecast Variables",
          color: "purple",
          icon: Layers,
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600",
        };
      default:
        return {
          title: "Forecast Variables",
          color: "gray",
          icon: BarChart3,
          bgColor: "bg-gray-50",
          iconColor: "text-gray-600",
        };
    }
  };

  const typeInfo = getTypeInfo();
  const TypeIcon = typeInfo.icon;

  return (
    <div className="space-y-8">
      <RequiredQuantityModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        data={modalState.data}
        type={modalState.type}
        forecastMonth={modalState.forecastMonth}
      />

      {/* Header with Controls */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-git4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {typeInfo.title}
              </h1>
              <p className="text-gray-600">
                Product Type: {productType?.toUpperCase() || "Unknown"} •{" "}
                {filteredVariables.length} variables
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search variables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-64"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex bg-white rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewMode("grouped")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === "grouped"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Grid size={16} />
                Grouped
              </button>
              <button
                onClick={() => setViewMode("flat")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === "flat"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <List size={16} />
                List
              </button>
            </div>

            {availableGroups.length > 1 && (
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {availableGroups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 ${typeInfo.bgColor} rounded-xl`}>
            <TypeIcon className={typeInfo.iconColor} size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {typeInfo.title}
            </h2>
            <p className="text-gray-600">
              {filteredVariables.length} variables found
            </p>
          </div>
        </div>

        {viewMode === "grouped" ? (
          <div className="space-y-8">
            {visibleGroups.map((groupKey) => {
              const group = variableGroups[groupKey] || {
                title: "Other Variables",
                icon: Info,
                color: "gray",
              };
              const groupVariables = groupedVariables[groupKey];
              const colorScheme =
                colorSchemes[group.color] || colorSchemes.blue;
              const IconComponent = group.icon;

              return (
                <div
                  key={groupKey}
                  className={`border-2 ${colorScheme.border} rounded-xl overflow-hidden`}
                >
                  <div
                    className={`${colorScheme.bg} px-6 py-4 border-b ${colorScheme.border}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                        <IconComponent className={colorScheme.text} size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {group.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {groupVariables.length} variables
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {groupVariables.map((variable) => {
                        const value = allData[variable.key];
                        console.log(
                          "selected_months:",
                          allData.selected_months
                        );

                        return renderVariableCard(
                          variable,
                          value,
                          allData,
                          colorScheme.bg,
                          colorScheme.text,
                          productType,
                          product_details
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVariables.map((variable) => {
              const value = allData[variable.key];
              return renderVariableCard(
                variable,
                value,
                allData,
                typeInfo.bgColor,
                typeInfo.iconColor,
                productType
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForecastVariableCards;
