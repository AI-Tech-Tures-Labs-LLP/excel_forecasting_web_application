// Complete ProductSelector.jsx with enhanced dropdown filters and separate notes column
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ChevronDown,
  Filter,
  X,
  Eye,
  Package,
  Store,
  Globe,
  FileDown,
  ArrowLeft,
  Search,
  CheckCircle,
  Clock,
  User,
  FileText,
  Plus,
  AlertCircle,
  MessageSquare,
  RefreshCw,
  Calendar,
  ChevronUp,
  ArrowUpDown,
  Check,
  Sliders,
  Settings,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductDetailsView from "./ProductDetailsView";
import NotesModal from "./NotesModal";
// Import Redux actions and selectors
import {
  fetchProducts,
  setSelectedProductType,
  setSelectedProduct,
  clearSelectedProduct,
  selectCurrentProducts,
  selectProductsLoading,
  selectSelectedProductType,
  selectSelectedProduct,
  selectStoreProducts,
  selectComProducts,
  selectOmniProducts,
} from "../redux/productSlice";

import { setCurrentView, addToast, selectCurrentView } from "../redux/uiSlice";
import { selectCurrentSession } from "../redux/forecastSlice";
import { formatDateTime } from "../utils/dateFormat";
import axios from "axios";

function ProductSelector() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const products = useSelector(selectCurrentProducts);
  const loading = useSelector(selectProductsLoading);
  const selectedProductType = useSelector(selectSelectedProductType);
  const currentView = useSelector(selectCurrentView);
  const forecastSession = useSelector(selectCurrentSession);
  const selectedProduct = useSelector(selectSelectedProduct);

  // Individual product type selectors for correct counts
  const storeProducts = useSelector(selectStoreProducts);
  const comProducts = useSelector(selectComProducts);
  const omniProducts = useSelector(selectOmniProducts);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [bulkFactorNote, setBulkFactorNote] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  // Enhanced filter state based on API
  const [selectedFilters, setSelectedFilters] = useState({
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
  });
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFactor, setBulkFactor] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(true);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastReviewedDropdownOpen, setLastReviewedDropdownOpen] =
    useState(false);
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    birthstones: [],
    red_box_items: [],
    vdf_statuses: [],
    forecast_months: [],
    statuses: [],
    tagged_to: [],
  });
  const [taggedToDropdownOpen, setTaggedToDropdownOpen] = useState(false);
  const [taggedToSearchTerm, setTaggedToSearchTerm] = useState("");
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [forecastMonthDropdownOpen, setForecastMonthDropdownOpen] =
    useState(false);
  const [forecastMonthSearchTerm, setForecastMonthSearchTerm] = useState("");
  // Notes modal state
  const [notesModal, setNotesModal] = useState({
    isOpen: false,
    productId: null,
    productName: "",
  });
  const [notesDropdownOpen, setNotesDropdownOpen] = useState(false);
  // Product notes state
  const [productNotesData, setProductNotesData] = useState({});
  const [activeTab, setActiveTab] = useState("basic");
  // Special days dropdown state
  const [specialDaysDropdownOpen, setSpecialDaysDropdownOpen] = useState(false);
  // Category download modal state
  const [categoryDownloadModal, setCategoryDownloadModal] = useState({
    isOpen: false,
    selectedCategories: [],
    availableCategories: [],
    isDownloading: false,
  });
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [addedQtyDropdownOpen, setAddedQtyDropdownOpen] = useState(false);
  const itemsPerPage = 10;

  // external factor result
  const [lastAppliedResults, setLastAppliedResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Product type configuration
  const productTypeConfig = {
    store: {
      icon: Store,
      label: "Store Products",
      color: "blue",
    },
    com: {
      icon: Package,
      label: "COM Products",
      color: "green",
    },
    omni: {
      icon: Globe,
      label: "Omni Products",
      color: "purple",
    },
  };

  // Boolean filter options
  const booleanOptions = [
    { value: "", label: "All" },
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  // Special Day (Holiday) filter configuration
  const specialDayFilters = [
    { key: "valentine_day", label: "Valentine's Day" },
    { key: "mothers_day", label: "Mother's Day" },
    { key: "fathers_day", label: "Father's Day" },
    { key: "mens_day", label: "Men's Day" },
    { key: "womens_day", label: "Women's Day" },
  ];

  // Additional boolean filters configuration
  const additionalBooleanFilters = [
    {
      key: "considered_birthstone",
      label: "Considered Birthstone",
      showFor: ["store", "omni"],
      priority: true, // Add this
    },
    {
      key: "added_qty_macys_soq",
      label: "Added Qty Macy's SOQ",
      showFor: ["store", "com", "omni"],
    },
    {
      key: "below_min_order",
      label: "Below Min Order",
      showFor: ["store", "com", "omni"],
    },
    {
      key: "over_macys_soq",
      label: "Over Macy's SOQ",
      showFor: ["store", "com", "omni"],
      priority: true, // Add this
    },
    {
      key: "added_only_to_balance_soq",
      label: "Added Only to Balance SOQ",
      showFor: ["store", "com", "omni"],
    },
    {
      key: "need_to_review_first",
      label: "Need to Review First",
      showFor: ["store", "com", "omni"],
      priority: true, // Add this
    },
  ];
  // Initialize data and filters
  useEffect(() => {
    const initializeData = async () => {
      try {
        await loadAvailableFilters();
        dispatch(
          fetchProducts({
            productType: selectedProductType,
            filters: selectedFilters,
          })
        );
      } catch (error) {
        dispatch(
          addToast({
            type: "error",
            message: "Failed to initialize data",
            duration: 5000,
          })
        );
      }
    };

    initializeData();
  }, [dispatch, selectedProductType]);

  // Refetch products when filters change
  useEffect(() => {
    if (!filtersLoading) {
      dispatch(
        fetchProducts({
          productType: selectedProductType,
          filters: selectedFilters,
        })
      );
    }
  }, [dispatch, selectedProductType, selectedFilters, filtersLoading]);

  // Load forecast data from session
  // useEffect(() => {
  //   if (forecastSession?.selectedCategories) {
  //     const selectedCategoryNames = forecastSession.selectedCategories.map(
  //       (cat) => cat.name
  //     );
  //     setSelectedFilters((prev) => ({
  //       ...prev,
  //       category: selectedCategoryNames,
  //     }));
  //   }
  // }, [forecastSession]);

  // Load product notes data when products change
  useEffect(() => {
    if (products.length > 0) {
      loadProductNotesData();
    }
  }, [products]);

  // Load comprehensive product notes data
  const loadProductNotesData = async () => {
    try {
      const productIds = products.map((p) => p.pid);
      const uniqueIds = [...new Set(productIds)];

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/forecast-notes/`
      );
      const allNotes = await response.json();

      const notesData = {};
      const notes = allNotes.results || allNotes;

      uniqueIds.forEach((pid) => {
        const productNotes = notes.filter((note) => note.pid === pid);

        if (productNotes.length > 0) {
          const sortedNotes = productNotes.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          const latestNote = sortedNotes[0];

          const hasUnreviewed = productNotes.some(
            (note) => note.status === "not_reviewed"
          );
          const allReviewed = productNotes.every(
            (note) => note.status === "reviewed"
          );
          const isPending = productNotes.some(
            (note) => note.status === "pending"
          );

          let status = "not_reviewed";
          if (allReviewed && productNotes.length > 0) {
            status = "reviewed";
          } else if (hasUnreviewed) {
            status = "not_reviewed";
          } else if (isPending) {
            status = "pending";
          } 
          notesData[pid] = {
            notes: sortedNotes,
            latestNote: latestNote,
            assignedTo: latestNote.assigned_to || "Unassigned",
            productAssignedTo: latestNote.product_assigned_to || "Unassigned",
            status: status,
            count: productNotes.length,
            hasUnreviewed: hasUnreviewed,
          };
        } else {
          notesData[pid] = {
            notes: [],
            latestNote: null,
            assignedTo: "Unassigned",
            status: "not_reviewed",
            count: 0,
            hasUnreviewed: false,
          };
        }
      });

      setProductNotesData(notesData);
    } catch (error) {
      console.error("Error loading product notes data:", error);
    }
  };

  // Memoized filtered and sorted products
  // const processedProducts = useMemo(() => {
  //   let filteredProducts = [...products];

  //   // Apply search filter
  //   if (searchQuery) {
  //     filteredProducts = filteredProducts.filter(
  //       (product) =>
  //         product.pid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   }

  //   // Apply notes sorting
  //   if (selectedFilters.notes_sort) {
  //     filteredProducts.sort((a, b) => {
  //       const aNotesData = productNotesData[a.pid];
  //       const bNotesData = productNotesData[b.pid];

  //       const aDate = aNotesData?.latestNote?.created_at
  //         ? new Date(aNotesData.latestNote.created_at)
  //         : new Date(0);
  //       const bDate = bNotesData?.latestNote?.created_at
  //         ? new Date(bNotesData.latestNote.created_at)
  //         : new Date(0);

  //       if (selectedFilters.notes_sort === "latest") {
  //         return bDate - aDate; // Latest first
  //       } else {
  //         return aDate - bDate; // Oldest first
  //       }
  //     });
  //   }

  //   return filteredProducts;
  // }, [products, searchQuery, selectedFilters.notes_sort, productNotesData]);
  const processedProducts = useMemo(() => {
    let filteredProducts = [...products];

    // Apply search filter
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.pid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tagged_to filter
    if (selectedFilters.tagged_to && selectedFilters.tagged_to.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const assignedTo =
          productNotesData[product.pid]?.assignedTo || "Unassigned";
        return selectedFilters.tagged_to.includes(assignedTo);
      });
    }

    // Apply forecast_month filter
    if (
      selectedFilters.forecast_month &&
      selectedFilters.forecast_month.length > 0
    ) {
      const monthMap = {
        JANUARY: "JAN",
        FEBRUARY: "FEB",
        MARCH: "MAR",
        APRIL: "APR",
        MAY: "MAY",
        JUNE: "JUN",
        JULY: "JUL",
        AUGUST: "AUG",
        SEPTEMBER: "SEP",
        OCTOBER: "OCT",
        NOVEMBER: "NOV",
        DECEMBER: "DEC",
      };

      const selectedShortMonths = selectedFilters.forecast_month.map(
        (m) => monthMap[m.toUpperCase()]
      );

      filteredProducts = filteredProducts.filter((product) =>
        selectedShortMonths.includes(product.forecast_month)
      );
    }

    // Apply status filter
    if (selectedFilters.status && selectedFilters.status.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const note = productNotesData[product.pid]?.latestNote;
        const status = note?.status;

        let productStatus = "Not Reviewed"; // Default
        if (status === "reviewed") {
          productStatus = "Reviewed";
        } else if (status === "pending") {
          productStatus = "Pending";
        } else if (status === "not_reviewed") {
          productStatus = "Not Reviewed";
        }

        return selectedFilters.status.includes(productStatus);
      });
    }

    // Apply notes sorting
    if (selectedFilters.notes_sort) {
      filteredProducts.sort((a, b) => {
        const aNotesData = productNotesData[a.pid];
        const bNotesData = productNotesData[b.pid];

        const aDate = aNotesData?.latestNote?.created_at
          ? new Date(aNotesData.latestNote.created_at)
          : new Date(0);
        const bDate = bNotesData?.latestNote?.created_at
          ? new Date(bNotesData.latestNote.created_at)
          : new Date(0);

        if (selectedFilters.notes_sort === "latest") {
          return bDate - aDate; // Latest first
        } else {
          return aDate - bDate; // Oldest first
        }
      });
    }

    // Apply added quantity sorting
    if (selectedFilters.added_qty_sort) {
      filteredProducts.sort((a, b) => {
        const aQty = a.total_added_qty || 0;
        const bQty = b.total_added_qty || 0;

        if (selectedFilters.added_qty_sort === "asc") {
          return aQty - bQty; // Ascending
        } else {
          return bQty - aQty; // Descending
        }
      });
    }

    // Apply last reviewed sorting
    if (selectedFilters.last_reviewed_sort) {
      filteredProducts.sort((a, b) => {
        const aNotesData = productNotesData[a.pid];
        const bNotesData = productNotesData[b.pid];

        const aDate = aNotesData?.latestNote?.updated_at
          ? new Date(aNotesData.latestNote.updated_at)
          : new Date(0);
        const bDate = bNotesData?.latestNote?.updated_at
          ? new Date(bNotesData.latestNote.updated_at)
          : new Date(0);

        if (selectedFilters.last_reviewed_sort === "newest") {
          return bDate - aDate; // Newest first
        } else {
          return aDate - bDate; // Oldest first
        }
      });
    }

    return filteredProducts;
  }, [
    products,
    searchQuery,
    selectedFilters.tagged_to,
    selectedFilters.forecast_month,
    selectedFilters.notes_sort,
    selectedFilters.added_qty_sort,
    selectedFilters.status,
    selectedFilters.last_reviewed_sort,
    productNotesData,
  ]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("recentSearchedProducts") || "[]"
    );
    setRecentSearches(stored);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchContainer = event.target.closest(".search-container");
      const categoryDropdown = event.target.closest(".category-dropdown");
      const taggedToDropdown = event.target.closest(".tagged-to-dropdown");
      const notesDropdown = event.target.closest(".notes-dropdown");
      const forecastMonthDropdown = event.target.closest(
        ".forecast-month-dropdown"
      );
      const addedQtyDropdown = event.target.closest(".added-qty-dropdown");
      const statusDropdown = event.target.closest(".status-dropdown");
      const lastReviewedDropdown = event.target.closest(
        ".last-reviewed-dropdown"
      ); // Add this
      const specialDaysDropdown = event.target.closest(
        ".special-days-dropdown"
      );

      if (!searchContainer) {
        setShowSearchDropdown(false);
      }

      // If clicking outside any dropdown area, close all dropdowns
      if (
        !categoryDropdown &&
        !taggedToDropdown &&
        !notesDropdown &&
        !forecastMonthDropdown &&
        !addedQtyDropdown &&
        !statusDropdown &&
        !lastReviewedDropdown &&
        !specialDaysDropdown &&
        !event.target.closest("th")
      ) {
        closeAllDropdowns();
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

  const applyBulkExternalFactor = async () => {
    if (!isValidInput()) return;
    if (!bulkFactor || selectedProductIds.length === 0) return;

    setIsApplying(true);
    setError("");

    try {
      // FIXED: Use processedProducts instead of currentProducts to get all filtered products
      // This ensures we update all selected products, not just those on the current page
      const productsToUpdate = processedProducts.filter((p) =>
        selectedProductIds.includes(p.pid)
      );

      console.log(
        `Updating ${productsToUpdate.length} products:`,
        productsToUpdate.map((p) => p.pid)
      );

      const updatePromises = productsToUpdate.map(async (product) => {
        // Calculate the new user_added_quantity based on external factor percentage
        const originalQty = product.user_added_quantity || 0;
        const newUserAddedQty = Math.round(
          originalQty * (1 + parseFloat(bulkFactor) / 100)
        );

        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/forecast/api/product/${
            product.pid
          }/`,
          {
            product_details: {
              external_factor_percentage: parseFloat(bulkFactor),
              user_added_quantity: newUserAddedQty, // Set the calculated quantity
              external_factor: bulkFactorNote,
            },
          }
        );

        return {
          pid: product.pid,
          category: product.category,
          originalQty: originalQty,
          newQty: newUserAddedQty,
          factorApplied: parseFloat(bulkFactor),
          response: response.data,
        };
      });

      const results = await Promise.all(updatePromises);

      // Store the results for display
      setLastAppliedResults({
        timestamp: new Date(),
        factorPercentage: parseFloat(bulkFactor),
        factorNote: bulkFactorNote,
        totalProductsUpdated: results.length,
        results: results,
        summary: {
          totalOriginalQty: results.reduce((sum, r) => sum + r.originalQty, 0),
          totalNewQty: results.reduce((sum, r) => sum + r.newQty, 0),
          totalDifference: results.reduce(
            (sum, r) => sum + (r.newQty - r.originalQty),
            0
          ),
        },
      });

      // Refresh the products data to get updated values
      await dispatch(
        fetchProducts({
          productType: selectedProductType,
          filters: selectedFilters,
        })
      );

      // Also refresh the product notes data to ensure everything is up to date
      await loadProductNotesData();

      setSuccess(true);
      setShowResults(true);

      // Reset form after showing success
      setTimeout(() => {
        setShowBulkModal(false);
        setSuccess(false);
        setBulkFactor("");
        setBulkFactorNote("");
      }, 2000);
    } catch (error) {
      console.error("Error applying bulk external factor:", error);
      setError("Failed to apply external factor. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = processedProducts.slice(startIndex, endIndex);

  // Load available filter options from API
  // const loadAvailableFilters = async () => {
  //   setFiltersLoading(true);
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_BASE_URL}/forecast/query/filter_products/`
  //     );
  //     const data = await response.json();

  //     const allProducts = [
  //       ...(data.store_products || []),
  //       ...(data.com_products || []),
  //       ...(data.omni_products || []),
  //     ];

  //     // Extract unique values for each filter
  //     const categories = [
  //       ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
  //     ];

  //     const birthstones = [
  //       ...new Set(allProducts.map((p) => p.birthstone).filter(Boolean)),
  //     ];

  //     const redBoxItems = ["Yes", "No"];
  //     const vdfStatuses = ["Active", "Inactive"];

  //     setAvailableFilters({
  //       categories: categories.sort(),
  //       birthstones: birthstones.sort(),
  //       red_box_items: redBoxItems,
  //       vdf_statuses: vdfStatuses,
  //     });
  //     setCategoryDownloadModal((prev) => ({
  //       ...prev,
  //       availableCategories: categories.sort(),
  //     }));
  //   } catch (error) {
  //     console.error("Error loading filter options:", error);
  //     dispatch(
  //       addToast({
  //         type: "error",
  //         message: "Failed to load filter options",
  //         duration: 5000,
  //       })
  //     );
  //   } finally {
  //     setFiltersLoading(false);
  //   }
  // };
  // const loadAvailableFilters = async () => {
  //   setFiltersLoading(true);
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_BASE_URL}/forecast/query/filter_products/`
  //     );
  //     const data = await response.json();

  //     const allProducts = [
  //       ...(data.store_products || []),
  //       ...(data.com_products || []),
  //       ...(data.omni_products || []),
  //     ];

  //     // Extract unique values for each filter
  //     const categories = [
  //       ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
  //     ];

  //     const birthstones = [
  //       ...new Set(allProducts.map((p) => p.birthstone).filter(Boolean)),
  //     ];

  //     // Load product notes to get tagged users
  //     let taggedToUsers = ["Unassigned"]; // Default value
  //     try {
  //       const notesResponse = await fetch(
  //         `${import.meta.env.VITE_API_BASE_URL}/forecast/forecast-notes/`
  //       );
  //       const notesData = await notesResponse.json();
  //       const notes = notesData.results || notesData;

  //       // Extract unique assigned users from notes
  //       const assignedUsers = [
  //         ...new Set(
  //           notes
  //             .map((note) => note.assigned_to)
  //             .filter(Boolean)
  //             .filter((user) => user !== "Unassigned")
  //         ),
  //       ];

  //       taggedToUsers = ["Unassigned", ...assignedUsers.sort()];
  //     } catch (notesError) {
  //       console.warn("Could not load notes for tagged users:", notesError);
  //     }

  //     const redBoxItems = ["Yes", "No"];
  //     const vdfStatuses = ["Active", "Inactive"];

  //     setAvailableFilters({
  //       categories: categories.sort(),
  //       birthstones: birthstones.sort(),
  //       tagged_to: taggedToUsers, // Add this line
  //       red_box_items: redBoxItems,
  //       vdf_statuses: vdfStatuses,
  //     });

  //     setCategoryDownloadModal((prev) => ({
  //       ...prev,
  //       availableCategories: categories.sort(),
  //     }));
  //   } catch (error) {
  //     console.error("Error loading filter options:", error);
  //     dispatch(
  //       addToast({
  //         type: "error",
  //         message: "Failed to load filter options",
  //         duration: 5000,
  //       })
  //     );
  //   } finally {
  //     setFiltersLoading(false);
  //   }
  // };
  // const loadAvailableFilters = async () => {
  //   setFiltersLoading(true);
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_BASE_URL}/forecast/query/filter_products/`
  //     );
  //     const data = await response.json();

  //     const allProducts = [
  //       ...(data.store_products || []),
  //       ...(data.com_products || []),
  //       ...(data.omni_products || []),
  //     ];

  //     // Extract unique values for each filter
  //     const categories = [
  //       ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
  //     ];

  //     const birthstones = [
  //       ...new Set(allProducts.map((p) => p.birthstone).filter(Boolean)),
  //     ];

  //     // Predefined months array
  //     const forecastMonths = [
  //       "January",
  //       "February",
  //       "March",
  //       "April",
  //       "May",
  //       "June",
  //       "July",
  //       "August",
  //       "September",
  //       "October",
  //       "November",
  //       "December",
  //     ];

  //     // Load product notes to get tagged users
  //     let taggedToUsers = ["Unassigned"]; // Default value
  //     try {
  //       const notesResponse = await fetch(
  //         `${import.meta.env.VITE_API_BASE_URL}/forecast/forecast-notes/`
  //       );
  //       const notesData = await notesResponse.json();
  //       const notes = notesData.results || notesData;

  //       // Extract unique assigned users from notes
  //       const assignedUsers = [
  //         ...new Set(
  //           notes
  //             .map((note) => note.assigned_to)
  //             .filter(Boolean)
  //             .filter((user) => user !== "Unassigned")
  //         ),
  //       ];

  //       taggedToUsers = ["Unassigned", ...assignedUsers.sort()];
  //     } catch (notesError) {
  //       console.warn("Could not load notes for tagged users:", notesError);
  //     }

  //     const redBoxItems = ["Yes", "No"];
  //     const vdfStatuses = ["Active", "Inactive"];

  //     setAvailableFilters({
  //       categories: categories.sort(),
  //       birthstones: birthstones.sort(),
  //       tagged_to: taggedToUsers,
  //       forecast_months: forecastMonths, // Add this line
  //       red_box_items: redBoxItems,
  //       vdf_statuses: vdfStatuses,
  //     });

  //     setCategoryDownloadModal((prev) => ({
  //       ...prev,
  //       availableCategories: categories.sort(),
  //     }));
  //   } catch (error) {
  //     console.error("Error loading filter options:", error);
  //     dispatch(
  //       addToast({
  //         type: "error",
  //         message: "Failed to load filter options",
  //         duration: 5000,
  //       })
  //     );
  //   } finally {
  //     setFiltersLoading(false);
  //   }
  // };
  const loadAvailableFilters = async () => {
    setFiltersLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/query/filter_products/`
      );
      const data = await response.json();

      const allProducts = [
        ...(data.store_products || []),
        ...(data.com_products || []),
        ...(data.omni_products || []),
      ];

      // Extract unique values for each filter
      const categories = [
        ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
      ];

      const birthstones = [
        ...new Set(allProducts.map((p) => p.birthstone).filter(Boolean)),
      ];

      // Predefined months array
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

      // Predefined status options
      const statuses = ["Reviewed", "Not Reviewed", "Pending"];

      // Load product notes to get tagged users
      let taggedToUsers = ["Unassigned"]; // Default value
      try {
        const notesResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/forecast/forecast-notes/`
        );
        const notesData = await notesResponse.json();
        const notes = notesData.results || notesData;

        // Extract unique assigned users from notes
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

      const redBoxItems = ["Yes", "No"];
      const vdfStatuses = ["Active", "Inactive"];

      setAvailableFilters({
        categories: categories.sort(),
        birthstones: birthstones.sort(),
        tagged_to: taggedToUsers,
        forecast_months: forecastMonths,
        statuses: statuses, // Add this line
        red_box_items: redBoxItems,
        vdf_statuses: vdfStatuses,
      });

      setCategoryDownloadModal((prev) => ({
        ...prev,
        availableCategories: categories.sort(),
      }));
    } catch (error) {
      console.error("Error loading filter options:", error);
      dispatch(
        addToast({
          type: "error",
          message: "Failed to load filter options",
          duration: 5000,
        })
      );
    } finally {
      setFiltersLoading(false);
    }
  };

  // Handle product type change
  const handleProductTypeChange = (productType) => {
    dispatch(setSelectedProductType(productType));
    setCurrentPage(1);
  };

  // Handle multi-select filter changes
  const handleMultiSelectFilterChange = (filterKey, value, checked) => {
    const currentValues = selectedFilters[filterKey] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((item) => item !== value);

    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: newValues,
    }));
    setCurrentPage(1);
  };

  // Handle single-select filter changes (for boolean filters)
  const handleSingleSelectFilterChange = (filterKey, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: value === "" ? null : value,
    }));
    setCurrentPage(1);
  };

  // Handle search
  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  //   setShowRecent(query.trim() === ""); // Show recent only when input is empty
  //   setCurrentPage(1);
  // };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);

    // Show dropdown when there's a query or when input is focused (even if empty)
    setShowSearchDropdown(true);
  };

  const handleSearchInputFocus = () => {
    setShowSearchDropdown(true);
  };

  // Handle view details
  const handleViewDetails = (product) => {
    // Save to recent searches before navigating
    saveToRecentSearches(product);

    // Close search dropdown
    setShowSearchDropdown(false);
    setSearchQuery("");

    // Navigate to details
    dispatch(setSelectedProduct(product));
    dispatch(setCurrentView("details"));
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

  // Handle back to selector
  const handleBackToSelector = () => {
    dispatch(clearSelectedProduct());
    dispatch(setCurrentView("selector"));
  };

  // Handle notes modal
  const handleOpenNotes = (product) => {
    setNotesModal({
      isOpen: true,
      productId: product.pid,
      productName: product.category || "",
    });
  };

  const handleCloseNotes = () => {
    setNotesModal({
      isOpen: false,
      productId: null,
      productName: "",
    });
    loadProductNotesData();
  };

  const handleOpenCategoryDownload = () => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      isOpen: true,
      selectedCategories: [],
    }));
  };

  const handleDownloadFinalQuantityReport = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/final-quantity-report/`,
        { responseType: "blob" } // important for file download
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "final_quantity_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const closeAllDropdowns = () => {
    setCategoryDropdownOpen(false);
    setCategorySearchTerm("");
    setTaggedToDropdownOpen(false);
    setTaggedToSearchTerm("");
    setNotesDropdownOpen(false);
    setForecastMonthDropdownOpen(false);
    setForecastMonthSearchTerm("");
    setAddedQtyDropdownOpen(false);
    setStatusDropdownOpen(false); // Add this line
    setSpecialDaysDropdownOpen(false);
    setLastReviewedDropdownOpen(false);
  };

  const handleCloseCategoryDownload = () => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      isOpen: false,
      selectedCategories: [],
      isDownloading: false,
    }));
  };

  const handleCategorySelectionChange = (category, checked) => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      selectedCategories: checked
        ? [...prev.selectedCategories, category]
        : prev.selectedCategories.filter((cat) => cat !== category),
    }));
  };

  const handleSelectAllCategories = () => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      selectedCategories: [...prev.availableCategories],
    }));
  };

  const handleDeselectAllCategories = () => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      selectedCategories: [],
    }));
  };

  const handleDownloadSelectedCategories = async () => {
    if (categoryDownloadModal.selectedCategories.length === 0) {
      dispatch(
        addToast({
          type: "error",
          message: "Please select at least one category to download",
          duration: 3000,
        })
      );
      return;
    }

    setCategoryDownloadModal((prev) => ({ ...prev, isDownloading: true }));

    try {
      // Convert display names to file names by removing brackets and spaces
      const processedCategories = categoryDownloadModal.selectedCategories.map(
        (category) => {
          // Remove brackets and extra spaces to match file names
          return category.replace(/\s*\([^)]*\)/, "");
        }
      );

      const categoriesParam = processedCategories.join(",");

      // Get the output filename from localStorage forecast data
      const forecastData = JSON.parse(
        localStorage.getItem("forecastData") || "{}"
      );
      const outputFileName = forecastData.outputFileName || "";

      console.log(
        "Original categories:",
        categoryDownloadModal.selectedCategories
      );
      console.log("Processed categories:", processedCategories);
      console.log("Using output filename:", outputFileName);

      // Use 'file_path' parameter to match backend
      const downloadUrl = `${
        import.meta.env.VITE_API_BASE_URL
      }/forecast/download-category/?category=${encodeURIComponent(
        categoriesParam
      )}&file_path=${encodeURIComponent(outputFileName)}`;

      console.log("Full download URL:", downloadUrl);

      // Create a temporary link to trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download =
        processedCategories.length === 1
          ? `${processedCategories[0]}.xlsx`
          : "categories.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // dispatch(
      //   addToast({
      //     type: "success",
      //     message: `Downloaded ${processedCategories.length} category file(s)`,
      //     duration: 3000,
      //   })
      // );

      handleCloseCategoryDownload();
    } catch (error) {
      console.error("Error downloading categories:", error);
      dispatch(
        addToast({
          type: "error",
          message: "Failed to download category files",
          duration: 5000,
        })
      );
    } finally {
      setCategoryDownloadModal((prev) => ({ ...prev, isDownloading: false }));
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
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
      notes_sort: null,
      added_qty_sort: null,
      tagged_to: [],
      status: [],
      last_reviewed_sort: null,
      forecast_month: [],
    });
    setSearchQuery("");
  };

  // const isAllSelected = currentProducts.every((p) =>
  //   selectedProductIds.includes(p.pid)
  // );

  // const handleSelectAll = (checked) => {
  //   if (checked) {
  //     const newSelections = currentProducts.map((p) => p.pid);
  //     setSelectedProductIds((prev) => [
  //       ...new Set([...prev, ...newSelections]),
  //     ]);
  //   } else {
  //     setSelectedProductIds((prev) =>
  //       prev.filter((id) => !currentProducts.map((p) => p.pid).includes(id))
  //     );
  //   }
  // };
  const formatAssignedToDisplay = (product) => {
    const notesData = productNotesData[product.pid];
    const assignedTo = notesData?.assignedTo || "Unassigned";
    const productAssignedTo = notesData?.productAssignedTo || "Unassigned";
    return (
      <div className="flex items-center gap-1">
        <User size={14} className="text-gray-400" />
        <span className="text-sm">{productAssignedTo}</span>
      </div>
    );
  };
  // Refresh data
  const handleRefresh = () => {
    loadAvailableFilters();
    dispatch(
      fetchProducts({
        productType: selectedProductType,
        filters: selectedFilters,
      })
    );
  };

  // Format status display
  // const formatStatusDisplay = (product) => {
  //   const notesData = productNotesData[product.pid];

  //   if (!notesData) {
  //     return (
  //       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
  //         <Clock size={12} className="mr-1" />
  //         Pending
  //       </span>
  //     );
  //   }

  //   switch (notesData.status) {
  //     case "reviewed":
  //       return (
  //         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  //           <CheckCircle size={12} className="mr-1" />
  //           Reviewed
  //         </span>
  //       );
  //     case "not_reviewed":
  //       return (
  //         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
  //           <AlertCircle size={12} className="mr-1" />
  //           Not Reviewed
  //         </span>
  //       );
  //     default:
  //       return (
  //         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
  //           <Clock size={12} className="mr-1" />
  //           Pending
  //         </span>
  //       );
  //   }
  // };
  const monthMap = {
    JANUARY: "JAN",
    FEBRUARY: "FEB",
    MARCH: "MAR",
    APRIL: "APR",
    MAY: "MAY",
    JUNE: "JUN",
    JULY: "JUL",
    AUGUST: "AUG",
    SEPTEMBER: "SEP",
    OCTOBER: "OCT",
    NOVEMBER: "NOV",
    DECEMBER: "DEC",
  };

  const selectedShortMonths = selectedFilters.forecast_month.map(
    (m) => monthMap[m.toUpperCase()]
  );

  const formatStatusDisplay = (product) => {
    const note = productNotesData[product.pid]?.latestNote;
    const status = note?.status;

    if (!status) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Clock size={12} className="mr-1" />
          Not Reviewed
        </span>
      );
    }

    const statusConfig = {
      reviewed: {
        icon: <CheckCircle size={12} className="mr-1" />,
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Reviewed",
      },
      not_reviewed: {
        icon: <AlertCircle size={12} className="mr-1" />,
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Not Reviewed",
      },
      pending: {
        icon: <Clock size={12} className="mr-1" />,
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
    };

    const { icon, bg, text, label } =
      statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}
      >
        {icon}
        {label}
      </span>
    );
  };

  const getMacysUrl = (product) => {
    // Use the website field directly from the product data
    return product.website || "#";
  };
  const isValidInput = () => {
    const num = parseFloat(bulkFactor);
    return !isNaN(num) && num >= -100 && num <= 100;
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isApplying) {
      setShowBulkModal(false);
    }
  };

  const handleMacysRedirect = async (pid) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/forecast/api/product/${pid}/`
      );
      const website = response.data?.product_details?.website;

      if (website && website.trim() !== "") {
        window.open(website, "_blank");
      } else {
        alert("No website link available for this product.");
      }
    } catch (error) {
      console.error("Error fetching Macy's link:", error);
      alert("Failed to retrieve Macy's product link.");
    }
  };

  // Helper function to check if Macy's link can be generated
  const canGenerateMacysLink = (product) => {
    // Check if website field exists and is not empty

    console.log("Product pid:", product.pid);

    return product.website && product.website.trim() !== "";
  };

  // Format notes display in separate column
  // const formatNotesDisplay = (product) => {
  //   const notesData = productNotesData[product.pid];

  //   if (!notesData || notesData.count === 0) {
  //     return (
  //       <div className="flex items-center justify-center gap-1 text-blue-400 hover:text-indigo-600  cursor-pointer">
  //         <MessageSquare size={18} />
  //         <span className="text-xs"></span>
  //       </div>
  //     );
  //   }
  //   return (
  //     <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
  //       <MessageSquare size={14} className="text-blue-500" />
  //       <span className="text-sm font-medium text-blue-600">
  //         {notesData.count}
  //       </span>
  //       {notesData.hasUnreviewed && (
  //         <div
  //           className="w-2 h-2 bg-red-500 rounded-full"
  //           title="Has unreviewed notes"
  //         ></div>
  //       )}
  //     </div>
  //   );
  // };
  // Updated formatNotesDisplay function with consistent sizing
  // Updated formatNotesDisplay function with consistent sizing
  const formatNotesDisplay = (product) => {
    const notesData = productNotesData[product.pid];

    if (!notesData || notesData.count === 0) {
      return (
        <div className="flex items-center justify-center gap-1 text-blue-400 hover:text-indigo-600 cursor-pointer w-16 h-8 relative">
          <MessageSquare size={16} />
          <span className="text-sm">0</span>
          {/* Empty space for red dot to maintain consistent sizing */}
          <div className="w-2 h-2 invisible"></div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-indigo-600 w-16 h-8 relative">
        <MessageSquare size={16} className="text-blue-500" />
        <span className="text-sm font-medium text-blue-600">
          {notesData.count}
        </span>
        {/* Always reserve space for red dot */}
        <div className="w-2 h-2 flex-shrink-0">
          {notesData.hasUnreviewed && (
            <div
              className="w-2 h-2 bg-red-500 rounded-full"
              title="Has unreviewed notes"
            ></div>
          )}
        </div>
      </div>
    );
  };

  // Format assigned to display
  // const formatAssignedToDisplay = (product) => {
  //   const notesData = productNotesData[product.pid];
  //   const assignedTo = notesData?.assignedTo || "Unassigned";

  //   return (
  //     <div className="flex items-center gap-1">
  //       <User size={14} className="text-gray-400" />
  //       <span className="text-sm">{assignedTo}</span>
  //     </div>
  //   );
  // };

  // Get added qty
  const getAddedQty = (product) => {
    return product.total_added_qty || 0;
  };

  // Get the correct count for each product type
  const getProductCount = (productType) => {
    switch (productType) {
      case "store":
        return storeProducts.length;
      case "com":
        return comProducts.length;
      case "omni":
        return omniProducts.length;
      default:
        return 0;
    }
  };

  const isAllSelected =
    processedProducts.length > 0 &&
    processedProducts.every((p) => selectedProductIds.includes(p.pid));

  const isSomeSelected = selectedProductIds.length > 0 && !isAllSelected;

  const handleSelectAll = (checked) => {
    if (checked) {
      const allProductIds = processedProducts.map((p) => p.pid);
      setSelectedProductIds(allProductIds);
    } else {
      setSelectedProductIds([]);
    }
  };

  // Check if filters have active values
  const hasActiveFilters =
    Object.values(selectedFilters).some((filterValue) => {
      if (Array.isArray(filterValue)) {
        return filterValue.length > 0;
      }
      return filterValue !== null;
    }) || searchQuery.length > 0;

  // Render multi-select dropdown
  const renderMultiSelectDropdown = (filterKey, options, label) => {
    if (!options || options.length === 0) return null;

    const selectedValues = selectedFilters[filterKey] || [];

    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </label>
        <div className="relative">
          <div className="border border-gray-300 rounded-lg p-2 bg-white min-h-[40px] max-h-32 overflow-y-auto">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 py-1 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) =>
                    handleMultiSelectFilterChange(
                      filterKey,
                      option,
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          {selectedValues.length > 0 && (
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-indigo-600">
                {selectedValues.length} selected
              </span>
              <button
                onClick={() =>
                  setSelectedFilters((prev) => ({ ...prev, [filterKey]: [] }))
                }
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render single-select dropdown
  const renderSingleSelectDropdown = (filterKey, label) => {
    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </label>
        <select
          value={selectedFilters[filterKey] || ""}
          onChange={(e) =>
            handleSingleSelectFilterChange(filterKey, e.target.value)
          }
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
        >
          {booleanOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Render special day filters as checkbox dropdown
  const renderSpecialDayFilters = () => {
    const selectedSpecialDays = specialDayFilters.filter(
      (filter) => selectedFilters[filter.key] === "true"
    );

    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
          Special Days
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              closeAllDropdowns();
              setSpecialDaysDropdownOpen(!specialDaysDropdownOpen);
            }}
            className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <span className="text-gray-700">
              {selectedSpecialDays.length > 0
                ? `${selectedSpecialDays.length} selected`
                : "Select special days"}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${
                specialDaysDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {specialDaysDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="p-2 max-h-48 overflow-y-auto">
                {specialDayFilters.map((filter) => (
                  <label
                    key={filter.key}
                    className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 cursor-pointer rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters[filter.key] === "true"}
                      onChange={(e) =>
                        handleSingleSelectFilterChange(
                          filter.key,
                          e.target.checked ? "true" : ""
                        )
                      }
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">
                      {filter.label}
                    </span>
                  </label>
                ))}
              </div>
              {selectedSpecialDays.length > 0 && (
                <div className="border-t border-gray-200 p-2">
                  <button
                    onClick={() => {
                      const clearedFilters = { ...selectedFilters };
                      specialDayFilters.forEach((filter) => {
                        clearedFilters[filter.key] = null;
                      });
                      setSelectedFilters(clearedFilters);
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear all special days
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {selectedSpecialDays.length > 0 && (
          <div className="mt-1">
            <span className="text-xs text-indigo-600">
              {selectedSpecialDays.length} selected
            </span>
          </div>
        )}
      </div>
    );
  };

  // Show details view if in details mode
  // if (currentView === "details") {
  //   const handleNavigateToProduct = (productId) => {
  //     console.log("ProductSelector: Navigating to product:", productId);

  //     // Find the product in the current products list
  //     const allProducts = [...storeProducts, ...comProducts, ...omniProducts];
  //     const targetProduct = allProducts.find((p) => p.pid === productId);

  //     if (targetProduct) {
  //       dispatch(setSelectedProduct(targetProduct));
  //       // currentView stays as "details" so we stay in details view
  //     } else {
  //       console.error("Product not found:", productId);
  //     }
  //   };

  //   // Show details view if in details mode
  //   if (currentView === "details") {
  //     return (
  //       <ProductDetailsView
  //         productId={selectedProduct?.pid}
  //         onBack={handleBackToSelector}
  //         onNavigateToProduct={handleNavigateToProduct} // ADD THIS LINE
  //       />
  //     );
  //   }
  //   return (
  //     <ProductDetailsView
  //       productId={selectedProduct?.pid}
  //       onBack={handleBackToSelector}
  //     />
  //   );
  // }

  // Add this useEffect for ESC key handling
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        closeAllDropdowns();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !isApplying) {
        setShowBulkModal(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isApplying]);

  if (currentView === "details") {
    const handleNavigateToProduct = (productId) => {
      const allProducts = [...storeProducts, ...comProducts, ...omniProducts];
      const targetProduct = allProducts.find((p) => p.pid === productId);
      if (targetProduct) {
        dispatch(setSelectedProduct(targetProduct));
      }
    };

    return (
      <ProductDetailsView
        productId={selectedProduct?.pid}
        onBack={handleBackToSelector}
        onNavigateToProduct={handleNavigateToProduct}
      />
    );
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    setBulkFactor(value);
    setError("");

    if (value && !isValidInput()) {
      if (parseFloat(value) < -100) {
        setError("Percentage cannot be less than -100%");
      } else if (parseFloat(value) > 100) {
        setError("Percentage cannot exceed 100%");
      } else if (isNaN(parseFloat(value))) {
        setError("Please enter a valid number");
      }
    }
  };

  // // Fixed ResultsModal component with proper styling and positioning
  // const ResultsModal = () => {
  //   if (!showResults || !lastAppliedResults) return null;

  //   return (
  //     <div
  //       className="fixed inset-0 z-[9999] flex items-center justify-center"
  //       style={{
  //         backgroundColor: "rgba(0, 0, 0, 0.5)",
  //         backdropFilter: "blur(4px)",
  //       }}
  //       onClick={(e) => {
  //         if (e.target === e.currentTarget) {
  //           setShowResults(false);
  //         }
  //       }}
  //     >
  //       <div
  //         className="bg-white rounded-xl shadow-2xl mx-4 max-h-[90vh] overflow-hidden"
  //         style={{
  //           width: "95%",
  //           maxWidth: "1000px",
  //           transform: "scale(1)",
  //           animation: "modalSlideIn 0.3s ease-out",
  //         }}
  //         onClick={(e) => e.stopPropagation()}
  //       >
  //         {/* Header - Fixed */}
  //         <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white relative">
  //           <div className="flex items-center justify-between">
  //             <div className="flex items-center gap-3">
  //               <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
  //                 <CheckCircle className="w-6 h-6 text-white" />
  //               </div>
  //               <div>
  //                 <h2 className="text-xl font-bold text-white">
  //                   External Factor Applied Successfully!
  //                 </h2>
  //                 <p className="text-green-100 mt-1">
  //                   {lastAppliedResults.factorPercentage > 0
  //                     ? "Increased"
  //                     : "Decreased"}{" "}
  //                   quantities by{" "}
  //                   {Math.abs(lastAppliedResults.factorPercentage)}%
  //                 </p>
  //               </div>
  //             </div>
  //             <button
  //               onClick={() => setShowResults(false)}
  //               className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors text-white"
  //             >
  //               <X className="w-5 h-5" />
  //             </button>
  //           </div>
  //         </div>

  //         {/* Summary Cards - Fixed styling */}
  //         <div className="p-6 bg-gray-50 border-b border-gray-200">
  //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  //             {/* Products Updated Card */}
  //             <div className="bg-white rounded-lg p-4 border-2 border-blue-200 shadow-sm">
  //               <div className="flex items-center gap-3">
  //                 <div className="p-2 bg-blue-100 rounded-lg">
  //                   <Package className="w-5 h-5 text-blue-600" />
  //                 </div>
  //                 <div className="min-w-0 flex-1">
  //                   <p className="text-xs text-gray-600 font-medium">
  //                     Products Updated
  //                   </p>
  //                   <p className="text-xl font-bold text-blue-600">
  //                     {lastAppliedResults.totalProductsUpdated}
  //                   </p>
  //                 </div>
  //               </div>
  //             </div>

  //             {/* Original Total Card */}
  //             <div className="bg-white rounded-lg p-4 border-2 border-gray-200 shadow-sm">
  //               <div className="flex items-center gap-3">
  //                 <div className="p-2 bg-gray-100 rounded-lg">
  //                   <ArrowUpDown className="w-5 h-5 text-gray-600" />
  //                 </div>
  //                 <div className="min-w-0 flex-1">
  //                   <p className="text-xs text-gray-600 font-medium">
  //                     Original Total
  //                   </p>
  //                   <p className="text-xl font-bold text-gray-800">
  //                     {lastAppliedResults.summary.totalOriginalQty.toLocaleString()}
  //                   </p>
  //                 </div>
  //               </div>
  //             </div>

  //             {/* New Total Card */}
  //             <div className="bg-white rounded-lg p-4 border-2 border-green-200 shadow-sm">
  //               <div className="flex items-center gap-3">
  //                 <div className="p-2 bg-green-100 rounded-lg">
  //                   <ChevronUp className="w-5 h-5 text-green-600" />
  //                 </div>
  //                 <div className="min-w-0 flex-1">
  //                   <p className="text-xs text-gray-600 font-medium">
  //                     New Total
  //                   </p>
  //                   <p className="text-xl font-bold text-green-600">
  //                     {lastAppliedResults.summary.totalNewQty.toLocaleString()}
  //                   </p>
  //                 </div>
  //               </div>
  //             </div>

  //             {/* Net Change Card */}
  //             <div
  //               className={`bg-white rounded-lg p-4 shadow-sm border-2 ${
  //                 lastAppliedResults.summary.totalDifference >= 0
  //                   ? "border-emerald-200"
  //                   : "border-red-200"
  //               }`}
  //             >
  //               <div className="flex items-center gap-3">
  //                 <div
  //                   className={`p-2 rounded-lg ${
  //                     lastAppliedResults.summary.totalDifference >= 0
  //                       ? "bg-emerald-100"
  //                       : "bg-red-100"
  //                   }`}
  //                 >
  //                   {lastAppliedResults.summary.totalDifference >= 0 ? (
  //                     <ChevronUp className="w-5 h-5 text-emerald-600" />
  //                   ) : (
  //                     <ChevronDown className="w-5 h-5 text-red-600" />
  //                   )}
  //                 </div>
  //                 <div className="min-w-0 flex-1">
  //                   <p className="text-xs text-gray-600 font-medium">
  //                     Net Change
  //                   </p>
  //                   <p
  //                     className={`text-xl font-bold ${
  //                       lastAppliedResults.summary.totalDifference >= 0
  //                         ? "text-emerald-600"
  //                         : "text-red-600"
  //                     }`}
  //                   >
  //                     {lastAppliedResults.summary.totalDifference >= 0
  //                       ? "+"
  //                       : ""}
  //                     {lastAppliedResults.summary.totalDifference.toLocaleString()}
  //                   </p>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Applied Factor Info - Fixed */}
  //           <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
  //             <div className="flex items-center gap-3 mb-3">
  //               <Settings className="w-5 h-5 text-blue-600" />
  //               <span className="font-semibold text-blue-800">
  //                 Applied Factor Details
  //               </span>
  //             </div>
  //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
  //               <div className="flex flex-col">
  //                 <span className="text-gray-600 text-xs font-medium">
  //                   Percentage:
  //                 </span>
  //                 <span className="font-bold text-blue-800 text-lg">
  //                   {lastAppliedResults.factorPercentage > 0 ? "+" : ""}
  //                   {lastAppliedResults.factorPercentage}%
  //                 </span>
  //               </div>
  //               <div className="flex flex-col">
  //                 <span className="text-gray-600 text-xs font-medium">
  //                   Applied At:
  //                 </span>
  //                 <span className="font-medium text-gray-800">
  //                   {lastAppliedResults.timestamp.toLocaleString()}
  //                 </span>
  //               </div>
  //               <div className="flex flex-col">
  //                 <span className="text-gray-600 text-xs font-medium">
  //                   Note:
  //                 </span>
  //                 <span
  //                   className="font-medium text-gray-800 truncate"
  //                   title={lastAppliedResults.factorNote || "No notes provided"}
  //                 >
  //                   {lastAppliedResults.factorNote || "No notes provided"}
  //                 </span>
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Detailed Results Table - Fixed scrolling */}
  //         <div className="flex-1 overflow-hidden">
  //           <div className="p-6 pb-0">
  //             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
  //               <FileText className="w-5 h-5" />
  //               Detailed Changes by Product
  //             </h3>
  //           </div>

  //           <div
  //             className="px-6 pb-6"
  //             style={{ maxHeight: "300px", overflowY: "auto" }}
  //           >
  //             <div className="overflow-x-auto">
  //               <table className="min-w-full border border-gray-200 rounded-lg bg-white">
  //                 <thead className="bg-gray-50 sticky top-0">
  //                   <tr>
  //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
  //                       Product ID
  //                     </th>
  //                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
  //                       Category
  //                     </th>
  //                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
  //                       Original Qty
  //                     </th>
  //                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
  //                       New Qty
  //                     </th>
  //                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
  //                       Change
  //                     </th>
  //                     <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
  //                       Factor Applied
  //                     </th>
  //                   </tr>
  //                 </thead>
  //                 <tbody className="bg-white divide-y divide-gray-200">
  //                   {lastAppliedResults.results.map((result, index) => {
  //                     const change = result.newQty - result.originalQty;
  //                     return (
  //                       <tr
  //                         key={result.pid}
  //                         className={
  //                           index % 2 === 0 ? "bg-gray-50" : "bg-white"
  //                         }
  //                       >
  //                         <td className="px-4 py-3 text-sm font-mono text-gray-900 border-r border-gray-100">
  //                           {result.pid}
  //                         </td>
  //                         <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-100">
  //                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
  //                             {result.category}
  //                           </span>
  //                         </td>
  //                         <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 border-r border-gray-100">
  //                           {result.originalQty.toLocaleString()}
  //                         </td>
  //                         <td className="px-4 py-3 text-sm text-right font-bold text-green-600 border-r border-gray-100">
  //                           {result.newQty.toLocaleString()}
  //                         </td>
  //                         <td
  //                           className={`px-4 py-3 text-sm text-right font-bold border-r border-gray-100 ${
  //                             change >= 0 ? "text-emerald-600" : "text-red-600"
  //                           }`}
  //                         >
  //                           {change >= 0 ? "+" : ""}
  //                           {change.toLocaleString()}
  //                         </td>
  //                         <td className="px-4 py-3 text-sm text-center">
  //                           <span
  //                             className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
  //                               result.factorApplied >= 0
  //                                 ? "bg-green-100 text-green-800"
  //                                 : "bg-red-100 text-red-800"
  //                             }`}
  //                           >
  //                             {result.factorApplied > 0 ? "+" : ""}
  //                             {result.factorApplied}%
  //                           </span>
  //                         </td>
  //                       </tr>
  //                     );
  //                   })}
  //                 </tbody>
  //               </table>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Footer - Fixed */}
  //         <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
  //           <div className="text-sm text-gray-600 text-center sm:text-left">
  //             Changes applied to {lastAppliedResults.totalProductsUpdated}{" "}
  //             products • Data refreshed automatically
  //           </div>
  //           <button
  //             onClick={() => setShowResults(false)}
  //             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  //           >
  //             Close
  //           </button>
  //         </div>
  //       </div>

  //       <style jsx>{`
  //         @keyframes modalSlideIn {
  //           from {
  //             opacity: 0;
  //             transform: scale(0.9) translateY(-20px);
  //           }
  //           to {
  //             opacity: 1;
  //             transform: scale(1) translateY(0);
  //           }
  //         }
  //       `}</style>
  //     </div>
  //   );
  // };

  return (
    <>
      {showBulkModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-200"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-200 scale-100">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Set External Factor %
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Apply to {selectedProductIds.length} selected products
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isApplying && setShowBulkModal(false)}
                disabled={isApplying}
                className={`p-2 rounded-lg transition-colors ${
                  isApplying
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Selected Products Info */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  <span className="font-medium">
                    {selectedProductIds.length}
                  </span>{" "}
                  products will be updated
                </span>
              </div>

              {/* Input Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  External Factor Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter percentage (-100 to 100)"
                    value={bulkFactor}
                    onChange={handleInputChange}
                    disabled={isApplying}
                    min="-100"
                    max="100"
                    step="0.1"
                    className={`w-11/12 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      error
                        ? "border-red-300 bg-red-50"
                        : success
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    } ${isApplying ? "opacity-50 cursor-not-allowed" : ""}`}
                  />

                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-400 text-sm">%</span>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>External factor applied successfully!</span>
                  </div>
                )}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    External Factor Notes
                  </label>
                  <textarea
                    value={bulkFactorNote}
                    onChange={(e) => setBulkFactorNote(e.target.value)}
                    placeholder="Add notes about external factors..."
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                {/* Helper Text */}
                {!error && !success && (
                  <p className="text-xs text-gray-500 mt-2">
                    This percentage will be applied to all selected products
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowBulkModal(false)}
                disabled={isApplying}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isApplying
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={applyBulkExternalFactor}
                disabled={
                  !bulkFactor || !isValidInput() || isApplying || success
                }
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !bulkFactor || !isValidInput() || isApplying || success
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-sm hover:shadow-md"
                }`}
              >
                {isApplying ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Applying...</span>
                  </div>
                ) : success ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Applied!</span>
                  </div>
                ) : (
                  "Apply Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD THIS - Single Results Modal (replaces both the component and the duplicate JSX) */}
      {showResults && lastAppliedResults && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowResults(false);
            }
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl mx-4 max-h-[90vh] overflow-hidden"
            style={{
              width: "95%",
              maxWidth: "1000px",
              transform: "scale(1)",
              animation: "modalSlideIn 0.3s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      External Factor Applied Successfully!
                    </h2>
                    <p className="text-green-100 mt-1">
                      {lastAppliedResults.factorPercentage > 0
                        ? "Increased"
                        : "Decreased"}{" "}
                      quantities by{" "}
                      {Math.abs(lastAppliedResults.factorPercentage)}%
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Products Updated Card */}
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600 font-medium">
                        Products Updated
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        {lastAppliedResults.totalProductsUpdated}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Original Total Card */}
                <div className="bg-white rounded-lg p-4 border-2 border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <ArrowUpDown className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600 font-medium">
                        Original Total
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        {lastAppliedResults.summary.totalOriginalQty.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* New Total Card */}
                <div className="bg-white rounded-lg p-4 border-2 border-green-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ChevronUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600 font-medium">
                        New Total
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        {lastAppliedResults.summary.totalNewQty.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Net Change Card */}
                <div
                  className={`bg-white rounded-lg p-4 shadow-sm border-2 ${
                    lastAppliedResults.summary.totalDifference >= 0
                      ? "border-emerald-200"
                      : "border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        lastAppliedResults.summary.totalDifference >= 0
                          ? "bg-emerald-100"
                          : "bg-red-100"
                      }`}
                    >
                      {lastAppliedResults.summary.totalDifference >= 0 ? (
                        <ChevronUp className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600 font-medium">
                        Net Change
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          lastAppliedResults.summary.totalDifference >= 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {lastAppliedResults.summary.totalDifference >= 0
                          ? "+"
                          : ""}
                        {lastAppliedResults.summary.totalDifference.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applied Factor Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">
                    Applied Factor Details
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-600 text-xs font-medium">
                      Percentage:
                    </span>
                    <span className="font-bold text-blue-800 text-lg">
                      {lastAppliedResults.factorPercentage > 0 ? "+" : ""}
                      {lastAppliedResults.factorPercentage}%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600 text-xs font-medium">
                      Applied At:
                    </span>
                    <span className="font-medium text-gray-800">
                      {lastAppliedResults.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600 text-xs font-medium">
                      Note:
                    </span>
                    <span
                      className="font-medium text-gray-800 truncate"
                      title={
                        lastAppliedResults.factorNote || "No notes provided"
                      }
                    >
                      {lastAppliedResults.factorNote || "No notes provided"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Results Table */}
            <div className="flex-1 overflow-hidden">
              <div className="p-6 pb-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Detailed Changes by Product
                </h3>
              </div>

              <div
                className="px-6 pb-6"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg bg-white">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                          Product ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                          Category
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                          Old User Added Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                          New Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                          Change
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                          Factor Applied
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lastAppliedResults.results.map((result, index) => {
                        const change = result.newQty - result.originalQty;
                        return (
                          <tr
                            key={result.pid}
                            className={
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }
                          >
                            <td className="px-4 py-3 text-sm font-mono text-gray-900 border-r border-gray-100">
                              {result.pid}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-100">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                                {result.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 border-r border-gray-100">
                              {result.originalQty.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-bold text-green-600 border-r border-gray-100">
                              {result.newQty.toLocaleString()}
                            </td>
                            <td
                              className={`px-4 py-3 text-sm text-right font-bold border-r border-gray-100 ${
                                change >= 0
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }`}
                            >
                              {change >= 0 ? "+" : ""}
                              {change.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  result.factorApplied >= 0
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {result.factorApplied > 0 ? "+" : ""}
                                {result.factorApplied}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600 text-center sm:text-left">
                Changes applied to {lastAppliedResults.totalProductsUpdated}{" "}
                products • Data refreshed automatically
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>

          <style jsx>{`
            @keyframes modalSlideIn {
              from {
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}</style>
        </div>
      )}

      <div className="w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate("/file-upload")}
                  className="text-white opacity-80 hover:opacity-100 flex items-center gap-2 transition-opacity"
                >
                  <ArrowLeft size={16} />
                  Back to Forecast
                </button>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Product Selector
              </h1>
              <p className="text-indigo-100 mt-1">
                Enhanced filtering with dropdown controls and separate notes
              </p>
            </div>

            {/* Right side actions */}

            <div className="flex items-center gap-3">
              {/* Download sumary */}

              {
                <>
                  <a
                    href={`${
                      import.meta.env.VITE_API_BASE_URL
                    }/forecast/export-summary`}
                  >
                    <button
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 border border-white/20"
                      title="Download Category Files"
                    >
                      <FileDown size={18} />
                      <span className="hidden sm:inline">Download Summary</span>
                      <span className="sm:hidden">Download</span>
                    </button>
                  </a>
                </>
              }

              {/* Download Button - More prominent */}
              {
                <button
                  onClick={handleOpenCategoryDownload}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 border border-white/20"
                  title="Download Category Files"
                >
                  <FileDown size={18} />
                  <span className="hidden sm:inline">Download Categories</span>
                  <span className="sm:hidden">Download</span>
                </button>
              }

              {
                <button
                  onClick={handleDownloadFinalQuantityReport}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 border border-white/20"
                  title="Download Category Files"
                >
                  <FileDown size={18} />
                  <span className="hidden sm:inline">
                    Download Final Quantity Report
                  </span>
                  <span className="sm:hidden">Download</span>
                </button>
              }

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="text-white opacity-80 hover:opacity-100 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                title="Refresh Data"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Forecast Information Banner */}
          {forecastSession && (
            <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-indigo-800 mb-2">
                    Active Forecast Session
                  </h3>
                  <div className="text-sm text-indigo-700 space-y-1">
                    <p>
                      <strong>Categories:</strong>{" "}
                      {forecastSession.selectedCategories
                        ?.map((cat) => `${cat.name} (${cat.value})`)
                        .join(", ")}
                    </p>
                    <p>
                      <strong>Period:</strong> {forecastSession.monthFrom} to{" "}
                      {forecastSession.monthTo} ({forecastSession.percentage}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Type Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {Object.entries(productTypeConfig).map(([type, config]) => {
                const IconComponent = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => handleProductTypeChange(type)}
                    className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      selectedProductType === type
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent size={18} />
                    {config.label}
                    <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {getProductCount(type)}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Enhanced Filters Section */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl shadow-xl overflow-hidden mb-6">
            {/* Filters Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Sliders size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Advanced Filters
                    </h3>
                    <p className="text-slate-300 text-sm">
                      Refine your product search with precision
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {hasActiveFilters && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 rounded-full">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-indigo-700">
                        {
                          Object.values(selectedFilters)
                            .flat()
                            .filter((v) => v && v !== "").length
                        }{" "}
                        active
                      </span>
                    </div>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all duration-200 text-sm font-medium"
                    disabled={!hasActiveFilters}
                  >
                    <RefreshCw size={16} />
                    Reset All
                  </button>
                </div>
              </div>
            </div>

            {filtersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-slate-600 font-medium">
                    Loading intelligent filters...
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-8">
                {/* Filter Categories with Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                  {[
                    { id: "basic", label: "Basic Filters", icon: Filter },
                    { id: "business", label: "Business Logic", icon: Settings },
                    { id: "special", label: "Special Days", icon: Calendar },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-indigo-100 text-indigo-700 shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Basic Filters Tab */}
                {activeTab === "basic" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Birthstones Filter - Boxed */}
                    {(selectedProductType === "store" ||
                      selectedProductType === "omni") && (
                      <div className="bg-white border-2 border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-purple-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Star size={18} className="text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-purple-900">
                              Birthstones
                            </h4>
                            <p className="text-xs text-purple-600">
                              Filter by birthstone type
                            </p>
                          </div>
                          {selectedFilters.birthstone?.length > 0 && (
                            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-300">
                              {selectedFilters.birthstone.length}
                            </span>
                          )}
                        </div>

                        {/* INCREASED HEIGHT FROM max-h-40 TO max-h-64 */}
                        <div className="border border-purple-200 rounded-lg p-3 bg-purple-50/30 max-h-64 overflow-y-auto">
                          <div className="space-y-2">
                            {availableFilters.birthstones.map((birthstone) => (
                              <label
                                key={birthstone}
                                className="flex items-center gap-3 p-2 hover:bg-purple-100 rounded-lg cursor-pointer transition-colors group"
                              >
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedFilters.birthstone?.includes(
                                        birthstone
                                      ) || false
                                    }
                                    onChange={(e) =>
                                      handleMultiSelectFilterChange(
                                        "birthstone",
                                        birthstone,
                                        e.target.checked
                                      )
                                    }
                                    className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500 focus:ring-2"
                                  />
                                  {selectedFilters.birthstone?.includes(
                                    birthstone
                                  ) && (
                                    <Check
                                      size={12}
                                      className="absolute inset-0 m-auto text-white pointer-events-none"
                                    />
                                  )}
                                </div>
                                <span className="text-sm text-purple-800 group-hover:text-purple-900 font-medium capitalize">
                                  {birthstone.toLowerCase()}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Red Box Items Filter - Boxed */}
                    <div className="bg-white border-2 border-red-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-red-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <div className="w-4 h-4 bg-red-500 rounded"></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-red-900">
                            Red Box Items
                          </h4>
                          <p className="text-xs text-red-600">
                            Special red box category
                          </p>
                        </div>
                        {selectedFilters.red_box_item?.length > 0 && (
                          <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-300">
                            {selectedFilters.red_box_item.length}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {availableFilters.red_box_items.map((item) => (
                          <label
                            key={item}
                            className="flex items-center gap-3 p-3 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer transition-all duration-200 hover:border-red-300 bg-red-50/30"
                          >
                            <input
                              type="checkbox"
                              checked={
                                selectedFilters.red_box_item?.includes(item) ||
                                false
                              }
                              onChange={(e) =>
                                handleMultiSelectFilterChange(
                                  "red_box_item",
                                  item,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-red-600 border-red-300 rounded focus:ring-red-500 focus:ring-2"
                            />
                            <span className="text-sm font-semibold text-red-800">
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Additional Boolean Filters - Boxed */}
                    <div className="bg-white border-2 border-indigo-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Settings size={18} className="text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-indigo-900">
                            Additional Filters
                          </h4>
                          <p className="text-xs text-indigo-600">
                            Quantity and SOQ filters
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 max-h-80">
                        {additionalBooleanFilters
                          .filter(
                            (filter) =>
                              filter.showFor.includes(selectedProductType) &&
                              ![
                                "below_min_order",
                                "over_macys_soq",
                                "need_to_review_first",
                              ].includes(filter.key)
                          )
                          .slice(0, 3)
                          .map((filter) => (
                            <div key={filter.key} className="space-y-2">
                              <label className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                                {filter.label}
                              </label>
                              <select
                                value={selectedFilters[filter.key] || ""}
                                onChange={(e) =>
                                  handleSingleSelectFilterChange(
                                    filter.key,
                                    e.target.value
                                  )
                                }
                                className="w-full p-3 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-indigo-50/30 hover:border-indigo-300 transition-colors font-medium text-indigo-800"
                              >
                                {booleanOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Business Logic Tab */}
                {activeTab === "business" && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-inner">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <AlertCircle size={20} className="text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-indigo-900">
                          Priority Business Filters
                        </h4>
                        <p className="text-sm text-indigo-700">
                          Critical business logic and decision-making filters
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Below Min Order */}
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-indigo-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                          <label className="text-sm font-bold text-slate-800">
                            Below Min Order
                          </label>
                        </div>
                        <select
                          value={selectedFilters.below_min_order || ""}
                          onChange={(e) =>
                            handleSingleSelectFilterChange(
                              "below_min_order",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white font-semibold text-slate-700 hover:border-slate-300 transition-all duration-200"
                        >
                          {booleanOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-2">
                          Products below minimum order threshold
                        </p>
                      </div>

                      {/* Over Macy's SOQ */}
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-indigo-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                          <label className="text-sm font-bold text-slate-800">
                            Over Macy's SOQ
                          </label>
                        </div>
                        <select
                          value={selectedFilters.over_macys_soq || ""}
                          onChange={(e) =>
                            handleSingleSelectFilterChange(
                              "over_macys_soq",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white font-semibold text-slate-700 hover:border-slate-300 transition-all duration-200"
                        >
                          {booleanOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-2">
                          Exceeds Macy's stock on quote
                        </p>
                      </div>

                      {/* Need to Review First */}
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-indigo-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                          <label className="text-sm font-bold text-slate-800">
                            Need to Review First
                          </label>
                        </div>
                        <select
                          value={selectedFilters.need_to_review_first || ""}
                          onChange={(e) =>
                            handleSingleSelectFilterChange(
                              "need_to_review_first",
                              e.target.value
                            )
                          }
                          className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white font-semibold text-slate-700 hover:border-slate-300 transition-all duration-200"
                        >
                          {booleanOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-2">
                          Requires management review
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Special Days Tab */}
                {activeTab === "special" && (
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Calendar size={24} className="text-pink-600" />
                      <div>
                        <h4 className="text-lg font-bold text-pink-900">
                          Holiday & Special Days
                        </h4>
                        <p className="text-sm text-pink-700">
                          Filter by seasonal and special occasion products
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {specialDayFilters.map((filter) => (
                        <div
                          key={filter.key}
                          className="bg-white rounded-xl p-4 border border-pink-200 hover:shadow-md transition-all duration-200 hover:border-pink-300"
                        >
                          <label className="flex items-center gap-3 cursor-pointer">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={selectedFilters[filter.key] === "true"}
                                onChange={(e) =>
                                  handleSingleSelectFilterChange(
                                    filter.key,
                                    e.target.checked ? "true" : ""
                                  )
                                }
                                className="w-5 h-5 text-pink-600 border-pink-300 rounded focus:ring-pink-500 focus:ring-2"
                              />
                              {selectedFilters[filter.key] === "true" && (
                                <Check
                                  size={14}
                                  className="absolute inset-0 m-auto text-white pointer-events-none"
                                />
                              )}
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-slate-800">
                                {filter.label}
                              </span>
                              <p className="text-xs text-slate-500">
                                Products for {filter.label.toLowerCase()}
                              </p>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filter Summary */}
                {hasActiveFilters && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter size={16} className="text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-800">
                          Active Filters Summary
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedFilters.category?.map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                          >
                            {cat}
                          </span>
                        ))}
                        {selectedFilters.birthstone?.map((stone) => (
                          <span
                            key={stone}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                          >
                            {stone}
                          </span>
                        ))}
                        {specialDayFilters
                          .filter((f) => selectedFilters[f.key] === "true")
                          .map((f) => (
                            <span
                              key={f.key}
                              className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium"
                            >
                              {f.label}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary Cards - moved above products table */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {processedProducts.length}
                  </p>
                </div>
                <Package className="text-blue-600" size={24} />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Reviewed</p>
                  <p className="text-2xl font-bold text-green-900">
                    {
                      Object.values(productNotesData).filter(
                        (data) => data.status === "reviewed"
                      ).length
                    }
                  </p>
                </div>
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Not Reviewed
                  </p>
                  <p className="text-2xl font-bold text-red-900">
                    {
                      Object.values(productNotesData).filter(
                        (data) => data.status === "not_reviewed"
                      ).length
                    }
                  </p>
                </div>
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {
                      Object.values(productNotesData).filter(
                        (data) => data.status === "pending"
                      ).length
                    }
                  </p>
                </div>
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          {/* Products Display */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {React.createElement(
                  productTypeConfig[selectedProductType].icon,
                  { size: 20 }
                )}
                {productTypeConfig[selectedProductType].label}
              </h3>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                {/* Search Bar with Dropdown - Responsive */}
                <div className="relative search-container w-full sm:w-auto  sm:min-w-[300px] lg:min-w-[400px]">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 "
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search products by ID or category..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={handleSearchInputFocus}
                    className="w-full pl-10 pr-4 py-2.5 border  border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />

                  {/* Search Results Dropdown */}
                  {showSearchDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-w-full">
                      {/* Show Recent Searches when no query or query matches recent items */}
                      {searchQuery.trim() === "" &&
                        recentSearches.length > 0 && (
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
                                  onClick={() =>
                                    handleRecentSearchClick(product)
                                  }
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
                                              {productNotesData[product.pid]
                                                ?.count || 0}{" "}
                                              Notes
                                            </span>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <User className="w-3 h-3" />
                                            <span>
                                              {productNotesData[product.pid]
                                                ?.assignedTo || "Unassigned"}
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
                      {searchQuery.trim() !== "" &&
                        processedProducts.length > 0 && (
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
                                              {productNotesData[product.pid]
                                                ?.count || 0}{" "}
                                              Notes
                                            </span>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <User className="w-3 h-3" />
                                            <span>
                                              {productNotesData[product.pid]
                                                ?.assignedTo || "Unassigned"}
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
                                Showing first 10 of {
                                  processedProducts.length
                                }{" "}
                                results
                              </div>
                            )}
                          </>
                        )}

                      {/* No results message */}
                      {searchQuery.trim() !== "" &&
                        processedProducts.length === 0 && (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No products found</p>
                            <p className="text-xs text-gray-400">
                              Try adjusting your search terms
                            </p>
                          </div>
                        )}

                      {/* Empty state when no recent searches */}
                      {searchQuery.trim() === "" &&
                        recentSearches.length === 0 && (
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

                {/* Right side buttons */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    onClick={() => setShowBulkModal(true)}
                    className={`
      group relative inline-flex items-center gap-2 px-4 lg:px-6 py-2.5 font-medium text-sm rounded-lg
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
      ${
        selectedProductIds.length === 0 || loading
          ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-sm hover:shadow-md active:scale-[0.98]"
      }
    `}
                    disabled={selectedProductIds.length === 0}
                  >
                    <span className="hidden sm:inline">
                      Set External Factor %
                    </span>
                    <span className="sm:hidden">Set Factor</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 hidden sm:inline">
                      {processedProducts.length} products found
                    </span>
                    <span className="text-xs text-gray-500 sm:hidden">
                      {processedProducts.length} found
                    </span>
                    {loading && (
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package size={64} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="mb-4">
                  {hasActiveFilters || searchQuery
                    ? "No products match the current filters or search query."
                    : "No products available for this category."}
                </p>
                {(hasActiveFilters || searchQuery) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Clear all filters and search
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto min-h-[500px]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-center flex-col">
                          <input
                            type="checkbox"
                            ref={(el) => {
                              if (el) el.indeterminate = isSomeSelected;
                            }}
                            checked={isAllSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                          {selectedProductIds.length > 0 && (
                            <span className="mt-2 text-xs text-indigo-600 font-medium">
                              {selectedProductIds.length}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                        Product ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider relative">
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setCategoryDropdownOpen(!categoryDropdownOpen);
                            setCategorySearchTerm("");
                          }}
                          className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
                            selectedFilters.category.length > 0
                              ? "text-indigo-600 font-semibold"
                              : ""
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            {selectedFilters.category.length > 0 && (
                              <Filter size={14} />
                            )}
                            Category
                          </span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              categoryDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                          {selectedFilters.category.length > 0 && (
                            <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                              {selectedFilters.category.length}
                            </span>
                          )}
                        </button>

                        {categoryDropdownOpen && (
                          <div
                            className="category-dropdown absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Header with search */}
                            <div className="p-3 border-b border-gray-100">
                              <div className="relative">
                                <Search
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                  size={16}
                                />
                                <input
                                  type="text"
                                  placeholder="Search categories..."
                                  value={categorySearchTerm}
                                  onChange={(e) =>
                                    setCategorySearchTerm(e.target.value)
                                  }
                                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {categorySearchTerm && (
                                  <button
                                    onClick={() => setCategorySearchTerm("")}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    <X size={16} />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="p-2 border-b border-gray-100 flex justify-between">
                              <button
                                onClick={() => {
                                  const filteredCategories =
                                    availableFilters.categories.filter((cat) =>
                                      cat
                                        .toLowerCase()
                                        .includes(
                                          categorySearchTerm.toLowerCase()
                                        )
                                    );
                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    category: [
                                      ...new Set([
                                        ...prev.category,
                                        ...filteredCategories,
                                      ]),
                                    ],
                                  }));
                                }}
                                className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                              >
                                Select All{" "}
                                {categorySearchTerm &&
                                  `(${
                                    availableFilters.categories.filter((cat) =>
                                      cat
                                        .toLowerCase()
                                        .includes(
                                          categorySearchTerm.toLowerCase()
                                        )
                                    ).length
                                  })`}
                              </button>
                              <button
                                onClick={() =>
                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    category: [],
                                  }))
                                }
                                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                              >
                                Clear All
                              </button>
                            </div>

                            {/* Categories list - now filtered */}
                            <div className="flex-1 overflow-y-auto">
                              {availableFilters.categories
                                .filter((cat) =>
                                  cat
                                    .toLowerCase()
                                    .includes(categorySearchTerm.toLowerCase())
                                )
                                .map((cat) => (
                                  <label
                                    key={cat}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                                  >
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        checked={selectedFilters.category.includes(
                                          cat
                                        )}
                                        onChange={(e) =>
                                          handleMultiSelectFilterChange(
                                            "category",
                                            cat,
                                            e.target.checked
                                          )
                                        }
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                                      />
                                      {selectedFilters.category.includes(
                                        cat
                                      ) && (
                                        <Check
                                          size={12}
                                          className="absolute top-0.5 left-0.5 text-white pointer-events-none"
                                        />
                                      )}
                                    </div>
                                    <span className="text-sm text-gray-700 flex-1">
                                      {cat}
                                    </span>
                                  </label>
                                ))}

                              {/* No results message */}
                              {categorySearchTerm &&
                                availableFilters.categories.filter((cat) =>
                                  cat
                                    .toLowerCase()
                                    .includes(categorySearchTerm.toLowerCase())
                                ).length === 0 && (
                                  <div className="p-4 text-center text-gray-500 text-sm">
                                    No categories found matching "
                                    {categorySearchTerm}"
                                  </div>
                                )}
                            </div>

                            {/* Footer with selection count */}
                            {selectedFilters.category.length > 0 && (
                              <div className="p-2 border-t border-gray-100 bg-gray-50">
                                <span className="text-xs text-gray-600">
                                  {selectedFilters.category.length} of{" "}
                                  {availableFilters.categories.length}{" "}
                                  categories selected
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setTaggedToDropdownOpen(!taggedToDropdownOpen);
                            setTaggedToSearchTerm("");
                          }}
                          className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
                            selectedFilters.tagged_to?.length > 0
                              ? "text-indigo-600 font-semibold"
                              : ""
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            {selectedFilters.tagged_to?.length > 0 && (
                              <Filter size={14} />
                            )}
                            Tagged To
                          </span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              taggedToDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                          {selectedFilters.tagged_to?.length > 0 && (
                            <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                              {selectedFilters.tagged_to.length}
                            </span>
                          )}
                        </button>

                        {taggedToDropdownOpen && (
                          <div
                            className="tagged-to-dropdown absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="p-3 border-b border-gray-100">
                              <div className="relative">
                                <Search
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                  size={16}
                                />
                                <input
                                  type="text"
                                  placeholder="Search tagged to..."
                                  value={taggedToSearchTerm}
                                  onChange={(e) =>
                                    setTaggedToSearchTerm(e.target.value)
                                  }
                                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {taggedToSearchTerm && (
                                  <button
                                    onClick={() => setTaggedToSearchTerm("")}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    <X size={16} />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="p-2 border-b border-gray-100 flex justify-between">
                              <button
                                onClick={() => {
                                  const filteredTaggedTo = (
                                    availableFilters.tagged_to || []
                                  ).filter((user) =>
                                    user
                                      .toLowerCase()
                                      .includes(
                                        taggedToSearchTerm.toLowerCase()
                                      )
                                  );
                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    tagged_to: [
                                      ...new Set([
                                        ...(prev.tagged_to || []),
                                        ...filteredTaggedTo,
                                      ]),
                                    ],
                                  }));
                                }}
                                className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                              >
                                Select All{" "}
                                {taggedToSearchTerm &&
                                  `(${
                                    (availableFilters.tagged_to || []).filter(
                                      (user) =>
                                        user
                                          .toLowerCase()
                                          .includes(
                                            taggedToSearchTerm.toLowerCase()
                                          )
                                    ).length
                                  })`}
                              </button>
                              <button
                                onClick={() =>
                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    tagged_to: [],
                                  }))
                                }
                                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                              >
                                Clear All
                              </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                              {(availableFilters.tagged_to || [])
                                .filter((user) =>
                                  user
                                    .toLowerCase()
                                    .includes(taggedToSearchTerm.toLowerCase())
                                )
                                .map((user) => (
                                  <label
                                    key={user}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                                  >
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        checked={(
                                          selectedFilters.tagged_to || []
                                        ).includes(user)}
                                        onChange={(e) =>
                                          handleMultiSelectFilterChange(
                                            "tagged_to",
                                            user,
                                            e.target.checked
                                          )
                                        }
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                                      />
                                      {(
                                        selectedFilters.tagged_to || []
                                      ).includes(user) && (
                                        <Check
                                          size={12}
                                          className="absolute top-0.5 left-0.5 text-white pointer-events-none"
                                        />
                                      )}
                                    </div>
                                    <span className="text-sm text-gray-700 flex-1">
                                      {user}
                                    </span>
                                  </label>
                                ))}

                              {taggedToSearchTerm &&
                                (availableFilters.tagged_to || []).filter(
                                  (user) =>
                                    user
                                      .toLowerCase()
                                      .includes(
                                        taggedToSearchTerm.toLowerCase()
                                      )
                                ).length === 0 && (
                                  <div className="p-4 text-center text-gray-500 text-sm">
                                    No users found matching "
                                    {taggedToSearchTerm}"
                                  </div>
                                )}
                            </div>

                            {(selectedFilters.tagged_to?.length || 0) > 0 && (
                              <div className="p-2 border-t border-gray-100 bg-gray-50">
                                <span className="text-xs text-gray-600">
                                  {selectedFilters.tagged_to.length} of{" "}
                                  {(availableFilters.tagged_to || []).length}{" "}
                                  users selected
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider relative">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider relative">
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setNotesDropdownOpen(!notesDropdownOpen);
                          }}
                          className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
                            selectedFilters.notes_sort
                              ? "text-indigo-600 font-semibold"
                              : ""
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            {selectedFilters.notes_sort && <Filter size={14} />}
                            Notes
                          </span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              notesDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                          {selectedFilters.notes_sort && (
                            <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                              {selectedFilters.notes_sort === "latest"
                                ? "Latest"
                                : "Oldest"}
                            </span>
                          )}
                        </button>

                        {notesDropdownOpen && (
                          <div
                            className="notes-dropdown absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Header */}
                            <div className="p-3 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-700">
                                Sort by Notes
                              </span>
                            </div>

                            {/* Options */}
                            <div className="p-2">
                              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                                <input
                                  type="radio"
                                  name="notes_sort"
                                  value=""
                                  checked={!selectedFilters.notes_sort}
                                  onChange={() =>
                                    setSelectedFilters((prev) => ({
                                      ...prev,
                                      notes_sort: null,
                                    }))
                                  }
                                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">
                                  No Sorting
                                </span>
                              </label>

                              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                                <input
                                  type="radio"
                                  name="notes_sort"
                                  value="latest"
                                  checked={
                                    selectedFilters.notes_sort === "latest"
                                  }
                                  onChange={() =>
                                    setSelectedFilters((prev) => ({
                                      ...prev,
                                      notes_sort: "latest",
                                    }))
                                  }
                                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">
                                  Latest Notes First
                                </span>
                              </label>

                              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                                <input
                                  type="radio"
                                  name="notes_sort"
                                  value="oldest"
                                  checked={
                                    selectedFilters.notes_sort === "oldest"
                                  }
                                  onChange={() =>
                                    setSelectedFilters((prev) => ({
                                      ...prev,
                                      notes_sort: "oldest",
                                    }))
                                  }
                                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">
                                  Oldest Notes First
                                </span>
                              </label>
                            </div>

                            {/* Clear button */}
                            {selectedFilters.notes_sort && (
                              <div className="p-2 border-t border-gray-100">
                                <button
                                  onClick={() =>
                                    setSelectedFilters((prev) => ({
                                      ...prev,
                                      notes_sort: null,
                                    }))
                                  }
                                  className="w-full px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                >
                                  Clear Sorting
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setForecastMonthDropdownOpen(
                              !forecastMonthDropdownOpen
                            );
                            setForecastMonthSearchTerm("");
                          }}
                          className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
                            selectedFilters.forecast_month?.length > 0
                              ? "text-indigo-600 font-semibold"
                              : ""
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            {selectedFilters.forecast_month?.length > 0 && (
                              <Filter size={14} />
                            )}
                            Forecast Month
                          </span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              forecastMonthDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                          {selectedFilters.forecast_month?.length > 0 && (
                            <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                              {selectedFilters.forecast_month.length}
                            </span>
                          )}
                        </button>

                        {forecastMonthDropdownOpen && (
                          <div
                            className="forecast-month-dropdown absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Header with search */}
                            <div className="p-3 border-b border-gray-100">
                              <div className="relative">
                                <Search
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                  size={16}
                                />
                                <input
                                  type="text"
                                  placeholder="Search months..."
                                  value={forecastMonthSearchTerm}
                                  onChange={(e) =>
                                    setForecastMonthSearchTerm(e.target.value)
                                  }
                                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {forecastMonthSearchTerm && (
                                  <button
                                    onClick={() =>
                                      setForecastMonthSearchTerm("")
                                    }
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    <X size={16} />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="p-2 border-b border-gray-100 flex justify-between">
                              <button
                                onClick={() => {
                                  const filteredMonths =
                                    availableFilters.forecast_months.filter(
                                      (month) =>
                                        month
                                          .toLowerCase()
                                          .includes(
                                            forecastMonthSearchTerm.toLowerCase()
                                          )
                                    );
                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    forecast_month: [
                                      ...new Set([
                                        ...(prev.forecast_month || []),
                                        ...filteredMonths,
                                      ]),
                                    ],
                                  }));
                                }}
                                className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                              >
                                Select All{" "}
                                {forecastMonthSearchTerm &&
                                  `(${
                                    availableFilters.forecast_months.filter(
                                      (month) =>
                                        month
                                          .toLowerCase()
                                          .includes(
                                            forecastMonthSearchTerm.toLowerCase()
                                          )
                                    ).length
                                  })`}
                              </button>
                              <button
                                onClick={() =>
                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    forecast_month: [],
                                  }))
                                }
                                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                              >
                                Clear All
                              </button>
                            </div>

                            {/* Months list */}
                            <div className="flex-1 overflow-y-auto">
                              {availableFilters.forecast_months
                                .filter((month) =>
                                  month
                                    .toLowerCase()
                                    .includes(
                                      forecastMonthSearchTerm.toLowerCase()
                                    )
                                )
                                .map((month) => (
                                  <label
                                    key={month}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                                  >
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        checked={(
                                          selectedFilters.forecast_month || []
                                        ).includes(month)}
                                        onChange={(e) =>
                                          handleMultiSelectFilterChange(
                                            "forecast_month",
                                            month,
                                            e.target.checked
                                          )
                                        }
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                                      />
                                      {(
                                        selectedFilters.forecast_month || []
                                      ).includes(month) && (
                                        <Check
                                          size={12}
                                          className="absolute top-0.5 left-0.5 text-white pointer-events-none"
                                        />
                                      )}
                                    </div>
                                    <span className="text-sm text-gray-700 flex-1">
                                      {month}
                                    </span>
                                  </label>
                                ))}

                              {/* No results message */}
                              {forecastMonthSearchTerm &&
                                availableFilters.forecast_months.filter(
                                  (month) =>
                                    month
                                      .toLowerCase()
                                      .includes(
                                        forecastMonthSearchTerm.toLowerCase()
                                      )
                                ).length === 0 && (
                                  <div className="p-4 text-center text-gray-500 text-sm">
                                    No months found matching "
                                    {forecastMonthSearchTerm}"
                                  </div>
                                )}
                            </div>

                            {/* Footer with selection count */}
                            {(selectedFilters.forecast_month?.length || 0) >
                              0 && (
                              <div className="p-2 border-t border-gray-100 bg-gray-50">
                                <span className="text-xs text-gray-600">
                                  {selectedFilters.forecast_month.length} of{" "}
                                  {availableFilters.forecast_months.length}{" "}
                                  months selected
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setAddedQtyDropdownOpen(!addedQtyDropdownOpen);
                          }}
                          className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
                            selectedFilters.added_qty_sort
                              ? "text-indigo-600 font-semibold"
                              : ""
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            {selectedFilters.added_qty_sort && (
                              <Filter size={14} />
                            )}
                            Added Qty
                          </span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              addedQtyDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                          {selectedFilters.added_qty_sort && (
                            <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                              {selectedFilters.added_qty_sort === "asc"
                                ? "↑"
                                : "↓"}
                            </span>
                          )}
                        </button>

                        {addedQtyDropdownOpen && (
                          <div
                            className="added-qty-dropdown absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Header */}
                            <div className="p-3 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-700">
                                Sort by Added Quantity
                              </span>
                            </div>

                            {/* Options */}
                            <div className="p-2">
                              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                                <input
                                  type="radio"
                                  name="added_qty_sort"
                                  value=""
                                  checked={!selectedFilters.added_qty_sort}
                                  onChange={() =>
                                    setSelectedFilters((prev) => ({
                                      ...prev,
                                      added_qty_sort: null,
                                    }))
                                  }
                                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">
                                  No Sorting
                                </span>
                              </label>

                              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                                <input
                                  type="radio"
                                  name="added_qty_sort"
                                  value="asc"
                                  checked={
                                    selectedFilters.added_qty_sort === "asc"
                                  }
                                  onChange={() =>
                                    setSelectedFilters((prev) => ({
                                      ...prev,
                                      added_qty_sort: "asc",
                                    }))
                                  }
                                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-700">
                                    Ascending
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    (Low to High)
                                  </span>
                                  <ArrowUpDown
                                    size={14}
                                    className="text-gray-400 rotate-180"
                                  />
                                </div>
                              </label>

                              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                                <input
                                  type="radio"
                                  name="added_qty_sort"
                                  value="desc"
                                  checked={
                                    selectedFilters.added_qty_sort === "desc"
                                  }
                                  onChange={() =>
                                    setSelectedFilters((prev) => ({
                                      ...prev,
                                      added_qty_sort: "desc",
                                    }))
                                  }
                                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-700">
                                    Descending
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    (High to Low)
                                  </span>
                                  <ArrowUpDown
                                    size={14}
                                    className="text-gray-400"
                                  />
                                </div>
                              </label>
                            </div>

                            {/* Clear button */}
                            {selectedFilters.added_qty_sort && (
                              <div className="p-2 border-t border-gray-100">
                                <button
                                  onClick={() =>
                                    setSelectedFilters((prev) => ({
                                      ...prev,
                                      added_qty_sort: null,
                                    }))
                                  }
                                  className="w-full px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                >
                                  Clear Sorting
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setStatusDropdownOpen(!statusDropdownOpen);
                          }}
                          className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
                            selectedFilters.status?.length > 0
                              ? "text-indigo-600 font-semibold"
                              : ""
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            {selectedFilters.status?.length > 0 && (
                              <Filter size={14} />
                            )}
                            Status
                          </span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              statusDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                          {selectedFilters.status?.length > 0 && (
                            <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                              {selectedFilters.status.length}
                            </span>
                          )}
                        </button>

                        {statusDropdownOpen && (
                          <div
                            className="status-dropdown absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Header */}
                            <div className="p-3 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-700">
                                Filter by Status
                              </span>
                            </div>

                            {/* Action buttons */}
                            <div className="p-2 border-b border-gray-100 flex justify-between">
                              <button
                                onClick={() => {
                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    status: [...availableFilters.statuses],
                                  }));
                                }}
                                className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                              >
                                Select All
                              </button>
                              <button
                                onClick={() =>
                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    status: [],
                                  }))
                                }
                                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                              >
                                Clear All
                              </button>
                            </div>

                            {/* Status list */}
                            <div className="flex-1 overflow-y-auto">
                              {availableFilters.statuses.map((status) => (
                                <label
                                  key={status}
                                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                                >
                                  <div className="relative">
                                    <input
                                      type="checkbox"
                                      checked={(
                                        selectedFilters.status || []
                                      ).includes(status)}
                                      onChange={(e) =>
                                        handleMultiSelectFilterChange(
                                          "status",
                                          status,
                                          e.target.checked
                                        )
                                      }
                                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {(selectedFilters.status || []).includes(
                                      status
                                    ) && (
                                      <Check
                                        size={12}
                                        className="absolute top-0.5 left-0.5 text-white pointer-events-none"
                                      />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 flex-1">
                                    {status === "Reviewed" && (
                                      <CheckCircle
                                        size={16}
                                        className="text-green-500"
                                      />
                                    )}
                                    {status === "Not Reviewed" && (
                                      <AlertCircle
                                        size={16}
                                        className="text-red-500"
                                      />
                                    )}
                                    {status === "Pending" && (
                                      <Clock
                                        size={16}
                                        className="text-yellow-500"
                                      />
                                    )}
                                    <span className="text-sm text-gray-700">
                                      {status}
                                    </span>
                                  </div>
                                </label>
                              ))}
                            </div>

                            {/* Footer with selection count */}
                            {(selectedFilters.status?.length || 0) > 0 && (
                              <div className="p-2 border-t border-gray-100 bg-gray-50">
                                <span className="text-xs text-gray-600">
                                  {selectedFilters.status.length} of{" "}
                                  {availableFilters.statuses.length} statuses
                                  selected
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setLastReviewedDropdownOpen(
                              !lastReviewedDropdownOpen
                            );
                          }}
                          className={`flex items-center gap-2 hover:text-gray-700 transition-colors ${
                            selectedFilters.last_reviewed_sort
                              ? "text-indigo-600 font-semibold"
                              : ""
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            {selectedFilters.last_reviewed_sort && (
                              <Filter size={14} />
                            )}
                            Last Reviewed At
                          </span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              lastReviewedDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                          {selectedFilters.last_reviewed_sort && (
                            <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                              {selectedFilters.last_reviewed_sort === "newest"
                                ? "↓"
                                : "↑"}
                            </span>
                          )}
                        </button>

                        {lastReviewedDropdownOpen && (
                          <div
                            className="last-reviewed-dropdown absolute top-full left-[-40px] mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Header */}
                            <div className="p-3 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-700">
                                Sort by Last Reviewed Date
                              </span>
                            </div>

                            {/* Options */}
                            <div className="p-2">
                              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                                <input
                                  type="radio"
                                  name="last_reviewed_sort"
                                  value=""
                                  checked={!selectedFilters.last_reviewed_sort}
                                  onChange={() =>
                                    setSelectedFilters((prev) => ({
                                      ...prev,
                                      last_reviewed_sort: null,
                                    }))
                                  }
                                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">
                                  No Sorting
                                </span>
                              </label>

                              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                                <input
                                  type="radio"
                                  name="last_reviewed_sort"
                                  value="newest"
                                  checked={
                                    selectedFilters.last_reviewed_sort ===
                                    "newest"
                                  }
                                  onChange={() =>
                                    setSelectedFilters((prev) => ({
                                      ...prev,
                                      last_reviewed_sort: "newest",
                                    }))
                                  }
                                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-700">
                                    Newest First
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    (Recent to Old)
                                  </span>
                                  <ChevronDown
                                    size={14}
                                    className="text-gray-400"
                                  />
                                </div>
                              </label>

                              <label className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded">
                                <input
                                  type="radio"
                                  name="last_reviewed_sort"
                                  value="oldest"
                                  checked={
                                    selectedFilters.last_reviewed_sort ===
                                    "oldest"
                                  }
                                  onChange={() =>
                                    setSelectedFilters((prev) => ({
                                      ...prev,
                                      last_reviewed_sort: "oldest",
                                    }))
                                  }
                                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-700">
                                    Oldest First
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    (Old to Recent)
                                  </span>
                                  <ChevronUp
                                    size={14}
                                    className="text-gray-400"
                                  />
                                </div>
                              </label>
                            </div>

                            {/* Additional filter options */}
                            <div className="border-t border-gray-100 p-2">
                              <div className="text-xs font-medium text-gray-600 mb-2 px-3">
                                Quick Filters
                              </div>

                              <button
                                onClick={() => {
                                  // Filter products reviewed in the last 7 days
                                  const sevenDaysAgo = new Date();
                                  sevenDaysAgo.setDate(
                                    sevenDaysAgo.getDate() - 7
                                  );

                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    last_reviewed_sort: "newest",
                                  }));
                                  // You can add additional logic here to filter by date range if needed
                                }}
                                className="w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
                              >
                                📅 Last 7 days
                              </button>

                              <button
                                onClick={() => {
                                  // Filter products reviewed in the last 30 days
                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    last_reviewed_sort: "newest",
                                  }));
                                }}
                                className="w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
                              >
                                📅 Last 30 days
                              </button>

                              <button
                                onClick={() => {
                                  // Show products never reviewed (no updated_at date)
                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    last_reviewed_sort: "oldest",
                                  }));
                                }}
                                className="w-full text-left px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
                              >
                                ⏰ Never reviewed
                              </button>
                            </div>

                            {/* Clear button */}
                            {selectedFilters.last_reviewed_sort && (
                              <div className="p-2 border-t border-gray-100">
                                <button
                                  onClick={() =>
                                    setSelectedFilters((prev) => ({
                                      ...prev,
                                      last_reviewed_sort: null,
                                    }))
                                  }
                                  className="w-full px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                >
                                  Clear Sorting
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                        Final Qty
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentProducts.map((product, index) => (
                      <tr
                        key={`${product.pid}-${index}`}
                        onClick={() => handleViewDetails(product)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        title="Click to view details"
                      >
                        {" "}
                        {/* New image column */}
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img
                              className="h-16 w-16 rounded-lg object-cover border border-gray-200 shadow-sm"
                              src={productImage}
                              alt={`Product ${product.pid}`}
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div
                              className="h-16 w-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center hidden"
                              style={{ display: "none" }}
                            >
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          </div>
                        </td> */}
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm text-left font-medium text-gray-900"
                          onClick={(e) => e.stopPropagation()} // Prevent row click when clicking checkbox
                        >
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(product.pid)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSelectedProductIds((prev) =>
                                checked
                                  ? [...prev, product.pid]
                                  : prev.filter((id) => id !== product.pid)
                              );
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-left font-medium text-gray-900">
                          <div className="flex items-center">
                            <span className="font-mono">{product.pid}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatAssignedToDisplay(product)}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-900">
                          {formatAssignedToDisplay(product)}
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          onClick={(e) => e.stopPropagation()} // Prevent row click when clicking notes
                        >
                          <div
                            className="flex justify-center cursor-pointer p-2 rounded hover:bg-gray-100"
                            onClick={() => handleOpenNotes(product)}
                            title="Click to manage notes"
                          >
                            {formatNotesDisplay(product)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-900">
                          {product.forecast_month ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {product.forecast_month}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-left font-medium text-gray-900">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {getAddedQty(product).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-900">
                          {formatStatusDisplay(product)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                          {productNotesData[product.pid]?.latestNote?.updated_at
                            ? (() => {
                                const [date, time] = formatDateTime(
                                  productNotesData[product.pid].latestNote
                                    .updated_at
                                ).split(", ");
                                return (
                                  <>
                                    <div>{date}</div>
                                    <div className="text-xs text-gray-500">
                                      {time}
                                    </div>
                                  </>
                                );
                              })()
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-900">
                          {(() => {
                            // Priority: user_added_quantity > calculated from external_factor_percentage > default display
                            if (
                              product.user_added_quantity !== null &&
                              product.user_added_quantity !== undefined
                            ) {
                              return (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {parseInt(
                                    product.user_added_quantity
                                  ).toLocaleString()}
                                </span>
                              );
                            } else if (
                              product.external_factor_percentage !== null &&
                              product.external_factor_percentage !== undefined
                            ) {
                              const calculatedQty = Math.round(
                                product.user_added_quantity *
                                  (1 + product.external_factor_percentage / 100)
                              );
                              return (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {calculatedQty.toLocaleString()}
                                  <span className="ml-1 text-xs bg-blue-200 text-blue-700 px-1 rounded">
                                    {product.external_factor_percentage > 0
                                      ? "+"
                                      : ""}
                                    {product.external_factor_percentage}%
                                  </span>
                                </span>
                              );
                            } else {
                              return (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  {(
                                    product.user_added_quantity || 0
                                  ).toLocaleString()}
                                  <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 rounded">
                                    Default
                                  </span>
                                </span>
                              );
                            }
                          })()}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(product)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors p-2 rounded-lg hover:bg-indigo-50 flex items-center gap-2"
                            title="View Details"
                          >
                            <Eye size={16} />
                            <span className="text-sm font-medium"></span>
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, processedProducts.length)} of{" "}
                {processedProducts.length} products
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded text-sm ${
                        currentPage === pageNum
                          ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 mb-2">
              Filter Guide:
            </h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                • <strong>Multi-select filters:</strong> You can select multiple
                options for Categories, Birthstones, Red Box Items, and VDF
                Status
              </p>
              <p>
                • <strong>Boolean filters:</strong> Choose Yes/No/All for
                options like "Below Min Order", "Need to Review First", etc.
              </p>
              <p>
                • <strong>Special Days:</strong> Select holidays using the
                dropdown with checkboxes
              </p>
              <p>
                • <strong>Notes column:</strong> Click on the notes indicator to
                add or manage notes for each product
              </p>
              <p>
                • <strong>Search:</strong> Search by Product ID or Category name
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal for adding/editing notes */}
      <NotesModal
        selectedProductType={selectedProductType}
        isOpen={notesModal.isOpen}
        onClose={handleCloseNotes}
        productId={notesModal.productId}
        productName={notesModal.productName}
        loadProductNotesData={loadProductNotesData}
        onTaggedUserAdded={(newUser) => {
          // Add new user to available filters if not already present
          setAvailableFilters((prev) => ({
            ...prev,
            tagged_to: prev.tagged_to.includes(newUser)
              ? prev.tagged_to
              : [...prev.tagged_to, newUser].sort(),
          }));
        }}
      />
      {/* Category Download Modal */}
      {categoryDownloadModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Categories to Download
              </h3>
              <button
                onClick={handleCloseCategoryDownload}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {categoryDownloadModal.availableCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No categories available for download</p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={handleSelectAllCategories}
                    className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleDeselectAllCategories}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Deselect All
                  </button>
                </div>

                <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                  {categoryDownloadModal.availableCategories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={categoryDownloadModal.selectedCategories.includes(
                          category
                        )}
                        onChange={(e) =>
                          handleCategorySelectionChange(
                            category,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {categoryDownloadModal.selectedCategories.length} categories
                    selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCloseCategoryDownload}
                      className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDownloadSelectedCategories}
                      disabled={
                        categoryDownloadModal.selectedCategories.length === 0 ||
                        categoryDownloadModal.isDownloading
                      }
                      className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {categoryDownloadModal.isDownloading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <FileDown size={16} />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ProductSelector;
