import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { BarChart3, X } from "lucide-react";
import ForecastVariableCards from "./ForecastVariableCards";

const ForecastVariablesModal = ({
  showVariablesModal,
  setShowVariablesModal,
  productData,
  cardData,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowVariablesModal(false);
      }
    };

    if (showVariablesModal) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showVariablesModal, setShowVariablesModal]);

  if (!showVariablesModal) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close modal when clicking on the backdrop
        if (e.target === e.currentTarget) {
          setShowVariablesModal(false);
        }
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl flex flex-col overflow-hidden"
        style={{ height: "90vh" }}
        onClick={(e) => e.stopPropagation()} // Prevent event bubbling when clicking inside modal
      >
        {/* Modal Header - Fixed */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between flex-shrink-0 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <BarChart3 className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">
              Forecast Algorithm Variables - {cardData?.productId}
            </h2>
          </div>
          <button
            onClick={() => setShowVariablesModal(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-hidden rounded-b-xl">
          <div className="h-full overflow-y-auto p-6 custom-scrollbar">
            <ForecastVariableCards productData={productData} />
          </div>
        </div>
      </div>
    </div>
  );
};

ForecastVariablesModal.propTypes = {
  showVariablesModal: PropTypes.bool.isRequired,
  setShowVariablesModal: PropTypes.func.isRequired,
  productData: PropTypes.object,
  cardData: PropTypes.object,
};

export default ForecastVariablesModal;
