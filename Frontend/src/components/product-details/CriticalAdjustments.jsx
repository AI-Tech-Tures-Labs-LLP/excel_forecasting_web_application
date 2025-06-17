import React from "react";
import PropTypes from "prop-types";
import { AlertTriangle, Save } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const CriticalAdjustments = ({
  userAddedQuantity,
  setUserAddedQuantity,
  externalFactor,
  setExternalFactor,
  externalFactorPercentage,
  setExternalFactorPercentage,
  cardData,
  productId,
  onSave,
  fetchProducts,
}) => {
  const dispatch = useDispatch();
  const { sheetId } = useParams();
  const selectedFilters = useSelector((state) => state.filters.selectedFilters);
  const selectedProductType = useSelector(
    (state) => state.filters.selectedProductType
  );
  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    return typeof value === "number" ? value.toLocaleString() : value;
  };

  const handleUserAddedQuantityChange = (value) => {
    setExternalFactorPercentage("");
    const qty = parseFloat(value);
    setUserAddedQuantity(value);

    if (!isNaN(qty) && cardData.totalAddedQty) {
      const percentage = (qty / cardData.totalAddedQty) * 100;
      setExternalFactorPercentage(percentage.toFixed(2));
    } else {
      setExternalFactorPercentage("");
      setExternalFactor("");
    }
  };

  const handleSaveProductNote = async () => {
    if (!externalFactor || !externalFactor.trim()) {
      console.log("No note content to save");
      return;
    }

    try {
      const noteData = {
        pid: productId,
        note: externalFactor.trim(),
        assigned_to: "Unassigned",
        status: "not_reviewed",
      };

      console.log("Saving note:", noteData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/forecast-notes/`,
        noteData
      );

      console.log("Note saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please try again.");
    }
  };

  const handleSaveCriticalInputs = async () => {
    try {
      const payload = {
        sheet_id: sheetId,
        product_details: {
          user_updated_final_quantity: userAddedQuantity
            ? parseFloat(userAddedQuantity)
            : null,
          external_factor_percentage: externalFactorPercentage
            ? parseFloat(externalFactorPercentage)
            : null,
          external_factor: externalFactor || null,
        },
        tagged_to: [],
      };

      console.log("Saving critical inputs:", payload);

      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/product/${productId}/`,
        payload
      );

      console.log("Save response:", response.data);

      if (response.status === 200 || response.status === 201) {
        if (response.data.product_details) {
          setUserAddedQuantity(
            response.data.product_details.user_updated_final_quantity?.toString() ||
              userAddedQuantity
          );
          setExternalFactorPercentage(
            response.data.product_details.external_factor_percentage?.toString() ||
              externalFactorPercentage
          );
          setExternalFactor(
            response.data.product_details.external_factor || externalFactor
          );
        }

        // Save note if there's content in externalFactor
        if (externalFactor && externalFactor.trim()) {
          await handleSaveProductNote();
        }

        // Call the onSave callback if provided
        if (onSave) {
          onSave();
        }
        dispatch(
          fetchProducts({
            productType: selectedProductType,
            filters: selectedFilters,
            sheetId: sheetId,
          })
        );
      }
    } catch (error) {
      console.error("Error saving critical inputs:", error);
      console.error("Error response:", error.response?.data);
      alert(
        `Failed to save critical inputs: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-amber-200 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-amber-600" size={16} />
          <h3 className="text-sm font-semibold text-gray-800">
            Critical Adjustments
          </h3>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-12 gap-4 items-end">
          {/* User Added Quantity - Takes 4 columns */}
          <div className="col-span-12 md:col-span-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              User Added Quantity
            </label>
            <input
              type="number"
              value={userAddedQuantity}
              onChange={(e) => handleUserAddedQuantityChange(e.target.value)}
              placeholder="Enter quantity..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
            />
            {userAddedQuantity && (
              <div className="mt-1.5 text-xs text-emerald-600 font-medium flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                Value: {formatValue(parseFloat(userAddedQuantity))}
              </div>
            )}
          </div>

          {/* Notes - Takes 6 columns */}
          <div className="col-span-12 md:col-span-6">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={externalFactor}
              onChange={(e) => setExternalFactor(e.target.value)}
              placeholder="Add relevant notes about external factors..."
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none transition-all"
            />
          </div>

          {/* Save Button - Takes 2 columns */}
          <div className="col-span-12 md:col-span-2">
            <button
              onClick={handleSaveCriticalInputs}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all transform hover:scale-105 shadow-sm hover:shadow-md"
            >
              <Save size={14} />
              Save
            </button>
          </div>
        </div>

        {/* Final Quantity Display - If there's a calculated value */}
        {(userAddedQuantity || externalFactorPercentage) &&
          cardData?.totalAddedQty && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">
                  Final Quantity:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-indigo-600">
                    {userAddedQuantity
                      ? userAddedQuantity
                      : externalFactorPercentage
                      ? Math.round(
                          cardData.totalAddedQty *
                            (1 + parseFloat(externalFactorPercentage) / 100)
                        ).toLocaleString()
                      : cardData.totalAddedQty.toLocaleString()}
                  </span>
                  {(userAddedQuantity || externalFactorPercentage) && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      Updated
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

CriticalAdjustments.propTypes = {
  userAddedQuantity: PropTypes.string.isRequired,
  setUserAddedQuantity: PropTypes.func.isRequired,
  externalFactor: PropTypes.string.isRequired,
  setExternalFactor: PropTypes.func.isRequired,
  externalFactorPercentage: PropTypes.string.isRequired,
  setExternalFactorPercentage: PropTypes.func.isRequired,
  cardData: PropTypes.object.isRequired,
  productId: PropTypes.string.isRequired,
  onSave: PropTypes.func,
};

export default CriticalAdjustments;
