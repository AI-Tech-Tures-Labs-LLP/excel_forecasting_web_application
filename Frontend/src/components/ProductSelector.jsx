// ProductSelector.jsx - Main component (refactored)
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, FileDown } from "lucide-react";

// Import sub-components
import ProductTypeHeader from "./ProductSelector/ProductTypeHeader";
import FilterPanel from "./ProductSelector/FilterPanel";
import SearchBar from "./ProductSelector/SearchBar";
import SummaryCards from "./ProductSelector/SummaryCards";
import ProductTable from "./ProductSelector/ProductTable";
import BulkActionModal from "./ProductSelector/BulkActionModal";
import ResultsModal from "./ProductSelector/ResultsModal";
import CategoryDownloadModal from "./ProductSelector/CategoryDownloadModal";
import ProductDetailsView from "./product-details/ProductDetailsView";
import NotesModal from "./NotesModal";

// Redux imports
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
  selectAllProducts,
} from "../redux/productSlice";
import { setCurrentView, addToast, selectCurrentView } from "../redux/uiSlice";
import { selectCurrentSession } from "../redux/forecastSlice";
import axios from "axios";

function ProductSelector() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sheetId } = useParams();
  // Redux state
  const products = useSelector(selectCurrentProducts);
  const loading = useSelector(selectProductsLoading);
  const selectedProductType = useSelector(selectSelectedProductType);
  const currentView = useSelector(selectCurrentView);
  const forecastSession = useSelector(selectCurrentSession);
  const selectedProduct = useSelector(selectSelectedProduct);
  const storeProducts = useSelector(selectStoreProducts);
  const comProducts = useSelector(selectComProducts);
  const omniProducts = useSelector(selectOmniProducts);
  const everyProducts = useSelector(selectAllProducts);
  console;
  // Local state
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    birthstone: [],
    is_red_box_item: [],
    vdf_status: [],
    tagged_to: [],
    is_considered_birthstone: null,
    is_added_quantity_using_macys_soq: null,
    is_below_min_order: null,
    is_over_macys_soq: null,
    is_added_only_to_balance_macys_soq: null,
    is_need_to_review_first: null,
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
    assigned_to: [],
    final_qty_sort: null,
  });

  // Modal states
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lastAppliedResults, setLastAppliedResults] = useState(null);
  const [categoryDownloadModal, setCategoryDownloadModal] = useState({
    isOpen: false,
    selectedCategories: [],
    availableCategories: [],
    isDownloading: false,
  });
  const [notesModal, setNotesModal] = useState({
    isOpen: false,
    productId: null,
    productName: "",
  });

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    birthstones: [],
    is_red_box_items: [],
    vdf_statuses: [],
    forecast_months: [],
    statuses: [],
    tagged_to: [],
  });
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [productNotesData, setProductNotesData] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Initialize data and filters
  useEffect(() => {
    const initializeData = async () => {
      try {
        await loadAvailableFilters();
        // dispatch(
        //   fetchProducts({
        //     productType: selectedProductType,
        //     filters: selectedFilters,
        //     sheetId: sheetId,
        //   })
        // );
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
  }, []);

  // Refetch products when filters change
  useEffect(() => {
    if (!filtersLoading) {
      dispatch(
        fetchProducts({
          productType: selectedProductType,
          filters: selectedFilters,
          sheetId: sheetId,
        })
      );
    }
  }, [dispatch, selectedProductType, selectedFilters, filtersLoading]);

  // Load product notes data when products change
  useEffect(() => {
    if (products.length > 0) {
      loadProductNotesData();
    }
  }, [products]);

  // Load available filters from API
  const loadAvailableFilters = async () => {
    setFiltersLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/query/filter_products/?sheet_id=${sheetId}`
      );
      const data = await response.json();
      console.log("Available filters data:", data);
      // const allProducts = [
      //   ...(data.store_products || []),
      //   ...(data.com_products || []),
      //   ...(data.omni_products || []),
      // ];

      const allProducts = [...data];

      const categories = [
        ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
      ];
      const birthstones = [
        ...new Set(allProducts.map((p) => p.birthstone).filter(Boolean)),
      ];

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

      let taggedToUsers = ["Unassigned"];
      try {
        const notesResponse = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/forecast/forecast-notes/?sheet_id=${sheetId}`
        );
        const notesData = await notesResponse.json();
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

      const redBoxItems = ["Yes", "No"];
      const vdfStatuses = ["Active", "Inactive"];

      setAvailableFilters({
        categories: categories.sort(),
        birthstones: birthstones.sort(),
        tagged_to: taggedToUsers,
        forecast_months: forecastMonths,
        statuses: statuses,
        is_red_box_items: redBoxItems,
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

  // Load comprehensive product notes data
  const loadProductNotesData = async () => {
    try {
      // Create mapping from internal product `id` to external `product_id`
      const productIdMap = {};
      products.forEach((p) => {
        productIdMap[p.id] = p.product_id;
      });

      // Extract unique product_ids for filtering
      const uniqueProductIds = [...new Set(products.map((p) => p.product_id))];

      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/forecast-notes/?sheet_id=${sheetId}`
      );
      const allNotes = await response.json();

      const notes = allNotes.results || allNotes;
      const notesData = {};

      uniqueProductIds.forEach((product_id) => {
        const productNotes = notes.filter((note) => {
          const internalId = note.productdetail;
          const mappedProductId = productIdMap[internalId];
          return mappedProductId === product_id;
        });

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

          notesData[product_id] = {
            notes: sortedNotes,
            latestNote: latestNote,
            assignedTo: latestNote.assigned_to || "Unassigned",
            productAssignedTo: latestNote.product_assigned_to || "Unassigned",
            status: status,
            count: productNotes.length,
            hasUnreviewed: hasUnreviewed,
          };
        } else {
          notesData[product_id] = {
            notes: [],
            latestNote: null,
            assignedTo: "Unassigned",
            status: "not_reviewed",
            count: 0,
            hasUnreviewed: false,
          };
        }
      });

      console.log("Product notes data loaded:", notesData);
      setProductNotesData(notesData);
    } catch (error) {
      console.error("Error loading product notes data:", error);
    }
  };

  const getFinalQty = (product) => {
    if (
      product.user_updated_final_quantity !== null &&
      product.user_updated_final_quantity !== undefined
    ) {
      return parseInt(product.user_updated_final_quantity);
    } else if (
      product.external_factor_percentage !== null &&
      product.external_factor_percentage !== undefined
    ) {
      const baseQty =
        product.user_updated_final_quantity != null &&
        product.user_updated_final_quantity !== 0
          ? product.user_updated_final_quantity
          : product.recommended_total_quantity || 0;

      return Math.round(
        baseQty * (1 + product.external_factor_percentage / 100)
      );
    } else {
      return product.recommended_total_quantity || 0;
    }
  };

  // Memoized filtered and sorted products
  // const processedProducts = useMemo(() => {
  //   let filteredProducts = [...products];

  //   // Apply search filter
  //   if (searchQuery) {
  //     filteredProducts = filteredProducts.filter(
  //       (product) =>
  //         product.product_id
  //           ?.toLowerCase()
  //           .includes(searchQuery.toLowerCase()) ||
  //         product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   }

  //   // Apply tagged_to filter
  //   if (selectedFilters.tagged_to && selectedFilters.tagged_to.length > 0) {
  //     filteredProducts = filteredProducts.filter((product) => {
  //       const assignedTo =
  //         productNotesData[product.product_id]?.assignedTo || "Unassigned";
  //       return selectedFilters.tagged_to.includes(assignedTo);
  //     });
  //   }

  //   // Apply forecast_month filter
  //   if (
  //     selectedFilters.forecast_month &&
  //     selectedFilters.forecast_month.length > 0
  //   ) {
  //     const monthMap = {
  //       JANUARY: "JAN",
  //       FEBRUARY: "FEB",
  //       MARCH: "MAR",
  //       APRIL: "APR",
  //       MAY: "MAY",
  //       JUNE: "JUN",
  //       JULY: "JUL",
  //       AUGUST: "AUG",
  //       SEPTEMBER: "SEP",
  //       OCTOBER: "OCT",
  //       NOVEMBER: "NOV",
  //       DECEMBER: "DEC",
  //     };

  //     const selectedShortMonths = selectedFilters.forecast_month.map(
  //       (m) => monthMap[m.toUpperCase()]
  //     );

  //     filteredProducts = filteredProducts.filter((product) =>
  //       selectedShortMonths.includes(product.forecast_month)
  //     );
  //   }

  //   // Apply status filter
  //   if (selectedFilters.status && selectedFilters.status.length > 0) {
  //     filteredProducts = filteredProducts.filter((product) => {
  //       const note = productNotesData[product.product_id]?.latestNote;
  //       const status = note?.status;

  //       let productStatus = "Not Reviewed";
  //       if (status === "reviewed") {
  //         productStatus = "Reviewed";
  //       } else if (status === "pending") {
  //         productStatus = "Pending";
  //       } else if (status === "not_reviewed") {
  //         productStatus = "Not Reviewed";
  //       }

  //       return selectedFilters.status.includes(productStatus);
  //     });
  //   }

  //   // Apply sorting
  //   if (selectedFilters.notes_sort) {
  //     filteredProducts.sort((a, b) => {
  //       const aNotesData = productNotesData[a.product_id];
  //       const bNotesData = productNotesData[b.product_id];

  //       const aDate = aNotesData?.latestNote?.created_at
  //         ? new Date(aNotesData.latestNote.created_at)
  //         : new Date(0);
  //       const bDate = bNotesData?.latestNote?.created_at
  //         ? new Date(bNotesData.latestNote.created_at)
  //         : new Date(0);

  //       if (selectedFilters.notes_sort === "latest") {
  //         return bDate - aDate;
  //       } else {
  //         return aDate - bDate;
  //       }
  //     });
  //   }

  //   if (selectedFilters.added_qty_sort) {
  //     filteredProducts.sort((a, b) => {
  //       const aQty = a.recommended_total_quantity || 0;
  //       const bQty = b.recommended_total_quantity || 0;

  //       if (selectedFilters.added_qty_sort === "asc") {
  //         return aQty - bQty;
  //       } else {
  //         return bQty - aQty;
  //       }
  //     });
  //   }

  //   if (selectedFilters.last_reviewed_sort) {
  //     filteredProducts.sort((a, b) => {
  //       const aNotesData = productNotesData[a.product_id];
  //       const bNotesData = productNotesData[b.product_id];

  //       const aDate = aNotesData?.latestNote?.updated_at
  //         ? new Date(aNotesData.latestNote.updated_at)
  //         : new Date(0);
  //       const bDate = bNotesData?.latestNote?.updated_at
  //         ? new Date(bNotesData.latestNote.updated_at)
  //         : new Date(0);

  //       if (selectedFilters.last_reviewed_sort === "newest") {
  //         return bDate - aDate;
  //       } else {
  //         return aDate - bDate;
  //       }
  //     });
  //   }

  //   return filteredProducts;
  // }, [
  //   products,
  //   searchQuery,
  //   selectedFilters.tagged_to,
  //   selectedFilters.forecast_month,
  //   selectedFilters.notes_sort,
  //   selectedFilters.added_qty_sort,
  //   selectedFilters.status,
  //   selectedFilters.last_reviewed_sort,
  //   productNotesData,
  // ]);

  // In ProductSelector.jsx, replace the processedProducts useMemo with this updated version:

  const processedProducts = useMemo(() => {
    let filteredProducts = [...products];

    // Apply search filter
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.product_id
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply assigned_to filter - UPDATED LOGIC
    if (selectedFilters.assigned_to && selectedFilters.assigned_to.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        // Check if product has direct assigned_to property
        if (product.assigned_to) {
          // Handle case where assigned_to is a user ID (number)
          if (typeof product.assigned_to === "number") {
            return selectedFilters.assigned_to.includes(product.assigned_to);
          }
          // Handle other assigned_to formats if needed
          if (
            typeof product.assigned_to === "string" ||
            typeof product.assigned_to === "object"
          ) {
            return selectedFilters.assigned_to.includes(product.assigned_to);
          }
        }

        // Fallback to productNotesData for assignment info
        const assignedTo =
          productNotesData[product.product_id]?.assignedTo || "Unassigned";

        // Handle "unassigned" filter selection
        if (selectedFilters.assigned_to.includes("unassigned")) {
          if (assignedTo === "Unassigned" || !product.assigned_to) {
            return true;
          }
        }

        // Handle user ID selections
        const userIdSelections = selectedFilters.assigned_to.filter(
          (id) => typeof id === "number"
        );
        if (userIdSelections.length > 0 && product.assigned_to) {
          return userIdSelections.includes(product.assigned_to);
        }

        // Handle username/string selections
        const usernameSelections = selectedFilters.assigned_to.filter(
          (id) => typeof id === "string" && id !== "unassigned"
        );
        if (usernameSelections.length > 0) {
          return usernameSelections.includes(assignedTo);
        }

        return false;
      });
    }

    // Apply tagged_to filter (keeping existing logic for compatibility)
    if (selectedFilters.tagged_to && selectedFilters.tagged_to.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const assignedTo =
          productNotesData[product.product_id]?.assignedTo || "Unassigned";
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
        const note = productNotesData[product.product_id]?.latestNote;
        const status = note?.status;

        let productStatus = "Not Reviewed";
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

    // Apply sorting
    if (selectedFilters.notes_sort) {
      filteredProducts.sort((a, b) => {
        const aNotesData = productNotesData[a.product_id];
        const bNotesData = productNotesData[b.product_id];

        const aDate = aNotesData?.latestNote?.created_at
          ? new Date(aNotesData.latestNote.created_at)
          : new Date(0);
        const bDate = bNotesData?.latestNote?.created_at
          ? new Date(bNotesData.latestNote.created_at)
          : new Date(0);

        if (selectedFilters.notes_sort === "latest") {
          return bDate - aDate;
        } else {
          return aDate - bDate;
        }
      });
    }

    if (selectedFilters.added_qty_sort) {
      filteredProducts.sort((a, b) => {
        const aQty = a.recommended_total_quantity || 0;
        const bQty = b.recommended_total_quantity || 0;

        if (selectedFilters.added_qty_sort === "asc") {
          return aQty - bQty;
        } else {
          return bQty - aQty;
        }
      });
    }

    if (selectedFilters.final_qty_sort) {
      filteredProducts.sort((a, b) => {
        const aQty = getFinalQty(a);
        const bQty = getFinalQty(b);

        if (selectedFilters.final_qty_sort === "asc") {
          return aQty - bQty;
        } else {
          return bQty - aQty;
        }
      });
    }

    if (selectedFilters.last_reviewed_sort) {
      filteredProducts.sort((a, b) => {
        const aNotesData = productNotesData[a.product_id];
        const bNotesData = productNotesData[b.product_id];

        const aDate = aNotesData?.latestNote?.updated_at
          ? new Date(aNotesData.latestNote.updated_at)
          : new Date(0);
        const bDate = bNotesData?.latestNote?.updated_at
          ? new Date(bNotesData.latestNote.updated_at)
          : new Date(0);

        if (selectedFilters.last_reviewed_sort === "newest") {
          return bDate - aDate;
        } else {
          return aDate - bDate;
        }
      });
    }

    return filteredProducts;
  }, [
    products,
    searchQuery,
    selectedFilters.assigned_to, // Add this dependency
    selectedFilters.tagged_to,
    selectedFilters.forecast_month,
    selectedFilters.notes_sort,
    selectedFilters.added_qty_sort,
    selectedFilters.status,
    selectedFilters.last_reviewed_sort,
    selectedFilters.final_qty_sort,
    productNotesData,
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = processedProducts.slice(startIndex, endIndex);

  // Event handlers
  const handleProductTypeChange = (productType) => {
    dispatch(setSelectedProductType(productType));
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    loadAvailableFilters();
    dispatch(
      fetchProducts({
        productType: selectedProductType,
        filters: selectedFilters,
        sheetId: sheetId,
      })
    );
  };

  const handleDownloadFinalQuantityReport = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/final-quantity-report/?sheet_id=${sheetId}`,
        { responseType: "blob" }
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

  const handleOpenCategoryDownload = () => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      isOpen: true,
      selectedCategories: [],
    }));
  };

  const handleBackToSelector = () => {
    dispatch(clearSelectedProduct());
    dispatch(setCurrentView("selector"));
  };

  const handleOpenNotes = (product) => {
    setNotesModal({
      isOpen: true,
      productId: product.product_id,
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

  // Show details view if in details mode
  // if (currentView === "details") {
  //   const handleNavigateToProduct = (productId) => {
  //     const allProducts = [...storeProducts, ...comProducts, ...omniProducts];
  //     const targetProduct = allProducts.find((p) => p.product_id === productId);
  //     if (targetProduct) {
  //       dispatch(setSelectedProduct(targetProduct));
  //     }
  //   };

  //   return (
  //     <ProductDetailsView
  //       productId={selectedProduct?.product_id}
  //       onBack={handleBackToSelector}
  //       onNavigateToProduct={handleNavigateToProduct}
  //     />
  //   );
  // }

  const handleDownloadSummary = async () => {
    try {
      // Show loading state (optional)
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/forecast/export-summary/?sheet_id=${sheetId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if the response contains a download_url
      if (data.download_url) {
        // Create a temporary anchor element to trigger download
        const link = document.createElement("a");
        link.href = data.download_url;
        link.download = "forecast_summary.xlsx"; // Set the filename
        link.target = "_blank"; // Open in new tab as fallback

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Optional: Show success toast
        dispatch(
          addToast({
            type: "success",
            message: "Download started successfully",
            duration: 3000,
          })
        );
      } else {
        throw new Error("No download URL provided in response");
      }
    } catch (error) {
      console.error("Download failed:", error);

      // Show error toast
      dispatch(
        addToast({
          type: "error",
          message: "Failed to download summary. Please try again.",
          duration: 5000,
        })
      );
    }
  };

  console.log("productnotedata", productNotesData);
  return (
    <>
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

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadSummary}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 border border-white/20"
              >
                <FileDown size={18} />
                <span className="hidden sm:inline">Download Summary</span>
                <span className="sm:hidden">Download</span>
              </button>

              <button
                onClick={handleOpenCategoryDownload}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 border border-white/20"
              >
                <FileDown size={18} />
                <span className="hidden sm:inline">Download Categories</span>
                <span className="sm:hidden">Download</span>
              </button>

              <button
                onClick={handleDownloadFinalQuantityReport}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 border border-white/20"
              >
                <FileDown size={18} />
                <span className="hidden sm:inline">
                  Download Final Quantity Report
                </span>
                <span className="sm:hidden">Download</span>
              </button>

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
                      {forecastSession.categories
                        ?.map((cat) => `${cat.name} (${cat.value})`)
                        .join(", ")}
                    </p>
                    <p>
                      <strong>Period:</strong> {forecastSession.month_from} to{" "}
                      {forecastSession.month_to} ({forecastSession.percentage}
                      %)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Type Header */}
          <ProductTypeHeader
            selectedProductType={selectedProductType}
            onProductTypeChange={handleProductTypeChange}
            storeProducts={storeProducts}
            comProducts={comProducts}
            omniProducts={omniProducts}
          />

          {/* Filter Panel */}
          <FilterPanel
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            availableFilters={availableFilters}
            filtersLoading={filtersLoading}
            selectedProductType={selectedProductType}
            onClearFilters={() => {
              setSelectedFilters({
                category: [],
                birthstone: [],
                is_red_box_item: [],
                vdf_status: [],
                tagged_to: [],
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
                final_qty_sort: null, // Add this line
                status: [],
                last_reviewed_sort: null,
                forecast_month: [],
                assigned_to: [],
              });
              setSearchQuery("");
              setCurrentPage(1);
            }}
          />

          {/* Summary Cards */}
          <SummaryCards
            totalProducts={processedProducts.length}
            productNotesData={productNotesData}
          />

          {/* Search and Products Display */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {selectedProductType === "store" && "Store Products"}
                {selectedProductType === "com" && "COM Products"}
                {selectedProductType === "omni" && "Omni Products"}
              </h3>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearch={setSearchQuery}
                  onProductSelect={(product) => {
                    dispatch(setSelectedProduct(product));
                    dispatch(setCurrentView("details"));
                  }}
                  processedProducts={processedProducts}
                  productNotesData={productNotesData}
                />

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  {/* <button
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
                  </button> */}

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

            {/* Product Table */}
            <ProductTable
              loading={loading}
              currentProducts={currentProducts}
              productNotesData={productNotesData}
              selectedProductIds={selectedProductIds}
              setSelectedProductIds={setSelectedProductIds}
              processedProducts={processedProducts}
              onViewDetails={(product) => {
                // dispatch(setSelectedProduct(product));
                // dispatch(setCurrentView("details"));
                navigate(`/products/${product.sheet}/${product.product_id}`);
              }}
              onOpenNotes={handleOpenNotes}
              searchQuery={searchQuery}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              availableFilters={availableFilters}
              setCurrentPage={setCurrentPage}
            />
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

      {/* Modals */}
      <BulkActionModal
        showModal={showBulkModal}
        setShowModal={setShowBulkModal}
        selectedProductIds={selectedProductIds}
        processedProducts={processedProducts}
        onSuccess={(results) => {
          setLastAppliedResults(results);
          setShowResults(true);
          loadProductNotesData();
          dispatch(
            fetchProducts({
              productType: selectedProductType,
              filters: selectedFilters,
              sheetId: sheetId,
            })
          );
        }}
      />

      <ResultsModal
        showResults={showResults}
        setShowResults={setShowResults}
        lastAppliedResults={lastAppliedResults}
      />

      <CategoryDownloadModal
        categoryDownloadModal={categoryDownloadModal}
        setCategoryDownloadModal={setCategoryDownloadModal}
        onToast={(message) => dispatch(addToast(message))}
      />

      <NotesModal
        selectedProductType={selectedProductType}
        isOpen={notesModal.isOpen}
        onClose={handleCloseNotes}
        productDetailId={notesModal.id}
        productId={notesModal.productId}
        productName={notesModal.productName}
        loadProductNotesData={loadProductNotesData}
        onTaggedUserAdded={(newUser) => {
          setAvailableFilters((prev) => ({
            ...prev,
            tagged_to: prev.tagged_to.includes(newUser)
              ? prev.tagged_to
              : [...prev.tagged_to, newUser].sort(),
          }));
        }}
      />
    </>
  );
}

export default ProductSelector;
