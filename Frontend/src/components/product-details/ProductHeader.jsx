import React from "react";
import PropTypes from "prop-types";
import {
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  History,
  X,
} from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductHeader = ({
  productId,
  cardData,
  onBack,
  searchQuery,
  setSearchQuery,
  searchResults,
  showSearchDropdown,
  setShowSearchDropdown,
  recentSearches,
  showRecentSearches,
  setShowRecentSearches,
  handleNavigateToProduct,
  canNavigatePrevious,
  canNavigateNext,
  previousProduct,
  nextProduct,
  currentProductIndex,
  allProducts,
  handleSearchChange,
  handleSearchFocus,
  handleSearchBlur,
  handleSearchResultClick,
  handleRecentSearchClick,
  clearRecentSearches,
  removeFromRecentSearches,
}) => {
  const { sheetId } = useParams();
  const handleProductLinkClick = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/product/${productId}/?sheet_id=${sheetId}`
      );
      const externalLink = response.data?.product_details?.website;

      localStorage.setItem("externalLink", externalLink);

      if (externalLink) {
        window.open(externalLink, "_blank");
      } else {
        alert("No website link found for this product.");
      }
    } catch (error) {
      console.error("Error fetching product link:", error);
      alert("Failed to fetch product link.");
    }
  };

  const handlePreviousProduct = () => {
    if (canNavigatePrevious && previousProduct) {
      handleNavigateToProduct(previousProduct.pid);
    }
  };

  const handleNextProduct = () => {
    if (canNavigateNext && nextProduct) {
      handleNavigateToProduct(nextProduct.pid);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-10 py-6 min-h-[200px] relative">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white opacity-90 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Products</span>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex items-center gap-8">
          {/* Large Product Image with Link - Left */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg bg-white/10">
                <img
                  src={`${
                    import.meta.env.VITE_API_BASE_URL
                  }/media/images/${productId}.png`}
                  alt={`Product ${productId}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full bg-white/20 flex items-center justify-center">
                        <span class="text-white/60 text-sm font-medium">No Image</span>
                      </div>
                    `;
                  }}
                />
              </div>

              {/* Product Link Button - Near Image */}
              <div className="mt-3">
                <button
                  onClick={handleProductLinkClick}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 border-2 border-amber-300 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  title="View on Macy's website"
                >
                  <ExternalLink size={16} className="text-white" />
                  <span className="text-sm">Macy's Web ID</span>
                </button>
              </div>
            </div>
          </div>

          {/* Center Content - Product Details and Search */}
          <div className="flex-1 flex flex-col items-center">
            {/* Product Title - Center */}
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-white mb-2">
                Product Details: {cardData?.productId}
              </h1>
              <p className="text-indigo-100">
                Comprehensive forecast and performance analytics
              </p>
            </div>

            {/* Search Bar - Center */}
            <div className="relative w-full max-w-md">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search products by ID or category..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all"
                />

                {/* Recent Searches Dropdown */}
                {showRecentSearches && recentSearches.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <History size={16} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">
                          Recent Searches
                        </span>
                      </div>
                      <button
                        onClick={clearRecentSearches}
                        className="text-gray-400 hover:text-red-500 p-1 rounded"
                        title="Clear all recent searches"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {recentSearches.map((recentSearch, index) => (
                      <div
                        key={recentSearch.pid}
                        className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between group ${
                          index !== recentSearches.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        } ${
                          recentSearch.pid === productId
                            ? "bg-indigo-50 border-indigo-200"
                            : ""
                        }`}
                      >
                        <div
                          onClick={() => handleRecentSearchClick(recentSearch)}
                          className="flex-1"
                        >
                          <div className="flex items-center gap-2">
                            <History size={14} className="text-gray-400" />
                            <div className="font-medium text-gray-900">
                              {recentSearch.pid}
                            </div>
                          </div>
                          {recentSearch.category && (
                            <div className="text-sm text-gray-500 ml-6">
                              {recentSearch.category}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {recentSearch.pid === productId && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                          <button
                            onClick={() =>
                              removeFromRecentSearches(recentSearch.pid)
                            }
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded transition-opacity"
                            title="Remove from recent searches"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Search Dropdown */}
                {showSearchDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
                    {searchResults.map((product, index) => (
                      <div
                        key={product.pid}
                        onClick={() => handleSearchResultClick(product)}
                        className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                          index !== searchResults.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        } ${
                          product.pid === productId
                            ? "bg-indigo-50 border-indigo-200"
                            : ""
                        }`}
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {product.pid}
                          </div>
                          {product.category && (
                            <div className="text-sm text-gray-500">
                              {product.category}
                            </div>
                          )}
                        </div>
                        {product.pid === productId && (
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {showSearchDropdown &&
                  searchQuery &&
                  searchResults.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="px-4 py-3 text-gray-500 text-center">
                        No products found matching "{searchQuery}"
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Navigation Controls - Right */}
          <div className="flex items-center gap-4">
            {/* Product Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousProduct}
                disabled={!canNavigatePrevious}
                className={`p-2 rounded-lg border border-white/20 transition-all ${
                  canNavigatePrevious
                    ? "text-white hover:bg-white/10 cursor-pointer"
                    : "text-white/30 cursor-not-allowed"
                }`}
                title={
                  canNavigatePrevious
                    ? `Previous: ${previousProduct?.pid}`
                    : "No previous product"
                }
              >
                <ChevronLeft size={20} />
              </button>

              <span className="text-white/80 text-sm px-2">
                {currentProductIndex + 1} of {allProducts.length}
              </span>

              <button
                onClick={handleNextProduct}
                disabled={!canNavigateNext}
                className={`p-2 rounded-lg border border-white/20 transition-all ${
                  canNavigateNext
                    ? "text-white hover:bg-white/10 cursor-pointer"
                    : "text-white/30 cursor-not-allowed"
                }`}
                title={
                  canNavigateNext
                    ? `Next: ${nextProduct?.pid}`
                    : "No next product"
                }
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductHeader.propTypes = {
  productId: PropTypes.string.isRequired,
  cardData: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  showSearchDropdown: PropTypes.bool.isRequired,
  setShowSearchDropdown: PropTypes.func.isRequired,
  recentSearches: PropTypes.array.isRequired,
  showRecentSearches: PropTypes.bool.isRequired,
  setShowRecentSearches: PropTypes.func.isRequired,
  handleNavigateToProduct: PropTypes.func.isRequired,
  canNavigatePrevious: PropTypes.bool.isRequired,
  canNavigateNext: PropTypes.bool.isRequired,
  previousProduct: PropTypes.object,
  nextProduct: PropTypes.object,
  currentProductIndex: PropTypes.number.isRequired,
  allProducts: PropTypes.array.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  handleSearchFocus: PropTypes.func.isRequired,
  handleSearchBlur: PropTypes.func.isRequired,
  handleSearchResultClick: PropTypes.func.isRequired,
  handleRecentSearchClick: PropTypes.func.isRequired,
  clearRecentSearches: PropTypes.func.isRequired,
  removeFromRecentSearches: PropTypes.func.isRequired,
};

export default ProductHeader;
