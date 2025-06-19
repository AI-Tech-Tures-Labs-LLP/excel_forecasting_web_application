import { useState, useEffect } from "react";

const useDashboardData = (selectedTimeframe) => {
  const [stats, setStats] = useState({
    totalAnalysts: 0,
    activeAnalysts: 0,
    totalForecasts: 0,
    pendingTasks: 0,
    completionRate: 0,
    avgPerformance: 0,
    totalProducts: 0,
    categoriesManaged: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [quickMetrics, setQuickMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeframe]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch analysts data
      const analystResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/users/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (analystResponse.ok) {
        const users = await analystResponse.json();
        const analysts = users.filter(
          (user) =>
            user.role?.name === "analyst" ||
            user.role?.name === "senior_analyst"
        );

        // Fetch products data to get workload information
        const productsResponse = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/forecast/query/filter_products/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        let totalProducts = 0;
        let reviewedProducts = 0;
        let categoriesSet = new Set();
        let analystWorkloads = {};

        if (productsResponse.ok) {
          const products = await productsResponse.json();
          totalProducts = products.length;
          reviewedProducts = products.filter(
            (p) => p.status === "reviewed"
          ).length;

          // Get unique categories
          products.forEach((p) => {
            if (p.category) categoriesSet.add(p.category);
          });

          // Calculate individual analyst workloads
          analysts.forEach((analyst) => {
            const analystProducts = products.filter(
              (p) => p.assigned_to === analyst.id
            );
            const analystReviewed = analystProducts.filter(
              (p) => p.status === "reviewed"
            ).length;
            const analystPending = analystProducts.filter(
              (p) => p.status === "not_reviewed"
            ).length;

            analystWorkloads[analyst.id] = {
              total: analystProducts.length,
              reviewed: analystReviewed,
              pending: analystPending,
              completionRate:
                analystProducts.length > 0
                  ? Math.round((analystReviewed / analystProducts.length) * 100)
                  : 0,
            };
          });
        }

        const activeAnalysts = analysts.filter((a) => a.is_active).length;
        const completionRate =
          totalProducts > 0
            ? Math.round((reviewedProducts / totalProducts) * 100)
            : 0;

        // Calculate average performance
        const avgPerformance =
          Object.values(analystWorkloads).length > 0
            ? Math.round(
                Object.values(analystWorkloads).reduce(
                  (sum, w) => sum + w.completionRate,
                  0
                ) / Object.values(analystWorkloads).length
              )
            : 0;

        setStats({
          totalAnalysts: analysts.length,
          activeAnalysts,
          totalForecasts: totalProducts,
          pendingTasks: totalProducts - reviewedProducts,
          completionRate,
          avgPerformance,
          totalProducts,
          categoriesManaged: categoriesSet.size,
        });

        // Generate performance data for chart with proper name handling
        const performanceChart = analysts.slice(0, 5).map((analyst) => {
          const displayName = analyst.username || "Unknown User";

          return {
            name: displayName,
            performance: analystWorkloads[analyst.id]?.completionRate || 0,
            workload: analystWorkloads[analyst.id]?.total || 0,
          };
        });

        setPerformanceData(performanceChart);

        // Fetch recent file uploads
        await fetchRecentUploads();

        // Set quick metrics
        setQuickMetrics({
          avgProductsPerAnalyst: Math.round(
            totalProducts / (analysts.length || 1)
          ),
          topPerformer:
            performanceChart.length > 0
              ? performanceChart.reduce(
                  (prev, current) =>
                    prev.performance > current.performance ? prev : current,
                  performanceChart[0]
                )
              : { name: "N/A", performance: 0 },
          workloadDistribution: analystWorkloads,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentUploads = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/sheet-upload/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const uploads = await response.json();

        // Sort uploads by uploaded_at date and take the last 5
        const sortedUploads = uploads
          .sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))
          .slice(0, 5);

        // Fetch user data to get usernames
        const usersResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/users/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        let userMap = {};
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          userMap = users.reduce((acc, user) => {
            acc[user.id] = user.username || user.email || "Unknown User";
            return acc;
          }, {});
        }

        // Transform uploads data into recent activities format
        const activities = sortedUploads.map((upload, index) => {
          // Calculate time ago
          const uploadDate = new Date(upload.uploaded_at);
          const now = new Date();
          const diffInMinutes = Math.floor((now - uploadDate) / (1000 * 60));

          let timeAgo;
          if (diffInMinutes < 1) {
            timeAgo = "Just now";
          } else if (diffInMinutes < 60) {
            timeAgo = `${diffInMinutes} minute${
              diffInMinutes > 1 ? "s" : ""
            } ago`;
          } else if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
          } else {
            const days = Math.floor(diffInMinutes / 1440);
            timeAgo = `${days} day${days > 1 ? "s" : ""} ago`;
          }

          const fileName = upload.name || "Unknown file";
          const userName = userMap[upload.user] || "Admin";

          // Extract categories info for display
          let categoriesInfo = "";
          try {
            const categories = JSON.parse(upload.categories || "[]");
            if (categories.length > 0) {
              categoriesInfo = categories
                .map((cat) => `${cat.name}${cat.value}`)
                .join(", ");
            }
          } catch (e) {
            categoriesInfo = upload.output_folder || "";
          }

          return {
            id: upload.id || index,
            user: userName,
            action: "uploaded file",
            target: fileName,
            time: timeAgo,
            type: upload.is_processed ? "success" : "info",
            icon: "Upload", // Will be mapped to component later
            fileSize: null,
            status: upload.is_processed ? "processed" : "pending",
            categories: categoriesInfo,
            monthRange:
              upload.month_from && upload.month_to
                ? `${upload.month_from} - ${upload.month_to}`
                : null,
            percentage: upload.percentage,
          };
        });

        setRecentActivities(activities);
      } else {
        setRecentActivities([]);
      }
    } catch (error) {
      console.error("Error fetching recent uploads:", error);
      setRecentActivities([]);
    }
  };

  return {
    stats,
    recentActivities,
    performanceData,
    quickMetrics,
    loading,
    fetchDashboardData,
  };
};

export default useDashboardData;
