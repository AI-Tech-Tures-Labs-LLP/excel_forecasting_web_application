// // Updated productSlice.js with enhanced filter support
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Updated async thunk for API calls with enhanced filters
// export const fetchProducts = createAsyncThunk(
//   "products/fetchProducts",
//   async ({ productType, filters }, { rejectWithValue }) => {
//     try {
//       const params = new URLSearchParams();

//       if (sheetId) {
//         params.append("sheet_id", sheetId);
//       }

//       // Multi-select filters (arrays)
//       const multiSelectFilters = [
//         "category",
//         "birthstone",
//         "red_box_item",
//         "vdf_status",
//       ];

//       multiSelectFilters.forEach((filterKey) => {
//         const values = filters[filterKey];
//         if (Array.isArray(values) && values.length > 0) {
//           values.forEach((value) => {
//             if (filterKey === "red_box_item" || filterKey === "vdf_status") {
//               // Convert string values to boolean for API
//               const boolValue =
//                 value === "Yes" ? "true" : value === "No" ? "false" : value;
//               params.append(filterKey, boolValue);
//             } else {
//               params.append(filterKey, value);
//             }
//           });
//         }
//       });

//       // Single-select boolean filters
//       const booleanFilters = [
//         "considered_birthstone",
//         "added_qty_macys_soq",
//         "below_min_order",
//         "over_macys_soq",
//         "added_only_to_balance_soq",
//         "need_to_review_first",
//         "valentine_day",
//         "mothers_day",
//         "fathers_day",
//         "mens_day",
//         "womens_day",
//       ];

//       booleanFilters.forEach((filterKey) => {
//         const value = filters[filterKey];
//         if (value !== null && value !== undefined && value !== "") {
//           params.append(filterKey, value);
//         }
//       });

//       // Product type filter
//       if (productType) {
//         params.append("product_type", productType);
//       }

//       console.log("API Request params:", params.toString()); // Debug log

//       const response = await axios.get(
//         `${API_BASE_URL}/forecast/query/filter_products/?${params}`
//       );

//       return {
//         productType,
//         data: response.data,
//         filters,
//         sheetId,
//         timestamp: Date.now(),
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchProductDetails = createAsyncThunk(
//   "products/fetchProductDetails",
//   async (productId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/forecast/api/product/${productId}/`
//       );
//       return { productId, data: response.data };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const initialState = {
//   // Product data
//   storeProducts: [],
//   comProducts: [],
//   omniProducts: [],

//   // Selected states
//   selectedProductType: "store",
//   selectedProduct: null,
//   selectedProductDetails: null,

//   // Loading states
//   loading: {
//     products: false,
//     productDetails: false,
//   },

//   // Error states
//   errors: {
//     products: null,
//     productDetails: null,
//   },

//   // Cache and metadata
//   lastFetch: {
//     store: null,
//     com: null,
//     omni: null,
//   },
//   cache: {
//     productDetails: {},
//   },

//   // Pagination
//   pagination: {
//     store: { page: 1, totalPages: 1, totalItems: 0 },
//     com: { page: 1, totalPages: 1, totalItems: 0 },
//     omni: { page: 1, totalPages: 1, totalItems: 0 },
//   },

//   // Enhanced filter state
//   appliedFilters: {
//     category: [],
//     birthstone: [],
//     red_box_item: [],
//     vdf_status: [],
//     considered_birthstone: null,
//     added_qty_macys_soq: null,
//     below_min_order: null,
//     over_macys_soq: null,
//     added_only_to_balance_soq: null,
//     need_to_review_first: null,
//     valentine_day: null,
//     mothers_day: null,
//     fathers_day: null,
//     mens_day: null,
//     womens_day: null,
//   },
// };

// const productSlice = createSlice({
//   name: "products",
//   initialState,
//   reducers: {
//     // Product type selection
//     setSelectedProductType: (state, action) => {
//       state.selectedProductType = action.payload;
//       state.selectedProduct = null;
//       state.selectedProductDetails = null;
//     },

//     // Product selection
//     setSelectedProduct: (state, action) => {
//       state.selectedProduct = action.payload;
//     },

//     clearSelectedProduct: (state) => {
//       state.selectedProduct = null;
//       state.selectedProductDetails = null;
//     },

//     // Filter management
//     setAppliedFilters: (state, action) => {
//       state.appliedFilters = { ...state.appliedFilters, ...action.payload };
//     },

//     clearAppliedFilters: (state) => {
//       state.appliedFilters = {
//         category: [],
//         birthstone: [],
//         red_box_item: [],
//         vdf_status: [],
//         considered_birthstone: null,
//         added_qty_macys_soq: null,
//         below_min_order: null,
//         over_macys_soq: null,
//         added_only_to_balance_soq: null,
//         need_to_review_first: null,
//         valentine_day: null,
//         mothers_day: null,
//         fathers_day: null,
//         mens_day: null,
//         womens_day: null,
//       };
//     },

//     // Clear errors
//     clearErrors: (state) => {
//       state.errors.products = null;
//       state.errors.productDetails = null;
//     },

//     // Cache management
//     clearCache: (state) => {
//       state.cache.productDetails = {};
//     },

//     // Reset state
//     resetProductState: (state) => {
//       return {
//         ...initialState,
//         selectedProductType: state.selectedProductType,
//       };
//     },

//     // Pagination
//     setPagination: (state, action) => {
//       const { productType, pagination } = action.payload;
//       state.pagination[productType] = pagination;
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       // Fetch products
//       .addCase(fetchProducts.pending, (state) => {
//         state.loading.products = true;
//         state.errors.products = null;
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         const { productType, data, filters, timestamp } = action.payload;

//         state.loading.products = false;
//         state.appliedFilters = filters;
//         state.lastFetch[productType] = timestamp;

//         // Update products based on type - handle all types if no specific type provided
//         if (!productType || productType === "store") {
//           state.storeProducts =
//             data.filter((d) => d.product_type === "store") || [];
//         }
//         if (!productType || productType === "com") {
//           state.comProducts =
//             data.filter((d) => d.product_type === "com") || [];
//         }
//         if (!productType || productType === "omni") {
//           state.omniProducts =
//             data.filter((d) => d.product_type === "omni") || [];
//         }
//       })
//       .addCase(fetchProducts.rejected, (state, action) => {
//         state.loading.products = false;
//         state.errors.products = action.payload;
//       })

//       // Fetch product details
//       .addCase(fetchProductDetails.pending, (state) => {
//         state.loading.productDetails = true;
//         state.errors.productDetails = null;
//       })
//       .addCase(fetchProductDetails.fulfilled, (state, action) => {
//         const { productId, data } = action.payload;

//         state.loading.productDetails = false;
//         state.selectedProductDetails = data;
//         state.cache.productDetails[productId] = {
//           data,
//           timestamp: Date.now(),
//         };
//       })
//       .addCase(fetchProductDetails.rejected, (state, action) => {
//         state.loading.productDetails = false;
//         state.errors.productDetails = action.payload;
//       });
//   },
// });

// // Selectors
// export const selectSelectedProductType = (state) =>
//   state.products.selectedProductType;

// export const selectProductsByType = (state, productType) => {
//   switch (productType) {
//     case "store":
//       return state.products.storeProducts;
//     case "com":
//       return state.products.comProducts;
//     case "omni":
//       return state.products.omniProducts;
//     default:
//       return [];
//   }
// };

// export const selectCurrentProducts = (state) => {
//   return selectProductsByType(state, state.products.selectedProductType);
// };

// export const selectProductsLoading = (state) => state.products.loading.products;
// export const selectProductDetailsLoading = (state) =>
//   state.products.loading.productDetails;
// export const selectSelectedProduct = (state) => state.products.selectedProduct;
// export const selectSelectedProductDetails = (state) =>
//   state.products.selectedProductDetails;
// export const selectProductErrors = (state) => state.products.errors;

// // Additional selectors
// export const selectStoreProducts = (state) => state.products.storeProducts;
// export const selectComProducts = (state) => state.products.comProducts;
// export const selectOmniProducts = (state) => state.products.omniProducts;
// export const selectAllProducts = (state) => [
//   ...state.products.storeProducts,
//   ...state.products.comProducts,
//   ...state.products.omniProducts,
// ];

// export const selectProductCache = (state) =>
//   state.products.cache.productDetails;
// export const selectLastFetch = (state) => state.products.lastFetch;
// export const selectPagination = (state) => state.products.pagination;
// export const selectAppliedFilters = (state) => state.products.appliedFilters;

// // Check if data needs refresh (older than 5 minutes)
// export const selectShouldRefreshProducts = (state, productType) => {
//   const lastFetch = state.products.lastFetch[productType];
//   if (!lastFetch) return true;
//   return Date.now() - lastFetch > 5 * 60 * 1000; // 5 minutes
// };

// // Check if any filters are active
// export const selectHasActiveFilters = (state) => {
//   const filters = state.products.appliedFilters;
//   return Object.entries(filters).some(([key, value]) => {
//     if (Array.isArray(value)) {
//       return value.length > 0;
//     }
//     return value !== null && value !== undefined && value !== "";
//   });
// };

// export const {
//   setSelectedProductType,
//   setSelectedProduct,
//   clearSelectedProduct,
//   setAppliedFilters,
//   clearAppliedFilters,
//   clearErrors,
//   clearCache,
//   resetProductState,
//   setPagination,
// } = productSlice.actions;

// export default productSlice.reducer;

// Updated productSlice.js with enhanced filter support and fixes
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Updated async thunk for API calls with enhanced filters
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ productType, filters, sheetId }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (sheetId) {
        params.append("sheet_id", sheetId);
      }

      // Multi-select filters (arrays)
      const multiSelectFilters = [
        "category",
        "birthstone",
        "red_box_item",
        "vdf_status",
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

      // Product type filter
      if (productType) {
        params.append("product_type", productType);
      }

      console.log("API Request params:", params.toString()); // Debug log

      const response = await axios.get(
        `${API_BASE_URL}/forecast/query/filter_products/?${params}`
      );

      return {
        productType,
        data: response.data,
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
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/forecast/api/product/${productId}/`
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

  // Pagination
  pagination: {
    store: { page: 1, totalPages: 1, totalItems: 0 },
    com: { page: 1, totalPages: 1, totalItems: 0 },
    omni: { page: 1, totalPages: 1, totalItems: 0 },
  },

  // Enhanced filter state
  appliedFilters: {
    category: [],
    birthstone: [],
    red_box_item: [],
    vdf_status: [],
    considered_birthstone: null,
    added_qty_macys_soq: null,
    below_min_order: null,
    over_macys_soq: null,
    added_only_to_balance_soq: null,
    need_to_review_first: null,
    valentine_day: null,
    mothers_day: null,
    fathers_day: null,
    mens_day: null,
    womens_day: null,
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

    // Filter management
    setAppliedFilters: (state, action) => {
      state.appliedFilters = { ...state.appliedFilters, ...action.payload };
    },

    clearAppliedFilters: (state) => {
      state.appliedFilters = {
        category: [],
        birthstone: [],
        red_box_item: [],
        vdf_status: [],
        considered_birthstone: null,
        added_qty_macys_soq: null,
        below_min_order: null,
        over_macys_soq: null,
        added_only_to_balance_soq: null,
        need_to_review_first: null,
        valentine_day: null,
        mothers_day: null,
        fathers_day: null,
        mens_day: null,
        womens_day: null,
      };
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

    // Pagination
    setPagination: (state, action) => {
      const { productType, pagination } = action.payload;
      state.pagination[productType] = pagination;
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
        const { productType, data, filters, timestamp } = action.payload;

        console.log("Products fetched successfully:", {
          productType,
          dataLength: Array.isArray(data) ? data.length : "not array",
          dataType: typeof data,
          sampleData: Array.isArray(data) ? data[0] : data,
        });

        state.loading.products = false;
        state.appliedFilters = filters;
        state.lastFetch[productType] = timestamp;

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

export const selectProductCache = (state) =>
  state.products.cache.productDetails;
export const selectLastFetch = (state) => state.products.lastFetch;
export const selectPagination = (state) => state.products.pagination;
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
  sampleStoreProduct: state.products.storeProducts[0] || null,
  sampleComProduct: state.products.comProducts[0] || null,
  sampleOmniProduct: state.products.omniProducts[0] || null,
});

export const {
  setSelectedProductType,
  setSelectedProduct,
  clearSelectedProduct,
  setAppliedFilters,
  clearAppliedFilters,
  clearErrors,
  clearCache,
  resetProductState,
  setPagination,
} = productSlice.actions;

export default productSlice.reducer;
