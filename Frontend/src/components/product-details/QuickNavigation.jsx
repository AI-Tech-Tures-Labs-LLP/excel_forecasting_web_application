import React from "react";
import PropTypes from "prop-types";
import { Navigation, ChevronLeft, ChevronRight } from "lucide-react";

const QuickNavigation = ({
  previousProduct,
  nextProduct,
  onNavigatePrevious,
  onNavigateNext,
}) => {
  // Only render if there are products to navigate to
  if (!previousProduct && !nextProduct) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Navigation size={16} />
          <span>Quick Navigation:</span>
        </div>
        <div className="flex items-center gap-4">
          {previousProduct && (
            <button
              onClick={onNavigatePrevious}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">{previousProduct.pid}</span>
              <span className="sm:hidden">Previous</span>
            </button>
          )}
          {nextProduct && (
            <button
              onClick={onNavigateNext}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              <span className="hidden sm:inline">{nextProduct.pid}</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

QuickNavigation.propTypes = {
  previousProduct: PropTypes.object,
  nextProduct: PropTypes.object,
  onNavigatePrevious: PropTypes.func.isRequired,
  onNavigateNext: PropTypes.func.isRequired,
};

export default QuickNavigation;
