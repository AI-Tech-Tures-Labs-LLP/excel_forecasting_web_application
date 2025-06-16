import React from "react";
import PropTypes from "prop-types";
import { CheckCircle, RefreshCw, Save, X } from "lucide-react";

const SavePopups = ({
  showSaveChangesPopup,
  setShowSaveChangesPopup,
  isSaving,
  showCriticalSavePopup,
  setShowCriticalSavePopup,
  showSuccessPopup,
  setShowSuccessPopup,
}) => {
  return (
    <>
      {/* Main Save Changes Popup */}
      {showSaveChangesPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            style={{ backdropFilter: "blur(8px)" }}
          ></div>

          {/* Popup content */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center animate-fadeIn transform transition-all duration-300 scale-100">
            <div className="flex justify-center mb-4">
              <div
                className={`p-3 rounded-full transition-all duration-300 ${
                  isSaving ? "bg-blue-100 animate-pulse" : "bg-green-100"
                }`}
              >
                {isSaving ? (
                  <RefreshCw size={32} className="text-blue-600 animate-spin" />
                ) : (
                  <CheckCircle size={32} className="text-green-600" />
                )}
              </div>
            </div>

            <h2
              className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                isSaving ? "text-blue-800" : "text-green-800"
              }`}
            >
              {isSaving
                ? "Applying Changes..."
                : "Changes Applied Successfully!"}
            </h2>

            <p className="text-gray-600 mb-6">
              {isSaving
                ? "Please wait while we save your forecast changes. This may take a moment."
                : "Your forecast changes have been saved successfully. You may continue editing or navigate to another product."}
            </p>

            {/* Progress indicator when saving */}
            {isSaving && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full animate-pulse"
                    style={{ width: "70%" }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Processing your request...
                </p>
              </div>
            )}

            {/* Close button - only show when not saving */}
            {!isSaving && (
              <button
                onClick={() => setShowSaveChangesPopup(false)}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors transform hover:scale-105"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Critical Save Popup */}
      {showCriticalSavePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fadeIn">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <Save size={32} className="text-emerald-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Critical Adjustments Saved
            </h2>
            <p className="text-gray-600 mb-6">
              Your critical forecast adjustments have been saved successfully.
            </p>
            <button
              onClick={() => setShowCriticalSavePopup(false)}
              className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle size={24} />
            <div>
              <div className="font-semibold">Changes Applied Successfully!</div>
              <div className="text-sm opacity-90">
                Forecast data has been updated
              </div>
            </div>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="ml-4 hover:bg-green-600 rounded p-1 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

SavePopups.propTypes = {
  showSaveChangesPopup: PropTypes.bool.isRequired,
  setShowSaveChangesPopup: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  showCriticalSavePopup: PropTypes.bool.isRequired,
  setShowCriticalSavePopup: PropTypes.func.isRequired,
  showSuccessPopup: PropTypes.bool.isRequired,
  setShowSuccessPopup: PropTypes.func.isRequired,
};

export default SavePopups;
