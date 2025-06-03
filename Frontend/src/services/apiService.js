// src/services/apiService.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging and auth
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// FORECAST SERVICES
// ============================================================================

export const forecastService = {
  // Upload forecast file
  uploadForecast: async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/forecast/upload/`,
        formData,
        {
          timeout: 600000, // 10 minutes for file uploads
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  },
  // Get forecast sheet data
  getForecastSheetData: async () => {
    try {
      const response = await apiClient.get("/api/sheet/");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Get forecast notes
  getForecastNotes: async (productId = null) => {
    try {
      const url = productId
        ? `/forecast/forecast-notes/?pid=${productId}`
        : "/forecast/forecast-notes/";

      const response = await apiClient.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Create forecast note
  createForecastNote: async (noteData) => {
    try {
      const response = await apiClient.post(
        "/forecast/forecast-notes/",
        noteData
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Update forecast note
  updateForecastNote: async (noteId, noteData) => {
    try {
      const response = await apiClient.patch(
        `/forecast/forecast-notes/${noteId}/`,
        noteData
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Delete forecast note
  deleteForecastNote: async (noteId) => {
    try {
      await apiClient.delete(`/forecast/forecast-notes/${noteId}/`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Download final quantity report
  downloadFinalQuantityReport: async () => {
    try {
      const response = await apiClient.get("/forecast/final-quantity-report/", {
        responseType: "blob",
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Export summary
  exportSummary: async () => {
    try {
      const response = await apiClient.get("/forecast/export-summary", {
        responseType: "blob",
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Download category files
  downloadCategoryFiles: async (categories, fileName = "") => {
    try {
      const categoriesParam = Array.isArray(categories)
        ? categories.join(",")
        : categories;
      const params = new URLSearchParams({
        category: categoriesParam,
        ...(fileName && { file_path: fileName }),
      });

      const response = await apiClient.get(
        `/forecast/download-category/?${params}`,
        {
          responseType: "blob",
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },
};

// ============================================================================
// PRODUCT SERVICES
// ============================================================================

export const productService = {
  // Get filtered products
  getFilteredProducts: async (productType, filters = {}) => {
    try {
      const params = new URLSearchParams();

      // Multi-select filters (arrays)
      const multiSelectFilters = [
        "category",
        "birthstone",
        "red_box_item",
        "vdf_status",
        "tagged_to",
        "forecast_month",
        "status",
      ];

      multiSelectFilters.forEach((filterKey) => {
        const values = filters[filterKey];
        if (Array.isArray(values) && values.length > 0) {
          values.forEach((value) => {
            if (filterKey === "red_box_item" || filterKey === "vdf_status") {
              // Convert string values to boolean for API
              const boolValue =
                value === "Yes" ? "true" : value === "No" ? "false" : value;
              params.append(filterKey, boolValue);
            } else {
              params.append(filterKey, value);
            }
          });
        }
      });

      // Single-select boolean filters
      const booleanFilters = [
        "considered_birthstone",
        "added_qty_macys_soq",
        "below_min_order",
        "over_macys_soq",
        "added_only_to_balance_soq",
        "need_to_review_first",
        "valentine_day",
        "mothers_day",
        "fathers_day",
        "mens_day",
        "womens_day",
      ];

      booleanFilters.forEach((filterKey) => {
        const value = filters[filterKey];
        if (value !== null && value !== undefined && value !== "") {
          params.append(filterKey, value);
        }
      });

      // Sorting filters
      const sortingFilters = [
        "notes_sort",
        "added_qty_sort",
        "last_reviewed_sort",
      ];

      sortingFilters.forEach((filterKey) => {
        const value = filters[filterKey];
        if (value !== null && value !== undefined && value !== "") {
          params.append(filterKey, value);
        }
      });

      // Product type filter
      if (productType) {
        params.append("product_type", productType);
      }

      const response = await apiClient.get(
        `/forecast/query/filter_products/?${params}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Get product details
  getProductDetails: async (productId) => {
    try {
      const response = await apiClient.get(
        `/forecast/api/product/${productId}/`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Update product details
  updateProductDetails: async (productId, productData) => {
    try {
      const response = await apiClient.put(
        `/forecast/api/product/${productId}/`,
        productData
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Recalculate forecast
  recalculateForecast: async (payload) => {
    try {
      const response = await apiClient.post(
        "/forecast/api/product/recalculate_forecast/",
        payload
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Save and recalculate forecast
  saveAndRecalculateForecast: async (payload) => {
    try {
      const response = await apiClient.post(
        "/forecast/api/product/save_recalculate/",
        payload
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Get product website/external link
  getProductWebsite: async (productId) => {
    try {
      const response = await apiClient.get(
        `/forecast/api/product/${productId}/`
      );
      const website = response.data?.product_details?.website;
      return { success: true, data: { website } };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Bulk update external factor
  bulkUpdateExternalFactor: async (productIds, externalFactor, notes = "") => {
    try {
      const promises = productIds.map((productId) =>
        apiClient.put(`/forecast/api/product/${productId}/`, {
          product_details: {
            external_factor_percentage: parseFloat(externalFactor),
            user_added_quantity: null,
            external_factor: notes,
          },
        })
      );

      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },
};

// ============================================================================
// FILE UPLOAD SERVICES
// ============================================================================

export const fileService = {
  // Upload pricing sheet
  uploadPricingSheet: async (formData) => {
    try {
      const response = await apiClient.post("/api/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  },

  // Download file from server
  downloadFile: async (filePath, fileName = "download") => {
    try {
      const response = await apiClient.get(filePath, {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },
};

// ============================================================================
// NOTES SERVICES
// ============================================================================

export const notesService = {
  // Get notes for a product
  getProductNotes: async (productId) => {
    try {
      const response = await apiClient.get(
        `/forecast/forecast-notes/?pid=${productId}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Get all notes
  getAllNotes: async () => {
    try {
      const response = await apiClient.get("/forecast/forecast-notes/");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Create a note
  createNote: async (noteData) => {
    try {
      const response = await apiClient.post(
        "/forecast/forecast-notes/",
        noteData
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Update a note
  updateNote: async (noteId, noteData) => {
    try {
      const response = await apiClient.patch(
        `/forecast/forecast-notes/${noteId}/`,
        noteData
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },

  // Delete a note
  deleteNote: async (noteId) => {
    try {
      await apiClient.delete(`/forecast/forecast-notes/${noteId}/`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const apiUtils = {
  // Build filter parameters for product queries
  buildFilterParams: (filters, productType) => {
    const params = new URLSearchParams();

    // Multi-select filters
    const multiSelectFilters = [
      "category",
      "birthstone",
      "red_box_item",
      "vdf_status",
      "tagged_to",
      "forecast_month",
      "status",
    ];

    multiSelectFilters.forEach((filterKey) => {
      const values = filters[filterKey];
      if (Array.isArray(values) && values.length > 0) {
        values.forEach((value) => {
          if (filterKey === "red_box_item" || filterKey === "vdf_status") {
            const boolValue =
              value === "Yes" ? "true" : value === "No" ? "false" : value;
            params.append(filterKey, boolValue);
          } else {
            params.append(filterKey, value);
          }
        });
      }
    });

    // Boolean filters
    const booleanFilters = [
      "considered_birthstone",
      "added_qty_macys_soq",
      "below_min_order",
      "over_macys_soq",
      "added_only_to_balance_soq",
      "need_to_review_first",
      "valentine_day",
      "mothers_day",
      "fathers_day",
      "mens_day",
      "womens_day",
    ];

    booleanFilters.forEach((filterKey) => {
      const value = filters[filterKey];
      if (value !== null && value !== undefined && value !== "") {
        params.append(filterKey, value);
      }
    });

    // Product type
    if (productType) {
      params.append("product_type", productType);
    }

    return params;
  },

  // Format error messages
  formatErrorMessage: (error) => {
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    if (error?.error) return error.error;
    return "An unexpected error occurred";
  },

  // Check if response is successful
  isSuccessResponse: (response) => {
    return response && response.success === true;
  },

  // Handle file download from blob
  downloadBlob: (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Create form data from object
  createFormData: (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "categories") {
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  },
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const apiService = {
  forecast: forecastService,
  product: productService,
  file: fileService,
  notes: notesService,
  utils: apiUtils,

  // Direct access to axios instance for custom calls
  client: apiClient,
};

export default apiService;
