// Dynamic Calculation Modal Component
export default DynamicCalculationModal = ({
  isOpen,
  onClose,
  data,
  type,
  modalType,
  forecastMonth,
}) => {
  if (!isOpen) return null;

  const getModalConfig = () => {
    switch (modalType) {
      case "required_quantity":
        return {
          title: "Required EOH Quantity Calculation",
          icon: Calculator,
          gradient: "from-emerald-500 to-green-600",
          getContent: () => getRequiredQuantityContent(),
        };
      case "fc_index":
        return {
          title: "12-Month FC Index Calculation",
          icon: BarChart3,
          gradient: "from-blue-500 to-indigo-600",
          getContent: () => getFCIndexContent(),
        };
      case "loss":
        return {
          title: "Loss Percentage Calculation",
          icon: TrendingDown,
          gradient: "from-red-500 to-pink-600",
          getContent: () => getLossContent(),
        };
      case "trend":
        return {
          title: "Trend Calculation",
          icon: TrendingUp,
          gradient: "from-green-500 to-emerald-600",
          getContent: () => getTrendContent(),
        };
      case "fc_index_loss":
        return {
          title: "12-Month FC Index (Loss %) Calculation",
          icon: TrendingDown,
          gradient: "from-orange-500 to-red-600",
          getContent: () => getFCIndexLossContent(),
        };
      case "planned_shipment":
        return {
          title: "Planned Shipment Calculation",
          icon: Truck,
          gradient: "from-cyan-500 to-blue-600",
          getContent: () => getPlannedShipmentContent(),
        };
      case "total_added_qty":
        return {
          title: "Total Added Quantity Calculation",
          icon: Calculator,
          gradient: "from-purple-500 to-indigo-600",
          getContent: () => getTotalAddedQtyContent(),
        };
      default:
        return {
          title: "Calculation Details",
          icon: Info,
          gradient: "from-gray-500 to-gray-600",
          getContent: () => <div>No calculation details available</div>,
        };
    }
  };

  const getRequiredQuantityContent = () => {
    const doorCount = data?.kpi_door_count || 0;
    const averageComOh = data?.average_com_oh || 0;
    const fldc = data?.fldc || 0;
    const requiredQuantity = data?.forecast_month_required_quantity || 0;
    const nextRequiredQuantity =
      data?.next_forecast_month_required_quantity || 0;
    const currentForecastMonth = data?.forecast_month || "Unknown";
    const nextForecastMonth = data?.next_forecast_month || "Unknown";

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
      <div className="space-y-6">
        <div className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
          <div className="flex items-center gap-3 mb-2">
            {type === "store" && (
              <Building2 className={colors.text} size={20} />
            )}
            {type === "com" && (
              <ShoppingCart className={colors.text} size={20} />
            )}
            {type === "omni" && <Layers className={colors.text} size={20} />}
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
            <h4 className="font-semibold text-gray-800">Calculation Formula</h4>
          </div>
          <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
            Required EOH for {displayMonth} = KPI Door Count + Average COM EOM
            OH + FLDC
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="text-blue-600" size={16} />
              <span className="font-medium text-blue-700">KPI Door Count</span>
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
            <h4 className="font-semibold text-gray-800">Calculation Steps</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">KPI Door Count:</span>
              <span className="font-medium">{doorCount.toLocaleString()}</span>
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
                <AlertTriangle className="text-yellow-600 mt-0.5" size={16} />
                <div>
                  <h5 className="font-medium text-yellow-800 mb-1">
                    Calculation Note
                  </h5>
                  <p className="text-yellow-700 text-sm">
                    Calculated value ({calculatedSum.toLocaleString()}) differs
                    from stored value (
                    {displayRequiredQuantity.toLocaleString()}). This may
                    indicate additional factors in the actual calculation.
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  };

  const getFCIndexContent = () => {
    const getModalData = () => {
      switch (type) {
        case "store":
          return {
            stdIndexValue: data?.std_index_value || 0,
            stdTySales: data?.std_ty_unit_sales || 0,
            month12FcIndex: data?.month_12_fc_index_original || 0,
            formula: "12-Month FC Index = STD TY Unit Sales / STD Index Value",
          };
        case "com":
          return {
            tyComSales: data?.ty_com_sales_unit_selected_month_sum || 0,
            stdIndexValue: data?.std_index_value || 0,
            month12FcIndex: data?.new_month_12_fc_index || 0,
            formula:
              "12-Month FC Index = TY COM Sales Unit Selected Month Sum / STD Index Value",
          };
        case "omni":
          return {
            tyStoreSales: data?.ty_store_sales_unit_selected_month_sum || 0,
            stdIndexValue: data?.std_index_value || 0,
            storeMonth12FcIndex: data?.store_month_12_fc_index_original || 0,
            tyComSales: data?.ty_com_sales_unit_selected_month_sum || 0,
            comMonth12FcIndex: data?.com_month_12_fc_index || 0,
            storeFormula:
              "Store 12-Month FC Index = TY Store Sales Unit Selected Month Sum / STD Index Value",
            comFormula:
              "COM 12-Month FC Index = TY COM Sales Unit Selected Month Sum / STD Index Value",
          };
        default:
          return {};
      }
    };

    const modalData = getModalData();

    return (
      <div className="space-y-6">
        {type === "omni" ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-4">
                Store FC Index Calculation
              </h3>
              <div className="bg-gray-50 p-3 rounded-md font-mono text-sm mb-4">
                {modalData.storeFormula}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-blue-200 rounded-lg p-3 bg-white">
                  <span className="text-sm font-medium text-blue-700">
                    TY Store Sales Unit
                  </span>
                  <div className="text-xl font-bold text-blue-800">
                    {modalData.tyStoreSales?.toLocaleString() || "N/A"}
                  </div>
                </div>
                <div className="border border-blue-200 rounded-lg p-3 bg-white">
                  <span className="text-sm font-medium text-blue-700">
                    STD Index Value
                  </span>
                  <div className="text-xl font-bold text-blue-800">
                    {modalData.stdIndexValue?.toLocaleString() || "N/A"}
                  </div>
                </div>
                <div className="border border-emerald-200 rounded-lg p-3 bg-emerald-50">
                  <span className="text-sm font-medium text-emerald-700">
                    Store 12-Month FC Index
                  </span>
                  <div className="text-xl font-bold text-emerald-800">
                    {modalData.storeMonth12FcIndex?.toLocaleString() || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-4">
                COM FC Index Calculation
              </h3>
              <div className="bg-gray-50 p-3 rounded-md font-mono text-sm mb-4">
                {modalData.comFormula}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-green-200 rounded-lg p-3 bg-white">
                  <span className="text-sm font-medium text-green-700">
                    TY COM Sales Unit
                  </span>
                  <div className="text-xl font-bold text-green-800">
                    {modalData.tyComSales?.toLocaleString() || "N/A"}
                  </div>
                </div>
                <div className="border border-green-200 rounded-lg p-3 bg-white">
                  <span className="text-sm font-medium text-green-700">
                    STD Index Value
                  </span>
                  <div className="text-xl font-bold text-green-800">
                    {modalData.stdIndexValue?.toLocaleString() || "N/A"}
                  </div>
                </div>
                <div className="border border-emerald-200 rounded-lg p-3 bg-emerald-50">
                  <span className="text-sm font-medium text-emerald-700">
                    COM 12-Month FC Index
                  </span>
                  <div className="text-xl font-bold text-emerald-800">
                    {modalData.comMonth12FcIndex?.toLocaleString() || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
              {modalData.formula}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <span className="text-sm font-medium text-blue-700">
                  {type === "store" ? "STD TY Unit Sales" : "TY COM Sales Unit"}
                </span>
                <div className="text-2xl font-bold text-blue-800">
                  {(type === "store"
                    ? modalData.stdTySales
                    : modalData.tyComSales
                  )?.toLocaleString() || "N/A"}
                </div>
              </div>
              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <span className="text-sm font-medium text-purple-700">
                  STD Index Value
                </span>
                <div className="text-2xl font-bold text-purple-800">
                  {modalData.stdIndexValue?.toLocaleString() || "N/A"}
                </div>
              </div>
              <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
                <span className="text-sm font-medium text-emerald-700">
                  12-Month FC Index
                </span>
                <div className="text-2xl font-bold text-emerald-800">
                  {modalData.month12FcIndex?.toLocaleString() || "N/A"}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const getLossContent = () => {
    const doorCount = data?.kpi_door_count || 0;
    const averageEomOh = data?.average_eoh_oh || 0;
    const lossPercentage = data?.loss_updated || 0;
    const calculatedLoss = averageEomOh > 0 ? doorCount / averageEomOh : 0;

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
          Loss % = Door Count / Average EOM OH
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="text-blue-600" size={16} />
              <span className="font-medium text-blue-700">Door Count</span>
            </div>
            <div className="text-2xl font-bold text-blue-800">
              {doorCount.toLocaleString()}
            </div>
          </div>

          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <div className="flex items-center gap-2 mb-2">
              <Package className="text-green-600" size={16} />
              <span className="font-medium text-green-700">Average EOM OH</span>
            </div>
            <div className="text-2xl font-bold text-green-800">
              {averageEomOh.toLocaleString()}
            </div>
          </div>

          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="text-red-600" size={16} />
              <span className="font-medium text-red-700">Loss %</span>
            </div>
            <div className="text-2xl font-bold text-red-800">
              {(lossPercentage * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="text-gray-600" size={20} />
            <h4 className="font-semibold text-gray-800">Calculation Steps</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Door Count:</span>
              <span className="font-medium">{doorCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">÷ Average EOM OH:</span>
              <span className="font-medium">
                {averageEomOh.toLocaleString()}
              </span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between items-center py-2 bg-red-50 px-3 rounded-md">
              <span className="font-semibold text-red-800">Loss %:</span>
              <span className="text-xl font-bold text-red-800">
                {(calculatedLoss * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getTrendContent = () => {
    const getTrendData = () => {
      switch (type) {
        case "store":
          return {
            tyUnitSales: data?.ty_unit_sales_new_trend || 0,
            lyUnitSales: data?.ly_unit_sales_new_trend || 0,
            trend: data?.std_trend || 0,
            formula: "Trend = (TY Unit Sales - LY Unit Sales) / LY Unit Sales",
          };
        case "com":
          return {
            tyComSales: data?.ty_com_sales_unit_selected_month_sum || 0,
            lyComSales: data?.ly_com_sales_unit_selected_month_sum || 0,
            trend: data?.com_trend_for_selected_month || 0,
            formula:
              "Trend = (TY COM Sales Unit - LY COM Sales Unit) / LY COM Sales Unit",
          };
        case "omni":
          return {
            tyStoreSales: data?.ty_store_sales_unit_selected_month_sum || 0,
            lyStoreSales: data?.ly_store_sales_unit_selected_month_sum || 0,
            storeTrend: data?.store_trend || 0,
            tyComSales: data?.ty_com_sales_unit_selected_month_sum || 0,
            lyComSales: data?.ly_com_sales_unit_selected_month_sum || 0,
            comTrend: data?.com_trend_for_selected_month || 0,
            storeFormula:
              "Store Trend = (TY Store Sales Unit - LY Store Sales Unit) / LY Store Sales Unit",
            comFormula:
              "COM Trend = (TY COM Sales Unit - LY COM Sales Unit) / LY COM Sales Unit",
          };
        default:
          return {};
      }
    };

    const trendData = getTrendData();

    return (
      <div className="space-y-6">
        {type === "omni" ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-4">
                Store Trend Calculation
              </h3>
              <div className="bg-gray-50 p-3 rounded-md font-mono text-sm mb-4">
                {trendData.storeFormula}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-blue-200 rounded-lg p-3 bg-white">
                  <span className="text-sm font-medium text-blue-700">
                    TY Store Sales
                  </span>
                  <div className="text-lg font-bold text-blue-800">
                    {trendData.tyStoreSales?.toLocaleString() || "N/A"}
                  </div>
                </div>
                <div className="border border-blue-200 rounded-lg p-3 bg-white">
                  <span className="text-sm font-medium text-blue-700">
                    LY Store Sales
                  </span>
                  <div className="text-lg font-bold text-blue-800">
                    {trendData.lyStoreSales?.toLocaleString() || "N/A"}
                  </div>
                </div>
                <div className="border border-blue-200 rounded-lg p-3 bg-white">
                  <span className="text-sm font-medium text-blue-700">
                    Difference
                  </span>
                  <div className="text-lg font-bold text-blue-800">
                    {(
                      trendData.tyStoreSales - trendData.lyStoreSales
                    )?.toLocaleString() || "N/A"}
                  </div>
                </div>
                <div className="border border-emerald-200 rounded-lg p-3 bg-emerald-50">
                  <span className="text-sm font-medium text-emerald-700">
                    Store Trend
                  </span>
                  <div className="text-lg font-bold text-emerald-800">
                    {(trendData.storeTrend * 100)?.toFixed(1) || "N/A"}%
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-4">
                COM Trend Calculation
              </h3>
              <div className="bg-gray-50 p-3 rounded-md font-mono text-sm mb-4">
                {trendData.comFormula}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-green-200 rounded-lg p-3 bg-white">
                  <span className="text-sm font-medium text-green-700">
                    TY COM Sales
                  </span>
                  <div className="text-lg font-bold text-green-800">
                    {trendData.tyComSales?.toLocaleString() || "N/A"}
                  </div>
                </div>
                <div className="border border-green-200 rounded-lg p-3 bg-white">
                  <span className="text-sm font-medium text-green-700">
                    LY COM Sales
                  </span>
                  <div className="text-lg font-bold text-green-800">
                    {trendData.lyComSales?.toLocaleString() || "N/A"}
                  </div>
                </div>
                <div className="border border-green-200 rounded-lg p-3 bg-white">
                  <span className="text-sm font-medium text-green-700">
                    Difference
                  </span>
                  <div className="text-lg font-bold text-green-800">
                    {(
                      trendData.tyComSales - trendData.lyComSales
                    )?.toLocaleString() || "N/A"}
                  </div>
                </div>
                <div className="border border-emerald-200 rounded-lg p-3 bg-emerald-50">
                  <span className="text-sm font-medium text-emerald-700">
                    COM Trend
                  </span>
                  <div className="text-lg font-bold text-emerald-800">
                    {(trendData.comTrend * 100)?.toFixed(1) || "N/A"}%
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
              {trendData.formula}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <span className="text-sm font-medium text-blue-700">
                  {type === "store" ? "TY Unit Sales" : "TY COM Sales"}
                </span>
                <div className="text-xl font-bold text-blue-800">
                  {(type === "store"
                    ? trendData.tyUnitSales
                    : trendData.tyComSales
                  )?.toLocaleString() || "N/A"}
                </div>
              </div>
              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <span className="text-sm font-medium text-purple-700">
                  {type === "store" ? "LY Unit Sales" : "LY COM Sales"}
                </span>
                <div className="text-xl font-bold text-purple-800">
                  {(type === "store"
                    ? trendData.lyUnitSales
                    : trendData.lyComSales
                  )?.toLocaleString() || "N/A"}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <span className="text-sm font-medium text-gray-700">
                  Difference
                </span>
                <div className="text-xl font-bold text-gray-800">
                  {(type === "store"
                    ? trendData.tyUnitSales - trendData.lyUnitSales
                    : trendData.tyComSales - trendData.lyComSales
                  )?.toLocaleString() || "N/A"}
                </div>
              </div>
              <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
                <span className="text-sm font-medium text-emerald-700">
                  Trend
                </span>
                <div className="text-xl font-bold text-emerald-800">
                  {(trendData.trend * 100)?.toFixed(1) || "N/A"}%
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const getFCIndexLossContent = () => {
    const month12FcIndexOriginal =
      data?.month_12_fc_index_original ||
      data?.store_month_12_fc_index_original ||
      0;
    const lossUpdated = data?.loss_updated || 0;
    const month12FcIndexLoss =
      data?.new_month_12_fc_index || data?.store_month_12_fc_index_loss || 0;
    const calculatedLoss = month12FcIndexOriginal * (1 + lossUpdated);

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
          12-Month FC Index (Loss %) = 12-Month FC Index × (1 + Loss %)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <span className="text-sm font-medium text-blue-700">
              12-Month FC Index
            </span>
            <div className="text-xl font-bold text-blue-800">
              {month12FcIndexOriginal?.toLocaleString() || "N/A"}
            </div>
          </div>
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <span className="text-sm font-medium text-red-700">Loss %</span>
            <div className="text-xl font-bold text-red-800">
              {(lossUpdated * 100)?.toFixed(2) || "N/A"}%
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">
              Multiplier (1 + Loss %)
            </span>
            <div className="text-xl font-bold text-gray-800">
              {(1 + lossUpdated)?.toFixed(4) || "N/A"}
            </div>
          </div>
          <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
            <span className="text-sm font-medium text-emerald-700">
              FC Index (Loss %)
            </span>
            <div className="text-xl font-bold text-emerald-800">
              {month12FcIndexLoss?.toLocaleString() || "N/A"}
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="text-gray-600" size={20} />
            <h4 className="font-semibold text-gray-800">Calculation Steps</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">12-Month FC Index:</span>
              <span className="font-medium">
                {month12FcIndexOriginal?.toLocaleString() || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">× (1 + Loss %):</span>
              <span className="font-medium">
                × {(1 + lossUpdated)?.toFixed(4) || "N/A"}
              </span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between items-center py-2 bg-emerald-50 px-3 rounded-md">
              <span className="font-semibold text-emerald-800">
                FC Index (Loss %):
              </span>
              <span className="text-xl font-bold text-emerald-800">
                {calculatedLoss?.toLocaleString() || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getPlannedShipmentContent = () => {
    const isNext = forecastMonth === "next";
    const requiredQty = isNext
      ? data?.next_forecast_month_required_quantity || 0
      : data?.forecast_month_required_quantity || 0;
    const plannedOhBefore = isNext
      ? data?.next_forecast_month_planned_oh_before || 0
      : data?.forecast_month_planned_oh_before || 0;
    const plannedShipment = isNext
      ? data?.qty_added_to_maintain_oh_next_forecast_month || 0
      : data?.qty_added_to_maintain_oh_forecast_month || 0;
    const monthLabel = isNext
      ? data?.next_forecast_month || "Next Forecast Month"
      : data?.forecast_month || "Forecast Month";

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
          {monthLabel} - Planned Shipment = Required Quantity - Planned OH
          (Before Added Qty)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <span className="text-sm font-medium text-blue-700">
              Required Quantity
            </span>
            <div className="text-2xl font-bold text-blue-800">
              {requiredQty?.toLocaleString() || "N/A"}
            </div>
          </div>
          <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
            <span className="text-sm font-medium text-orange-700">
              Planned OH (Before)
            </span>
            <div className="text-2xl font-bold text-orange-800">
              {plannedOhBefore?.toLocaleString() || "N/A"}
            </div>
          </div>
          <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
            <span className="text-sm font-medium text-emerald-700">
              Planned Shipment
            </span>
            <div className="text-2xl font-bold text-emerald-800">
              {plannedShipment?.toLocaleString() || "N/A"}
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="text-gray-600" size={20} />
            <h4 className="font-semibold text-gray-800">Calculation Steps</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Required Quantity:</span>
              <span className="font-medium">
                {requiredQty?.toLocaleString() || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">- Planned OH (Before):</span>
              <span className="font-medium">
                {plannedOhBefore?.toLocaleString() || "N/A"}
              </span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between items-center py-2 bg-emerald-50 px-3 rounded-md">
              <span className="font-semibold text-emerald-800">
                Planned Shipment:
              </span>
              <span className="text-xl font-bold text-emerald-800">
                {(requiredQty - plannedOhBefore)?.toLocaleString() || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getTotalAddedQtyContent = () => {
    const forecastMonthQty = data?.qty_added_to_maintain_oh_forecast_month || 0;
    const nextForecastMonthQty =
      data?.qty_added_to_maintain_oh_next_forecast_month || 0;
    const macysSoqQty = data?.qty_added_to_balance_soq_forecast_month || 0;
    const totalRecommended = data?.recommended_total_quantity || 0;
    const calculatedTotal =
      forecastMonthQty + nextForecastMonthQty + macysSoqQty;

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-3 rounded-md font-mono text-sm">
          Total Added Qty = Forecast Month Added + Next Forecast Month Added +
          Macys SOQ Added
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <span className="text-sm font-medium text-blue-700">
              Forecast Month Added
            </span>
            <div className="text-lg font-bold text-blue-800">
              {forecastMonthQty?.toLocaleString() || "N/A"}
            </div>
          </div>
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <span className="text-sm font-medium text-green-700">
              Next Forecast Month Added
            </span>
            <div className="text-lg font-bold text-green-800">
              {nextForecastMonthQty?.toLocaleString() || "N/A"}
            </div>
          </div>
          <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
            <span className="text-sm font-medium text-yellow-700">
              Macys SOQ Added
            </span>
            <div className="text-lg font-bold text-yellow-800">
              {macysSoqQty?.toLocaleString() || "N/A"}
            </div>
          </div>
          <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
            <span className="text-sm font-medium text-emerald-700">
              Total Added Qty
            </span>
            <div className="text-lg font-bold text-emerald-800">
              {totalRecommended?.toLocaleString() || "N/A"}
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="text-gray-600" size={20} />
            <h4 className="font-semibold text-gray-800">Calculation Steps</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Forecast Month Added:</span>
              <span className="font-medium">
                {forecastMonthQty?.toLocaleString() || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">
                + Next Forecast Month Added:
              </span>
              <span className="font-medium">
                {nextForecastMonthQty?.toLocaleString() || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">+ Macys SOQ Added:</span>
              <span className="font-medium">
                {macysSoqQty?.toLocaleString() || "N/A"}
              </span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between items-center py-2 bg-emerald-50 px-3 rounded-md">
              <span className="font-semibold text-emerald-800">
                Total Added Qty:
              </span>
              <span className="text-xl font-bold text-emerald-800">
                {calculatedTotal?.toLocaleString() || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {calculatedTotal !== totalRecommended && totalRecommended > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 mt-0.5" size={16} />
              <div>
                <h5 className="font-medium text-yellow-800 mb-1">
                  Calculation Note
                </h5>
                <p className="text-yellow-700 text-sm">
                  Calculated total ({calculatedTotal?.toLocaleString()}) differs
                  from stored total ({totalRecommended?.toLocaleString()}).
                  Additional business rules may apply.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const modalConfig = getModalConfig();
  const IconComponent = modalConfig.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div
          className={`bg-gradient-to-r ${modalConfig.gradient} text-white p-6 rounded-t-xl`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <IconComponent className="text-white" size={24} />
              </div>
              <h2 className="text-xl font-bold">{modalConfig.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="text-white" size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">{modalConfig.getContent()}</div>

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
}; // Dynamic Calculation Modal Component
