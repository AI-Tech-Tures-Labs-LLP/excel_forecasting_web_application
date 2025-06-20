// Updated productSlice.js with enhanced filter support, fixes, and pagination
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Updated async thunk for API calls with enhanced filters and pagination
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    { productType, filters, sheetId, page = 1, pageSize = 10 },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      // Add pagination parameters
      params.append("page", page.toString());
      params.append("page_size", pageSize.toString());

      if (sheetId) {
        params.append("sheet_id", sheetId);
      }

      // Multi-select filters (arrays)
      const multiSelectFilters = [
        "category",
        "birthstone",
        "is_red_box_item",
        "vdf_status",
        "tagged_to",
        "forecast_month",
        "status",
        "assigned_to",
      ];

      multiSelectFilters.forEach((filterKey) => {
        const values = filters[filterKey];
        if (Array.isArray(values) && values.length > 0) {
          values.forEach((value) => {
            if (filterKey === "is_red_box_item" || filterKey === "vdf_status") {
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
        if (value !== null && value !== undefined && value !== "") {
          params.append(filterKey, value);
        }
      });

      // Add sorting parameters
      if (filters.notes_sort) {
        params.append(
          "ordering",
          filters.notes_sort === "latest" ? "-created_at" : "created_at"
        );
      }
      if (filters.added_qty_sort) {
        params.append(
          "ordering",
          filters.added_qty_sort === "asc"
            ? "recommended_total_quantity"
            : "-recommended_total_quantity"
        );
      }
      if (filters.final_qty_sort) {
        params.append(
          "ordering",
          filters.final_qty_sort === "asc"
            ? "user_updated_final_quantity"
            : "-user_updated_final_quantity"
        );
      }
      if (filters.last_reviewed_sort) {
        params.append(
          "ordering",
          filters.last_reviewed_sort === "newest" ? "-updated_at" : "updated_at"
        );
      }

      // Add search query
      if (filters.search) {
        params.append("search", filters.search);
      }

      // Product type filter
      if (productType) {
        params.append("product_type", productType);
      }

      console.log("API Request params:", params.toString()); // Debug log

      const response = await axios.get(
        `${API_BASE_URL}/forecast/query/filter_products/?${params}`
      );

      console.log("API Response:", response.data);

      // Handle paginated response
      const responseData = response.data;
      const results = responseData.results || [];
      const count = responseData.count || 0;
      const totalPages = Math.ceil(count / pageSize);

      return {
        productType,
        data: results,
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          totalCount: count,
          totalPages: totalPages,
          hasNext: !!responseData.next,
          hasPrevious: !!responseData.previous,
          next: responseData.next,
          previous: responseData.previous,
        },
        filters,
        sheetId,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Error in fetchProducts:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async ({ productId, sheetId }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (sheetId) {
        params.append("sheet_id", sheetId);
      }

      const response = await axios.get(
        `${API_BASE_URL}/forecast/api/product/${productId}/?${params}`
      );

      return { productId, data: response.data };
    } catch (error) {
      console.error("Error in fetchProductDetails:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  // Product data
  storeProducts: [],
  comProducts: [],
  omniProducts: [],

  // Selected states
  selectedProductType: "store",
  selectedProduct: null,
  selectedProductDetails: null,

  // Loading states
  loading: {
    products: false,
    productDetails: false,
  },

  // Error states
  errors: {
    products: null,
    productDetails: null,
  },

  // Cache and metadata
  lastFetch: {
    store: null,
    com: null,
    omni: null,
  },
  cache: {
    productDetails: {},
  },

  // Enhanced pagination with backend support
  pagination: {
    store: {
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
      next: null,
      previous: null,
    },
    com: {
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
      next: null,
      previous: null,
    },
    omni: {
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
      next: null,
      previous: null,
    },
  },

  // Enhanced filter state
  appliedFilters: {
    category: [],
    birthstone: [],
    is_red_box_item: [],
    vdf_status: [],
    tagged_to: [],
    forecast_month: [],
    status: [],
    assigned_to: [],
    is_considered_birthstone: null,
    is_added_quantity_using_macys_soq: null,
    is_below_min_order: null,
    is_over_macys_soq: null,
    is_added_only_to_balance_macys_soq: null,
    is_need_to_review_first: null,
    valentine_day: null,
    mothers_day: null,
    fathers_day: null,
    mens_day: null,
    womens_day: null,
    notes_sort: null,
    added_qty_sort: null,
    final_qty_sort: null,
    last_reviewed_sort: null,
    search: "",
  },
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Product type selection
    setSelectedProductType: (state, action) => {
      state.selectedProductType = action.payload;
      state.selectedProduct = null;
      state.selectedProductDetails = null;
    },

    // Product selection
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },

    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.selectedProductDetails = null;
    },

    // Pagination actions
    setCurrentPage: (state, action) => {
      const { productType, page } = action.payload;
      if (state.pagination[productType]) {
        state.pagination[productType].currentPage = page;
      }
    },

    setPageSize: (state, action) => {
      const { productType, pageSize } = action.payload;
      if (state.pagination[productType]) {
        state.pagination[productType].pageSize = pageSize;
        state.pagination[productType].currentPage = 1; // Reset to first page
      }
    },

    resetPagination: (state, action) => {
      const productType = action.payload;
      if (state.pagination[productType]) {
        state.pagination[productType] = {
          currentPage: 1,
          pageSize: state.pagination[productType].pageSize,
          totalCount: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
          next: null,
          previous: null,
        };
      }
    },

    // Filter management
    setAppliedFilters: (state, action) => {
      state.appliedFilters = { ...state.appliedFilters, ...action.payload };
      // Reset pagination when filters change
      Object.keys(state.pagination).forEach((productType) => {
        state.pagination[productType].currentPage = 1;
      });
    },

    clearAppliedFilters: (state) => {
      state.appliedFilters = {
        category: [],
        birthstone: [],
        is_red_box_item: [],
        vdf_status: [],
        tagged_to: [],
        forecast_month: [],
        status: [],
        assigned_to: [],
        is_considered_birthstone: null,
        is_added_quantity_using_macys_soq: null,
        is_below_min_order: null,
        is_over_macys_soq: null,
        is_added_only_to_balance_macys_soq: null,
        is_need_to_review_first: null,
        valentine_day: null,
        mothers_day: null,
        fathers_day: null,
        mens_day: null,
        womens_day: null,
        notes_sort: null,
        added_qty_sort: null,
        final_qty_sort: null,
        last_reviewed_sort: null,
        search: "",
      };
      // Reset pagination when filters are cleared
      Object.keys(state.pagination).forEach((productType) => {
        state.pagination[productType].currentPage = 1;
      });
    },

    // Clear errors
    clearErrors: (state) => {
      state.errors.products = null;
      state.errors.productDetails = null;
    },

    // Cache management
    clearCache: (state) => {
      state.cache.productDetails = {};
    },

    // Reset state
    resetProductState: (state) => {
      return {
        ...initialState,
        selectedProductType: state.selectedProductType,
      };
    },

    // Legacy pagination setter (for backward compatibility)
    setPagination: (state, action) => {
      const { productType, pagination } = action.payload;
      if (state.pagination[productType]) {
        state.pagination[productType] = {
          ...state.pagination[productType],
          ...pagination,
        };
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading.products = true;
        state.errors.products = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { productType, data, filters, timestamp, pagination } =
          action.payload;

        console.log("Products fetched successfully:", {
          productType,
          dataLength: Array.isArray(data) ? data.length : "not array",
          pagination,
        });

        state.loading.products = false;
        state.appliedFilters = filters;
        state.lastFetch[productType] = timestamp;

        // Update pagination state
        if (pagination && state.pagination[productType]) {
          state.pagination[productType] = pagination;
        }

        // Handle the case where data is already filtered by product type from API
        if (Array.isArray(data)) {
          // If API returns a flat array, filter by product_type
          if (!productType) {
            // If no specific product type requested, update all
            state.storeProducts =
              data.filter((d) => d.product_type === "store") || [];
            state.comProducts =
              data.filter((d) => d.product_type === "com") || [];
            state.omniProducts =
              data.filter((d) => d.product_type === "omni") || [];
          } else {
            // Update specific product type
            switch (productType) {
              case "store":
                state.storeProducts =
                  data.filter((d) => d.product_type === "store") || [];
                break;
              case "com":
                state.comProducts =
                  data.filter((d) => d.product_type === "com") || [];
                break;
              case "omni":
                state.omniProducts =
                  data.filter((d) => d.product_type === "omni") || [];
                break;
              default:
                // If productType doesn't match known types, still filter the data
                state.storeProducts =
                  data.filter((d) => d.product_type === "store") || [];
                state.comProducts =
                  data.filter((d) => d.product_type === "com") || [];
                state.omniProducts =
                  data.filter((d) => d.product_type === "omni") || [];
            }
          }
        } else if (data && typeof data === "object") {
          // If API returns an object with separate arrays (legacy format)
          if (data.store_products !== undefined) {
            state.storeProducts = data.store_products || [];
          }
          if (data.com_products !== undefined) {
            state.comProducts = data.com_products || [];
          }
          if (data.omni_products !== undefined) {
            state.omniProducts = data.omni_products || [];
          }
        } else {
          // Fallback: if data format is unexpected
          console.warn("Unexpected data format received:", data);
          state.storeProducts = [];
          state.comProducts = [];
          state.omniProducts = [];
        }

        // Log the final state for debugging
        console.log("Final product counts:", {
          store: state.storeProducts.length,
          com: state.comProducts.length,
          omni: state.omniProducts.length,
          pagination: state.pagination[productType],
        });
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error("fetchProducts rejected:", action.payload);
        state.loading.products = false;
        state.errors.products = action.payload;
        // Clear products on error
        state.storeProducts = [];
        state.comProducts = [];
        state.omniProducts = [];
      })

      // Fetch product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading.productDetails = true;
        state.errors.productDetails = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        const { productId, data } = action.payload;

        state.loading.productDetails = false;
        state.selectedProductDetails = data;
        state.cache.productDetails[productId] = {
          data,
          timestamp: Date.now(),
        };
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        console.error("fetchProductDetails rejected:", action.payload);
        state.loading.productDetails = false;
        state.errors.productDetails = action.payload;
      });
  },
});

// Selectors
export const selectSelectedProductType = (state) =>
  state.products.selectedProductType;

export const selectProductsByType = (state, productType) => {
  switch (productType) {
    case "store":
      return state.products.storeProducts;
    case "com":
      return state.products.comProducts;
    case "omni":
      return state.products.omniProducts;
    default:
      return [];
  }
};

export const selectCurrentProducts = (state) => {
  return selectProductsByType(state, state.products.selectedProductType);
};

export const selectProductsLoading = (state) => state.products.loading.products;
export const selectProductDetailsLoading = (state) =>
  state.products.loading.productDetails;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectSelectedProductDetails = (state) =>
  state.products.selectedProductDetails;
export const selectProductErrors = (state) => state.products.errors;

// Additional selectors
export const selectStoreProducts = (state) => state.products.storeProducts;
export const selectComProducts = (state) => state.products.comProducts;
export const selectOmniProducts = (state) => state.products.omniProducts;
export const selectAllProducts = (state) => [
  ...state.products.storeProducts,
  ...state.products.comProducts,
  ...state.products.omniProducts,
];

// Pagination selectors
export const selectPagination = (state) => state.products.pagination;
export const selectCurrentPagination = (state) =>
  state.products.pagination[state.products.selectedProductType];

export const selectPaginationByType = (state, productType) =>
  state.products.pagination[productType];

export const selectCurrentPage = (state) =>
  state.products.pagination[state.products.selectedProductType]?.currentPage ||
  1;

export const selectPageSize = (state) =>
  state.products.pagination[state.products.selectedProductType]?.pageSize || 10;

export const selectTotalCount = (state) =>
  state.products.pagination[state.products.selectedProductType]?.totalCount ||
  0;

export const selectTotalPages = (state) =>
  state.products.pagination[state.products.selectedProductType]?.totalPages ||
  0;

export const selectHasNext = (state) =>
  state.products.pagination[state.products.selectedProductType]?.hasNext ||
  false;

export const selectHasPrevious = (state) =>
  state.products.pagination[state.products.selectedProductType]?.hasPrevious ||
  false;

// Computed pagination info selector
export const selectPaginationInfo = (state) => {
  const pagination =
    state.products.pagination[state.products.selectedProductType];
  if (!pagination) return { startIndex: 0, endIndex: 0, totalCount: 0 };

  const { currentPage, pageSize, totalCount } = pagination;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(startIndex + pageSize - 1, totalCount);

  return {
    startIndex: totalCount > 0 ? startIndex : 0,
    endIndex: totalCount > 0 ? endIndex : 0,
    totalCount,
    currentPage,
    pageSize,
  };
};

export const selectProductCache = (state) =>
  state.products.cache.productDetails;
export const selectLastFetch = (state) => state.products.lastFetch;
export const selectAppliedFilters = (state) => state.products.appliedFilters;

// Check if data needs refresh (older than 5 minutes)
export const selectShouldRefreshProducts = (state, productType) => {
  const lastFetch = state.products.lastFetch[productType];
  if (!lastFetch) return true;
  return Date.now() - lastFetch > 5 * 60 * 1000; // 5 minutes
};

// Check if any filters are active
export const selectHasActiveFilters = (state) => {
  const filters = state.products.appliedFilters;
  return Object.entries(filters).some(([key, value]) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null && value !== undefined && value !== "";
  });
};

// Debug selector to check product data structure
export const selectProductsDebug = (state) => ({
  storeCount: state.products.storeProducts.length,
  comCount: state.products.comProducts.length,
  omniCount: state.products.omniProducts.length,
  loading: state.products.loading.products,
  errors: state.products.errors.products,
  selectedType: state.products.selectedProductType,
  pagination: state.products.pagination,
  sampleStoreProduct: state.products.storeProducts[0] || null,
  sampleComProduct: state.products.comProducts[0] || null,
  sampleOmniProduct: state.products.omniProducts[0] || null,
});

export const {
  setSelectedProductType,
  setSelectedProduct,
  clearSelectedProduct,
  setCurrentPage,
  setPageSize,
  resetPagination,
  setAppliedFilters,
  clearAppliedFilters,
  clearErrors,
  clearCache,
  resetProductState,
  setPagination,
} = productSlice.actions;

export default productSlice.reducer;
