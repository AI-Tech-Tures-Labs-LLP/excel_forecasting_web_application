// Updated productSlice.js to store assigned users and categories
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Enhanced async thunk for API calls with pagination support
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

      // Add sorting parameters - Updated to use the new sort_by parameter
      if (filters.sort_by) {
        let sortParam = filters.sort_by;

        // Add direction prefix for DESC ordering
        if (filters.sort_direction === "desc") {
          sortParam = `-${sortParam}`;
        }

        params.append("sort_by", sortParam);
      }

      // Legacy sorting support (keeping for backward compatibility)
      if (filters.notes_sort) {
        params.append(
          "sort_by",
          filters.notes_sort === "latest" ? "-created_at" : "created_at"
        );
      }
      if (filters.added_qty_sort) {
        params.append(
          "sort_by",
          filters.added_qty_sort === "asc"
            ? "recommended_total_quantity"
            : "-recommended_total_quantity"
        );
      }
      if (filters.final_qty_sort) {
        params.append(
          "sort_by",
          filters.final_qty_sort === "asc"
            ? "user_updated_final_quantity"
            : "-user_updated_final_quantity"
        );
      }
      if (filters.last_reviewed_sort) {
        params.append(
          "sort_by",
          filters.last_reviewed_sort === "newest" ? "-updated_at" : "updated_at"
        );
      }

      // Add search query
      if (filters.search && filters.search.trim()) {
        params.append("search", filters.search.trim());
      }

      // Product type filter
      if (productType && productType !== "all") {
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
        count: count,
        product_type_counts: responseData.product_type_counts || {},
        note_status_counts: responseData.note_status_counts || {},
        // Add these new fields from the API response
        categories: responseData.categories || [],
        assigned_users: responseData.assigned_users || [],
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
  storeProductCount: 0,
  comProductCount: 0,
  omniProductCount: 0,
  storeProducts: [],
  comProducts: [],
  omniProducts: [],
  all: [],
  pending: 0,
  reviewed: 0,
  not_reviewed: 0,

  // Add these new fields for assigned users and categories
  assignedUsers: [],
  categories: [],

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
    all: null,
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
    all: {
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

  // Enhanced filter state with new sorting and filtering options
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

    // New sorting parameters
    sort_by: null, // 'created_at', 'recommended_total_quantity', 'user_updated_final_quantity'
    sort_direction: null, // 'asc', 'desc'

    // Legacy sorting (keeping for backward compatibility)
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
      const targetType = productType || state.selectedProductType;
      if (state.pagination[targetType]) {
        state.pagination[targetType].currentPage = page;
      }
    },

    setPageSize: (state, action) => {
      const { productType, pageSize } = action.payload;
      const targetType = productType || state.selectedProductType;
      if (state.pagination[targetType]) {
        state.pagination[targetType].pageSize = pageSize;
        state.pagination[targetType].currentPage = 1; // Reset to first page
      }
    },

    resetPagination: (state, action) => {
      const productType = action.payload || state.selectedProductType;
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

    // New action specifically for sorting
    setSorting: (state, action) => {
      const { sortBy, direction } = action.payload;
      state.appliedFilters.sort_by = sortBy;
      state.appliedFilters.sort_direction = direction;

      // Clear legacy sorting when using new sorting
      if (sortBy) {
        state.appliedFilters.notes_sort = null;
        state.appliedFilters.added_qty_sort = null;
        state.appliedFilters.final_qty_sort = null;
        state.appliedFilters.last_reviewed_sort = null;
      }

      // Reset pagination when sorting changes
      Object.keys(state.pagination).forEach((productType) => {
        state.pagination[productType].currentPage = 1;
      });
    },

    // Clear sorting
    clearSorting: (state) => {
      state.appliedFilters.sort_by = null;
      state.appliedFilters.sort_direction = null;
      state.appliedFilters.notes_sort = null;
      state.appliedFilters.added_qty_sort = null;
      state.appliedFilters.final_qty_sort = null;
      state.appliedFilters.last_reviewed_sort = null;

      // Reset pagination when sorting is cleared
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
        sort_by: null,
        sort_direction: null,
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
        pagination: {
          ...initialState.pagination,
          // Preserve page sizes
          store: {
            ...initialState.pagination.store,
            pageSize: state.pagination.store.pageSize,
          },
          com: {
            ...initialState.pagination.com,
            pageSize: state.pagination.com.pageSize,
          },
          omni: {
            ...initialState.pagination.omni,
            pageSize: state.pagination.omni.pageSize,
          },
          all: {
            ...initialState.pagination.all,
            pageSize: state.pagination.all.pageSize,
          },
        },
      };
    },

    // Legacy pagination setter (for backward compatibility)
    setPagination: (state, action) => {
      const { productType, pagination } = action.payload;
      const targetType = productType || state.selectedProductType;
      if (state.pagination[targetType]) {
        state.pagination[targetType] = {
          ...state.pagination[targetType],
          ...pagination,
        };
      }
    },

    // Utility actions for better UX
    goToFirstPage: (state, action) => {
      const productType = action.payload || state.selectedProductType;
      if (state.pagination[productType]) {
        state.pagination[productType].currentPage = 1;
      }
    },

    goToLastPage: (state, action) => {
      const productType = action.payload || state.selectedProductType;
      if (
        state.pagination[productType] &&
        state.pagination[productType].totalPages > 0
      ) {
        state.pagination[productType].currentPage =
          state.pagination[productType].totalPages;
      }
    },

    // Optimistic update for pagination (before API response)
    updatePaginationOptimistic: (state, action) => {
      const { productType, page, pageSize } = action.payload;
      const targetType = productType || state.selectedProductType;
      if (state.pagination[targetType]) {
        if (page !== undefined) {
          state.pagination[targetType].currentPage = page;
        }
        if (pageSize !== undefined) {
          state.pagination[targetType].pageSize = pageSize;
        }
      }
    },

    // Add actions to update assigned users and categories if needed
    setAssignedUsers: (state, action) => {
      state.assignedUsers = action.payload;
    },

    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state, action) => {
        state.loading.products = true;
        state.errors.products = null;

        // Optimistic pagination update
        const { productType, page, pageSize } = action.meta.arg;
        const targetType = productType || state.selectedProductType;
        if (state.pagination[targetType]) {
          if (page !== undefined) {
            state.pagination[targetType].currentPage = page;
          }
          if (pageSize !== undefined) {
            state.pagination[targetType].pageSize = pageSize;
          }
        }
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const {
          productType,
          data,
          filters,
          timestamp,
          pagination,
          count,
          product_type_counts,
          note_status_counts,
          categories,
          assigned_users,
        } = action.payload;

        console.log("Products fetched successfully:", {
          productType,
          dataLength: Array.isArray(data) ? data.length : "not array",
          pagination,
          categoriesCount: categories?.length || 0,
          assignedUsersCount: assigned_users?.length || 0,
        });

        state.loading.products = false;
        state.appliedFilters = filters;

        const targetType = productType || "all";
        state.lastFetch[targetType] = timestamp;

        // Update pagination state
        if (pagination && state.pagination[targetType]) {
          state.pagination[targetType] = {
            ...state.pagination[targetType],
            ...pagination,
          };
        }

        // Update assigned users and categories from API response
        if (assigned_users && Array.isArray(assigned_users)) {
          state.assignedUsers = assigned_users;
        }

        if (categories && Array.isArray(categories)) {
          state.categories = categories;
        }

        // Handle data based on product type
        if (Array.isArray(data)) {
          state.pending = note_status_counts.pending || 0;
          state.reviewed = note_status_counts.reviewed || 0;
          state.not_reviewed = note_status_counts.not_reviewed || 0;
          state.storeProductCount = product_type_counts.store || 0;
          state.comProductCount = product_type_counts.com || 0;
          state.omniProductCount = product_type_counts.omni || 0;

          if (!productType || productType === "all") {
            // If no specific product type or "all", distribute to appropriate arrays
            state.storeProducts =
              data.filter((d) => d.product_type === "store") || [];
            state.comProducts =
              data.filter((d) => d.product_type === "com") || [];
            state.omniProducts =
              data.filter((d) => d.product_type === "omni") || [];
            state.storeProductCount = product_type_counts.store || 0;
            state.comProductCount = product_type_counts.com || 0;
            state.omniProductCount = product_type_counts.omni || 0;
          } else {
            // Update specific product type
            switch (productType) {
              case "store":
                state.storeProductCount = count || 0;
                state.storeProducts = data || [];
                break;
              case "com":
                state.comProductCount = count || 0;
                state.comProducts = data || [];
                break;
              case "omni":
                state.omniProductCount = count || 0;
                state.omniProducts = data || [];
                break;
              default:
                // Fallback: filter and distribute
                state.storeProductCount = product_type_counts.store || 0;
                state.comProductCount = product_type_counts.com || 0;
                state.omniProductCount = product_type_counts.omni || 0;
                state.pending = note_status_counts.pending || 0;
                state.reviewed = note_status_counts.reviewed || 0;
                state.not_reviewed = note_status_counts.not_reviewed || 0;
                state.storeProducts =
                  data.filter((d) => d.product_type === "store") || [];
                state.comProducts =
                  data.filter((d) => d.product_type === "com") || [];
                state.omniProducts =
                  data.filter((d) => d.product_type === "omni") || [];
            }
          }
        } else if (data && typeof data === "object") {
          // Handle legacy object format
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
          console.warn("Unexpected data format received:", data);
          // Only clear the specific product type on unexpected format
          if (productType) {
            switch (productType) {
              case "store":
                state.storeProducts = [];
                break;
              case "com":
                state.comProducts = [];
                break;
              case "omni":
                state.omniProducts = [];
                break;
              default:
                state.storeProducts = [];
                state.comProducts = [];
                state.omniProducts = [];
            }
          }
        }

        // Log the final state for debugging
        console.log("Final product counts:", {
          store: state.storeProducts.length,
          com: state.comProducts.length,
          omni: state.omniProducts.length,
          pagination: state.pagination[targetType],
          assignedUsers: state.assignedUsers.length,
          categories: state.categories.length,
        });
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error("fetchProducts rejected:", action.payload);
        state.loading.products = false;
        state.errors.products = action.payload;

        // Reset pagination on error but don't clear products unless critical error
        const { productType } = action.meta.arg;
        const targetType = productType || state.selectedProductType;
        if (state.pagination[targetType]) {
          state.pagination[targetType] = {
            ...state.pagination[targetType],
            currentPage: 1,
            totalCount: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false,
            next: null,
            previous: null,
          };
        }
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

// Enhanced Selectors
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

// Product selectors
export const selectStoreProducts = (state) => state.products.storeProducts;
export const selectComProducts = (state) => state.products.comProducts;
export const selectOmniProducts = (state) => state.products.omniProducts;
export const selectAllProducts = (state) => [
  ...state.products.storeProducts,
  ...state.products.comProducts,
  ...state.products.omniProducts,
];

// New selectors for assigned users and categories
export const selectAssignedUsers = (state) => state.products.assignedUsers;
export const selectCategories = (state) => state.products.categories;

// Enhanced pagination selectors
export const selectPagination = (state) => state.products.pagination;

export const selectCurrentPagination = (state) =>
  state.products.pagination[state.products.selectedProductType] ||
  state.products.pagination.store;

export const selectPaginationByType = (state, productType) =>
  state.products.pagination[productType] || state.products.pagination.store;

export const selectCurrentPage = (state) =>
  selectCurrentPagination(state)?.currentPage || 1;

export const selectPageSize = (state) =>
  selectCurrentPagination(state)?.pageSize || 10;

export const selectTotalCount = (state) =>
  selectCurrentPagination(state)?.totalCount || 0;

export const selectTotalPages = (state) =>
  selectCurrentPagination(state)?.totalPages || 0;

export const selectHasNext = (state) =>
  selectCurrentPagination(state)?.hasNext || false;

export const selectHasPrevious = (state) =>
  selectCurrentPagination(state)?.hasPrevious || false;

// Enhanced pagination info selector
export const selectPaginationInfo = (state) => {
  const pagination = selectCurrentPagination(state);
  if (!pagination) return { startIndex: 0, endIndex: 0, totalCount: 0 };

  const { currentPage, pageSize, totalCount } = pagination;
  const startIndex = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(startIndex + pageSize - 1, totalCount);

  return {
    startIndex: totalCount > 0 ? startIndex : 0,
    endIndex: totalCount > 0 ? endIndex : 0,
    totalCount,
    currentPage,
    pageSize,
    totalPages: pagination.totalPages || 0,
  };
};

// Pagination state selectors
export const selectCanGoNext = (state) => selectHasNext(state);
export const selectCanGoPrevious = (state) => selectHasPrevious(state);

export const selectPageNumbers = (state) => {
  const totalPages = selectTotalPages(state);
  const currentPage = selectCurrentPage(state);

  if (totalPages <= 1) return [];

  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

// Sorting selectors
export const selectCurrentSort = (state) => ({
  sortBy: state.products.appliedFilters.sort_by,
  direction: state.products.appliedFilters.sort_direction,
});

export const selectIsSorted = (state) => {
  const filters = state.products.appliedFilters;
  return !!(
    filters.sort_by ||
    filters.notes_sort ||
    filters.added_qty_sort ||
    filters.final_qty_sort ||
    filters.last_reviewed_sort
  );
};

// Other selectors (unchanged)
export const selectProductCache = (state) =>
  state.products.cache.productDetails;
export const selectLastFetch = (state) => state.products.lastFetch;
export const selectAppliedFilters = (state) => state.products.appliedFilters;

export const getStoreCount = (state) => state.products.storeProductCount;
export const getComCount = (state) => state.products.comProductCount;
export const getOmniCount = (state) => state.products.omniProductCount;

export const getReviewed = (state) => state.products.reviewed;
export const getNotReviewed = (state) => state.products.not_reviewed;
export const getPending = (state) => state.products.pending;

// Check if data needs refresh (older than 5 minutes)
export const selectShouldRefreshProducts = (state, productType) => {
  const targetType = productType || state.products.selectedProductType;
  const lastFetch = state.products.lastFetch[targetType];
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

// Debug selector
export const selectProductsDebug = (state) => ({
  storeCount: state.products.storeProducts.length,
  comCount: state.products.comProducts.length,
  omniCount: state.products.omniProducts.length,
  loading: state.products.loading.products,
  errors: state.products.errors.products,
  selectedType: state.products.selectedProductType,
  pagination: state.products.pagination,
  currentPagination: selectCurrentPagination(state),
  paginationInfo: selectPaginationInfo(state),
  appliedFilters: state.products.appliedFilters,
  assignedUsers: state.products.assignedUsers,
  categories: state.products.categories,
  currentSort: selectCurrentSort(state),
  isSorted: selectIsSorted(state),
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
  setSorting,
  clearSorting,
  clearAppliedFilters,
  clearErrors,
  clearCache,
  resetProductState,
  setPagination,
  goToFirstPage,
  goToLastPage,
  updatePaginationOptimistic,
  setAssignedUsers,
  setCategories,
} = productSlice.actions;

export default productSlice.reducer;
