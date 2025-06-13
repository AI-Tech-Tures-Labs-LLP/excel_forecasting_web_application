import React from "react";
import PropTypes from "prop-types";
import { TrendingUp } from "lucide-react";

const RollingForecastTable = ({
  rollingForecastData,
  editableData,
  changedCells,
  setChangedCells,
  autoChangedCells,
  justChangedCells,
  setJustChangedCells,
  handleCellChange,
}) => {
  if (!rollingForecastData) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Loading rolling forecast data...</p>
      </div>
    );
  }

  const monthLabels = [
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
    "JAN",
  ];

  const displayConfig = {
    index: { label: "Index", isPercentage: true },
    fcByIndex: { label: "FC by Index" },
    fcByTrend: { label: "FC by Trend" },
    recommendedFC: { label: "Recommended FC", highlight: true },
    plannedFC: { label: "Planned FC", editable: true },
    plannedShipments: { label: "Planned Shipments", editable: true },
    plannedEOH: { label: "Planned EOH (Cal)" },
    plannedSellThru: { label: "Planned Sell thru %", isPercentage: true },
  };

  const rows = Object.keys(rollingForecastData)
    .filter((key) => key !== "grossProjection" && key !== "macysProjReceipts")
    .map((key) => ({
      key,
      label: displayConfig[key]?.label || key,
      data:
        Array.isArray(rollingForecastData[key]) &&
        rollingForecastData[key].length === 12
          ? rollingForecastData[key]
          : Array(12).fill(0),
      isPercentage: displayConfig[key]?.isPercentage || false,
      highlight: displayConfig[key]?.highlight || false,
      editable: displayConfig[key]?.editable || false,
    }));

  const formatValue = (value, isPercentage = false) => {
    if (value === null || value === undefined || value === "") return "-";

    if (isPercentage) {
      const percentValue =
        typeof value === "number" ? value * 100 : parseFloat(value) * 100;
      return `${percentValue.toFixed(2)}%`;
    }

    return typeof value === "number" ? value.toLocaleString() : value;
  };

  // Enhanced cell change handler with highlighting
  const handleCellChangeWithHighlight = (rowType, month, value) => {
    const cellKey = `${rowType}-${month}`;

    // Add to changed cells for border highlighting
    setChangedCells((prev) => new Set([...prev, cellKey]));

    // Add temporary pop effect
    setJustChangedCells((prev) => new Set([...prev, cellKey]));

    // Remove pop effect after brief animation
    setTimeout(() => {
      setJustChangedCells((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cellKey);
        return newSet;
      });
    }, 600);

    // Call original handler
    handleCellChange(rowType, month, value);
  };

  const renderCell = (row, value, monthIndex, month) => {
    const cellKey = `${row.key}-${month}`;
    const isUserChanged = changedCells.has(cellKey);
    const isAutoChanged = autoChangedCells.has(cellKey);
    const isJustChanged = justChangedCells.has(cellKey);

    if (row.editable && editableData) {
      const editableKey =
        row.key === "plannedFC" ? "plannedFC" : "plannedShipments";
      const editableValue = editableData[editableKey]?.[month] ?? value;

      return (
        <div className="relative">
          <input
            type="number"
            value={editableValue}
            onChange={(e) =>
              handleCellChangeWithHighlight(editableKey, month, e.target.value)
            }
            className={`w-full px-2 py-1 text-center text-sm font-medium rounded transition-all duration-300 ${
              isJustChanged
                ? "transform scale-110 shadow-lg border-2 border-indigo-400 bg-indigo-50"
                : isUserChanged || isAutoChanged
                ? "border-2 border-gray-500 bg-gray-50 font-semibold"
                : "border border-blue-300 bg-blue-50 focus:bg-white focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-200`}
            style={{ minWidth: "70px" }}
          />
        </div>
      );
    }

    return (
      <div className="relative">
        <span
          className={`text-sm font-medium transition-all duration-300 ${
            isJustChanged
              ? "transform scale-110 font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded"
              : isUserChanged || isAutoChanged
              ? "font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded"
              : "text-gray-800"
          }`}
        >
          {formatValue(value, row.isPercentage)}
        </span>
      </div>
    );
  };

  const clearHighlights = () => {
    setChangedCells(new Set());
    setJustChangedCells(new Set());
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
              <th className="border-r border-gray-300 px-4 py-4 text-left text-sm font-bold text-gray-700 bg-white sticky left-0 z-10 min-w-[200px]">
                ROLLING 12M FC
              </th>
              {monthLabels.map((month) => (
                <th
                  key={month}
                  className="border-r border-gray-300 px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[90px]"
                >
                  {month}
                </th>
              ))}
              <th className="border-r border-gray-300 px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[100px]">
                ANNUAL
              </th>
              <th className="border-r border-gray-300 px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[100px]">
                SPRING
              </th>
              <th className="px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[100px]">
                FALL
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const totals = {
                annual: row.data.reduce((sum, val) => sum + (val || 0), 0),
                spring: row.data
                  .slice(0, 6)
                  .reduce((sum, val) => sum + (val || 0), 0),
                fall: row.data
                  .slice(6)
                  .reduce((sum, val) => sum + (val || 0), 0),
              };

              if (row.editable && editableData) {
                const editableKey =
                  row.key === "plannedFC" ? "plannedFC" : "plannedShipments";
                const editableValues = Object.values(
                  editableData[editableKey] || {}
                );
                if (editableValues.length === 12) {
                  totals.annual = editableValues.reduce(
                    (sum, val) => sum + (val || 0),
                    0
                  );
                  totals.spring = editableValues
                    .slice(0, 6)
                    .reduce((sum, val) => sum + (val || 0), 0);
                  totals.fall = editableValues
                    .slice(6)
                    .reduce((sum, val) => sum + (val || 0), 0);
                }
              }

              // Check if any cell in this row has changed
              const rowHasUserChanges = monthLabels.some((month) =>
                changedCells.has(`${row.key}-${month}`)
              );
              const rowHasAutoChanges = monthLabels.some((month) =>
                autoChangedCells.has(`${row.key}-${month}`)
              );

              return (
                <tr
                  key={index}
                  className={`border-b border-gray-200 transition-all duration-200 ${
                    row.highlight
                      ? "bg-yellow-50"
                      : row.editable
                      ? "bg-blue-50"
                      : index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  } hover:bg-indigo-50 ${
                    rowHasUserChanges || rowHasAutoChanges
                      ? "border-l-2 border-l-gray-500"
                      : ""
                  }`}
                >
                  <td className="border-r border-gray-300 px-4 py-3 text-sm font-bold text-gray-800 bg-white sticky left-0 z-10">
                    <div className="flex items-center gap-2">
                      {row.label}
                      {row.editable && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Editable
                        </span>
                      )}
                      {rowHasUserChanges && (
                        <span
                          className="w-2 h-2 bg-green-500 rounded-full"
                          title="User modified"
                        ></span>
                      )}
                      {rowHasAutoChanges && !rowHasUserChanges && (
                        <span
                          className="w-2 h-2 bg-orange-500 rounded-full"
                          title="Auto calculated"
                        ></span>
                      )}
                    </div>
                  </td>
                  {row.data.map((value, i) => {
                    const cellKey = `${row.key}-${monthLabels[i]}`;
                    const isUserChanged = changedCells.has(cellKey);
                    const isAutoChanged = autoChangedCells.has(cellKey);
                    const isJustChanged = justChangedCells.has(cellKey);

                    return (
                      <td
                        key={i}
                        className={`border-r border-gray-300 px-3 py-3 text-center transition-all duration-300 ${
                          isJustChanged
                            ? "bg-indigo-100 shadow-inner"
                            : isUserChanged || isAutoChanged
                            ? "bg-gray-100 border-r-gray-400"
                            : row.editable
                            ? "bg-blue-50"
                            : ""
                        }`}
                      >
                        {renderCell(row, value, i, monthLabels[i])}
                      </td>
                    );
                  })}
                  <td
                    className={`border-r border-gray-300 px-3 py-3 text-center text-sm font-bold text-gray-900 transition-all duration-200 ${
                      rowHasUserChanges
                        ? "bg-green-100 text-green-800"
                        : rowHasAutoChanges
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-50"
                    }`}
                  >
                    {formatValue(totals.annual, row.isPercentage)}
                  </td>
                  <td
                    className={`border-r border-gray-300 px-3 py-3 text-center text-sm font-bold text-gray-900 transition-all duration-200 ${
                      rowHasUserChanges
                        ? "bg-green-100 text-green-800"
                        : rowHasAutoChanges
                        ? "bg-orange-100 text-orange-800"
                        : "bg-green-50"
                    }`}
                  >
                    {formatValue(totals.spring, row.isPercentage)}
                  </td>
                  <td
                    className={`px-3 py-3 text-center text-sm font-bold text-gray-900 transition-all duration-200 ${
                      rowHasUserChanges
                        ? "bg-green-100 text-green-800"
                        : rowHasAutoChanges
                        ? "bg-orange-100 text-orange-800"
                        : "bg-orange-50"
                    }`}
                  >
                    {formatValue(totals.fall, row.isPercentage)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Simple legend for highlights */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="flex items-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-gray-500 rounded"></div>
            <span>Modified Cells</span>
          </div>
        </div>

        <button
          onClick={clearHighlights}
          className="text-xs text-gray-500 hover:text-red-600 px-3 py-1 rounded border border-gray-300 hover:border-red-300 transition-colors"
        >
          Clear Highlights
        </button>
      </div>
    </div>
  );
};

RollingForecastTable.propTypes = {
  rollingForecastData: PropTypes.object,
  editableData: PropTypes.object.isRequired,
  changedCells: PropTypes.object.isRequired,
  setChangedCells: PropTypes.func.isRequired,
  autoChangedCells: PropTypes.object.isRequired,
  justChangedCells: PropTypes.object.isRequired,
  setJustChangedCells: PropTypes.func.isRequired,
  handleCellChange: PropTypes.func.isRequired,
};

export default RollingForecastTable;
