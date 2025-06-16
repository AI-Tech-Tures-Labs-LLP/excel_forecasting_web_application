import React from "react";
import PropTypes from "prop-types";
import {
  Tag,
  Truck,
  Building2,
  Clock,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Package,
  Gem,
  Calendar as CalendarIcon,
  Target,
  Layers,
  Activity,
  Star,
  Users,
  MapPin,
  Percent,
  Box,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

const ProductInfoCards = ({
  cardData,
  userAddedQuantity,
  externalFactorPercentage,
}) => {
  const formatValue = (value, isPercentage = false, isCurrency = false) => {
    if (value === null || value === undefined || value === "") return "-";

    if (isPercentage) {
      const percentValue =
        typeof value === "number" ? value * 100 : parseFloat(value) * 100;
      return `${percentValue.toFixed(2)}%`;
    }

    if (isCurrency)
      return `$${typeof value === "number" ? value.toLocaleString() : value}`;
    return typeof value === "number" ? value.toLocaleString() : value;
  };

  // Calculate final quantity based on user inputs
  const calculateFinalQuantity = () => {
    if (userAddedQuantity) {
      return userAddedQuantity;
    } else if (externalFactorPercentage && cardData?.totalAddedQty) {
      return Math.round(
        cardData.totalAddedQty *
          (1 + parseFloat(externalFactorPercentage) / 100)
      ).toLocaleString();
    } else if (cardData?.totalAddedQty) {
      return cardData.totalAddedQty.toLocaleString();
    }
    return "-";
  };

  const finalQuantity = calculateFinalQuantity();
  const hasQuantityUpdate = userAddedQuantity || externalFactorPercentage;

  return (
    <div className="space-y-6">
      {/* Primary Information Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Tag className="text-indigo-600" size={18} />
          Primary Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Category Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-50 rounded-md">
                  <Tag className="text-blue-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Category
                </span>
              </div>
              <p
                className="text-sm font-bold text-gray-900 truncate"
                title={cardData?.category}
              >
                {cardData?.category || "-"}
              </p>
            </div>
          </div>

          {/* Vendor Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-green-50 rounded-md">
                  <Truck className="text-green-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Vendor
                </span>
              </div>
              <p
                className="text-sm font-bold text-gray-900 truncate"
                title={cardData?.vendor}
              >
                {cardData?.vendor || "-"}
              </p>
            </div>
          </div>

          {/* Door Count Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-purple-50 rounded-md">
                  <Building2 className="text-purple-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">Doors</span>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {formatValue(cardData?.doorCount)}
              </p>
            </div>
          </div>

          {/* Lead Time Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-orange-50 rounded-md">
                  <Clock className="text-orange-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Lead Time
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {cardData?.leadTime ? `${cardData.leadTime} weeks` : "-"}
              </p>
            </div>
          </div>

          {/* Min Order Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-red-50 rounded-md">
                  <ShoppingCart className="text-red-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Min Order
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {formatValue(cardData?.minOrder)}
              </p>
            </div>
          </div>

          {/* Retail Value Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-emerald-50 rounded-md">
                  <DollarSign className="text-emerald-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Retail
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {formatValue(cardData?.macys_owned_retail, false, true)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-indigo-600" size={18} />
          Forecast Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* STD Trend Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-indigo-50 rounded-md">
                  <TrendingDown className="text-indigo-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  STD Trend
                </span>
              </div>
              <p
                className={`text-sm font-bold ${
                  cardData?.stdTrend >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {cardData?.stdTrend !== undefined ? (
                  <>
                    {cardData.stdTrend >= 0 ? "+" : ""}
                    {(cardData.stdTrend * 100).toFixed(1)}%
                  </>
                ) : (
                  "-"
                )}
              </p>
            </div>
          </div>

          {/* 12 Month FC Index Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-50 rounded-md">
                  <BarChart3 className="text-blue-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  12M FC Index
                </span>
              </div>
              <p className="text-sm font-bold text-blue-600">
                {formatValue(cardData?.monthFCIndex)}
              </p>
            </div>
          </div>

          {/* STD Index Value Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-cyan-50 rounded-md">
                  <Zap className="text-cyan-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  STD Index
                </span>
              </div>
              <p className="text-sm font-bold text-cyan-600">
                {cardData?.STD_index_value !== undefined
                  ? formatValue(cardData.STD_index_value * 100) + "%"
                  : "-"}
              </p>
            </div>
          </div>

          {/* Total Added Qty Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-green-50 rounded-md">
                  <Package className="text-green-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Added Qty
                </span>
              </div>
              <p className="text-sm font-bold text-green-600">
                {formatValue(cardData?.totalAddedQty)}
              </p>
            </div>
          </div>

          {/* Final Qty Card - Updated with dynamic calculation */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-emerald-50 rounded-md">
                  <Package
                    className={`${
                      hasQuantityUpdate ? "text-emerald-600" : "text-gray-600"
                    }`}
                    size={14}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Final Qty
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p
                  className={`text-sm font-bold ${
                    hasQuantityUpdate ? "text-emerald-600" : "text-gray-600"
                  }`}
                >
                  {finalQuantity}
                </p>
                {hasQuantityUpdate && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">
                    Modified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Macys SOQ Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-yellow-50 rounded-md">
                  <Star className="text-yellow-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Macys SOQ
                </span>
              </div>
              <p className="text-sm font-bold text-yellow-600">
                {formatValue(cardData?.macysSOQ)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Birthstone & Product Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Gem className="text-indigo-600" size={18} />
          Product Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Birthstone Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-pink-50 rounded-md">
                  <Gem className="text-pink-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Birthstone
                </span>
              </div>
              <p
                className="text-sm font-bold text-pink-600 truncate"
                title={cardData?.birthstone}
              >
                {cardData?.birthstone || "-"}
              </p>
            </div>
          </div>

          {/* Birthstone Month Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-purple-50 rounded-md">
                  <CalendarIcon className="text-purple-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  BS Month
                </span>
              </div>
              <p
                className="text-sm font-bold text-purple-600 truncate"
                title={cardData?.birthstoneMonth}
              >
                {cardData?.birthstoneMonth || "-"}
              </p>
            </div>
          </div>

          {/* Selected Month Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-teal-50 rounded-md">
                  <CalendarIcon className="text-teal-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Selected
                </span>
              </div>
              <p
                className="text-sm font-bold text-teal-600 truncate"
                title={cardData?.selectedMonth}
              >
                {cardData?.selectedMonth || "-"}
              </p>
            </div>
          </div>

          {/* Forecast Month Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-cyan-50 rounded-md">
                  <Target className="text-cyan-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Forecast
                </span>
              </div>
              <p
                className="text-sm font-bold text-cyan-600 truncate"
                title={cardData?.forecastMonth}
              >
                {cardData?.forecastMonth || "-"}
              </p>
            </div>
          </div>

          {/* Next Forecast Month Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-indigo-50 rounded-md">
                  <Layers className="text-indigo-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Next FC
                </span>
              </div>
              <p
                className="text-sm font-bold text-indigo-600 truncate"
                title={cardData?.nextForecastMonth}
              >
                {cardData?.nextForecastMonth || "-"}
              </p>
            </div>
          </div>

          {/* Product ID Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-gray-50 rounded-md">
                  <Info className="text-gray-600" size={14} />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  Product ID
                </span>
              </div>
              <p
                className="text-sm font-bold text-gray-600 truncate"
                title={cardData?.productId}
              >
                {cardData?.productId || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductInfoCards.propTypes = {
  cardData: PropTypes.object,
  userAddedQuantity: PropTypes.string,
  externalFactorPercentage: PropTypes.string,
};

export default ProductInfoCards;
