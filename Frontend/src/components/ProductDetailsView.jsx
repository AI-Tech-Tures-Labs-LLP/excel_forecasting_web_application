import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import productImage from "../assets/undefined.png";
import {
  ArrowLeft,
  ChevronDown,
  Calendar,
  TrendingUp,
  Clock,
  BarChart3,
  AlertCircle,
  Building2,
  Tag,
  DollarSign,
  Target,
  Truck,
  Star,
  Activity,
  ShoppingCart,
  Layers,
  Search,
  ChevronLeft,
  ChevronRight,
  Navigation,
  TrendingDown, // Add this
  Zap, // Add this
  Gem, // Add this
  Calendar as CalendarIcon, // Add this
  Package,
  Calculator,
  AlertTriangle,
  Save,
  RefreshCw,
  FileText,
  Settings,
  ExternalLink,
  History, // Add this for recent searches icon
  X, /// Add this for notes
} from "lucide-react";

// Import selectors
import {
  fetchProducts,
  selectCurrentProducts,
  selectSelectedProductType,
} from "../redux/productSlice";

const ProductDetailsView = ({ productId, onBack, onNavigateToProduct }) => {
  const dispatch = useDispatch();
  const [initialControlValues, setInitialControlValues] = useState(null);
  const [hasInitialChanges, setHasInitialChanges] = useState(false);

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
  const [externalFactor, setExternalFactor] = useState(""); // This will be the notes
  const [showCalculatedChanges, setShowCalculatedChanges] = useState(false);

  // SEARCH HISTORY

  // ROLLING FORECAST STATE
  const [editableData, setEditableData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState(null);

  // SEARCH AND NAVIGATION STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  // CONTROL STATES - DECLARE THESE BEFORE THE useEffect THAT USES THEM
  const [rollingMethod, setRollingMethod] = useState("YTD");
  const [editableTrend, setEditableTrend] = useState("12.5");
  const [editable12MonthFC, setEditable12MonthFC] = useState("1200");
  const [selectedIndex, setSelectedIndex] = useState("Grand Total");
  const [forecastingMethod, setForecastingMethod] = useState("FC by Index");
  const [hasControlChanges, setHasControlChanges] = useState(false);
  const [pendingChangeField, setPendingChangeField] = useState(null);
  //tab navigation

  const [activeTab, setActiveTab] = useState("forecast-variables");

  const originalValuesRef = useRef(null);
  const lastAppliedChangeRef = useRef(null);

  // Get current products list and product type from Redux
  const allProducts = useSelector(selectCurrentProducts);
  const selectedProductType = useSelector(selectSelectedProductType);

  // Find current product index and calculate navigation
  const currentProductIndex = useMemo(() => {
    return allProducts.findIndex((product) => product.pid === productId);
  }, [allProducts, productId]);

  const canNavigatePrevious = currentProductIndex > 0;
  const canNavigateNext = currentProductIndex < allProducts.length - 1;

  const previousProduct = canNavigatePrevious
    ? allProducts[currentProductIndex - 1]
    : null;
  const nextProduct = canNavigateNext
    ? allProducts[currentProductIndex + 1]
    : null;

  // Search functionality
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];

    return allProducts
      .filter(
        (product) =>
          product.pid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 10); // Limit to 10 results
  }, [allProducts, searchQuery]);

  // NOW ALL useEffect HOOKS AFTER ALL STATE DECLARATIONS
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
    }
  }, [productId]);

  useEffect(() => {
    // Add current product to recent searches when productId changes
    if (productId && allProducts.length > 0) {
      const currentProduct = allProducts.find((p) => p.pid === productId);
      if (currentProduct) {
        // Check if this product is already the most recent search to avoid duplicates
        const isAlreadyMostRecent =
          recentSearches.length > 0 && recentSearches[0].pid === productId;
        if (!isAlreadyMostRecent) {
          addToRecentSearches(currentProduct);
        }
      }
    }
  }, [productId, allProducts]);

  useEffect(() => {
    if (!originalValuesRef.current || !initialControlValues) return;

    const hasChanges =
      selectedIndex !== originalValuesRef.current.Current_FC_Index ||
      rollingMethod !== originalValuesRef.current.Rolling_method ||
      forecastingMethod !== originalValuesRef.current.Forecasting_Method ||
      parseFloat(editableTrend) !== originalValuesRef.current.Trend ||
      parseFloat(editable12MonthFC) !==
        originalValuesRef.current.month_12_fc_index;

    const hasInitialDiff =
      selectedIndex !== initialControlValues.Current_FC_Index ||
      rollingMethod !== initialControlValues.Rolling_method ||
      forecastingMethod !== initialControlValues.Forecasting_Method ||
      parseFloat(editableTrend) !== initialControlValues.Trend ||
      parseFloat(editable12MonthFC) !== initialControlValues.month_12_fc_index;

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
      !initialControlValues // only set once
    ) {
      setInitialControlValues({
        Trend: parseFloat(editableTrend) || 0,
        Forecasting_Method: forecastingMethod,
        Rolling_method: rollingMethod,
        month_12_fc_index: parseFloat(editable12MonthFC) || 0,
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

      // Initialize with current data
      monthLabels.forEach((month, index) => {
        initialEditableData.plannedFC[month] =
          rollingForecastData.plannedFC?.[index] || 0;
        initialEditableData.plannedShipments[month] =
          rollingForecastData.plannedShipments?.[index] || 0;
      });

      setEditableData(initialEditableData);
    }
  }, [rollingForecastData]);

  const getData = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/api/product/${productId}/`
      );
      const rolling = res.data.product_details.rolling_method;
      const trend = res.data.product_details.std_trend;
      const editablemonths = res.data.product_details.month_12_fc_index;
      const selectedIndex = res.data.product_details.current_fc_index;
      const forecasting = res.data.product_details.forecasting_method;
      setRollingMethod(rolling);
      setEditableTrend(trend);
      setEditable12MonthFC(editablemonths);
      setForecastingMethod(forecasting);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (productId) getData();
  }, [productId]);

  //   if (
  //     editableTrend &&
  //     forecastingMethod &&
  //     rollingMethod &&
  //     editable12MonthFC &&
  //     selectedIndex &&
  //     !originalValuesRef.current // only set once
  //   ) {
  //     originalValuesRef.current = {
  //       Trend: editableTrend,
  //       Forecasting_Method: forecastingMethod,
  //       Rolling_method: rollingMethod,
  //       month_12_fc_index: editable12MonthFC,
  //       Current_FC_Index: selectedIndex,
  //     };
  //   }

  // }, [editableTrend, forecastingMethod, rollingMethod, editable12MonthFC, selectedIndex]);

  useEffect(() => {
    if (
      editableTrend &&
      forecastingMethod &&
      rollingMethod &&
      editable12MonthFC &&
      selectedIndex &&
      !originalValuesRef.current // only set once
    ) {
      originalValuesRef.current = {
        Trend: parseFloat(editableTrend) || 0,
        Forecasting_Method: forecastingMethod,
        Rolling_method: rollingMethod,
        month_12_fc_index: parseFloat(editable12MonthFC) || 0,
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

      case "month_12_fc_index":
        setEditable12MonthFC(value);
        if (value !== originalValuesRef.current.month_12_fc_index) {
          setLastChangedField("month_12_fc_index");
          setPendingChangeField("month_12_fc_index");
        } else if (lastChangedField === "month_12_fc_index") {
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

  useEffect(() => {
    if (!pendingChangeField || !rollingForecastData) return;

    const timer = setTimeout(() => {
      setLastChangedField(pendingChangeField);
      handleApplyChanges();
      setPendingChangeField(null); // reset
    }, 500); // wait for state to settle

    return () => clearTimeout(timer); // cleanup
  }, [
    pendingChangeField,
    editableTrend,
    editable12MonthFC,
    forecastingMethod,
    rollingMethod,
    selectedIndex,
    rollingForecastData,
  ]);

  // Save recent searches to memory
  const saveRecentSearches = (searches) => {
    try {
      localStorage.setItem("productRecentSearches", JSON.stringify(searches));
      setRecentSearches(searches);
    } catch (error) {
      console.error("Error saving recent searches to localStorage:", error);
    }
  };

  // Add a product to recent searches
  const addToRecentSearches = (product) => {
    if (!product || !product.pid) return;

    // Get the latest data from localStorage to avoid stale state
    let currentSearches = [];
    try {
      const stored = localStorage.getItem("productRecentSearches");
      if (stored) {
        currentSearches = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error reading recent searches:", error);
      currentSearches = [];
    }

    // Check if this product is already the most recent
    if (currentSearches.length > 0 && currentSearches[0].pid === product.pid) {
      return; // Don't add duplicate
    }

    const newSearch = {
      pid: product.pid,
      category: product.category || "Unknown Category",
      timestamp: Date.now(),
    };

    const existing = currentSearches.filter((item) => item.pid !== product.pid);
    const updated = [newSearch, ...existing].slice(0, 10); // Keep only 10 most recent

    saveRecentSearches(updated);
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    saveRecentSearches([]);
  };

  // Remove a specific recent search
  const removeFromRecentSearches = (pidToRemove) => {
    const updated = recentSearches.filter((item) => item.pid !== pidToRemove);
    saveRecentSearches(updated);
  };

  const handleCellChange = (rowType, month, value) => {
    setEditableData((prev) => ({
      ...prev,
      [rowType]: {
        ...prev[rowType],
        [month]: parseFloat(value) || 0,
      },
    }));
  };

  const handleUserAddedQuantityChange = (value) => {
    setExternalFactorPercentage("");
    setExternalFactor("");
    const qty = parseFloat(value);
    setUserAddedQuantity(value);

    if (!isNaN(qty) && totalAddedQty) {
      const percentage = (qty / totalAddedQty) * 100;
      setExternalFactorPercentage(percentage.toFixed(2));
    } else {
      setExternalFactorPercentage("");
      setExternalFactor("");
    }

    // Clear external factor note when user quantity is manually entered
  };

  const handleExternalFactorPercentageChange = (value) => {
    setUserAddedQuantity("");

    const perc = parseFloat(value);
    setExternalFactorPercentage(value);
    if (!isNaN(perc) && totalAddedQty) {
      const qty = (totalAddedQty * perc) / 100;
      setUserAddedQuantity(Math.round(qty).toString());
    } else {
      setUserAddedQuantity("");
    }
  };

  // Add function to handle Apply Changes button
  const handleApplyChanges = async () => {
    if (!rollingForecastData || !productId) return;

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

      // Build context_data with updated control values
      const contextData = {
        Rolling_method: rollingMethod,
        Trend: parseFloat(editableTrend) || 0,
        Forecasting_Method: forecastingMethod,
        month_12_fc_index: parseFloat(editable12MonthFC) || 100,
        Current_FC_Index: selectedIndex,
      };

      // Add all the forecast data arrays to context
      monthLabels.forEach((month, index) => {
        if (!contextData.Index_value) contextData.Index_value = {};
        if (!contextData.FC_by_Index) contextData.FC_by_Index = {};
        if (!contextData.FC_by_Trend) contextData.FC_by_Trend = {};
        if (!contextData.Recommended_FC) contextData.Recommended_FC = {};
        if (!contextData.Planned_FC) contextData.Planned_FC = {};
        if (!contextData.Planned_Shipments) contextData.Planned_Shipments = {};
        if (!contextData.Planned_EOH) contextData.Planned_EOH = {};
        if (!contextData.Planned_sell_thru) contextData.Planned_sell_thru = {};

        contextData.Index_value[month] =
          rollingForecastData.index?.[index] || 0;
        contextData.FC_by_Index[month] =
          rollingForecastData.fcByIndex?.[index] || 0;
        contextData.FC_by_Trend[month] =
          rollingForecastData.fcByTrend?.[index] || 0;
        contextData.Recommended_FC[month] =
          rollingForecastData.recommendedFC?.[index] || 0;
        contextData.Planned_FC[month] =
          editableData.plannedFC?.[month] ||
          rollingForecastData.plannedFC?.[index] ||
          0;
        contextData.Planned_Shipments[month] =
          editableData.plannedShipments?.[month] ||
          rollingForecastData.plannedShipments?.[index] ||
          0;
        contextData.Planned_EOH[month] =
          rollingForecastData.plannedEOH?.[index] || 0;
        contextData.Planned_sell_thru[month] =
          rollingForecastData.plannedSellThru?.[index] || 0;
      });
      console.log("TREND", lastChangedField);
      const getChangedFieldValue = () => {
        switch (lastChangedField) {
          case "Trend":
            return parseFloat(editableTrend) || 0;
          case "month_12_fc_index":
            return parseFloat(editable12MonthFC) || 0;
          case "Forecasting_Method":
            return forecastingMethod;
          case "Rolling_method":
            return rollingMethod;
          case "Current_FC_Index":
            return selectedIndex;
          default:
            return editableTrend;
        }
      };
      if (lastChangedField) {
        lastAppliedChangeRef.current = {
          changed_variable: lastChangedField,
          new_value: getChangedFieldValue(), // reuse same logic
        };
      }

      // Use a control variable change to trigger recalculation
      const payload = {
        changed_variable: lastChangedField || "TREND", // or whichever control changed most recently
        // new_value: parseFloat(editableTrend) || 0,
        new_value: getChangedFieldValue(),
        context_data: contextData,
        pid: productId,
      };

      console.log("Applying control changes:", payload);

      // const response = await axios.post(
      //   `${
      //     import.meta.env.VITE_API_BASE_URL
      //   }/forecast/api/product/${productId}/`,
      //   payload
      // );

      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/api/product/recalculate_forecast/`,
        payload
      );

      if (response.data && response.data.updated_context) {
        // Update the rolling forecast data with the recalculated values
        const updatedContext = response.data.updated_context;

        const updatedRollingData = {
          index: monthLabels.map(
            (month) => updatedContext.Index_value?.[month] || 0
          ),
          fcByIndex: monthLabels.map(
            (month) => updatedContext.FC_by_Index?.[month] || 0
          ),
          fcByTrend: monthLabels.map(
            (month) => updatedContext.FC_by_Trend?.[month] || 0
          ),
          recommendedFC: monthLabels.map(
            (month) => updatedContext.Recommended_FC?.[month] || 0
          ),
          plannedFC: monthLabels.map(
            (month) => updatedContext.Planned_FC?.[month] || 0
          ),
          plannedShipments: monthLabels.map(
            (month) => updatedContext.Planned_Shipments?.[month] || 0
          ),
          plannedEOH: monthLabels.map(
            (month) => updatedContext.Planned_EOH?.[month] || 0
          ),
          grossProjection: rollingForecastData.grossProjection, // Keep existing
          macysProjReceipts: rollingForecastData.macysProjReceipts, // Keep existing
          plannedSellThru: monthLabels.map(
            (month) => updatedContext.Planned_sell_thru?.[month] || 0
          ),
        };

        setRollingForecastData(updatedRollingData);

        // Update editable data with new values
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

        // setHasControlChanges(false);
        setLastSubmittedData(payload);
        setLastChangedField(null);
        originalValuesRef.current = {
          Trend: parseFloat(editableTrend) || 0,
          Forecasting_Method: forecastingMethod,
          Rolling_method: rollingMethod,
          month_12_fc_index: editable12MonthFC,
          Current_FC_Index: selectedIndex,
        };
        // alert("Forecast controls applied successfully!");
      }
    } catch (error) {
      console.error("Error applying control changes:", error);
      alert("Failed to apply changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProducts = async () => {
    try {
      dispatch(
        fetchProducts({
          productType: selectedProductType,
          filters: {
            category: [],
            birthstone: [],
            red_box_item: [],
            vdf_status: [],
            tagged_to: [],
            considered_birthstone: null,
            added_qty_macys_soq: null,
            below_min_order: null,
            over_macys_soq: null,
            added_only_to_balance_soq: null,
            need_to_review_first: null,
            // Holiday filters
            notes_sort: null,
            forecast_month: [],
            added_qty_sort: null,
            valentine_day: null,
            mothers_day: null,
            fathers_day: null,
            mens_day: null,
            womens_day: null,
            status: [],
            last_reviewed_sort: null,
          },
        })
      );
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const handleSaveChanges = async () => {
    if (!rollingForecastData || !productId) return;

    setIsSaving(true);
    const file_path = localStorage.getItem("file_path");
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

      // Build context_data with updated control values
      const contextData = {
        Rolling_method: rollingMethod,
        Trend: parseFloat(editableTrend) || 0,
        Forecasting_Method: forecastingMethod,
        month_12_fc_index: parseFloat(editable12MonthFC) || 100,
        Current_FC_Index: selectedIndex,
      };

      // Add all the forecast data arrays to context
      monthLabels.forEach((month, index) => {
        if (!contextData.Index_value) contextData.Index_value = {};
        if (!contextData.FC_by_Index) contextData.FC_by_Index = {};
        if (!contextData.FC_by_Trend) contextData.FC_by_Trend = {};
        if (!contextData.Recommended_FC) contextData.Recommended_FC = {};
        if (!contextData.Planned_FC) contextData.Planned_FC = {};
        if (!contextData.Planned_Shipments) contextData.Planned_Shipments = {};
        if (!contextData.Planned_EOH) contextData.Planned_EOH = {};
        if (!contextData.Planned_sell_thru) contextData.Planned_sell_thru = {};

        contextData.Index_value[month] =
          rollingForecastData.index?.[index] || 0;
        contextData.FC_by_Index[month] =
          rollingForecastData.fcByIndex?.[index] || 0;
        contextData.FC_by_Trend[month] =
          rollingForecastData.fcByTrend?.[index] || 0;
        contextData.Recommended_FC[month] =
          rollingForecastData.recommendedFC?.[index] || 0;
        contextData.Planned_FC[month] =
          editableData.plannedFC?.[month] ||
          rollingForecastData.plannedFC?.[index] ||
          0;
        contextData.Planned_Shipments[month] =
          editableData.plannedShipments?.[month] ||
          rollingForecastData.plannedShipments?.[index] ||
          0;
        contextData.Planned_EOH[month] =
          rollingForecastData.plannedEOH?.[index] || 0;
        contextData.Planned_sell_thru[month] =
          rollingForecastData.plannedSellThru?.[index] || 0;
      });
      console.log("TREND", lastChangedField);
      const getChangedFieldValue = () => {
        switch (lastChangedField) {
          case "Trend":
            return parseFloat(editableTrend) || 0;
          case "month_12_fc_index":
            return parseFloat(editable12MonthFC) || 0;
          case "Forecasting_Method":
            return forecastingMethod;
          case "Rolling_method":
            return rollingMethod;
          case "Current_FC_Index":
            return selectedIndex;
          default:
            return null;
        }
      };

      const updated_context = {
        Rolling_method: rollingMethod,
        Trend: parseFloat(editableTrend) || 0,
        Forecasting_Method: forecastingMethod,
        month_12_fc_index: parseFloat(editable12MonthFC) || 0,
        Current_FC_Index: selectedIndex,
        Index: contextData.Index_value, // ✅ rename from Index_value
        FC_by_Index: contextData.FC_by_Index,
        FC_by_Trend: contextData.FC_by_Trend,
        Recommended_FC: contextData.Recommended_FC,
        Planned_FC: contextData.Planned_FC,
        Planned_Shipments: contextData.Planned_Shipments,
        Planned_EOH: contextData.Planned_EOH,
        Gross_Projection_Nav: contextData.Gross_Projection_Nav || {}, // if needed
        Macys_Proj_Receipts: contextData.Macys_Proj_Receipts || {}, // if needed
        Planned_sell_Thru: contextData.Planned_sell_thru,
      };

      // Use a control variable change to trigger recalculation
      const payload = {
        updated_context: updated_context,
        file_path: file_path,
        pid: productId,
      };

      console.log("Applying control changes:", payload);

      // const response = await axios.post(
      //   `${
      //     import.meta.env.VITE_API_BASE_URL
      //   }/forecast/api/product/${productId}/`,
      //   payload
      // );

      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/api/product/save_recalculate/`,
        payload
      );

      if (response.data && response.data.updated_context) {
        // Update the rolling forecast data with the recalculated values
        const updatedContext = response.data.updated_context;

        const updatedRollingData = {
          index: monthLabels.map(
            (month) => updatedContext.Index_value?.[month] || 0
          ),
          fcByIndex: monthLabels.map(
            (month) => updatedContext.FC_by_Index?.[month] || 0
          ),
          fcByTrend: monthLabels.map(
            (month) => updatedContext.FC_by_Trend?.[month] || 0
          ),
          recommendedFC: monthLabels.map(
            (month) => updatedContext.Recommended_FC?.[month] || 0
          ),
          plannedFC: monthLabels.map(
            (month) => updatedContext.Planned_FC?.[month] || 0
          ),
          plannedShipments: monthLabels.map(
            (month) => updatedContext.Planned_Shipments?.[month] || 0
          ),
          plannedEOH: monthLabels.map(
            (month) => updatedContext.Planned_EOH?.[month] || 0
          ),
          grossProjection: rollingForecastData.grossProjection, // Keep existing
          macysProjReceipts: rollingForecastData.macysProjReceipts, // Keep existing
          plannedSellThru: monthLabels.map(
            (month) => updatedContext.Planned_sell_thru?.[month] || 0
          ),
        };

        setRollingForecastData(updatedRollingData);

        // Update editable data with new values
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
          month_12_fc_index: editable12MonthFC,
          Current_FC_Index: selectedIndex,
        };
        setInitialControlValues({
          Trend: parseFloat(editableTrend) || 0,
          Forecasting_Method: forecastingMethod,
          Rolling_method: rollingMethod,
          month_12_fc_index: parseFloat(editable12MonthFC) || 0,
          Current_FC_Index: selectedIndex,
        });
        alert("Forecast controls applied successfully!");
      }
    } catch (error) {
      console.error("Error applying control changes:", error);
      alert("Failed to apply changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Add this function to submit the forecast data
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

      // Prepare the new_value based on which variable changed
      const newValue =
        changedVariable === "Planned_FC"
          ? editableData.plannedFC
          : editableData.plannedShipments;

      // Build context_data from current rollingForecastData
      console.log("editable12MonthFC-----------------", editable12MonthFC);

      const contextData = {
        Rolling_method: rollingMethod || "YTD",
        Trend: parseFloat(editableTrend) || -0.29,
        Forecasting_Method: "Average", // You might want to make this dynamic
        month_12_fc_index: parseFloat(editable12MonthFC) || 100,
        Current_FC_Index: "Gem", // You might want to make this dynamic
      };

      // Add all the forecast data arrays to context
      monthLabels.forEach((month, index) => {
        if (!contextData.Index_value) contextData.Index_value = {};
        if (!contextData.FC_by_Index) contextData.FC_by_Index = {};
        if (!contextData.FC_by_Trend) contextData.FC_by_Trend = {};
        if (!contextData.Recommended_FC) contextData.Recommended_FC = {};
        if (!contextData.Planned_FC) contextData.Planned_FC = {};
        if (!contextData.Planned_Shipments) contextData.Planned_Shipments = {};
        if (!contextData.Planned_EOH) contextData.Planned_EOH = {};
        if (!contextData.Planned_sell_thru) contextData.Planned_sell_thru = {};

        contextData.Index_value[month] =
          rollingForecastData.index?.[index] || 0;
        contextData.FC_by_Index[month] =
          rollingForecastData.fcByIndex?.[index] || 0;
        contextData.FC_by_Trend[month] =
          rollingForecastData.fcByTrend?.[index] || 0;
        contextData.Recommended_FC[month] =
          rollingForecastData.recommendedFC?.[index] || 0;
        contextData.Planned_FC[month] = editableData.plannedFC?.[month] || 0;
        contextData.Planned_Shipments[month] =
          editableData.plannedShipments?.[month] || 0;
        contextData.Planned_EOH[month] =
          rollingForecastData.plannedEOH?.[index] || 0;
        contextData.Planned_sell_thru[month] =
          rollingForecastData.plannedSellThru?.[index] || 0;
      });

      const payload = {
        changed_variable: changedVariable,
        new_value: newValue,
        context_data: contextData,
        pid: productId,
      };

      console.log("Submitting forecast changes:", payload);

      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/api/product/recalculate_forecast/`,
        payload
      );

      if (response.data && response.data.updated_context) {
        // Update the rolling forecast data with the recalculated values
        const updatedContext = response.data.updated_context;

        const updatedRollingData = {
          index: monthLabels.map(
            (month) => updatedContext.Index_value?.[month] || 0
          ),
          fcByIndex: monthLabels.map(
            (month) => updatedContext.FC_by_Index?.[month] || 0
          ),
          fcByTrend: monthLabels.map(
            (month) => updatedContext.FC_by_Trend?.[month] || 0
          ),
          recommendedFC: monthLabels.map(
            (month) => updatedContext.Recommended_FC?.[month] || 0
          ),
          plannedFC: monthLabels.map(
            (month) => updatedContext.Planned_FC?.[month] || 0
          ),
          plannedShipments: monthLabels.map(
            (month) => updatedContext.Planned_Shipments?.[month] || 0
          ),
          plannedEOH: monthLabels.map(
            (month) => updatedContext.Planned_EOH?.[month] || 0
          ),
          grossProjection: rollingForecastData.grossProjection, // Keep existing
          macysProjReceipts: rollingForecastData.macysProjReceipts, // Keep existing
          plannedSellThru: monthLabels.map(
            (month) => updatedContext.Planned_sell_thru?.[month] || 0
          ),
        };

        setRollingForecastData(updatedRollingData);
        setLastSubmittedData(payload);
        alert(`${changedVariable} updated successfully!`);
      }
    } catch (error) {
      console.error("Error submitting forecast changes:", error);
      alert("Failed to update forecast. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCriticalInputs = async () => {
    try {
      const calculatedUserQty =
        externalFactorPercentage && cardData?.totalAddedQty
          ? Math.round(
              cardData?.totalAddedQty *
                (parseFloat(externalFactorPercentage) / 100)
            )
          : null;
      const payload = {
        product_details: {
          user_added_quantity: userAddedQuantity
            ? parseFloat(userAddedQuantity)
            : null,
          external_factor_percentage: externalFactorPercentage
            ? parseFloat(externalFactorPercentage)
            : null,
          external_factor: externalFactor || null,
        },
      };

      console.log("Saving critical inputs:", payload);

      const response = await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/api/product/${productId}/`,
        payload
      );

      console.log("Save response:", response.data);

      if (response.status === 200 || response.status === 201) {
        if (response.data.product_details) {
          setUserAddedQuantity(
            response.data.product_details.user_added_quantity?.toString() ||
              userAddedQuantity
          );
          setExternalFactorPercentage(
            response.data.product_details.external_factor_percentage?.toString() ||
              externalFactorPercentage
          );
          setExternalFactor(
            response.data.product_details.external_factor || externalFactor
          );
        }

        alert("Critical forecast adjustments saved successfully!");
        await fetchProductDetails();
        await getProducts();
      }
    } catch (error) {
      console.error("Error saving critical inputs:", error);
      console.error("Error response:", error.response?.data);
      alert(
        `Failed to save critical inputs: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Make sure productId is in the dependency array

  const calculateChanges = () => {
    if (!externalFactorPercentage || !userAddedQuantity) return null;

    const factor = parseFloat(externalFactorPercentage);
    const qty = parseFloat(userAddedQuantity);

    if (isNaN(factor) || isNaN(qty)) return null;

    const isPositive = factor >= 0;
    const multiplier = 1 + factor / 100;
    const adjustedQty = Math.round(qty * multiplier);
    const change = adjustedQty - qty;

    return {
      originalQty: qty,
      adjustedQty,
      change,
      percentageChange: Math.abs(factor),
      type: isPositive ? "positive" : "negative",
    };
  };

  const changes = calculateChanges();

  const fetchProductDetails = async () => {
    console.log("Fetching details for product:", productId);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/api/product/${productId}/`
      );
      console.log("Product details fetched:", response.data);
      setProductData(response.data);
      if (response.data.product_details) {
        setUserAddedQuantity(
          response.data.product_details.user_added_quantity || ""
        );
        setExternalFactorPercentage(
          response.data.product_details.external_factor_percentage || ""
        );
        setExternalFactor(response.data.product_details.external_factor || "");
      }

      // Extract 12-month rolling forecast dynamically
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
        if (!item) return Array(12).fill(0);
        return monthOrder.map((m) => item[m] ?? 0);
      };

      rolling.index = getForecastValues("IndexPercentage");
      rolling.fcByIndex = getForecastValues("ForecastByIndex");
      rolling.fcByTrend = getForecastValues("ForecastByTrend");
      rolling.recommendedFC = getForecastValues("RecommendedForecast");
      rolling.plannedFC = getForecastValues("PlannedForecast");
      rolling.plannedShipments = getForecastValues("PlannedShipment");
      rolling.plannedEOH = getForecastValues("PlannedEOH");
      rolling.grossProjection = getForecastValues("GrossProjection");
      rolling.macysProjReceipts = getForecastValues("MacysProjectionReciepts");
      rolling.plannedSellThru = getForecastValues("PlannedSellThru");

      setRollingForecastData(rolling);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousProduct = () => {
    console.log("Previous button clicked");
    console.log("Can navigate previous:", canNavigatePrevious);
    console.log("Previous product:", previousProduct?.pid);
    console.log("onNavigateToProduct function:", typeof onNavigateToProduct);

    if (!onNavigateToProduct) {
      console.error("onNavigateToProduct function not provided!");
      return;
    }

    if (canNavigatePrevious && previousProduct) {
      console.log("Navigating to previous product:", previousProduct.pid);
      onNavigateToProduct(previousProduct.pid);
    } else {
      console.log("Cannot navigate previous:", {
        canNavigatePrevious,
        hasOnNavigateToProduct: !!onNavigateToProduct,
        hasPreviousProduct: !!previousProduct,
      });
    }
  };

  const handleNextProduct = () => {
    console.log("Next button clicked");
    console.log("Can navigate next:", canNavigateNext);
    console.log("Next product:", nextProduct?.pid);
    console.log("onNavigateToProduct function:", typeof onNavigateToProduct);

    if (!onNavigateToProduct) {
      console.error("onNavigateToProduct function not provided!");
      return;
    }

    if (canNavigateNext && nextProduct) {
      console.log("Navigating to next product:", nextProduct.pid);
      onNavigateToProduct(nextProduct.pid);
    } else {
      console.log("Cannot navigate next:", {
        canNavigateNext,
        hasOnNavigateToProduct: !!onNavigateToProduct,
        hasNextProduct: !!nextProduct,
      });
    }
  };

  // Search handlers
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchDropdown(value.trim().length > 0);
    setShowRecentSearches(false); // Hide recent searches when typing
  };

  const handleSearchResultClick = (product) => {
    console.log("Search result clicked:", product.pid);
    console.log("Current productId:", productId);

    if (onNavigateToProduct) {
      console.log("Calling onNavigateToProduct with:", product.pid);
      onNavigateToProduct(product.pid);
    } else {
      console.error("onNavigateToProduct function not provided!");
    }

    setSearchQuery("");
    setShowSearchDropdown(false);
  };

  const handleRecentSearchClick = (recentSearch) => {
    console.log("Recent search clicked:", recentSearch.pid);

    if (onNavigateToProduct) {
      console.log("Calling onNavigateToProduct with:", recentSearch.pid);
      onNavigateToProduct(recentSearch.pid);
    } else {
      console.error("onNavigateToProduct function not provided!");
    }

    setSearchQuery("");
    setShowSearchDropdown(false);
    setShowRecentSearches(false);
  };

  // Function to handle product link click
  const handleProductLinkClick = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/forecast/api/product/${productId}/`
      );
      const externalLink = response.data?.product_details?.website;

      //add external link to local storage
      localStorage.setItem("externalLink", externalLink);

      if (externalLink) {
        window.open(externalLink, "_blank"); // Open in new tab
      } else {
        alert("No website link found for this product.");
      }
    } catch (error) {
      console.error("Error fetching product link:", error);
      alert("Failed to fetch product link.");
    }
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length > 0) {
      setShowSearchDropdown(true);
      setShowRecentSearches(false);
    } else {
      // Show recent searches when focusing on empty search
      setShowRecentSearches(recentSearches.length > 0);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding dropdown to allow clicks on results
    setTimeout(() => {
      setShowSearchDropdown(false);
      setShowRecentSearches(false);
    }, 200);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatValue = (value, isPercentage = false, isCurrency = false) => {
    if (value === null || value === undefined || value === "") return "-";

    if (isPercentage) {
      // Multiply by 100 for percentage display
      const percentValue =
        typeof value === "number" ? value * 100 : parseFloat(value) * 100;
      return `${percentValue.toFixed(2)}%`;
    }

    if (isCurrency)
      return `$${typeof value === "number" ? value.toLocaleString() : value}`;
    return typeof value === "number" ? value.toLocaleString() : value;
  };

  // Get sophisticated card data from different forecast sources
  // Update the getSophisticatedCardData function to include the new fields
  // Update the getSophisticatedCardData function to include the new fields
  const getSophisticatedCardData = () => {
    if (!productData) return null;

    const { product_details, store_forecast, com_forecast, omni_forecast } =
      productData;

    // Try to get data from the most relevant forecast type first
    const forecastData =
      store_forecast?.[0] || com_forecast?.[0] || omni_forecast?.[0] || {};

    return {
      // Existing Basic Information
      category:
        product_details?.department_description ||
        product_details?.subclass_decription ||
        forecastData?.category ||
        "Unknown Category",

      vendor:
        forecastData?.vendor ||
        product_details?.vendor_name ||
        product_details?.vendor ||
        "Unknown Vendor",

      doorCount:
        forecastData?.door_count ||
        product_details?.current_door_count ||
        forecastData?.Door_count ||
        0,

      leadTime:
        forecastData?.lead_time ||
        product_details?.lead_time ||
        forecastData?.Lead_time ||
        0,

      minOrder:
        forecastData?.Min_order ||
        forecastData?.min_order ||
        product_details?.min_order ||
        0,

      retailValue:
        forecastData?.retail_value ||
        product_details?.retail_price ||
        forecastData?.Retail_value ||
        product_details?.price ||
        0,

      selectedMonth:
        forecastData?.selected_months ||
        product_details?.selected_months ||
        forecastData?.Selected_month ||
        "N/A",

      forecastMonth:
        forecastData?.forecast_month || forecastData?.Forecast_month || "N/A",

      nextForecastMonth:
        forecastData?.next_forecast_month ||
        forecastData?.Next_forecast_month ||
        "N/A",

      // Existing additional data
      productId: product_details?.product_id || productId,
      trend: forecastData?.trend || 0,
      addedQty: forecastData?.total_added_qty || 0,
      macysSOQ: forecastData?.Macys_SOQ || 0,

      // NEW FIELDS - Add these with all possible field name variations
      stdTrend: forecastData?.std_trend || product_details?.std_trend || 0,
      monthFCIndex:
        forecastData?.month_12_fc_index ||
        forecastData?.["12_month_FC_index"] ||
        forecastData?.com_month_12_fc_index ||
        forecastData?.store_month_12_fc_index ||
        product_details?.month_12_fc_index ||
        0,
      stdIndexValue:
        forecastData?.std_index_value ||
        forecastData?.STD_index_value ||
        product_details?.std_index_value ||
        0,
      birthstone:
        forecastData?.birthstone || product_details?.birthstone || "N/A",
      birthstoneMonth:
        forecastData?.birthstone_month ||
        forecastData?.bithstone_month ||
        product_details?.birthstone_month ||
        "N/A",
      totalAddedQty:
        forecastData?.total_added_qty ||
        product_details?.total_added_qty ||
        forecastData?.addedQty ||
        0,
    };
  };

  const renderProductVariablesTable = () => {
    if (!productData) return null;

    const { store_forecast, com_forecast, omni_forecast } = productData;

    // Helper function to render individual forecast table
    const renderForecastTable = (forecastData, type, title, bgColor) => {
      if (!forecastData || !forecastData[0]) return null;

      const data = forecastData[0];

      // Define variable configurations for each type
      const getVariableConfig = (type) => {
        const baseConfig = [
          { key: "lead_time", label: "Lead Time", suffix: " days" },
          {
            key: "leadtime_holiday_adjustment",
            label: "Holiday Adjustment",
            type: "boolean",
          },
          { key: "selected_months", label: "Selected Months", type: "array" },
          { key: "trend", label: "Trend", type: "percentage" },
          {
            key: "inventory_maintained",
            label: "Inventory Maintained",
            type: "boolean",
          },
          { key: "red_box_item", label: "Red Box Item", type: "boolean" },
          { key: "forecasting_method", label: "Forecasting Method" },
          { key: "forecast_month", label: "Forecast Month" },
          { key: "next_forecast_month", label: "Next Forecast Month" },
          { key: "birthstone", label: "Birthstone" },
          { key: "birthstone_month", label: "Birthstone Month" },
          { key: "Macys_SOQ", label: "Macy's SOQ" },
          { key: "total_added_qty", label: "Total Added Qty" },
          {
            key: "average_store_sale_thru",
            label: "Avg Store Sale Thru",
            type: "percentage",
          },
          {
            key: "macy_SOQ_percentage",
            label: "Macy SOQ %",
            type: "percentage",
          },
        ];

        const typeSpecific = {
          store: [
            { key: "month_12_fc_index", label: "12M FC Index" },
            { key: "loss", label: "Loss" },
            { key: "month_12_fc_index_loss", label: "12M FC Index Loss" },
            { key: "trend_index_difference", label: "Trend Index Difference" },
            { key: "door_count", label: "Door Count" },
            { key: "average_com_oh", label: "Average COM OH" },
            { key: "fldc", label: "FLDC" },
            {
              key: "forecast_month_required_quantity",
              label: "Forecast Month Req Qty",
            },
            {
              key: "forecast_month_planned_oh",
              label: "Forecast Month Planned OH",
            },
            {
              key: "next_forecast_month_required_quantity",
              label: "Next Month Req Qty",
            },
            {
              key: "next_forecast_month_planned_oh",
              label: "Next Month Planned OH",
            },
            { key: "Qty_given_to_macys", label: "Qty Given to Macy's" },
          ],
          com: [
            { key: "com_month_12_fc_index", label: "COM 12M FC Index" },
            { key: "com_trend", label: "COM Trend", type: "percentage" },
            { key: "trend_index_difference", label: "Trend Index Difference" },
            {
              key: "minimum_required_oh_for_com",
              label: "Min Required OH for COM",
            },
            { key: "fldc", label: "FLDC" },
            {
              key: "forecast_month_required_quantity",
              label: "Forecast Month Req Qty",
            },
            {
              key: "forecast_month_planned_oh",
              label: "Forecast Month Planned OH",
            },
            {
              key: "next_forecast_month_required_quantity",
              label: "Next Month Req Qty",
            },
            {
              key: "next_forecast_month_planned_oh",
              label: "Next Month Planned OH",
            },
            { key: "vdf_status", label: "VDF Status", type: "boolean" },
            { key: "vdf_added_qty", label: "VDF Added Qty" },
            {
              key: "forecast_month_planned_shipment",
              label: "Forecast Month Planned Shipment",
            },
            { key: "Qty_given_to_macys", label: "Qty Given to Macy's" },
          ],
          omni: [
            { key: "com_month_12_fc_index", label: "COM 12M FC Index" },
            { key: "com_trend", label: "COM Trend", type: "percentage" },
            {
              key: "com_inventory_maintained",
              label: "COM Inventory Maintained",
              type: "boolean",
            },
            {
              key: "minimum_required_oh_for_com",
              label: "Min Required OH for COM",
            },
            { key: "com_fldc", label: "COM FLDC" },
            { key: "store_month_12_fc_index", label: "Store 12M FC Index" },
            {
              key: "store_month_12_fc_index_loss",
              label: "Store 12M FC Index Loss",
            },
            { key: "store_trend", label: "Store Trend", type: "percentage" },
            {
              key: "store_inventory_maintained",
              label: "Store Inventory Maintained",
              type: "boolean",
            },
            { key: "door_count", label: "Door Count" },
            { key: "store_fldc", label: "Store FLDC" },
            {
              key: "forecast_month_planned_oh",
              label: "Forecast Month Planned OH",
            },
            {
              key: "next_forecast_month_planned_oh",
              label: "Next Month Planned OH",
            },
            {
              key: "trend_index_difference_com",
              label: "Trend Index Diff (COM)",
            },
            {
              key: "trend_index_difference_store",
              label: "Trend Index Diff (Store)",
            },
            {
              key: "forecasting_method_com",
              label: "Forecasting Method (COM)",
            },
            {
              key: "forecasting_method_store",
              label: "Forecasting Method (Store)",
            },
            {
              key: "forecast_month_required_quantity_total",
              label: "Total Req Qty (Forecast Month)",
            },
            {
              key: "next_forecast_month_required_quantity_total",
              label: "Total Req Qty (Next Month)",
            },
          ],
        };

        return [...baseConfig, ...(typeSpecific[type] || [])];
      };

      const formatVariableValue = (value, config) => {
        if (value === null || value === undefined) return "-";

        switch (config.type) {
          case "boolean":
            return value ? "Yes" : "No";
          case "array":
            return Array.isArray(value) ? value.join(", ") : value;
          case "percentage":
            return typeof value === "number"
              ? `${(value * 100).toFixed(2)}%`
              : `${value}%`;
          default:
            const formattedValue =
              typeof value === "number" ? value.toLocaleString() : value;
            return config.suffix
              ? `${formattedValue}${config.suffix}`
              : formattedValue;
        }
      };

      const variables = getVariableConfig(type);

      return (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 ${bgColor} rounded-lg`}>
              {type === "store" && (
                <Building2 className="text-blue-600" size={20} />
              )}
              {type === "com" && (
                <ShoppingCart className="text-green-600" size={20} />
              )}
              {type === "omni" && (
                <Layers className="text-purple-600" size={20} />
              )}
            </div>
            <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${bgColor} border-b border-gray-200`}>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Variable
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {variables.map((variable, index) => {
                    const value = data[variable.key];
                    return (
                      <tr
                        key={variable.key}
                        className={`border-b border-gray-100 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-gray-100 transition-colors`}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">
                          {variable.label}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {formatVariableValue(value, variable)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {store_forecast &&
          store_forecast.length > 0 &&
          renderForecastTable(
            store_forecast,
            "store",
            "Store Forecast Variables",
            "bg-blue-50"
          )}

        {com_forecast &&
          com_forecast.length > 0 &&
          renderForecastTable(
            com_forecast,
            "com",
            "COM Forecast Variables",
            "bg-green-50"
          )}

        {omni_forecast &&
          omni_forecast.length > 0 &&
          renderForecastTable(
            omni_forecast,
            "omni",
            "Omni Forecast Variables",
            "bg-purple-50"
          )}
      </div>
    );
  };

  // Enhanced Rolling Forecast Table with proper width and dynamic data
  function renderRollingForecastTable() {
    if (!rollingForecastData) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading rolling forecast data...</p>
        </div>
      );
    }

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

    const displayConfig = {
      index: { label: "Index", isPercentage: true },
      fcByIndex: { label: "FC by Index" },
      fcByTrend: { label: "FC by Trend" },
      recommendedFC: { label: "Recommended FC", highlight: true },
      plannedFC: { label: "Planned FC", editable: true },
      plannedShipments: { label: "Planned Shipments", editable: true },
      plannedEOH: { label: "Planned EOH (Cal)" },
      plannedSellThru: { label: "Planned Sell thru %", isPercentage: true },
    };

    const rows = Object.keys(rollingForecastData)
      .filter((key) => key !== "grossProjection" && key !== "macysProjReceipts") // Exclude these rows
      .map((key) => ({
        key,
        label: displayConfig[key]?.label || key,
        data:
          Array.isArray(rollingForecastData[key]) &&
          rollingForecastData[key].length === 12
            ? rollingForecastData[key]
            : Array(12).fill(0),
        isPercentage: displayConfig[key]?.isPercentage || false,
        highlight: displayConfig[key]?.highlight || false,
        editable: displayConfig[key]?.editable || false,
      }));

    const renderCell = (row, value, monthIndex, month) => {
      if (row.editable && editableData) {
        const editableKey =
          row.key === "plannedFC" ? "plannedFC" : "plannedShipments";
        const editableValue = editableData[editableKey]?.[month] ?? value;

        return (
          <input
            type="number"
            value={editableValue}
            onChange={(e) =>
              handleCellChange(editableKey, month, e.target.value)
            }
            className="w-full px-2 py-1 text-center text-sm font-medium border border-blue-300 rounded bg-blue-50 focus:bg-white focus:border-blue-500 focus:outline-none"
            style={{ minWidth: "70px" }}
          />
        );
      }

      return (
        <span className="text-sm font-medium text-gray-800">
          {formatValue(value, row.isPercentage)}
        </span>
      );
    };

    return (
      <div className="w-full">
        {/* Submit Buttons */}
        <div className="mb-4 flex gap-3">
          <button
            onClick={() => submitForecastChanges("Planned_FC")}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            Submit Planned FC
          </button>
          <button
            onClick={() => submitForecastChanges("Planned_Shipments")}
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            Submit Planned Shipments
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                <th className="border-r border-gray-300 px-4 py-4 text-left text-sm font-bold text-gray-700 bg-white sticky left-0 z-10 min-w-[200px]">
                  ROLLING 12M FC
                </th>
                {monthLabels.map((month) => (
                  <th
                    key={month}
                    className="border-r border-gray-300 px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[90px]"
                  >
                    {month}
                  </th>
                ))}
                <th className="border-r border-gray-300 px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[100px]">
                  ANNUAL
                </th>
                <th className="border-r border-gray-300 px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[100px]">
                  SPRING
                </th>
                <th className="px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[100px]">
                  FALL
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const totals = {
                  annual: row.data.reduce((sum, val) => sum + (val || 0), 0),
                  spring: row.data
                    .slice(0, 6)
                    .reduce((sum, val) => sum + (val || 0), 0),
                  fall: row.data
                    .slice(6)
                    .reduce((sum, val) => sum + (val || 0), 0),
                };

                // For editable rows, recalculate totals from editableData
                if (row.editable && editableData) {
                  const editableKey =
                    row.key === "plannedFC" ? "plannedFC" : "plannedShipments";
                  const editableValues = Object.values(
                    editableData[editableKey] || {}
                  );
                  if (editableValues.length === 12) {
                    totals.annual = editableValues.reduce(
                      (sum, val) => sum + (val || 0),
                      0
                    );
                    totals.spring = editableValues
                      .slice(0, 6)
                      .reduce((sum, val) => sum + (val || 0), 0);
                    totals.fall = editableValues
                      .slice(6)
                      .reduce((sum, val) => sum + (val || 0), 0);
                  }
                }

                return (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 ${
                      row.highlight
                        ? "bg-yellow-50"
                        : row.editable
                        ? "bg-blue-50"
                        : index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    } hover:bg-indigo-50 transition-colors`}
                  >
                    <td className="border-r border-gray-300 px-4 py-3 text-sm font-bold text-gray-800 bg-white sticky left-0 z-10">
                      {row.label}
                      {row.editable && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Editable
                        </span>
                      )}
                    </td>
                    {row.data.map((value, i) => (
                      <td
                        key={i}
                        className={`border-r border-gray-300 px-3 py-3 text-center ${
                          row.editable ? "bg-blue-50" : ""
                        }`}
                      >
                        {renderCell(row, value, i, monthLabels[i])}
                      </td>
                    ))}
                    <td className="border-r border-gray-300 px-3 py-3 text-center text-sm font-bold text-gray-900 bg-blue-50">
                      {formatValue(totals.annual, row.isPercentage)}
                    </td>
                    <td className="border-r border-gray-300 px-3 py-3 text-center text-sm font-bold text-gray-900 bg-green-50">
                      {formatValue(totals.spring, row.isPercentage)}
                    </td>
                    <td className="px-3 py-3 text-center text-sm font-bold text-gray-900 bg-orange-50">
                      {formatValue(totals.fall, row.isPercentage)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Debug info - can be removed in production */}
        {/* {lastSubmittedData && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <h5 className="font-semibold text-gray-700 mb-2">
              Last Submitted Data:
            </h5>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(lastSubmittedData, null, 2)}
            </pre>
          </div>
        )} */}
      </div>
    );
  }

  // Current Year Forecast Table with proper width - CORRECTED VERSION
  function renderCurrentYearForecastTable() {
    const year = new Date().getFullYear();
    if (!productData?.monthly_forecast) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No monthly forecast data available for {year}
          </p>
        </div>
      );
    }

    const yearForecasts = productData.monthly_forecast.filter(
      (f) => f.year === year
    );

    if (yearForecasts.length === 0) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No forecast data available for {year}</p>
        </div>
      );
    }

    const forecastRows = [
      { key: "TY_Unit_Sales", label: "Total Sales Units" },
      { key: "TY_store_unit_sales", label: "Store Sales Units" },
      { key: "TY_MCOM_Unit_Sales", label: "COM Sales Units" },
      {
        key: "TY_COM_to_TTL",
        label: "COM % to TTL (Sales)",
        isPercentage: true,
      },
      { key: "TY_OH_Units", label: "TOTAL EOM OH" },
      { key: "TY_store_EOM_OH", label: "STORE EOM OH" },
      { key: "TY_OH_MCOM_Units", label: "COM EOH OH" },
      {
        key: "TY_COM_to_TTL_OH",
        label: "COM % to TTL (EOH)",
        isPercentage: true,
      },
      { key: "PTD_TY_Sales", label: "Omni Sales $" },
      { key: "MCOM_PTD_TY_Sales", label: "COM Sales $" },
    ];

    const months = [
      "jan",
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
    ];

    const monthLabels = [
      "JAN",
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
    ];

    const calculateTotals = (forecast) => {
      if (!forecast) return { annual: 0, spring: 0, fall: 0 };

      const values = months.map((month) => forecast[month] || 0);
      const annual = values.reduce((sum, val) => sum + val, 0);
      const spring = values.slice(1, 7).reduce((sum, val) => sum + val, 0);
      const fall = [...values.slice(7), values[0]].reduce(
        (sum, val) => sum + val,
        0
      );

      return { annual, spring, fall };
    };

    return (
      <div className="w-full">
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                <th className="border-r border-gray-300 px-4 py-4 text-left text-sm font-bold text-gray-700 bg-white sticky left-0 z-10 min-w-[200px]">
                  TOTAL {year}
                </th>
                {monthLabels.map((month) => (
                  <th
                    key={month}
                    className="border-r border-gray-300 px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[90px]"
                  >
                    {month}
                  </th>
                ))}
                <th className="border-r border-gray-300 px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[100px]">
                  ANNUAL
                </th>
                <th className="border-r border-gray-300 px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[100px]">
                  SPRING
                </th>
                <th className="px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[100px]">
                  FALL
                </th>
              </tr>
            </thead>
            <tbody>
              {forecastRows.map((row, index) => {
                const forecast = yearForecasts.find(
                  (f) => f.variable_name === row.key
                );

                if (!forecast) {
                  return (
                    <tr
                      key={row.key}
                      className={`border-b border-gray-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="border-r border-gray-300 px-4 py-3 text-sm font-bold text-gray-800 bg-white sticky left-0 z-10">
                        {row.label}
                      </td>
                      {monthLabels.map((_, i) => (
                        <td
                          key={i}
                          className="border-r border-gray-300 px-3 py-3 text-center text-sm text-gray-400"
                        >
                          -
                        </td>
                      ))}
                      <td className="border-r border-gray-300 px-3 py-3 text-center text-sm font-bold text-gray-400">
                        -
                      </td>
                      <td className="border-r border-gray-300 px-3 py-3 text-center text-sm text-gray-400">
                        -
                      </td>
                      <td className="px-3 py-3 text-center text-sm text-gray-400">
                        -
                      </td>
                    </tr>
                  );
                }

                const totals = calculateTotals(forecast);

                return (
                  <tr
                    key={row.key}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50 transition-colors`}
                  >
                    <td className="border-r border-gray-300 px-4 py-3 text-sm font-bold text-gray-800 bg-white sticky left-0 z-10">
                      {row.label}
                    </td>
                    {months.map((month) => (
                      <td
                        key={month}
                        className="border-r border-gray-300 px-3 py-3 text-center text-sm font-medium text-gray-800"
                      >
                        {formatValue(forecast[month], row.isPercentage)}
                      </td>
                    ))}
                    <td className="border-r border-gray-300 px-3 py-3 text-center text-sm font-bold text-gray-900 bg-blue-50">
                      {formatValue(totals.annual, row.isPercentage)}
                    </td>
                    <td className="border-r border-gray-300 px-3 py-3 text-center text-sm font-bold text-gray-900 bg-green-50">
                      {formatValue(totals.spring, row.isPercentage)}
                    </td>
                    <td className="px-3 py-3 text-center text-sm font-bold text-gray-900 bg-orange-50">
                      {formatValue(totals.fall, row.isPercentage)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const cardData = getSophisticatedCardData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Loading Product Details
              </h3>
              <p className="text-gray-600">
                Please wait while we fetch the product information...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Product
            </h3>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="space-x-4">
              <button
                onClick={fetchProductDetails}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      key={productId}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 h-100"
    >
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Header Section with Search and Navigation */}
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

              {/* Product Link Button - Top Right */}
              <div className="ml-auto">
                <button
                  onClick={handleProductLinkClick}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                  title="Copy product link"
                >
                  <ExternalLink size={18} />
                  <span className="hidden sm:inline">Link</span>
                </button>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex items-center gap-8">
              {/* Large Product Image - Left */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg bg-white/10">
                  <img
                    src={productImage}
                    alt={`Product ${cardData?.productId}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `
                <div class="w-full h-full bg-white/20 flex items-center justify-center">
                  <span class="text-white/60 text-sm font-medium">No Image</span>
                </div>
              `;
                    }}
                  />
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
                              onClick={() =>
                                handleRecentSearchClick(recentSearch)
                              }
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

        {/* Quick Navigation Info */}
        {(previousProduct || nextProduct) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Navigation size={16} />
                <span>Quick Navigation:</span>
              </div>
              <div className="flex items-center gap-4">
                {previousProduct && (
                  <button
                    onClick={handlePreviousProduct}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">
                      {previousProduct.pid}
                    </span>
                    <span className="sm:hidden">Previous</span>
                  </button>
                )}
                {nextProduct && (
                  <button
                    onClick={handleNextProduct}
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
        )}

        {/* Clean Metric Cards */}
        {cardData && (
          <div className="space-y-6">
            {/* Primary Information Cards */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Tag className="text-indigo-600" size={18} />
                Primary Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Category Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-blue-50 rounded-md">
                        <Tag className="text-blue-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Category
                      </span>
                    </div>
                    <p
                      className="text-sm font-bold text-gray-900 truncate"
                      title={cardData.category}
                    >
                      {cardData.category}
                    </p>
                  </div>
                </div>

                {/* Vendor Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-green-50 rounded-md">
                        <Truck className="text-green-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Vendor
                      </span>
                    </div>
                    <p
                      className="text-sm font-bold text-gray-900 truncate"
                      title={cardData.vendor}
                    >
                      {cardData.vendor}
                    </p>
                  </div>
                </div>

                {/* Door Count Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-purple-50 rounded-md">
                        <Building2 className="text-purple-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Doors
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {formatValue(cardData.doorCount)}
                    </p>
                  </div>
                </div>

                {/* Lead Time Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-orange-50 rounded-md">
                        <Clock className="text-orange-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Lead Time
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {cardData.leadTime} days
                    </p>
                  </div>
                </div>

                {/* Min Order Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-red-50 rounded-md">
                        <ShoppingCart className="text-red-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Min Order
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {formatValue(cardData.minOrder)}
                    </p>
                  </div>
                </div>

                {/* Retail Value Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-emerald-50 rounded-md">
                        <DollarSign className="text-emerald-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Retail
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {formatValue(cardData.retailValue, false, true)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Forecast Metrics */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="text-indigo-600" size={18} />
                Forecast Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* STD Trend Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-indigo-50 rounded-md">
                        <TrendingDown className="text-indigo-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        STD Trend
                      </span>
                    </div>
                    <p
                      className={`text-sm font-bold ${
                        cardData.stdTrend >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {cardData.stdTrend >= 0 ? "+" : ""}
                      {formatValue(cardData.stdTrend)}
                    </p>
                  </div>
                </div>

                {/* 12 Month FC Index Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-blue-50 rounded-md">
                        <BarChart3 className="text-blue-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        12M FC Index
                      </span>
                    </div>
                    <p className="text-sm font-bold text-blue-600">
                      {formatValue(cardData.monthFCIndex)}
                    </p>
                  </div>
                </div>

                {/* STD Index Value Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-cyan-50 rounded-md">
                        <Zap className="text-cyan-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        STD Index
                      </span>
                    </div>
                    <p className="text-sm font-bold text-cyan-600">
                      {formatValue(cardData.stdIndexValue)}
                    </p>
                  </div>
                </div>

                {/* Total Added Qty Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-green-50 rounded-md">
                        <Package className="text-green-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Added Qty
                      </span>
                    </div>
                    <p className="text-sm font-bold text-green-600">
                      {formatValue(cardData.totalAddedQty)}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-green-50 rounded-md">
                        <Package className="text-red-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Final Qty
                      </span>
                    </div>
                    <p className="text-sm font-bold text-green-600">
                      {userAddedQuantity
                        ? userAddedQuantity
                        : externalFactorPercentage
                        ? Math.round(
                            cardData.totalAddedQty *
                              (1 + externalFactorPercentage / 100)
                          )
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* Birthstone Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-pink-50 rounded-md">
                        <Gem className="text-pink-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Birthstone
                      </span>
                    </div>
                    <p
                      className="text-sm font-bold text-pink-600 truncate"
                      title={cardData.birthstone}
                    >
                      {cardData.birthstone}
                    </p>
                  </div>
                </div>

                {/* Birthstone Month Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-purple-50 rounded-md">
                        <CalendarIcon className="text-purple-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        BS Month
                      </span>
                    </div>
                    <p
                      className="text-sm font-bold text-purple-600 truncate"
                      title={cardData.birthstoneMonth}
                    >
                      {cardData.birthstoneMonth}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timing Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="text-indigo-600" size={18} />
                Timing Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Selected Month Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-teal-50 rounded-md">
                        <Calendar className="text-teal-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Selected
                      </span>
                    </div>
                    <p
                      className="text-sm font-bold text-teal-600 truncate"
                      title={cardData.selectedMonth}
                    >
                      {cardData.selectedMonth}
                    </p>
                  </div>
                </div>

                {/* Forecast Month Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-cyan-50 rounded-md">
                        <Target className="text-cyan-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Forecast
                      </span>
                    </div>
                    <p
                      className="text-sm font-bold text-cyan-600 truncate"
                      title={cardData.forecastMonth}
                    >
                      {cardData.forecastMonth}
                    </p>
                  </div>
                </div>

                {/* Next Forecast Month Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-indigo-50 rounded-md">
                        <Layers className="text-indigo-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Next FC
                      </span>
                    </div>
                    <p
                      className="text-sm font-bold text-indigo-600 truncate"
                      title={cardData.nextForecastMonth}
                    >
                      {cardData.nextForecastMonth}
                    </p>
                  </div>
                </div>

                {/* Performance Indicators */}
                {/* Trend Performance Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-green-50 rounded-md">
                        <TrendingUp
                          className={
                            cardData.trend >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                          size={14}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Trend
                      </span>
                    </div>
                    <p
                      className={`text-sm font-bold ${
                        cardData.trend >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {cardData.trend >= 0 ? "+" : ""}
                      {formatValue(cardData.trend)}
                    </p>
                  </div>
                </div>

                {/* Macy's SOQ Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-yellow-50 rounded-md">
                        <Star className="text-yellow-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Macy's SOQ
                      </span>
                    </div>
                    <p className="text-sm font-bold text-yellow-600">
                      {formatValue(cardData.macysSOQ)}
                    </p>
                  </div>
                </div>

                {/* Status Card */}
                {/* <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-green-50 rounded-md">
                        <Activity className="text-green-600" size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Status
                      </span>
                    </div>
                    <p className="text-sm font-bold text-green-600">Active</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        )}
        {/* CRITICAL INPUT FIELDS SECTION - Dynamic Implementation */}
        <div className="bg-white rounded-xl shadow-lg border-l-4 border-amber-500 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
                <AlertTriangle className="text-amber-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Critical Forecast Adjustments
                </h3>
                <p className="text-amber-700 text-sm">
                  These values directly impact forecast calculations
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Added Quantity Input */}
              <div className="bg-white rounded-lg border-2 border-amber-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Calculator className="text-amber-600" size={18} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800">
                      User Added Quantity
                    </label>
                    <span className="text-xs text-amber-600 font-medium">
                      Additional quantity to be added
                    </span>
                  </div>
                </div>
                <input
                  type="number"
                  value={userAddedQuantity}
                  onChange={(e) =>
                    handleUserAddedQuantityChange(e.target.value)
                  }
                  // disabled={!!externalFactorPercentage}
                  placeholder="Enter additional quantity..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base font-medium focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all placeholder-gray-400"
                />
                {userAddedQuantity && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600 font-medium">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Value set: {formatValue(parseFloat(userAddedQuantity))}
                  </div>
                )}
              </div>

              {/* External Factor Percentage */}
              <div className="bg-white rounded-lg border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <TrendingUp className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800">
                      External Factor Percentage
                    </label>
                    <span className="text-xs text-blue-600 font-medium">
                      Market adjustment factor (can be positive or negative)
                    </span>
                  </div>
                </div>

                <input
                  type="number"
                  value={externalFactorPercentage}
                  onChange={(e) =>
                    handleExternalFactorPercentageChange(e.target.value)
                  }
                  // disabled={!!userAddedQuantity}
                  placeholder="Enter percentage (e.g., 15 or -10)..."
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-400"
                />
                {externalFactorPercentage && (
                  <div
                    className={`mt-3 flex items-center gap-2 text-sm font-medium ${
                      parseFloat(externalFactorPercentage) >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        parseFloat(externalFactorPercentage) >= 0
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    {parseFloat(externalFactorPercentage) >= 0 ? "+" : ""}
                    {externalFactorPercentage}% adjustment
                  </div>
                )}
              </div>
            </div>

            {/* External Factor Notes Section */}
            <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="text-gray-600" size={18} />
                <label className="block text-sm font-semibold text-gray-800">
                  External Factor Notes
                </label>
              </div>
              <textarea
                value={externalFactor}
                onChange={(e) => setExternalFactor(e.target.value)}
                placeholder="Add any relevant notes about external factors affecting the forecast..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all resize-none placeholder-gray-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSaveCriticalInputs}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold shadow-md hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <Save size={18} />
                Save Critical Adjustments
              </button>
              <button
                onClick={() => setShowCalculatedChanges(!showCalculatedChanges)}
                disabled={!changes}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  changes
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-105"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <RefreshCw size={18} />
                Show Impact Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Calculated Changes Display - Also Improved */}
        {showCalculatedChanges && changes && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calculator className="text-blue-600" size={18} />
                </div>
                Calculated Impact Analysis
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Original Quantity */}
                <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-sm font-medium text-slate-600 mb-2">
                    Original Quantity
                  </div>
                  <div className="text-2xl font-bold text-slate-800">
                    {formatValue(changes.originalQty)}
                  </div>
                </div>

                {/* External Factor */}
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-medium text-blue-700 mb-2">
                    External Factor
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      changes.type === "positive"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {changes.type === "positive" ? "+" : "-"}
                    {changes.percentageChange}%
                  </div>
                </div>

                {/* Adjusted Quantity */}
                <div className="text-center p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="text-sm font-medium text-indigo-700 mb-2">
                    Adjusted Quantity
                  </div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {formatValue(changes.adjustedQty)}
                  </div>
                </div>

                {/* Net Change */}
                <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="text-sm font-medium text-amber-700 mb-2">
                    Net Change
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      changes.change >= 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {changes.change >= 0 ? "+" : ""}
                    {formatValue(changes.change)}
                  </div>
                </div>
              </div>

              {/* Impact Summary - Improved */}
              <div className="mt-6 p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Impact Summary
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  Applying a{" "}
                  <span
                    className={`font-semibold px-2 py-1 rounded ${
                      changes.type === "positive"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {changes.type === "positive" ? "positive" : "negative"}{" "}
                    {changes.percentageChange}%
                  </span>{" "}
                  external factor to the base quantity of{" "}
                  <span className="font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded">
                    {formatValue(changes.originalQty)}
                  </span>{" "}
                  results in an adjusted quantity of{" "}
                  <span className="font-semibold px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
                    {formatValue(changes.adjustedQty)}
                  </span>
                  , representing a net change of{" "}
                  <span
                    className={`font-semibold px-2 py-1 rounded ${
                      changes.change >= 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {changes.change >= 0 ? "+" : ""}
                    {formatValue(changes.change)} units
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Section - Forecast Variables and Rolling Forecast */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tab Headers - Button Style */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
            <div className="flex items-center justify-center">
              <div className="inline-flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                <button
                  onClick={() => setActiveTab("forecast-variables")}
                  className={`flex items-center gap-3 px-6 py-3 rounded-md font-semibold text-sm transition-all duration-200 ${
                    activeTab === "forecast-variables"
                      ? "bg-indigo-600 text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  <BarChart3 className="text-current" size={18} />
                  <span>Forecast Algorithm Variables</span>
                  {activeTab === "forecast-variables" && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("rolling-forecast")}
                  className={`flex items-center gap-3 px-6 py-3 rounded-md font-semibold text-sm transition-all duration-200 ${
                    activeTab === "rolling-forecast"
                      ? "bg-indigo-600 text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  <TrendingUp className="text-current" size={18} />
                  <span>Rolling 12M Forecast</span>
                  {activeTab === "rolling-forecast" && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "forecast-variables" && (
              <div className="animate-fadeIn">
                <div className="mb-4 flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <BarChart3 className="text-indigo-600" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Forecast Algorithm Variables
                  </h3>
                </div>
                {renderProductVariablesTable()}
              </div>
            )}

            {activeTab === "rolling-forecast" && (
              <div className="animate-fadeIn">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg">
                        <TrendingUp className="text-indigo-600" size={20} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Rolling Forecast Controls
                      </h3>
                    </div>

                    <button
                      disabled={
                        !initialControlValues ||
                        !originalValuesRef.current ||
                        JSON.stringify(initialControlValues) ===
                          JSON.stringify(originalValuesRef.current) ||
                        isSaving // Add this condition
                      }
                      onClick={handleSaveChanges}
                      className={`px-6 py-3 rounded-lg text-sm font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 ${
                        JSON.stringify(initialControlValues) !==
                          JSON.stringify(originalValuesRef.current) && !isSaving // Add !isSaving condition
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transform hover:scale-105"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Applying Changes...
                        </>
                      ) : (
                        <>
                          <Settings size={16} />
                          Apply Changes
                          {JSON.stringify(initialControlValues) !==
                            JSON.stringify(originalValuesRef.current) && (
                            <span className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full animate-bounce">
                              !
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Select Index */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Select Index
                      </label>
                      <select
                        value={selectedIndex}
                        onChange={(e) =>
                          handleFieldChange("Current_FC_Index", e.target.value)
                        }
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        disabled={
                          lastChangedField &&
                          lastChangedField !== "Current_FC_Index"
                        }
                      >
                        {[
                          "BT",
                          "Citrine",
                          "Cross",
                          "CZ",
                          "Dia",
                          "Ear",
                          "EMER",
                          "Garnet",
                          "Gem",
                          "GEM EAR",
                          "Gold Chain",
                          "GOLD EAR",
                          "Amy",
                          "Anklet",
                          "Aqua",
                          "Bridal",
                          "Heart",
                          "Heavy Gold Chain",
                          "Jade",
                          "KIDS",
                          "Locket",
                          "Mens Gold Bracelet",
                          "Mens Misc",
                          "Mens Silver chain",
                          "Mom",
                          "MOP",
                          "Neck",
                          "Onyx",
                          "Opal",
                          "Pearl",
                          "Peridot",
                          "Religious",
                          "Ring",
                          "Ruby",
                          "Saph",
                          "Womens Silver Chain",
                          "Wrist",
                          "Grand Total",
                        ].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rolling Method Dropdown */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Rolling Method
                      </label>
                      <select
                        value={rollingMethod}
                        onChange={(e) =>
                          handleFieldChange("Rolling_method", e.target.value)
                        }
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        disabled={
                          lastChangedField &&
                          lastChangedField !== "Rolling_method"
                        }
                      >
                        <option value="YTD">YTD</option>
                        <option value="Current MTH">Current MTH</option>
                        <option value="SPRING">SPRING</option>
                        <option value="FALL">FALL</option>
                        <option value="LY FALL">LY FALL</option>
                      </select>
                    </div>

                    {/* Forecasting Method Dropdown */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Forecasting Method
                      </label>
                      <select
                        value={forecastingMethod}
                        onChange={(e) =>
                          handleFieldChange(
                            "Forecasting_Method",
                            e.target.value
                          )
                        }
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        disabled={
                          lastChangedField &&
                          lastChangedField !== "Forecasting_Method"
                        }
                      >
                        {[
                          "FC By Index",
                          "FC By Trend",
                          "Average",
                          "Current Year",
                          "Last Year",
                        ].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Editable Trend */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Trend
                      </label>
                      <input
                        type="number"
                        value={editableTrend}
                        onChange={(e) =>
                          handleFieldChange("Trend", e.target.value)
                        }
                        step="0.1"
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Enter trend value"
                        disabled={
                          lastChangedField && lastChangedField !== "Trend"
                        }
                      />
                    </div>

                    {/* Editable 12 Month FC */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        12 Month FC
                      </label>
                      <input
                        type="number"
                        value={editable12MonthFC}
                        onChange={(e) =>
                          handleFieldChange("month_12_fc_index", e.target.value)
                        }
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Enter 12 month FC"
                        disabled={
                          lastChangedField &&
                          lastChangedField !== "month_12_fc_index"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Forecast Table */}
                {renderRollingForecastTable()}
              </div>
            )}
          </div>
        </div>

        {/* Monthly Forecast - Clean Design */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div
            className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection("monthlyForecast")}
          >
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="text-indigo-600" size={20} />
              Monthly Forecast
            </h3>
            <ChevronDown
              size={20}
              className={`text-gray-500 transition-transform duration-200 ${
                expandedSections.monthlyForecast ? "rotate-180" : ""
              }`}
            />
          </div>
          {expandedSections.monthlyForecast && (
            <div className="p-6 space-y-8">
              {/* Current Year Data */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="text-blue-600" size={18} />
                  <h4 className="text-lg font-semibold text-gray-700">
                    TOTAL {new Date().getFullYear()}
                  </h4>
                </div>
                {renderCurrentYearForecastTable()}
              </div>

              {/* Last Year Data */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="text-gray-600" size={18} />
                  <h4 className="text-lg font-semibold text-gray-700">
                    TOTAL {new Date().getFullYear() - 1}
                  </h4>
                </div>
                {renderCurrentYearForecastTable()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ProductDetailsView.propTypes = {
  productId: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onNavigateToProduct: PropTypes.func.isRequired, // Make sure this is required
};

export default ProductDetailsView;
