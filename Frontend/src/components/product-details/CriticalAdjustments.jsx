import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  AlertTriangle,
  Save,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
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
  productData, // Add productData prop to get current status
}) => {
  const dispatch = useDispatch();
  const { sheetId } = useParams();
  const selectedFilters = useSelector((state) => state.filters.selectedFilters);
  const selectedProductType = useSelector(
    (state) => state.filters.selectedProductType
  );

  // Status state - initialize with current product status
  const [currentStatus, setCurrentStatus] = useState(
    productData?.product_details?.status || "not_reviewed"
  );

  // Validation states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status options
  const statusOptions = [
    {
      value: "not_reviewed",
      label: "Not Reviewed",
      icon: <AlertCircle size={14} className="text-red-600" />,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-300",
    },
    {
      value: "pending",
      label: "Pending",
      icon: <Clock size={14} className="text-yellow-600" />,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-300",
    },
    {
      value: "reviewed",
      label: "Reviewed",
      icon: <CheckCircle size={14} className="text-green-600" />,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-300",
    },
  ];

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    return typeof value === "number" ? value.toLocaleString() : value;
  };

  // Enhanced validation function
  const validateInputs = () => {
    const newErrors = {};

    // Check if quantity is entered
    const hasQuantity = userAddedQuantity && userAddedQuantity.trim() !== "";
    const hasNote = externalFactor && externalFactor.trim() !== "";

    if (hasQuantity) {
      // Validate quantity is a valid number
      const qty = parseFloat(userAddedQuantity);
      if (isNaN(qty)) {
        newErrors.userAddedQuantity = "Please enter a valid number";
      } else if (qty < 0) {
        newErrors.userAddedQuantity = "Quantity cannot be negative";
      } else if (qty === 0) {
        newErrors.userAddedQuantity = "Quantity must be greater than 0";
      }

      // Note is mandatory when quantity is added
      if (!hasNote) {
        newErrors.externalFactor = "Note is required when adding quantity";
      }
    }

    // If note is provided without quantity, that's fine (standalone note)
    if (hasNote && !hasQuantity) {
      // This is valid - user can add notes without quantity
    }

    // Check if note length is reasonable (optional constraint)
    if (hasNote && externalFactor.trim().length < 5) {
      newErrors.externalFactor = "Note should be at least 5 characters long";
    }

    if (hasNote && externalFactor.trim().length > 500) {
      newErrors.externalFactor = "Note should not exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserAddedQuantityChange = (value) => {
    setUserAddedQuantity(value);

    // Clear quantity-related errors when user starts typing
    if (errors.userAddedQuantity) {
      setErrors((prev) => ({ ...prev, userAddedQuantity: null }));
    }

    // Calculate percentage
    const qty = parseFloat(value);
    if (!isNaN(qty) && cardData.totalAddedQty && qty > 0) {
      const percentage = (qty / cardData.totalAddedQty) * 100;
      setExternalFactorPercentage(percentage.toFixed(2));
    } else {
      setExternalFactorPercentage("");
    }

    // If quantity is cleared, also clear note requirement error
    if (!value || value.trim() === "") {
      setErrors((prev) => ({ ...prev, externalFactor: null }));
    }
  };

  const handleNoteChange = (value) => {
    setExternalFactor(value);

    // Clear note-related errors when user starts typing
    if (errors.externalFactor) {
      setErrors((prev) => ({ ...prev, externalFactor: null }));
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/product/${productId}/`,
        {
          sheet_id: sheetId,
          product_details: {
            status: newStatus,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setCurrentStatus(newStatus);

        // Refresh products data if fetchProducts is available
        if (
          fetchProducts &&
          dispatch &&
          selectedProductType &&
          selectedFilters
        ) {
          dispatch(
            fetchProducts({
              productType: selectedProductType,
              filters: selectedFilters,
              sheetId: sheetId,
            })
          );
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      setErrors((prev) => ({
        ...prev,
        status: "Failed to update status. Please try again.",
      }));
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
        noteData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Note saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving note:", error);
      throw error; // Re-throw to handle in main save function
    }
  };

  const handleSaveCriticalInputs = async () => {
    // Validate inputs before submission
    if (!validateInputs()) {
      return;
    }

    setIsSubmitting(true);

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
          external_factor_note: externalFactor.trim() || null,
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

        if (onSave) onSave();

        if (
          fetchProducts &&
          dispatch &&
          selectedProductType &&
          selectedFilters
        ) {
          dispatch(
            fetchProducts({
              productType: selectedProductType,
              filters: selectedFilters,
              sheetId: sheetId,
            })
          );
        }

        // Clear any remaining errors after successful save
        setErrors({});
      }
    } catch (error) {
      console.error("Error saving critical inputs:", error);
      console.error("Error response:", error.response?.data);

      // Show more user-friendly error messages
      const errorMessage = error.response?.data?.message || error.message;
      setErrors({
        submit: `Failed to save: ${errorMessage}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form has valid data to save
  const hasDataToSave =
    (userAddedQuantity && userAddedQuantity.trim() !== "") ||
    (externalFactor && externalFactor.trim() !== "");

  // Get current status configuration
  const currentStatusConfig =
    statusOptions.find((option) => option.value === currentStatus) ||
    statusOptions[0];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-amber-200 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 border-b border-amber-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-amber-600" size={16} />
            <h3 className="text-sm font-semibold text-gray-800">
              Critical Adjustments
            </h3>
          </div>

          {/* Status Selector in Header */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-700">Status:</label>
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`px-3 py-1.5 border rounded-md text-xs font-medium focus:outline-none focus:ring-2 transition-all ${currentStatusConfig.bgColor} ${currentStatusConfig.textColor} ${currentStatusConfig.borderColor} focus:ring-indigo-100`}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Error Message */}
        {errors.status && (
          <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.status}
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Show general submission error */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle
              className="text-red-500 flex-shrink-0 mt-0.5"
              size={16}
            />
            <span className="text-sm text-red-700">{errors.submit}</span>
          </div>
        )}

        <div className="grid grid-cols-12 gap-4">
          {/* User Added Quantity - Takes 4 columns */}
          <div className="col-span-12 md:col-span-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              User Added Quantity
              {userAddedQuantity && userAddedQuantity.trim() !== "" && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            <input
              type="number"
              value={userAddedQuantity}
              onChange={(e) => handleUserAddedQuantityChange(e.target.value)}
              placeholder="Enter quantity..."
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.userAddedQuantity
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-amber-500 focus:ring-amber-100"
              }`}
            />
            {/* Fixed height container for feedback messages */}
            <div className="h-5 mt-1.5">
              {errors.userAddedQuantity && (
                <div className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.userAddedQuantity}
                </div>
              )}
              {userAddedQuantity && !errors.userAddedQuantity && (
                <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  Value: {formatValue(parseFloat(userAddedQuantity))}
                </div>
              )}
            </div>
          </div>

          {/* Notes - Takes 6 columns */}
          <div className="col-span-12 md:col-span-6">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Notes
              {userAddedQuantity && userAddedQuantity.trim() !== "" && (
                <span className="text-red-500 ml-1">* Required</span>
              )}
            </label>
            <textarea
              value={externalFactor}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder="Add relevant notes about external factors..."
              rows={2}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 resize-none transition-all ${
                errors.externalFactor
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
              }`}
            />
            {/* Fixed height container for feedback messages */}
            <div className="h-5 mt-1">
              {errors.externalFactor && (
                <div className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.externalFactor}
                </div>
              )}
              {externalFactor && !errors.externalFactor && (
                <div className="text-xs text-gray-500">
                  {externalFactor.length}/500 characters
                </div>
              )}
            </div>
          </div>

          {/* Save Button - Takes 2 columns */}
          <div className="col-span-12 md:col-span-2 flex items-start pt-6">
            <button
              onClick={handleSaveCriticalInputs}
              disabled={
                !hasDataToSave ||
                isSubmitting ||
                Object.keys(errors).some(
                  (key) => key !== "submit" && errors[key]
                )
              }
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all transform shadow-sm ${
                !hasDataToSave ||
                isSubmitting ||
                Object.keys(errors).some(
                  (key) => key !== "submit" && errors[key]
                )
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 focus:ring-emerald-200 hover:scale-105 hover:shadow-md"
              }`}
            >
              <Save size={14} />
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Validation Info - Fixed position */}
        <div className="mt-4 min-h-[60px]">
          {userAddedQuantity && userAddedQuantity.trim() !== "" && (
            <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle
                  className="text-blue-500 flex-shrink-0 mt-0.5"
                  size={14}
                />
                <span className="text-xs text-blue-700">
                  <strong>Note:</strong> Adding a note is mandatory when
                  specifying a quantity. This helps track the reasoning behind
                  quantity adjustments.
                </span>
              </div>
            </div>
          )}
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
  fetchProducts: PropTypes.func.isRequired,
  productData: PropTypes.object, // Add productData prop
};

export default CriticalAdjustments;
