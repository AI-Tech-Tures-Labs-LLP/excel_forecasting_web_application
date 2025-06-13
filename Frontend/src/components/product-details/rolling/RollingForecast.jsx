import React from "react";
import PropTypes from "prop-types";
import { TrendingUp, Settings, RefreshCw } from "lucide-react";
import RollingForecastTable from "./RollingForecastTable";
import ForecastControls from "../ForecastControls";

const RollingForecast = ({
  rollingForecastData,
  editableData,
  setEditableData,
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
  isSaving,
  hasControlChanges,
  hasEditableChanges,
  initialControlValues,
  originalValuesRef,
  changedCells,
  setChangedCells,
  autoChangedCells,
  setAutoChangedCells,
  justChangedCells,
  setJustChangedCells,
  lastChangedField,
  handleFieldChange,
  handleSaveChanges,
  handleCellChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <TrendingUp className="text-indigo-600" size={20} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Rolling 12M Forecast
          </h3>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <div className="animate-fadeIn">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <TrendingUp className="text-indigo-600" size={20} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Rolling Forecast Controls
                </h3>
              </div>

              {/* Apply Changes Button */}
              <div className="flex items-center gap-3">
                <button
                  disabled={
                    ((!initialControlValues ||
                      !originalValuesRef.current ||
                      JSON.stringify(initialControlValues) ===
                        JSON.stringify(originalValuesRef.current)) &&
                      !hasEditableChanges) ||
                    isSaving
                  }
                  onClick={handleSaveChanges}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 ${
                    ((!initialControlValues ||
                      !originalValuesRef.current ||
                      JSON.stringify(initialControlValues) ===
                        JSON.stringify(originalValuesRef.current)) &&
                      !hasEditableChanges) ||
                    isSaving
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transform hover:scale-105"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transform hover:scale-105"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Applying Changes...
                    </>
                  ) : (
                    <>
                      <Settings size={16} />
                      Apply Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Forecast Controls */}
            <ForecastControls
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              rollingMethod={rollingMethod}
              setRollingMethod={setRollingMethod}
              forecastingMethod={forecastingMethod}
              setForecastingMethod={setForecastingMethod}
              editableTrend={editableTrend}
              setEditableTrend={setEditableTrend}
              editable12MonthFC={editable12MonthFC}
              setEditable12MonthFC={setEditable12MonthFC}
              lastChangedField={lastChangedField}
              handleFieldChange={handleFieldChange}
            />
          </div>

          {/* Forecast Table */}
          <RollingForecastTable
            rollingForecastData={rollingForecastData}
            editableData={editableData}
            changedCells={changedCells}
            setChangedCells={setChangedCells}
            autoChangedCells={autoChangedCells}
            justChangedCells={justChangedCells}
            setJustChangedCells={setJustChangedCells}
            handleCellChange={handleCellChange}
          />
        </div>
      </div>
    </div>
  );
};

RollingForecast.propTypes = {
  rollingForecastData: PropTypes.object,
  editableData: PropTypes.object.isRequired,
  setEditableData: PropTypes.func.isRequired,
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
  isSaving: PropTypes.bool.isRequired,
  hasControlChanges: PropTypes.bool.isRequired,
  hasEditableChanges: PropTypes.bool.isRequired,
  initialControlValues: PropTypes.object,
  originalValuesRef: PropTypes.object.isRequired,
  changedCells: PropTypes.object.isRequired,
  setChangedCells: PropTypes.func.isRequired,
  autoChangedCells: PropTypes.object.isRequired,
  setAutoChangedCells: PropTypes.func.isRequired,
  justChangedCells: PropTypes.object.isRequired,
  setJustChangedCells: PropTypes.func.isRequired,
  lastChangedField: PropTypes.string,
  handleFieldChange: PropTypes.func.isRequired,
  handleSaveChanges: PropTypes.func.isRequired,
  handleCellChange: PropTypes.func.isRequired,
};

export default RollingForecast;
