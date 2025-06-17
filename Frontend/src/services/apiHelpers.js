// src/services/apiHelpers.js - Helper functions for API calls with enhanced filtering

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Build query parameters for the enhanced filter API
export const buildFilterParams = (filters, productType) => {
  const params = new URLSearchParams();

  // Multi-select filters that accept arrays
  const multiSelectFilters = {
    category: filters.category || [],
    birthstone: filters.birthstone || [],
    is_red_box_item: filters.is_red_box_item || [],
    vdf_status: filters.vdf_status || [],
  };

  // Add multi-select filters
  Object.entries(multiSelectFilters).forEach(([key, values]) => {
    if (Array.isArray(values) && values.length > 0) {
      values.forEach((value) => {
        // Convert UI values to API format
        if (key === "is_red_box_item") {
          const apiValue =
            value === "Yes" ? "true" : value === "No" ? "false" : value;
          params.append(key, apiValue);
        } else if (key === "vdf_status") {
          const apiValue =
            value === "Active"
              ? "true"
              : value === "Inactive"
              ? "false"
              : value;
          params.append(key, apiValue);
        } else {
          params.append(key, value);
        }
      });
    }
  });

  // Single-select boolean filters
  const booleanFilters = [
    "is_considered_birthstone",
    "is_added_quantity_using_macys_soq",
    "is_below_min_order",
    "is_over_macys_soq",
    "is_added_only_to_balance_macys_soq",
    "is_need_to_review_first",
    "valentine_day",
    "mothers_day",
    "fathers_day",
    "mens_day",
    "womens_day",
  ];

  booleanFilters.forEach((filterKey) => {
    const value = filters[filterKey];
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      value !== "clear"
    ) {
      params.append(filterKey, value);
    }
  });

  // Add product type if specified
  if (productType) {
    params.append("product_type", productType);
  }

  return params;
};

// Fetch products with enhanced filtering
export const fetchProductsWithFilters = async (productType, filters) => {
  try {
    const params = buildFilterParams(filters, productType);

    //console.log(
      "API Request:",
      `${API_BASE_URL}/forecast/query/filter_products/?${params.toString()}`
    );

    const response = await axios.get(
      `${API_BASE_URL}/forecast/query/filter_products/?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
      productType,
      appliedFilters: filters,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: error.response?.data || error.message,
      productType,
      appliedFilters: filters,
    };
  }
};

// Fetch available filter options
export const fetchAvailableFilters = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/forecast/query/filter_products/`
    );

    // const allProducts = [
    //   ...(response.data.store_products || []),
    //   ...(response.data.com_products || []),
    //   ...(response.data.omni_products || []),
    // ];
    const allProducts = response.data || [];

    // Extract unique values for each filter type
    const categories = [
      ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
    ].sort();

    const birthstones = [
      ...new Set(allProducts.map((p) => p.birthstone).filter(Boolean)),
    ].sort();

    // Static options for boolean filters
    const redBoxItems = ["Yes", "No"];
    const vdfStatuses = ["Active", "Inactive"];

    return {
      success: true,
      data: {
        categories,
        birthstones,
        is_red_box_items: redBoxItems,
        vdf_statuses: vdfStatuses,
        // Holiday filters are boolean, so they don't need options from API
        holidays: [
          "Valentine's Day",
          "Mother's Day",
          "Father's Day",
          "Men's Day",
          "Women's Day",
        ],
      },
    };
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return {
      success: false,
      error: error.response?.data || error.message,
      data: {
        categories: [],
        birthstones: [],
        is_red_box_items: [],
        vdf_statuses: [],
        holidays: [],
      },
    };
  }
};

// Fetch product details
export const fetchProductDetails = async (productId, sheetId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/forecast/api/product/${productId}/?sheet_id=${sheetId}`
    );

    return {
      success: true,
      data: response.data,
      productId,
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    return {
      success: false,
      error: error.response?.data || error.message,
      productId,
    };
  }
};

// Fetch product notes
// export const fetchProductNotes = async (productIds = []) => {
//   try {
//     let url = `${API_BASE_URL}/forecast/forecast-notes/`;

//     // If specific product IDs are provided, filter by them
//     if (productIds.length > 0) {
//       const params = new URLSearchParams();
//       productIds.forEach((pid) => params.append("pid", pid));
//       url += `?${params.toString()}`;
//     }

//     const response = await axios.get(url);

//     return {
//       success: true,
//       data: response.data.results || response.data,
//     };
//   } catch (error) {
//     console.error("Error fetching product notes:", error);
//     return {
//       success: false,
//       error: error.response?.data || error.message,
//       data: [],
//     };
//   }
// };

// Create or update product note
export const saveProductNote = async (noteData) => {
  try {
    const url = `${API_BASE_URL}/forecast/forecast-notes/`;
    const response = await axios.post(url, noteData);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error saving product note:", error);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

// Update product note
export const updateProductNote = async (noteId, noteData) => {
  try {
    const url = `${API_BASE_URL}/forecast/forecast-notes/${noteId}/`;
    const response = await axios.patch(url, noteData);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error updating product note:", error);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

// Delete product note
export const deleteProductNote = async (noteId) => {
  try {
    const url = `${API_BASE_URL}/forecast/forecast-notes/${noteId}/`;
    await axios.delete(url);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting product note:", error);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

// Utility function to format filter values for display
export const formatFilterValueForDisplay = (filterKey, value) => {
  switch (filterKey) {
    case "is_red_box_item":
      return value === "true" ? "Yes" : value === "false" ? "No" : value;
    case "vdf_status":
      return value === "true"
        ? "Active"
        : value === "false"
        ? "Inactive"
        : value;
    case "is_considered_birthstone":
    case "is_added_quantity_using_macys_soq":
    case "is_below_min_order":
    case "is_over_macys_soq":
    case "is_added_only_to_balance_macys_soq":
    case "is_need_to_review_first":
    case "valentine_day":
    case "mothers_day":
    case "fathers_day":
    case "mens_day":
    case "womens_day":
      return value === "true" ? "Yes" : value === "false" ? "No" : value;
    default:
      return value;
  }
};

// Utility function to get filter display name
export const getFilterDisplayName = (filterKey) => {
  const displayNames = {
    category: "Category",
    birthstone: "Birthstone",
    is_red_box_item: "Red Box Item",
    vdf_status: "VDF Status",
    is_considered_birthstone: "Considered Birthstone",
    is_added_quantity_using_macys_soq: "Added Qty Macy's SOQ",
    is_below_min_order: "Below Min Order",
    is_over_macys_soq: "Over Macy's SOQ",
    is_added_only_to_balance_macys_soq: "Added Only to Balance SOQ",
    is_need_to_review_first: "Need to Review First",
    valentine_day: "Valentine's Day",
    mothers_day: "Mother's Day",
    fathers_day: "Father's Day",
    mens_day: "Men's Day",
    womens_day: "Women's Day",
  };

  return (
    displayNames[filterKey] ||
    filterKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

// Validate filter values
export const validateFilters = (filters) => {
  const errors = {};

  // Validate array filters
  const arrayFilters = [
    "category",
    "birthstone",
    "is_red_box_item",
    "vdf_status",
  ];
  arrayFilters.forEach((key) => {
    if (filters[key] && !Array.isArray(filters[key])) {
      errors[key] = `${key} must be an array`;
    }
  });

  // Validate boolean filters
  const booleanFilters = [
    "is_considered_birthstone",
    "is_added_quantity_using_macys_soq",
    "is_below_min_order",
    "is_over_macys_soq",
    "is_added_only_to_balance_macys_soq",
    "is_need_to_review_first",
    "valentine_day",
    "mothers_day",
    "fathers_day",
    "mens_day",
    "womens_day",
  ];

  booleanFilters.forEach((key) => {
    const value = filters[key];
    if (
      value !== null &&
      value !== undefined &&
      !["true", "false", "clear", ""].includes(value)
    ) {
      errors[key] = `${key} must be 'true', 'false', or null`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  buildFilterParams,
  fetchProductsWithFilters,
  fetchAvailableFilters,
  fetchProductDetails,
  fetchProductNotes,
  saveProductNote,
  updateProductNote,
  deleteProductNote,
  formatFilterValueForDisplay,
  getFilterDisplayName,
  validateFilters,
};
