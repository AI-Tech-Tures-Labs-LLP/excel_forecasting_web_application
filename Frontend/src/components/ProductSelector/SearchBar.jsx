// ProductSelector/SearchBar.jsx
import React, { useState, useEffect } from "react";
import { Search, Clock, Calendar, MessageSquare, User, Eye, ChevronDown, Package } from "lucide-react";

const SearchBar = ({
  searchQuery,
  onSearch,
  onProductSelect,
  processedProducts,
  productNotesData,
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("recentSearchedProducts") || "[]"
    );
    setRecentSearches(stored);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchContainer = event.target.closest(".search-container");
      if (!searchContainer) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const saveToRecentSearches = (product) => {
    try {
      const existingSearches = JSON.parse(
        localStorage.getItem("recentSearchedProducts") || "[]"
      );

      // Remove the product if it already exists (to avoid duplicates)
      const filteredSearches = existingSearches.filter(
        (item) => item.pid !== product.pid
      );

      // Add the new product to the beginning of the array
      const updatedSearches = [product, ...filteredSearches];

      // Keep only the latest 10 searches
      const limitedSearches = updatedSearches.slice(0, 10);

      // Save to localStorage
      localStorage.setItem(
        "recentSearchedProducts",
        JSON.stringify(limitedSearches)
      );

      // Update state
      setRecentSearches(limitedSearches);
    } catch (error) {
      console.error("Error saving to recent searches:", error);
    }
  };

  const handleSearch = (query) => {
    onSearch(query);
    setShowSearchDropdown(true);
  };

  const handleSearchInputFocus = () => {
    setShowSearchDropdown(true);
  };

  const handleViewDetails = (product) => {
    // Save to recent searches before navigating
    saveToRecentSearches(product);

    // Close search dropdown
    setShowSearchDropdown(false);
    onSearch("");

    // Navigate to details
    onProductSelect(product);
  };

  const handleRecentSearchClick = (product) => {
    // Move the clicked item to the top of recent searches
    saveToRecentSearches(product);

    // Navigate to details
    handleViewDetails(product);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem("recentSearchedProducts");
    setRecentSearches([]);
  };

  return (
    <div className="relative search-container w-full sm:w-auto sm:min-w-[300px] lg:min-w-[400px]">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        type="text"
        placeholder="Search products by ID or category..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={handleSearchInputFocus}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      />

      {/* Search Results Dropdown */}
      {showSearchDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-w-full">
          {/* Show Recent Searches when no query or query matches recent items */}
          {searchQuery.trim() === "" && recentSearches.length > 0 && (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">
                  Recent Searches
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {recentSearches.map((product) => (
                  <div
                    key={`recent-${product.pid}`}
                    onClick={() => handleRecentSearchClick(product)}
                    className="relative bg-white border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 cursor-pointer overflow-hidden group last:border-b-0"
                  >
                    {/* Left accent border - different color for recent searches */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-teal-600"></div>

                    <div className="p-4 pl-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <h3 className="font-bold text-gray-900 text-base">
                                {product.pid}
                              </h3>
                            </div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {product.category}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Recently Viewed</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>
                                {productNotesData[product.pid]?.count || 0} Notes
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>
                                {productNotesData[product.pid]?.assignedTo ||
                                  "Unassigned"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="inline-flex items-center px-2 py-1 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {recentSearches.length >= 10 && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
                  Showing recent 10 searches
                </div>
              )}
            </>
          )}

          {/* Show Search Results when there's a query */}
          {searchQuery.trim() !== "" && processedProducts.length > 0 && (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm text-gray-600 font-medium">
                {processedProducts.length} products found
              </div>
              <div className="max-h-80 overflow-y-auto">
                {processedProducts.slice(0, 10).map((product) => (
                  <div
                    key={product.pid}
                    onClick={() => handleViewDetails(product)}
                    className="relative bg-white border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 cursor-pointer overflow-hidden group last:border-b-0"
                  >
                    {/* Left accent border */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600"></div>

                    <div className="p-4 pl-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-bold text-gray-900 text-base">
                              {product.pid}
                            </h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {product.category}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Added Today</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>
                                {productNotesData[product.pid]?.count || 0} Notes
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>
                                {productNotesData[product.pid]?.assignedTo ||
                                  "Unassigned"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {processedProducts.length > 10 && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
                  <ChevronDown className="w-3 h-3 inline mr-1" />
                  Showing first 10 of {processedProducts.length} results
                </div>
              )}
            </>
          )}

          {/* No results message */}
          {searchQuery.trim() !== "" && processedProducts.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No products found</p>
              <p className="text-xs text-gray-400">
                Try adjusting your search terms
              </p>
            </div>
          )}

          {/* Empty state when no recent searches */}
          {searchQuery.trim() === "" && recentSearches.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No recent searches</p>
              <p className="text-xs text-gray-400">
                Search for products to see them here
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;