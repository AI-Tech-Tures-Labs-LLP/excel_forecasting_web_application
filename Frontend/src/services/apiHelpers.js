// src/services/apiHelpers.js - Helper functions for API calls with enhanced filtering and pagination

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Build query parameters for the enhanced filter API with pagination
// export const buildFilterParams = (
//   filters,
//   productType,
//   page = 1,
//   pageSize = 10
// ) => {
//   const params = new URLSearchParams();

//   // Add pagination parameters
//   params.append("page", page.toString());
//   params.append("page_size", pageSize.toString());

//   // Multi-select filters that accept arrays
//   const multiSelectFilters = {
//     category: filters.category || [],
//     birthstone: filters.birthstone || [],
//     is_red_box_item: filters.is_red_box_item || [],
//     vdf_status: filters.vdf_status || [],
//     tagged_to: filters.tagged_to || [],
//     forecast_month: filters.forecast_month || [],
//     status: filters.status || [],
//     assigned_to: filters.assigned_to || [],
//   };

//   // Add multi-select filters
//   Object.entries(multiSelectFilters).forEach(([key, values]) => {
//     if (Array.isArray(values) && values.length > 0) {
//       values.forEach((value) => {
//         // Convert UI values to API format
//         if (key === "is_red_box_item") {
//           const apiValue =
//             value === "Yes" ? "true" : value === "No" ? "false" : value;
//           params.append(key, apiValue);
//         } else if (key === "vdf_status") {
//           const apiValue =
//             value === "Active"
//               ? "true"
//               : value === "Inactive"
//               ? "false"
//               : value;
//           params.append(key, apiValue);
//         } else {
//           params.append(key, value);
//         }
//       });
//     }
//   });

//   // Single-select boolean filters
//   const booleanFilters = [
//     "is_considered_birthstone",
//     "is_added_quantity_using_macys_soq",
//     "is_below_min_order",
//     "is_over_macys_soq",
//     "is_added_only_to_balance_macys_soq",
//     "is_need_to_review_first",
//     "valentine_day",
//     "mothers_day",
//     "fathers_day",
//     "mens_day",
//     "womens_day",
//   ];

//   booleanFilters.forEach((filterKey) => {
//     const value = filters[filterKey];
//     if (
//       value !== null &&
//       value !== undefined &&
//       value !== "" &&
//       value !== "clear"
//     ) {
//       params.append(filterKey, value);
//     }
//   });

//   // Add sorting parameters
//   if (filters.notes_sort) {
//     params.append(
//       "ordering",
//       filters.notes_sort === "latest" ? "-created_at" : "created_at"
//     );
//   }
//   if (filters.added_qty_sort) {
//     params.append(
//       "ordering",
//       filters.added_qty_sort === "asc"
//         ? "recommended_total_quantity"
//         : "-recommended_total_quantity"
//     );
//   }
//   if (filters.final_qty_sort) {
//     params.append(
//       "ordering",
//       filters.final_qty_sort === "asc"
//         ? "user_updated_final_quantity"
//         : "-user_updated_final_quantity"
//     );
//   }
//   if (filters.last_reviewed_sort) {
//     params.append(
//       "ordering",
//       filters.last_reviewed_sort === "newest" ? "-updated_at" : "updated_at"
//     );
//   }

//   // Add search query
//   if (filters.search) {
//     params.append("search", filters.search);
//   }

//   // Add product type if specified
//   if (productType) {
//     params.append("product_type", productType);
//   }

//   return params;
// };
export const buildFilterParams = (
  filters,
  productType,
  page = 1,
  pageSize = 10
) => {
  const params = new URLSearchParams();

  // Pagination
  params.append("page", page.toString());
  params.append("page_size", pageSize.toString());

  // Multi-select filters
  const multiSelectFilters = {
    category: filters.category || [],
    birthstone: filters.birthstone || [],
    is_red_box_item: filters.is_red_box_item || [],
    vdf_status: filters.vdf_status || [],
    tagged_to: filters.tagged_to || [],
    forecast_month: filters.forecast_month || [],
    status: filters.status || [],
    assigned_to: filters.assigned_to || [],
  };

  Object.entries(multiSelectFilters).forEach(([key, values]) => {
    values.forEach((value) => {
      let processed = value;
      if (key === "is_red_box_item" || key === "vdf_status") {
        processed = value === "Yes" ? "true" : value === "No" ? "false" : value;
      } else if (key === "birthstone") {
        processed = value.toString().trim().toUpperCase(); // ✅ Ensure full uppercase
      }
      params.append(key, processed);
    });
  });

  // Boolean single-select filters
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
      value !== "" &&
      value !== "clear"
    ) {
      params.append(key, value);
    }
  });

  // ✅ Enhanced sorting (new format)
  if (filters.sort_by) {
    const sortKeyMap = {
      created_at: "note_created_at",
      notes: "note_created_at",
      note_created_at: "note_created_at",
      recommended_total_quantity: "recommended_total_quantity",
      user_updated_final_quantity: "user_updated_final_quantity",
      updated_at: "updated_at",
    };

    const backendSortKey = sortKeyMap[filters.sort_by] || filters.sort_by;
    const sortDirection = filters.sort_direction === "desc" ? "-" : "";
    params.append("sort_by", `${sortDirection}${backendSortKey}`);
  } else {
    // ✅ Legacy fallback sorting (if new `sort_by` is not used)
    if (filters.notes_sort) {
      params.append(
        "sort_by",
        filters.notes_sort === "latest" ? "-note_created_at" : "note_created_at"
      );
    } else if (filters.added_qty_sort) {
      params.append(
        "sort_by",
        filters.added_qty_sort === "asc"
          ? "recommended_total_quantity"
          : "-recommended_total_quantity"
      );
    } else if (filters.final_qty_sort) {
      params.append(
        "sort_by",
        filters.final_qty_sort === "asc"
          ? "user_updated_final_quantity"
          : "-user_updated_final_quantity"
      );
    } else if (filters.last_reviewed_sort) {
      params.append(
        "sort_by",
        filters.last_reviewed_sort === "newest" ? "-updated_at" : "updated_at"
      );
    }
  }

  // Search
  if (filters.search && filters.search.trim()) {
    params.append("search", filters.search.trim());
  }

  // Product type
  if (productType && productType !== "all") {
    params.append("product_type", productType);
  }

  return params;
};

// Fetch products with enhanced filtering and pagination
export const fetchProductsWithFilters = async (
  productType,
  filters,
  sheetId,
  page = 1,
  pageSize = 10
) => {
  try {
    const params = buildFilterParams(filters, productType, page, pageSize);

    // Add sheet_id parameter
    if (sheetId) {
      params.append("sheet_id", sheetId);
    }

    console.log(
      "API Request:",
      `${API_BASE_URL}/forecast/query/filter_products/?${params.toString()}`
    );

    const response = await axios.get(
      `${API_BASE_URL}/forecast/query/filter_products/?${params.toString()}`
    );

    // Handle paginated response structure
    const data = response.data;

    return {
      success: true,
      data: {
        results: data.results || [],
        count: data.count || 0,
        next: data.next,
        previous: data.previous,
        totalPages: Math.ceil((data.count || 0) / pageSize),
        currentPage: page,
        pageSize: pageSize,
        hasNext: !!data.next,
        hasPrevious: !!data.previous,
      },
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
      data: {
        results: [],
        count: 0,
        totalPages: 0,
        currentPage: page,
        pageSize: pageSize,
        hasNext: false,
        hasPrevious: false,
      },
    };
  }
};

// Fetch available filter options
export const fetchAvailableFilters = async (sheetId) => {
  try {
    const params = new URLSearchParams();
    if (sheetId) {
      params.append("sheet_id", sheetId);
    }

    const response = await axios.get(
      `${API_BASE_URL}/forecast/query/filter_products/?${params.toString()}`
    );

    const allProducts = response.data.results || [];

    // Extract unique values for each filter type
    const categories = [
      ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
    ].sort();

    const birthstones = [
      ...new Set(allProducts.map((p) => p.birthstone).filter(Boolean)),
    ].sort();

    // Extract forecast months
    const forecastMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const statuses = ["Reviewed", "Not Reviewed", "Pending"];

    // Static options for boolean filters
    const redBoxItems = ["Yes", "No"];
    const vdfStatuses = ["Active", "Inactive"];

    // Get tagged users from notes if available
    let taggedToUsers = ["Unassigned"];
    try {
      const notesResponse = await axios.get(
        `${API_BASE_URL}/forecast/forecast-notes/?sheet_id=${sheetId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const notesData = notesResponse.data;
      const notes = notesData.results || notesData;

      const assignedUsers = [
        ...new Set(
          notes
            .map((note) => note.assigned_to)
            .filter(Boolean)
            .filter((user) => user !== "Unassigned")
        ),
      ];

      taggedToUsers = ["Unassigned", ...assignedUsers.sort()];
    } catch (notesError) {
      console.warn("Could not load notes for tagged users:", notesError);
    }

    return {
      success: true,
      data: {
        categories,
        birthstones,
        is_red_box_items: redBoxItems,
        vdf_statuses: vdfStatuses,
        forecast_months: forecastMonths,
        statuses: statuses,
        tagged_to: taggedToUsers,
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
        forecast_months: [],
        statuses: [],
        tagged_to: [],
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

// Create or update product note
export const saveProductNote = async (noteData) => {
  try {
    const url = `${API_BASE_URL}/forecast/forecast-notes/`;
    const response = await axios.post(url, noteData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    });

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
    const response = await axios.patch(url, noteData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    });

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
    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    });

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
    "tagged_to",
    "forecast_month",
    "status",
    "assigned_to",
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
  saveProductNote,
  updateProductNote,
  deleteProductNote,
  formatFilterValueForDisplay,
  getFilterDisplayName,
  validateFilters,
};
