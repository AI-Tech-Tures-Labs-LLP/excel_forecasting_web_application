// ProductSelector/BulkActionModal.jsx
import React, { useState, useEffect } from "react";
import { X, Settings, Package, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";

const BulkActionModal = ({
  showModal,
  setShowModal,
  selectedProductIds,
  processedProducts,
  onSuccess,
}) => {
  const [bulkFactor, setBulkFactor] = useState("");
  const [bulkFactorNote, setBulkFactorNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const isValidInput = () => {
    const num = parseFloat(bulkFactor);
    return !isNaN(num) && num >= -100 && num <= 100;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setBulkFactor(value);
    setError("");

    if (value && !isValidInput()) {
      if (parseFloat(value) < -100) {
        setError("Percentage cannot be less than -100%");
      } else if (parseFloat(value) > 100) {
        setError("Percentage cannot exceed 100%");
      } else if (isNaN(parseFloat(value))) {
        setError("Please enter a valid number");
      }
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isApplying) {
      setShowModal(false);
    }
  };

  const applyBulkExternalFactor = async () => {
    if (!isValidInput()) return;
    if (!bulkFactor || selectedProductIds.length === 0) return;

    setIsApplying(true);
    setError("");

    try {
      const productsToUpdate = processedProducts.filter((p) =>
        selectedProductIds.includes(p.pid)
      );

      console.log(
        `Updating ${productsToUpdate.length} products:`,
        productsToUpdate.map((p) => p.pid)
      );

      const updatePromises = productsToUpdate.map(async (product) => {
        // Calculate the new user_added_quantity based on external factor percentage
        const originalQty = product.user_added_quantity || 0;
        const newUserAddedQty = Math.round(
          originalQty * (1 + parseFloat(bulkFactor) / 100)
        );

        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/forecast/api/product/${
            product.pid
          }/`,
          {
            product_details: {
              external_factor_percentage: parseFloat(bulkFactor),
              user_added_quantity: newUserAddedQty,
              external_factor: bulkFactorNote,
            },
          }
        );

        return {
          pid: product.pid,
          category: product.category,
          originalQty: originalQty,
          newQty: newUserAddedQty,
          factorApplied: parseFloat(bulkFactor),
          response: response.data,
        };
      });

      const results = await Promise.all(updatePromises);

      // Store the results for display
      const appliedResults = {
        timestamp: new Date(),
        factorPercentage: parseFloat(bulkFactor),
        factorNote: bulkFactorNote,
        totalProductsUpdated: results.length,
        results: results,
        summary: {
          totalOriginalQty: results.reduce((sum, r) => sum + r.originalQty, 0),
          totalNewQty: results.reduce((sum, r) => sum + r.newQty, 0),
          totalDifference: results.reduce(
            (sum, r) => sum + (r.newQty - r.originalQty),
            0
          ),
        },
      };

      setSuccess(true);
      onSuccess(appliedResults);

      // Reset form after showing success
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        setBulkFactor("");
        setBulkFactorNote("");
      }, 2000);
    } catch (error) {
      console.error("Error applying bulk external factor:", error);
      setError("Failed to apply external factor. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !isApplying) {
        setShowModal(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isApplying, setShowModal]);

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-200 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Set External Factor %
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Apply to {selectedProductIds.length} selected products
              </p>
            </div>
          </div>
          <button
            onClick={() => !isApplying && setShowModal(false)}
            disabled={isApplying}
            className={`p-2 rounded-lg transition-colors ${
              isApplying
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Selected Products Info */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              <span className="font-medium">{selectedProductIds.length}</span>{" "}
              products will be updated
            </span>
          </div>

          {/* Input Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              External Factor Percentage
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="Enter percentage (-100 to 100)"
                value={bulkFactor}
                onChange={handleInputChange}
                disabled={isApplying}
                min="-100"
                max="100"
                step="0.1"
                className={`w-11/12 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  error
                    ? "border-red-300 bg-red-50"
                    : success
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                } ${isApplying ? "opacity-50 cursor-not-allowed" : ""}`}
              />

              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400 text-sm">%</span>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                <CheckCircle className="w-4 h-4" />
                <span>External factor applied successfully!</span>
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                External Factor Notes
              </label>
              <textarea
                value={bulkFactorNote}
                onChange={(e) => setBulkFactorNote(e.target.value)}
                placeholder="Add notes about external factors..."
                rows={3}
                disabled={isApplying}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Helper Text */}
            {!error && !success && (
              <p className="text-xs text-gray-500 mt-2">
                This percentage will be applied to all selected products
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={() => setShowModal(false)}
            disabled={isApplying}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isApplying
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={applyBulkExternalFactor}
            disabled={!bulkFactor || !isValidInput() || isApplying || success}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              !bulkFactor || !isValidInput() || isApplying || success
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-sm hover:shadow-md"
            }`}
          >
            {isApplying ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Applying...</span>
              </div>
            ) : success ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Applied!</span>
              </div>
            ) : (
              "Apply Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionModal;
