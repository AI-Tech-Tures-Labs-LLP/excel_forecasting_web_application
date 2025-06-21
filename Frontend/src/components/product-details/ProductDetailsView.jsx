import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { BarChart3 } from "lucide-react";

// Import components
import ProductHeader from "./ProductHeader";
import ProductInfoCards from "./ProductInfoCards";
import CriticalAdjustments from "./CriticalAdjustments";
import RollingForecast from "./rolling/RollingForecast";
import MonthlyForecast from "./forecast/MonthlyForecast";
import ForecastVariablesModal from "./forecast/ForecastVariablesModal";
import LoadingScreen from "./shared/LoadingScreen";
import ErrorScreen from "./shared/ErrorScreen";
import SavePopups from "./SavePopups";
import QuickNavigation from "./QuickNavigation";

// Import selectors
import {
  fetchProducts,
  selectAllProducts,
  selectComProducts,
  selectCurrentProducts,
  selectOmniProducts,
  selectSelectedProductType,
  selectStoreProducts,
} from "../../redux/productSlice";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetailsView = () => {
  const [dynamicModalState, setDynamicModalState] = useState({
    isOpen: false,
    type: null,
    data: null,
    modalType: null,
    forecastMonth: null,
  });
  const dispatch = useDispatch();
  const { sheetId, productId } = useParams();
  const navigate = useNavigate();
  const files = useSelector((state) => state.forecast.files);
  // const allProductsInRedux = useSelector(selectAllProducts);
  const storeProducts = useSelector(selectStoreProducts);
  const comProducts = useSelector(selectComProducts);
  const omniProducts = useSelector(selectOmniProducts);
  const handleNavigateToProduct = (productId) => {
    const allProducts = [...storeProducts, ...comProducts, ...omniProducts];
    const targetProduct = allProducts.find((p) => p.product_id === productId);
    if (targetProduct) {
      // dispatch(setSelectedProduct(targetProduct));
      navigate(`/products/${targetProduct.sheet}/${targetProduct.product_id}`);
    }
  };
  // BASIC STATE
  const [initialControlValues, setInitialControlValues] = useState(null);
  const [hasInitialChanges, setHasInitialChanges] = useState(false);
  const [lastChangedEditableField, setLastChangedEditableField] =
    useState(null);
  const [showSaveChangesPopup, setShowSaveChangesPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastChangedField, setLastChangedField] = useState(null);
  const [productData, setProductData] = useState(null);
  const [rollingForecastData, setRollingForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    monthlyForecast: true,
  });

  // CRITICAL INPUT FIELDS STATE
  const [userAddedQuantity, setUserAddedQuantity] = useState("");
  const [externalFactorPercentage, setExternalFactorPercentage] = useState("");
  const [externalFactor, setExternalFactor] = useState("");
  const [showCalculatedChanges, setShowCalculatedChanges] = useState(false);
  const [hasEditableChanges, setHasEditableChanges] = useState(false);

  // ROLLING FORECAST STATE
  const [editableData, setEditableData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // SEARCH AND NAVIGATION STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  // CONTROL STATES
  const [rollingMethod, setRollingMethod] = useState("YTD");
  const [editableTrend, setEditableTrend] = useState("12.5");
  const [editable12MonthFC, setEditable12MonthFC] = useState("1200");
  const [selectedIndex, setSelectedIndex] = useState("Grand Total");
  const [forecastingMethod, setForecastingMethod] = useState("FC by Index");
  const [hasControlChanges, setHasControlChanges] = useState(false);
  const [pendingChangeField, setPendingChangeField] = useState(null);
  const [showCriticalSavePopup, setShowCriticalSavePopup] = useState(false);
  const [showVariablesModal, setShowVariablesModal] = useState(false);

  // HIGHLIGHTING STATE
  const [changedCells, setChangedCells] = useState(new Set());
  const [autoChangedCells, setAutoChangedCells] = useState(new Set());
  const [previousValues, setPreviousValues] = useState({});
  const [justChangedCells, setJustChangedCells] = useState(new Set());

  // REFS
  const originalValuesRef = useRef(null);
  const lastAppliedChangeRef = useRef(null);

  // REDUX SELECTORS
  const allProducts = useSelector(selectCurrentProducts);
  const selectedProductType = useSelector(selectSelectedProductType);

  // NAVIGATION CALCULATIONS
  const currentProductIndex = useMemo(() => {
    return allProducts.findIndex((product) => product.product_id === productId);
  }, [allProducts, productId]);

  const canNavigatePrevious = currentProductIndex > 0;
  const canNavigateNext = currentProductIndex < allProducts.length - 1;

  const previousProduct = canNavigatePrevious
    ? allProducts[currentProductIndex - 1]
    : null;
  const nextProduct = canNavigateNext
    ? allProducts[currentProductIndex + 1]
    : null;

  // SEARCH FUNCTIONALITY
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allProducts
      .filter(
        (product) =>
          product.product_id
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 10);
  }, [allProducts, searchQuery]);
  // MAIN DATA FETCHING FUNCTION
  // const fetchProductDetails = async () => {
  //   console.log("Fetching details for product:", productId);
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await axios.get(
  //       `${
  //         import.meta.env.VITE_API_BASE_URL
  //       }/forecast/product/${productId}/?sheet_id=${sheetId}` // Ensure sheetId is included in the request
  //     );
  //     console.log("Product details fetched:", response.data);
  //     setProductData(response.data);

  //     // Pre-fetch and set the critical adjustment values
  //     if (response.data.product_details) {
  //       const userQty =
  //         response.data.product_details.user_updated_final_quantity;
  //       setUserAddedQuantity(
  //         userQty !== null && userQty !== undefined ? userQty.toString() : ""
  //       );

  //       const extFactorPerc =
  //         response.data.product_details.external_factor_percentage;
  //       setExternalFactorPercentage(
  //         extFactorPerc !== null && extFactorPerc !== undefined
  //           ? extFactorPerc.toString()
  //           : ""
  //       );

  //       setExternalFactor(response.data.product_details.external_factor || "");
  //     }

  //     // Extract 12-month rolling forecast dynamically
  //     const rolling = {
  //       index: [],
  //       fcByIndex: [],
  //       fcByTrend: [],
  //       recommendedFC: [],
  //       plannedFC: [],
  //       plannedShipments: [],
  //       plannedEOH: [],
  //       grossProjection: [],
  //       macysProjReceipts: [],
  //       plannedSellThru: [],
  //     };

  //     const monthOrder = [
  //       "feb",
  //       "mar",
  //       "apr",
  //       "may",
  //       "jun",
  //       "jul",
  //       "aug",
  //       "sep",
  //       "oct",
  //       "nov",
  //       "dec",
  //       "jan",
  //     ];

  //     const getForecastValues = (variable) => {
  //       const item = response.data.monthly_forecast?.find(
  //         (f) => f.variable_name === variable
  //       );
  //       if (!item) return Array(12).fill(0);
  //       return monthOrder.map((m) => item[m] ?? 0);
  //     };

  //     rolling.index = getForecastValues("index");
  //     rolling.fcByIndex = getForecastValues("fc_by_index");
  //     rolling.fcByTrend = getForecastValues("fc_by_trend");
  //     rolling.recommendedFC = getForecastValues("recommended_fc");
  //     rolling.plannedFC = getForecastValues("planned_fc");
  //     rolling.plannedShipments = getForecastValues("planned_shipments");
  //     rolling.plannedEOH = getForecastValues("planned_eoh_cal");
  //     rolling.grossProjection = getForecastValues("gross_projection_nav");
  //     rolling.macysProjReceipts = getForecastValues("macys_proj_receipts");
  //     rolling.plannedSellThru = getForecastValues("planned_sell_thru_pct");

  //     setRollingForecastData(rolling);
  //   } catch (error) {
  //     console.error("Error fetching product details:", error);
  //     setError("Failed to load product details");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchProductDetails = async () => {
  //   console.log("Fetching details for product:", productId);
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await axios.get(
  //       `${
  //         import.meta.env.VITE_API_BASE_URL
  //       }/forecast/product/${productId}/?sheet_id=${sheetId}`
  //     );
  //     console.log("Product details fetched:", response.data);
  //     setProductData(response.data);

  //     // Pre-fetch and set the critical adjustment values
  //     if (response.data.product_details) {
  //       const userQty =
  //         response.data.product_details.user_updated_final_quantity;
  //       setUserAddedQuantity(
  //         userQty !== null && userQty !== undefined ? userQty.toString() : ""
  //       );

  //       const extFactorPerc =
  //         response.data.product_details.external_factor_percentage;
  //       setExternalFactorPercentage(
  //         extFactorPerc !== null && extFactorPerc !== undefined
  //           ? extFactorPerc.toString()
  //           : ""
  //       );
  //       console.log(
  //         "Responsevifawfwa",
  //         response.data.product_details.external_factor_note
  //       );
  //       setExternalFactor(
  //         response.data.product_details?.external_factor_note || ""
  //       );
  //     }

  //     // Extract 12-month rolling forecast dynamically with updated variable names
  //     const rolling = {
  //       index: [],
  //       fcByIndex: [],
  //       fcByTrend: [],
  //       recommendedFC: [],
  //       plannedFC: [],
  //       plannedShipments: [],
  //       plannedEOH: [],
  //       grossProjection: [],
  //       macysProjReceipts: [],
  //       plannedSellThru: [],
  //     };

  //     const monthOrder = [
  //       "feb",
  //       "mar",
  //       "apr",
  //       "may",
  //       "jun",
  //       "jul",
  //       "aug",
  //       "sep",
  //       "oct",
  //       "nov",
  //       "dec",
  //       "jan",
  //     ];

  //     const getForecastValues = (variable) => {
  //       const item = response.data.monthly_forecast?.find(
  //         (f) => f.variable_name === variable
  //       );
  //       if (!item) {
  //         console.warn(`Variable ${variable} not found in monthly_forecast`);
  //         return Array(12).fill(0);
  //       }

  //       const values = monthOrder.map((m) => item[m] ?? 0);
  //       console.log(`${variable} values:`, values);
  //       return values;
  //     };

  //     // Updated variable names to match backend
  //     rolling.index = getForecastValues("index");
  //     rolling.fcByIndex = getForecastValues("fc_by_index");
  //     rolling.fcByTrend = getForecastValues("fc_by_trend");
  //     rolling.recommendedFC = getForecastValues("recommended_fc");
  //     rolling.plannedFC = getForecastValues("planned_fc");
  //     rolling.plannedShipments = getForecastValues("planned_shipments");
  //     rolling.plannedEOH = getForecastValues("planned_eoh_cal");
  //     rolling.grossProjection = getForecastValues("gross_projection_nav");
  //     rolling.macysProjReceipts = getForecastValues("macys_proj_receipts");
  //     rolling.plannedSellThru = getForecastValues("planned_sell_thru_pct");

  //     console.log("Rolling forecast data:", rolling);
  //     setRollingForecastData(rolling);
  //   } catch (error) {
  //     console.error("Error fetching product details:", error);
  //     setError("Failed to load product details");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchProductDetails = async () => {
    console.log("Fetching details for product:", productId);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/product/${productId}/?sheet_id=${sheetId}`
      );
      console.log("Product details fetched:", response.data);
      setProductData(response.data);

      // Pre-fetch and set the critical adjustment values
      if (response.data.product_details) {
        const userQty =
          response.data.product_details.user_updated_final_quantity;
        setUserAddedQuantity(
          userQty !== null && userQty !== undefined ? userQty.toString() : ""
        );

        const extFactorPerc =
          response.data.product_details.external_factor_percentage;
        setExternalFactorPercentage(
          extFactorPerc !== null && extFactorPerc !== undefined
            ? extFactorPerc.toString()
            : ""
        );

        // Fix: Check both external_factor_note and external_factor fields
        const externalFactorNote =
          response.data.product_details.external_factor_note ||
          response.data.product_details.external_factor ||
          "";

        console.log("External factor note found:", externalFactorNote);
        setExternalFactor(externalFactorNote);
      }

      // Extract 12-month rolling forecast dynamically with updated variable names
      const rolling = {
        index: [],
        fcByIndex: [],
        fcByTrend: [],
        recommendedFC: [],
        plannedFC: [],
        plannedShipments: [],
        plannedEOH: [],
        grossProjection: [],
        macysProjReceipts: [],
        plannedSellThru: [],
      };

      const monthOrder = [
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
        "jan",
      ];

      const getForecastValues = (variable) => {
        const item = response.data.monthly_forecast?.find(
          (f) => f.variable_name === variable
        );
        if (!item) {
          console.warn(`Variable ${variable} not found in monthly_forecast`);
          return Array(12).fill(0);
        }

        const values = monthOrder.map((m) => item[m] ?? 0);
        console.log(`${variable} values:`, values);
        return values;
      };

      // Updated variable names to match backend
      rolling.index = getForecastValues("index");
      rolling.fcByIndex = getForecastValues("fc_by_index");
      rolling.fcByTrend = getForecastValues("fc_by_trend");
      rolling.recommendedFC = getForecastValues("recommended_fc");
      rolling.plannedFC = getForecastValues("planned_fc");
      rolling.plannedShipments = getForecastValues("planned_shipments");
      rolling.plannedEOH = getForecastValues("planned_eoh_cal");
      rolling.grossProjection = getForecastValues("gross_projection_nav");
      rolling.macysProjReceipts = getForecastValues("macys_proj_receipts");
      rolling.plannedSellThru = getForecastValues("planned_sell_thru_pct");

      console.log("Rolling forecast data:", rolling);
      setRollingForecastData(rolling);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };
  const getData = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/product/${productId}/?sheet_id=${sheetId}`
      );

      const productDetails = res.data.product_details;

      // Check for updated values first, then fall back to original values
      const rolling =
        productDetails.updated_rolling_method ||
        productDetails.rolling_method_original ||
        productDetails.rolling_method;

      const trend =
        productDetails.updated_std_trend || productDetails.std_trend_original;

      const editablemonths =
        productDetails.updated_12_month_fc_index ||
        productDetails.month_12_fc_index_original;

      const selectedIndexVal =
        productDetails.updated_current_fc_index ||
        productDetails.current_fc_index_original ||
        productDetails.currect_fc_index;

      const forecasting =
        productDetails.updated_forecasting_method ||
        productDetails.forecasting_method_original ||
        productDetails.forecasting_method;

      console.log("Control values from API:", {
        rolling,
        trend,
        editablemonths,
        selectedIndexVal,
        forecasting,
      });

      setRollingMethod(rolling || "YTD");
      setEditableTrend(trend?.toString() || "12.5");
      setEditable12MonthFC(editablemonths?.toString() || "1200");
      setForecastingMethod(forecasting || "FC by Index");
      setSelectedIndex(selectedIndexVal || "Grand Total");
    } catch (err) {
      console.log("Error in getData:", err);
    }
  };
  // SEARCH HANDLERS
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchDropdown(value.trim().length > 0);
    setShowRecentSearches(false);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length > 0) {
      setShowSearchDropdown(true);
      setShowRecentSearches(false);
    } else {
      setShowRecentSearches(recentSearches.length > 0);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchDropdown(false);
      setShowRecentSearches(false);
    }, 200);
  };

  const handleSearchResultClick = (product) => {
    if (handleNavigateToProduct) {
      handleNavigateToProduct(product.product_id);
    }
    setSearchQuery("");
    setShowSearchDropdown(false);
  };

  const handleRecentSearchClick = (recentSearch) => {
    if (handleNavigateToProduct) {
      handleNavigateToProduct(recentSearch.product_id);
    }
    setSearchQuery("");
    setShowSearchDropdown(false);
    setShowRecentSearches(false);
  };

  // RECENT SEARCHES MANAGEMENT
  const saveRecentSearches = (searches) => {
    try {
      localStorage.setItem("productRecentSearches", JSON.stringify(searches));
      setRecentSearches(searches);
    } catch (error) {
      console.error("Error saving recent searches:", error);
    }
  };

  const addToRecentSearches = (product) => {
    if (!product || !product.product_id) return;

    let currentSearches = [];
    try {
      const stored = localStorage.getItem("productRecentSearches");
      if (stored) {
        currentSearches = JSON.parse(stored);
      }
    } catch (error) {
      currentSearches = [];
    }

    if (
      currentSearches.length > 0 &&
      currentSearches[0].product_id === product.product_id
    ) {
      return;
    }

    const newSearch = {
      product_id: product.product_id,
      category: product.category || "Unknown Category",
      timestamp: Date.now(),
    };

    const existing = currentSearches.filter(
      (item) => item.product_id !== product.product_id
    );
    const updated = [newSearch, ...existing].slice(0, 10);

    saveRecentSearches(updated);
  };

  const clearRecentSearches = () => {
    saveRecentSearches([]);
  };

  const removeFromRecentSearches = (pidToRemove) => {
    const updated = recentSearches.filter(
      (item) => item.product_id !== pidToRemove
    );
    saveRecentSearches(updated);
  };

  // FORECAST CONTROL HANDLERS
  const handleFieldChange = (field, value) => {
    if (!originalValuesRef.current) return;

    switch (field) {
      case "Trend":
        setEditableTrend(value);
        if (value !== originalValuesRef.current.Trend) {
          setLastChangedField("Trend");
          setPendingChangeField("Trend");
        } else if (lastChangedField === "Trend") {
          setLastChangedField(null);
        }
        break;

      case "Forecasting_Method":
        setForecastingMethod(value);
        if (value !== originalValuesRef.current.Forecasting_Method) {
          setLastChangedField("Forecasting_Method");
          setPendingChangeField("Forecasting_Method");
        } else if (lastChangedField === "Forecasting_Method") {
          setLastChangedField(null);
        }
        break;

      case "Rolling_method":
        setRollingMethod(value);
        if (value !== originalValuesRef.current.Rolling_method) {
          setLastChangedField("Rolling_method");
          setPendingChangeField("Rolling_method");
        } else if (lastChangedField === "Rolling_method") {
          setLastChangedField(null);
        }
        break;

      case "month_12_fc_index_original":
        setEditable12MonthFC(value);
        if (value !== originalValuesRef.current.month_12_fc_index_original) {
          setLastChangedField("month_12_fc_index_original");
          setPendingChangeField("month_12_fc_index_original");
        } else if (lastChangedField === "month_12_fc_index_original") {
          setLastChangedField(null);
        }
        break;

      case "Current_FC_Index":
        setSelectedIndex(value);
        if (value !== originalValuesRef.current.Current_FC_Index) {
          setLastChangedField("Current_FC_Index");
          setPendingChangeField("Current_FC_Index");
        } else if (lastChangedField === "Current_FC_Index") {
          setLastChangedField(null);
        }
        break;

      default:
        break;
    }
  };

  const handleCellChange = (rowType, month, value) => {
    setEditableData((prev) => ({
      ...prev,
      [rowType]: {
        ...prev[rowType],
        [month]: parseFloat(value) || 0,
      },
    }));
    setLastChangedEditableField(rowType);
    setHasEditableChanges(true);
  };

  // GET SOPHISTICATED CARD DATA
  // const getSophisticatedCardData = () => {
  //   if (!productData) return null;

  //   const { product_details, store_forecast, com_forecast, omni_forecast } =
  //     productData;
  //   const forecastData =
  //     store_forecast?.[0] || com_forecast?.[0] || omni_forecast?.[0] || {};

  //   return {
  //     category:
  //       product_details?.department_description ||
  //       product_details?.subclass_decription ||
  //       forecastData?.category ||
  //       "Unknown Category",
  //     vendor:
  //       forecastData?.vendor ||
  //       product_details?.vendor_name ||
  //       product_details?.vendor ||
  //       "Unknown Vendor",
  //     doorCount:
  //       forecastData?.door_count ||
  //       product_details?.current_door_count ||
  //       forecastData?.Door_count ||
  //       0,
  //     leadTime:
  //       forecastData?.lead_time ||
  //       product_details?.lead_time ||
  //       forecastData?.Lead_time ||
  //       0,
  //     minOrder:
  //       forecastData?.Min_order ||
  //       forecastData?.min_order ||
  //       product_details?.min_order ||
  //       0,
  //     retailValue:
  //       forecastData?.retail_value ||
  //       product_details?.retail_price ||
  //       forecastData?.Retail_value ||
  //       product_details?.price ||
  //       0,
  //     macys_owned_retail: product_details?.macys_owned_retail || 0,
  //     STD_index_value: product_details?.STD_index_value || 0,
  //     selectedMonth:
  //       forecastData?.selected_months ||
  //       product_details?.selected_months ||
  //       forecastData?.Selected_month ||
  //       "N/A",
  //     forecastMonth:
  //       forecastData?.forecast_month || forecastData?.Forecast_month || "N/A",
  //     nextForecastMonth:
  //       forecastData?.next_forecast_month ||
  //       forecastData?.Next_forecast_month ||
  //       "N/A",
  //     productId: product_details?.product_id || productId,
  //     trend: forecastData?.trend || 0,
  //     addedQty: forecastData?.recommended_total_quantity || 0,
  //     macysSOQ: forecastData?.Macys_SOQ || 0,
  //     stdTrend:
  //       forecastData?.std_trend_original ||
  //       product_details?.std_trend_original ||
  //       0,
  //     monthFCIndex:
  //       forecastData?.month_12_fc_index_original ||
  //       forecastData?.["12_month_FC_index"] ||
  //       forecastData?.com_month_12_fc_index ||
  //       forecastData?.store_month_12_fc_index ||
  //       product_details?.month_12_fc_index_original ||
  //       0,
  //     stdIndexValue:
  //       forecastData?.std_index_value ||
  //       forecastData?.STD_index_value ||
  //       product_details?.std_index_value ||
  //       0,
  //     birthstone:
  //       forecastData?.birthstone || product_details?.birthstone || "N/A",
  //     birthstoneMonth:
  //       forecastData?.birthstone_month ||
  //       forecastData?.bithstone_month ||
  //       product_details?.birthstone_month ||
  //       "N/A",
  //     totalAddedQty:
  //       forecastData?.recommended_total_quantity ||
  //       product_details?.recommended_total_quantity ||
  //       forecastData?.addedQty ||
  //       0,
  //   };
  // };

  const getSophisticatedCardData = () => {
    if (!productData) return null;

    const { product_details, store_forecast, com_forecast, omni_forecast } =
      productData;
    const forecastData =
      store_forecast?.[0] || com_forecast?.[0] || omni_forecast?.[0] || {};

    return {
      category:
        product_details?.category ||
        // forecastData?.category ||
        "Unknown Category",
      vendor: product_details?.vendor_name || "Unknown Vendor",
      doorCount: product_details?.kpi_door_count || 0,
      leadTime: product_details?.lead_time || 0,
      minOrder: product_details?.min_order || 0,

      macys_owned_retail: product_details?.macys_owned_retail || 0,
      STD_index_value: product_details?.std_index_value_original || 0,
      selectedMonth:
        // forecastData?.selected_months ||
        product_details?.selected_months ||
        // forecastData?.Selected_month ||
        "N/A",
      forecastMonth: product_details?.forecast_month || "N/A",
      nextForecastMonth:
        product_details?.next_forecast_month ||
        // forecastData?.next_forecast_month ||
        "N/A",
      productId: product_details?.product_id || productId,
      trend: product_details?.std_trend_original || 0,
      addedQty:
        product_details?.recommended_total_quantity ||
        // forecastData?.recommended_total_quantity ||
        0,
      macysSOQ:
        product_details?.Macys_SOQ ||
        // forecastData?.Macys_SOQ ||
        0,
      stdTrend:
        // forecastData?.std_trend_original ||
        product_details?.std_trend_original || 0,
      monthFCIndex:
        // forecastData?.month_12_fc_index_original ||
        // forecastData?.["12_month_FC_index"] ||
        // forecastData?.com_month_12_fc_index ||
        // forecastData?.store_month_12_fc_index ||
        product_details?.month_12_fc_index_original || 0,
      stdIndexValue:
        // forecastData?.std_index_value ||
        product_details?.std_index_value || 0,
      birthstone: product_details?.birthstone || "N/A",
      birthstoneMonth:
        // forecastData?.birthstone_month ||
        product_details?.birthstone_month || "N/A",
      totalAddedQty: product_details?.recommended_total_quantity || 0,
    };
  };

  const cardData = getSophisticatedCardData();

  // NAVIGATION HANDLERS
  const handleNavigatePrevious = () => {
    if (canNavigatePrevious && previousProduct) {
      handleNavigateToProduct(previousProduct.product_id);
    }
  };

  const handleNavigateNext = () => {
    if (canNavigateNext && nextProduct) {
      handleNavigateToProduct(nextProduct.product_id);
    }
  };

  // CRITICAL ADJUSTMENTS SAVE HANDLER
  const handleCriticalSave = () => {
    setShowCriticalSavePopup(true);
    setTimeout(() => setShowCriticalSavePopup(false), 3000);
  };

  // APPLY CHANGES FUNCTION
  const handleApplyChanges = async () => {
    if (!rollingForecastData || !productId || !sheetId) return;

    setIsSubmitting(true);

    try {
      const monthLabels = [
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
        "JAN",
      ];

      // Build context data with updated variable names for control fields
      const contextData = {
        updated_rolling_method: rollingMethod,
        updated_std_trend: parseFloat(editableTrend) || 0,
        updated_forecasting_method: forecastingMethod,
        updated_12_month_fc_index: parseFloat(editable12MonthFC) || 100,
        updated_current_fc_index: selectedIndex,
      };

      // Initialize monthly data objects with NEW variable names
      contextData.index = {};
      contextData.fc_by_index = {};
      contextData.fc_by_trend = {};
      contextData.recommended_fc = {};
      contextData.planned_fc = {};
      contextData.planned_shipments = {};
      contextData.planned_eoh_cal = {};
      contextData.planned_sell_thru_pct = {};
      contextData.gross_projection_nav = {};
      contextData.macys_proj_receipts = {};

      // Populate monthly data
      monthLabels.forEach((month, index) => {
        contextData.index[month] = rollingForecastData.index?.[index] || 0;
        contextData.fc_by_index[month] =
          rollingForecastData.fcByIndex?.[index] || 0;
        contextData.fc_by_trend[month] =
          rollingForecastData.fcByTrend?.[index] || 0;
        contextData.recommended_fc[month] =
          rollingForecastData.recommendedFC?.[index] || 0;
        contextData.planned_fc[month] =
          editableData.plannedFC?.[month] ||
          rollingForecastData.plannedFC?.[index] ||
          0;
        contextData.planned_shipments[month] =
          editableData.plannedShipments?.[month] ||
          rollingForecastData.plannedShipments?.[index] ||
          0;
        contextData.planned_eoh_cal[month] =
          rollingForecastData.plannedEOH?.[index] || 0;
        contextData.planned_sell_thru_pct[month] =
          rollingForecastData.plannedSellThru?.[index] || 0;
        contextData.gross_projection_nav[month] =
          rollingForecastData.grossProjection?.[index] || 0;
        contextData.macys_proj_receipts[month] =
          rollingForecastData.macysProjReceipts?.[index] || 0;
      });

      const getChangedVariableName = () => {
        switch (lastChangedField) {
          case "Trend":
            return "updated_std_trend";
          case "month_12_fc_index_original":
            return "updated_12_month_fc_index";
          case "Forecasting_Method":
            return "updated_forecasting_method";
          case "Rolling_method":
            return "updated_rolling_method";
          case "Current_FC_Index":
            return "updated_current_fc_index";
          default:
            return "updated_std_trend";
        }
      };

      const getChangedFieldValue = () => {
        switch (lastChangedField) {
          case "Trend":
            return parseFloat(editableTrend) || 0;
          case "month_12_fc_index_original":
            return parseFloat(editable12MonthFC) || 0;
          case "Forecasting_Method":
            return forecastingMethod;
          case "Rolling_method":
            return rollingMethod;
          case "Current_FC_Index":
            return selectedIndex;
          default:
            return parseFloat(editableTrend) || 0;
        }
      };

      if (lastChangedField) {
        lastAppliedChangeRef.current = {
          changed_variable: getChangedVariableName(),
          new_value: getChangedFieldValue(),
        };
      }

      const payload = {
        sheet_id: parseInt(sheetId),
        changed_variable: getChangedVariableName(),
        new_value: getChangedFieldValue(),
        context_data: contextData,
        pid: productId,
      };

      console.log("Sending payload:", payload); // For debugging

      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/product/recalculate_forecast/`,
        payload
      );

      if (response.data && response.data.updated_context) {
        const updatedContext = response.data.updated_context;

        // Update the rolling forecast data based on response with NEW variable names
        const updatedRollingData = {
          index: monthLabels.map((month) => updatedContext.index?.[month] || 0),
          fcByIndex: monthLabels.map(
            (month) => updatedContext.fc_by_index?.[month] || 0
          ),
          fcByTrend: monthLabels.map(
            (month) => updatedContext.fc_by_trend?.[month] || 0
          ),
          recommendedFC: monthLabels.map(
            (month) => updatedContext.recommended_fc?.[month] || 0
          ),
          plannedFC: monthLabels.map(
            (month) => updatedContext.planned_fc?.[month] || 0
          ),
          plannedShipments: monthLabels.map(
            (month) => updatedContext.planned_shipments?.[month] || 0
          ),
          plannedEOH: monthLabels.map(
            (month) => updatedContext.planned_eoh_cal?.[month] || 0
          ),
          grossProjection: monthLabels.map(
            (month) => updatedContext.gross_projection_nav?.[month] || 0
          ),
          macysProjReceipts: monthLabels.map(
            (month) => updatedContext.macys_proj_receipts?.[month] || 0
          ),
          plannedSellThru: monthLabels.map(
            (month) => updatedContext.planned_sell_thru_pct?.[month] || 0
          ),
        };

        setRollingForecastData(updatedRollingData);

        const newEditableData = {
          plannedFC: {},
          plannedShipments: {},
        };
        monthLabels.forEach((month, index) => {
          newEditableData.plannedFC[month] =
            updatedRollingData.plannedFC[index];
          newEditableData.plannedShipments[month] =
            updatedRollingData.plannedShipments[index];
        });
        setEditableData(newEditableData);

        setLastSubmittedData(payload);
        setLastChangedField(null);
        originalValuesRef.current = {
          Trend: parseFloat(editableTrend) || 0,
          Forecasting_Method: forecastingMethod,
          Rolling_method: rollingMethod,
          month_12_fc_index_original: editable12MonthFC,
          Current_FC_Index: selectedIndex,
        };

        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error applying control changes:", error);
      alert("Failed to apply changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUBMIT FORECAST CHANGES
  const submitForecastChanges = async (changedVariable) => {
    if (!editableData || !productId) return;

    setIsSubmitting(true);

    try {
      const monthLabels = [
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
        "JAN",
      ];

      // Map the changed variable to new naming convention
      const getVariableName = () => {
        switch (changedVariable) {
          case "Planned_FC":
            return "planned_fc";
          case "Planned_Shipments":
            return "planned_shipments";
          default:
            return changedVariable.toLowerCase();
        }
      };

      const newValue =
        changedVariable === "Planned_FC"
          ? editableData.plannedFC
          : editableData.plannedShipments;

      const contextData = {
        updated_rolling_method: rollingMethod,
        updated_std_trend: parseFloat(editableTrend) || 0,
        updated_forecasting_method: forecastingMethod,
        updated_12_month_fc_index: parseFloat(editable12MonthFC) || 0,
        updated_current_fc_index: selectedIndex,
      };

      // Add monthly data with updated variable names
      contextData.index = {};
      contextData.fc_by_index = {};
      contextData.fc_by_trend = {};
      contextData.recommended_fc = {};
      contextData.planned_fc = {};
      contextData.planned_shipments = {};
      contextData.planned_eoh_cal = {};
      contextData.planned_sell_thru_pct = {};
      contextData.gross_projection_nav = {};
      contextData.macys_proj_receipts = {};

      monthLabels.forEach((month, index) => {
        contextData.index[month] = rollingForecastData.index?.[index] || 0;
        contextData.fc_by_index[month] =
          rollingForecastData.fcByIndex?.[index] || 0;
        contextData.fc_by_trend[month] =
          rollingForecastData.fcByTrend?.[index] || 0;
        contextData.recommended_fc[month] =
          rollingForecastData.recommendedFC?.[index] || 0;
        contextData.planned_fc[month] =
          editableData.plannedFC?.[month] ||
          rollingForecastData.plannedFC?.[index] ||
          0;
        contextData.planned_shipments[month] =
          editableData.plannedShipments?.[month] ||
          rollingForecastData.plannedShipments?.[index] ||
          0;
        contextData.planned_eoh_cal[month] =
          rollingForecastData.plannedEOH?.[index] || 0;
        contextData.planned_sell_thru_pct[month] =
          rollingForecastData.plannedSellThru?.[index] || 0;
        contextData.gross_projection_nav[month] =
          rollingForecastData.grossProjection?.[index] || 0;
        contextData.macys_proj_receipts[month] =
          rollingForecastData.macysProjReceipts?.[index] || 0;
      });

      const payload = {
        sheet_id: parseInt(sheetId), // Added sheet_id
        changed_variable: getVariableName(),
        new_value: newValue,
        context_data: contextData, // Changed from updated_context to context_data
        pid: productId, // Changed from product_id to pid
      };

      console.log("Submitting forecast changes payload:", payload); // For debugging

      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/product/recalculate_forecast/`,
        payload
      );

      if (response.data && response.data.updated_context) {
        const updatedContext = response.data.updated_context;

        const updatedRollingData = {
          index: monthLabels.map((month) => updatedContext.index?.[month] || 0),
          fcByIndex: monthLabels.map(
            (month) => updatedContext.fc_by_index?.[month] || 0
          ),
          fcByTrend: monthLabels.map(
            (month) => updatedContext.fc_by_trend?.[month] || 0
          ),
          recommendedFC: monthLabels.map(
            (month) => updatedContext.recommended_fc?.[month] || 0
          ),
          plannedFC: monthLabels.map(
            (month) => updatedContext.planned_fc?.[month] || 0
          ),
          plannedShipments: monthLabels.map(
            (month) => updatedContext.planned_shipments?.[month] || 0
          ),
          plannedEOH: monthLabels.map(
            (month) => updatedContext.planned_eoh_cal?.[month] || 0
          ),
          grossProjection: monthLabels.map(
            (month) => updatedContext.gross_projection_nav?.[month] || 0
          ),
          macysProjReceipts: monthLabels.map(
            (month) => updatedContext.macys_proj_receipts?.[month] || 0
          ),
          plannedSellThru: monthLabels.map(
            (month) => updatedContext.planned_sell_thru_pct?.[month] || 0
          ),
        };

        setRollingForecastData(updatedRollingData);

        // Update editableData with new values
        const newEditableData = {
          plannedFC: {},
          plannedShipments: {},
        };
        monthLabels.forEach((month, index) => {
          newEditableData.plannedFC[month] =
            updatedRollingData.plannedFC[index];
          newEditableData.plannedShipments[month] =
            updatedRollingData.plannedShipments[index];
        });
        setEditableData(newEditableData);

        setLastSubmittedData(payload);
      }
    } catch (error) {
      console.error("Error submitting forecast changes:", error);
      alert("Failed to update forecast. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // HANDLE SAVE CHANGES
  const handleSaveChanges = async () => {
    if (!rollingForecastData || !productId) return;

    setIsSaving(true);
    setShowSaveChangesPopup(true);

    const file_path = files.find(
      (f) => f.id === parseInt(sheetId)
    ).output_folder;

    try {
      const monthLabels = [
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
        "JAN",
      ];

      // Build updated_context exactly matching your JSON structure
      const updated_context = {
        updated_rolling_method: rollingMethod,
        updated_std_trend: parseFloat(editableTrend) || 0,
        updated_forecasting_method: forecastingMethod,
        updated_12_month_fc_index: parseFloat(editable12MonthFC) || 0,
        updated_current_fc_index: selectedIndex,
      };

      // Initialize monthly data objects with exact variable names from your JSON
      updated_context.index = {};
      updated_context.fc_by_index = {}; // Note: your JSON has "fc_by_inex" but should be "fc_by_index"
      updated_context.fc_by_trend = {};
      updated_context.recommended_fc = {};
      updated_context.planned_fc = {};
      updated_context.planned_shipments = {};
      updated_context.planned_eoh_cal = {};
      updated_context.planned_sell_thru_pct = {};
      updated_context.gross_projection_nav = {};
      updated_context.macys_proj_receipts = {};

      // Populate monthly data
      monthLabels.forEach((month, index) => {
        updated_context.index[month] = rollingForecastData.index?.[index] || 0;
        updated_context.fc_by_index[month] =
          rollingForecastData.fcByIndex?.[index] || 0;
        updated_context.fc_by_trend[month] =
          rollingForecastData.fcByTrend?.[index] || 0;
        updated_context.recommended_fc[month] =
          rollingForecastData.recommendedFC?.[index] || 0;
        updated_context.planned_fc[month] =
          editableData.plannedFC?.[month] ||
          rollingForecastData.plannedFC?.[index] ||
          0;
        updated_context.planned_shipments[month] =
          editableData.plannedShipments?.[month] ||
          rollingForecastData.plannedShipments?.[index] ||
          0;
        updated_context.planned_eoh_cal[month] =
          rollingForecastData.plannedEOH?.[index] || 0;
        updated_context.planned_sell_thru_pct[month] =
          rollingForecastData.plannedSellThru?.[index] || 0;
        updated_context.gross_projection_nav[month] =
          rollingForecastData.grossProjection?.[index] || 0;
        updated_context.macys_proj_receipts[month] =
          rollingForecastData.macysProjReceipts?.[index] || 0;
      });

      // Create payload exactly matching your JSON structure
      const payload = {
        sheet_id: parseInt(sheetId),
        updated_context: updated_context,
        file_path: file_path,
        pid: productId,
      };

      console.log("Saving with payload:", JSON.stringify(payload, null, 2)); // Pretty print for debugging

      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/product/save_recalculate/`,
        payload
      );

      if (response.data && response.data.updated_context) {
        const updatedContext = response.data.updated_context;

        // Update rolling data using variable names from response
        const updatedRollingData = {
          index: monthLabels.map((month) => updatedContext.index?.[month] || 0),
          fcByIndex: monthLabels.map(
            (month) => updatedContext.fc_by_index?.[month] || 0
          ),
          fcByTrend: monthLabels.map(
            (month) => updatedContext.fc_by_trend?.[month] || 0
          ),
          recommendedFC: monthLabels.map(
            (month) => updatedContext.recommended_fc?.[month] || 0
          ),
          plannedFC: monthLabels.map(
            (month) => updatedContext.planned_fc?.[month] || 0
          ),
          plannedShipments: monthLabels.map(
            (month) => updatedContext.planned_shipments?.[month] || 0
          ),
          plannedEOH: monthLabels.map(
            (month) => updatedContext.planned_eoh_cal?.[month] || 0
          ),
          grossProjection: monthLabels.map(
            (month) => updatedContext.gross_projection_nav?.[month] || 0
          ),
          macysProjReceipts: monthLabels.map(
            (month) => updatedContext.macys_proj_receipts?.[month] || 0
          ),
          plannedSellThru: monthLabels.map(
            (month) => updatedContext.planned_sell_thru_pct?.[month] || 0
          ),
        };

        setRollingForecastData(updatedRollingData);

        const newEditableData = {
          plannedFC: {},
          plannedShipments: {},
        };
        monthLabels.forEach((month, index) => {
          newEditableData.plannedFC[month] =
            updatedRollingData.plannedFC[index];
          newEditableData.plannedShipments[month] =
            updatedRollingData.plannedShipments[index];
        });
        setEditableData(newEditableData);

        setHasControlChanges(false);
        setLastSubmittedData(payload);
        setLastChangedField(null);

        originalValuesRef.current = {
          Trend: parseFloat(editableTrend) || 0,
          Forecasting_Method: forecastingMethod,
          Rolling_method: rollingMethod,
          month_12_fc_index_original: editable12MonthFC,
          Current_FC_Index: selectedIndex,
        };

        setInitialControlValues({
          Trend: parseFloat(editableTrend) || 0,
          Forecasting_Method: forecastingMethod,
          Rolling_method: rollingMethod,
          month_12_fc_index_original: parseFloat(editable12MonthFC) || 0,
          Current_FC_Index: selectedIndex,
        });

        setHasEditableChanges(false);

        setTimeout(() => {
          setShowSaveChangesPopup(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error applying control changes:", error);
      setShowSaveChangesPopup(false);
      alert("Failed to apply changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ALL useEffect HOOKS
  useEffect(() => {
    setSearchResults(filteredProducts);
  }, [filteredProducts]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("productRecentSearches");
      if (stored) {
        const parsedSearches = JSON.parse(stored);
        setRecentSearches(parsedSearches);
      }
    } catch (error) {
      console.error("Error loading recent searches from localStorage:", error);
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    setSearchQuery("");
    setShowSearchDropdown(false);
    setShowRecentSearches(false);
  }, [productId]);

  useEffect(() => {
    console.log("ProductDetailsView: productId changed to:", productId);
    if (productId) {
      fetchProductDetails();
      getData();
    }
  }, [productId, sheetId]);

  useEffect(() => {
    if (productId && allProducts.length > 0) {
      const currentProduct = allProducts.find(
        (p) => p.product_id === productId
      );
      if (currentProduct) {
        const isAlreadyMostRecent =
          recentSearches.length > 0 &&
          recentSearches[0].product_id === productId;
        if (!isAlreadyMostRecent) {
          addToRecentSearches(currentProduct);
        }
      }
    }
  }, [productId, allProducts, recentSearches]);

  useEffect(() => {
    if (!originalValuesRef.current || !initialControlValues) return;

    const hasChanges =
      selectedIndex !== originalValuesRef.current.Current_FC_Index ||
      rollingMethod !== originalValuesRef.current.Rolling_method ||
      forecastingMethod !== originalValuesRef.current.Forecasting_Method ||
      parseFloat(editableTrend) !== originalValuesRef.current.Trend ||
      parseFloat(editable12MonthFC) !==
        originalValuesRef.current.month_12_fc_index_original;

    const hasInitialDiff =
      selectedIndex !== initialControlValues.Current_FC_Index ||
      rollingMethod !== initialControlValues.Rolling_method ||
      forecastingMethod !== initialControlValues.Forecasting_Method ||
      parseFloat(editableTrend) !== initialControlValues.Trend ||
      parseFloat(editable12MonthFC) !==
        initialControlValues.month_12_fc_index_original;

    setHasControlChanges(hasChanges);
    setHasInitialChanges(hasInitialDiff);
  }, [
    selectedIndex,
    rollingMethod,
    forecastingMethod,
    editableTrend,
    editable12MonthFC,
    initialControlValues,
  ]);

  useEffect(() => {
    if (
      editableTrend &&
      forecastingMethod &&
      rollingMethod &&
      editable12MonthFC &&
      selectedIndex &&
      !initialControlValues
    ) {
      setInitialControlValues({
        Trend: parseFloat(editableTrend) || 0,
        Forecasting_Method: forecastingMethod,
        Rolling_method: rollingMethod,
        month_12_fc_index_original: parseFloat(editable12MonthFC) || 0,
        Current_FC_Index: selectedIndex,
      });
    }
  }, [
    editableTrend,
    forecastingMethod,
    rollingMethod,
    editable12MonthFC,
    selectedIndex,
    initialControlValues,
  ]);

  useEffect(() => {
    if (rollingForecastData) {
      const monthLabels = [
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
        "JAN",
      ];

      const initialEditableData = {
        plannedFC: {},
        plannedShipments: {},
      };

      monthLabels.forEach((month, index) => {
        initialEditableData.plannedFC[month] =
          rollingForecastData.plannedFC?.[index] || 0;
        initialEditableData.plannedShipments[month] =
          rollingForecastData.plannedShipments?.[index] || 0;
      });

      setEditableData(initialEditableData);
    }
  }, [rollingForecastData]);

  useEffect(() => {
    if (
      editableTrend &&
      forecastingMethod &&
      rollingMethod &&
      editable12MonthFC &&
      selectedIndex &&
      !originalValuesRef.current
    ) {
      originalValuesRef.current = {
        Trend: parseFloat(editableTrend) || 0,
        Forecasting_Method: forecastingMethod,
        Rolling_method: rollingMethod,
        month_12_fc_index_original: parseFloat(editable12MonthFC) || 0,
        Current_FC_Index: selectedIndex,
      };
    }
  }, [
    editableTrend,
    forecastingMethod,
    rollingMethod,
    editable12MonthFC,
    selectedIndex,
  ]);

  useEffect(() => {
    if (!pendingChangeField || !rollingForecastData) return;

    const timer = setTimeout(() => {
      setLastChangedField(pendingChangeField);
      handleApplyChanges();
      setPendingChangeField(null);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    pendingChangeField,
    editableTrend,
    editable12MonthFC,
    forecastingMethod,
    rollingMethod,
    selectedIndex,
    rollingForecastData,
  ]);

  useEffect(() => {
    if (!lastChangedEditableField) return;

    const timer = setTimeout(() => {
      const changedVariable =
        lastChangedEditableField === "plannedFC"
          ? "Planned_FC"
          : "Planned_Shipments";
      submitForecastChanges(changedVariable);
      setLastChangedEditableField(null);
    }, 500);

    return () => clearTimeout(timer);
  }, [editableData, lastChangedEditableField]);

  useEffect(() => {
    if (!rollingForecastData || !previousValues.rollingForecastData) return;

    const monthLabels = [
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
      "JAN",
    ];
    const newAutoChangedCells = new Set();

    Object.keys(rollingForecastData).forEach((dataType) => {
      if (
        Array.isArray(rollingForecastData[dataType]) &&
        Array.isArray(previousValues.rollingForecastData[dataType])
      ) {
        rollingForecastData[dataType].forEach((value, index) => {
          const prevValue = previousValues.rollingForecastData[dataType][index];
          if (value !== prevValue && monthLabels[index]) {
            const cellKey = `${dataType}-${monthLabels[index]}`;
            newAutoChangedCells.add(cellKey);
          }
        });
      }
    });

    if (newAutoChangedCells.size > 0) {
      setAutoChangedCells((prev) => new Set([...prev, ...newAutoChangedCells]));
      setJustChangedCells((prev) => new Set([...prev, ...newAutoChangedCells]));

      setTimeout(() => {
        setJustChangedCells((prev) => {
          const newSet = new Set(prev);
          newAutoChangedCells.forEach((cellKey) => newSet.delete(cellKey));
          return newSet;
        });
      }, 600);
    }
  }, [rollingForecastData, previousValues.rollingForecastData]);

  useEffect(() => {
    if (rollingForecastData) {
      setPreviousValues((prev) => ({
        ...prev,
        rollingForecastData: JSON.parse(JSON.stringify(rollingForecastData)),
      }));
    }
  }, [JSON.stringify(rollingForecastData)]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  // LOADING AND ERROR STATES
  if (loading) {
    return <LoadingScreen />;
  }

  const onBack = () => {
    navigate(`/products/${sheetId}`);
  };

  if (error) {
    return (
      <ErrorScreen
        error={error}
        onRetry={fetchProductDetails}
        onBack={onBack}
      />
    );
  }

  // RENDER COMPONENT
  return (
    <div
      key={productId}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 h-100"
    >
      {/* Save Popups */}
      <SavePopups
        showSaveChangesPopup={showSaveChangesPopup}
        setShowSaveChangesPopup={setShowSaveChangesPopup}
        isSaving={isSaving}
        showCriticalSavePopup={showCriticalSavePopup}
        setShowCriticalSavePopup={setShowCriticalSavePopup}
        showSuccessPopup={showSuccessPopup}
        setShowSuccessPopup={setShowSuccessPopup}
      />

      <div className="w-full mx-auto p-6 space-y-8">
        {/* Enhanced Header Section */}
        <ProductHeader
          productId={productId}
          cardData={cardData}
          onBack={onBack}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          showSearchDropdown={showSearchDropdown}
          setShowSearchDropdown={setShowSearchDropdown}
          recentSearches={recentSearches}
          showRecentSearches={showRecentSearches}
          setShowRecentSearches={setShowRecentSearches}
          handleNavigateToProduct={handleNavigateToProduct}
          canNavigatePrevious={canNavigatePrevious}
          canNavigateNext={canNavigateNext}
          previousProduct={previousProduct}
          nextProduct={nextProduct}
          currentProductIndex={currentProductIndex}
          allProducts={allProducts}
          handleSearchChange={handleSearchChange}
          handleSearchFocus={handleSearchFocus}
          handleSearchBlur={handleSearchBlur}
          handleSearchResultClick={handleSearchResultClick}
          handleRecentSearchClick={handleRecentSearchClick}
          clearRecentSearches={clearRecentSearches}
          removeFromRecentSearches={removeFromRecentSearches}
        />

        {/* Quick Navigation */}
        <QuickNavigation
          previousProduct={previousProduct}
          nextProduct={nextProduct}
          onNavigatePrevious={handleNavigatePrevious}
          onNavigateNext={handleNavigateNext}
        />

        {/* Product Info Cards */}
        {cardData && (
          <ProductInfoCards
            cardData={cardData}
            userAddedQuantity={userAddedQuantity}
            externalFactorPercentage={externalFactorPercentage}
          />
        )}

        {/* Critical Adjustments */}
        <CriticalAdjustments
          userAddedQuantity={userAddedQuantity}
          setUserAddedQuantity={setUserAddedQuantity}
          externalFactor={externalFactor}
          setExternalFactor={setExternalFactor}
          externalFactorPercentage={externalFactorPercentage}
          setExternalFactorPercentage={setExternalFactorPercentage}
          cardData={cardData}
          productId={productId}
          onSave={handleCriticalSave}
          fetchProducts={fetchProducts}
          productData={productData}
        />

        {/* Rolling Forecast */}
        <RollingForecast
          rollingForecastData={rollingForecastData}
          editableData={editableData}
          setEditableData={setEditableData}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          rollingMethod={rollingMethod}
          setRollingMethod={setRollingMethod}
          forecastingMethod={forecastingMethod}
          setForecastingMethod={setForecastingMethod}
          editableTrend={editableTrend}
          setEditableTrend={setEditableTrend}
          editable12MonthFC={editable12MonthFC}
          setEditable12MonthFC={setEditable12MonthFC}
          isSaving={isSaving}
          hasControlChanges={hasControlChanges}
          hasEditableChanges={hasEditableChanges}
          initialControlValues={initialControlValues}
          originalValuesRef={originalValuesRef}
          changedCells={changedCells}
          setChangedCells={setChangedCells}
          autoChangedCells={autoChangedCells}
          setAutoChangedCells={setAutoChangedCells}
          justChangedCells={justChangedCells}
          setJustChangedCells={setJustChangedCells}
          lastChangedField={lastChangedField}
          handleFieldChange={handleFieldChange}
          handleSaveChanges={handleSaveChanges}
          handleCellChange={handleCellChange}
        />

        {/* Monthly Forecast */}
        <MonthlyForecast
          productData={productData}
          expandedSections={expandedSections}
          toggleSection={(section) =>
            setExpandedSections((prev) => ({
              ...prev,
              [section]: !prev[section],
            }))
          }
        />

        {/* Forecast Variables Button */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={() => setShowVariablesModal(true)}
            className="px-8 py-4 rounded-full text-base font-semibold shadow-2xl transition-all duration-300 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transform hover:scale-110 hover:shadow-3xl backdrop-blur-sm border border-white/20"
            style={{
              boxShadow:
                "0 10px 40px rgba(59, 130, 246, 0.4), 0 4px 20px rgba(99, 102, 241, 0.3)",
            }}
          >
            <BarChart3 size={20} />
            <span>Forecast Algorithm Variables</span>
          </button>
        </div>

        {/* Variables Modal */}
        <ForecastVariablesModal
          showVariablesModal={showVariablesModal}
          setShowVariablesModal={setShowVariablesModal}
          productData={productData}
          cardData={cardData}
        />
      </div>
    </div>
  );
};

ProductDetailsView.propTypes = {
  productId: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  handleNavigateToProduct: PropTypes.func.isRequired,
};

export default ProductDetailsView;
