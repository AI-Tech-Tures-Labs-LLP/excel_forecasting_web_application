// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Users,
//   UserPlus,
//   Edit3,
//   Trash2,
//   Search,
//   Filter,
//   Eye,
//   Settings,
//   Save,
//   X,
//   AlertCircle,
//   CheckCircle,
//   Mail,
//   Calendar,
//   Shield,
//   Tag,
//   Activity,
//   TrendingUp,
//   FileText,
//   Clock,
//   BarChart3,
//   Download,
//   Upload,
//   RefreshCw,
//   User,
//   Phone,
//   MapPin,
//   Briefcase,
//   Award,
//   AlertTriangle,
//   Ban,
//   Unlock,
//   Key,
//   Target,
//   Zap,
//   Package,
//   Database,
// } from "lucide-react";

// const AnalystManagement = () => {
//   const navigate = useNavigate();
//   const [analysts, setAnalysts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedAnalyst, setSelectedAnalyst] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState("view");
//   const [toast, setToast] = useState({ show: false, message: "", type: "" });
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [selectedAnalysts, setSelectedAnalysts] = useState([]);
//   const [workloadData, setWorkloadData] = useState({});
//   const [categoryAssignments, setCategoryAssignments] = useState({});
//   const [refreshing, setRefreshing] = useState(false);

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     department: "",
//     assigned_categories: [],
//     is_active: true,
//     role: "analyst",
//     permissions: [],
//   });

//   const availableCategories = [
//     "Bridge Gem742",
//     "Gold262&270",
//     "Womens Silver260&404",
//     "Precious",
//     "Fine Pearl",
//     "Semi",
//     "Diamond",
//     "Bridal",
//     "Men's",
//   ];

//   const availableDepartments = [
//     "Sales Forecasting",
//     "Market Analysis",
//     "Product Analytics",
//     "Trend Analysis",
//   ];

//   useEffect(() => {
//     fetchAnalysts();
//   }, []);

//   const fetchAnalysts = async () => {
//     setLoading(true);
//     try {
//       // Fetch users
//       const response = await fetch(
//         `${import.meta.env.VITE_API_BASE_URL}/auth/users/`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch analysts");
//       }

//       const data = await response.json();
//       console.log("Fetched users:", data);

//       // Filter to only show analysts
//       const analystUsers = data.filter(
//         (user) =>
//           user.role?.name === "analyst" || user.role?.name === "senior_analyst"
//       );

//       console.log("Filtered analysts:", analystUsers);

//       // Fetch workload data for each analyst
//       await fetchWorkloadData(analystUsers);

//       setAnalysts(analystUsers);
//     } catch (error) {
//       console.error("Error fetching analysts:", error);
//       showToast("Failed to load analysts", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchWorkloadData = async (analysts) => {
//     const workloadPromises = analysts.map(async (analyst) => {
//       try {
//         // Fetch products assigned to this analyst
//         const response = await fetch(
//           `${
//             import.meta.env.VITE_API_BASE_URL
//           }/forecast/query/filter_products/?assigned_to=${analyst.id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (response.ok) {
//           const products = await response.json();

//           // Calculate workload metrics
//           const totalProducts = products.length;
//           const reviewedProducts = products.filter(
//             (p) => p.status === "reviewed"
//           ).length;
//           const pendingProducts = products.filter(
//             (p) => p.status === "not_reviewed"
//           ).length;

//           // Get unique categories
//           const categories = [
//             ...new Set(products.map((p) => p.category).filter(Boolean)),
//           ];

//           // Calculate completion rate
//           const completionRate =
//             totalProducts > 0
//               ? Math.round((reviewedProducts / totalProducts) * 100)
//               : 0;

//           return {
//             analystId: analyst.id,
//             totalProducts,
//             reviewedProducts,
//             pendingProducts,
//             categories,
//             completionRate,
//             avgAccuracy: Math.floor(Math.random() * 15) + 85, // Mock data
//             currentProjects: categories.length,
//           };
//         }
//         return null;
//       } catch (error) {
//         console.error(
//           `Error fetching workload for analyst ${analyst.id}:`,
//           error
//         );
//         return null;
//       }
//     });

//     const workloadResults = await Promise.all(workloadPromises);
//     const workloadMap = {};

//     workloadResults.forEach((result, index) => {
//       if (result) {
//         workloadMap[analysts[index].id] = result;
//       }
//     });

//     setWorkloadData(workloadMap);
//   };

//   const fetchAnalystCategories = async (analystId) => {
//     try {
//       // Fetch all products to see which categories this analyst is assigned to
//       const response = await fetch(
//         `${import.meta.env.VITE_API_BASE_URL}/forecast/query/filter_products/`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.ok) {
//         const allProducts = await response.json();
//         const analystProducts = allProducts.filter(
//           (p) => p.assigned_to === analystId
//         );
//         const categories = [
//           ...new Set(analystProducts.map((p) => p.category).filter(Boolean)),
//         ];

//         setCategoryAssignments((prev) => ({
//           ...prev,
//           [analystId]: categories,
//         }));

//         return categories;
//       }
//     } catch (error) {
//       console.error("Error fetching analyst categories:", error);
//     }
//     return [];
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchAnalysts();
//     setRefreshing(false);
//   };

//   const showToast = (message, type) => {
//     setToast({ show: true, message, type });
//     setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
//   };

//   const handleCreateAnalyst = () => {
//     setModalMode("create");
//     setFormData({
//       username: "",
//       email: "",
//       phone: "",
//       department: "",
//       assigned_categories: [],
//       is_active: true,
//       role: "analyst",
//       permissions: [],
//     });
//     setShowModal(true);
//   };

//   const handleEditAnalyst = async (analyst) => {
//     setSelectedAnalyst(analyst);
//     setModalMode("edit");

//     // Fetch current category assignments
//     const categories = await fetchAnalystCategories(analyst.id);

//     setFormData({
//       username: analyst.username,
//       email: analyst.email,
//       phone: analyst.phone || "",
//       department: analyst.department || "",
//       assigned_categories: categories,
//       is_active: analyst.is_active,
//       role: analyst.role?.name || "analyst",
//       permissions: analyst.permissions || [],
//     });
//     setShowModal(true);
//   };

//   const handleViewAnalyst = async (analyst) => {
//     setSelectedAnalyst(analyst);
//     setModalMode("view");

//     // Fetch category assignments and workload data
//     await fetchAnalystCategories(analyst.id);

//     setShowModal(true);
//   };

//   const handleDeleteAnalyst = async (analystId) => {
//     if (
//       window.confirm(
//         "Are you sure you want to delete this analyst? This action cannot be undone."
//       )
//     ) {
//       try {
//         const response = await fetch(
//           `${import.meta.env.VITE_API_BASE_URL}/auth/users/${analystId}/`,
//           {
//             method: "DELETE",
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to delete analyst");
//         }

//         setAnalysts((prev) => prev.filter((a) => a.id !== analystId));
//         showToast("Analyst deleted successfully", "success");
//       } catch (error) {
//         console.error("Error deleting analyst:", error);
//         showToast("Failed to delete analyst", "error");
//       }
//     }
//   };

//   const handleToggleStatus = async (analystId) => {
//     try {
//       const analyst = analysts.find((a) => a.id === analystId);
//       const newStatus = !analyst.is_active;

//       const response = await fetch(
//         `${import.meta.env.VITE_API_BASE_URL}/auth/users/${analystId}/`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             is_active: newStatus,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update status");
//       }

//       setAnalysts((prev) =>
//         prev.map((a) =>
//           a.id === analystId ? { ...a, is_active: newStatus } : a
//         )
//       );
//       showToast("Status updated successfully", "success");
//     } catch (error) {
//       console.error("Error updating status:", error);
//       showToast("Failed to update status", "error");
//     }
//   };

//   const handleSaveAnalyst = async () => {
//     try {
//       if (modalMode === "create") {
//         const response = await fetch(
//           `${import.meta.env.VITE_API_BASE_URL}/auth/register/`,
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               ...formData,
//               password: "TempPassword123!",
//               role: formData.role,
//             }),
//           }
//         );

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || "Failed to create analyst");
//         }

//         showToast("Analyst created successfully", "success");
//         await fetchAnalysts();
//       } else if (modalMode === "edit") {
//         const response = await fetch(
//           `${import.meta.env.VITE_API_BASE_URL}/auth/users/${
//             selectedAnalyst.id
//           }/`,
//           {
//             method: "PATCH",
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(formData),
//           }
//         );

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || "Failed to update analyst");
//         }

//         showToast("Analyst updated successfully", "success");
//         await fetchAnalysts();
//       }
//       setShowModal(false);
//     } catch (error) {
//       console.error("Error saving analyst:", error);
//       showToast(error.message, "error");
//     }
//   };

//   const handleBulkAction = async (action) => {
//     if (selectedAnalysts.length === 0) {
//       showToast("Please select analysts first", "error");
//       return;
//     }

//     try {
//       const promises = selectedAnalysts.map((analystId) => {
//         switch (action) {
//           case "activate":
//             return fetch(
//               `${import.meta.env.VITE_API_BASE_URL}/auth/users/${analystId}/`,
//               {
//                 method: "PATCH",
//                 headers: {
//                   Authorization: `Bearer ${localStorage.getItem(
//                     "access_token"
//                   )}`,
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ is_active: true }),
//               }
//             );
//           case "deactivate":
//             return fetch(
//               `${import.meta.env.VITE_API_BASE_URL}/auth/users/${analystId}/`,
//               {
//                 method: "PATCH",
//                 headers: {
//                   Authorization: `Bearer ${localStorage.getItem(
//                     "access_token"
//                   )}`,
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ is_active: false }),
//               }
//             );
//           case "delete":
//             return fetch(
//               `${import.meta.env.VITE_API_BASE_URL}/auth/users/${analystId}/`,
//               {
//                 method: "DELETE",
//                 headers: {
//                   Authorization: `Bearer ${localStorage.getItem(
//                     "access_token"
//                   )}`,
//                   "Content-Type": "application/json",
//                 },
//               }
//             );
//           default:
//             return Promise.resolve();
//         }
//       });

//       if (action === "delete") {
//         if (
//           !window.confirm(
//             `Are you sure you want to delete ${selectedAnalysts.length} analysts?`
//           )
//         ) {
//           return;
//         }
//       }

//       await Promise.all(promises);

//       showToast(
//         `${selectedAnalysts.length} analysts ${action}d successfully`,
//         "success"
//       );
//       setSelectedAnalysts([]);
//       await fetchAnalysts();
//     } catch (error) {
//       console.error("Bulk action failed:", error);
//       showToast("Bulk action failed", "error");
//     }
//   };

//   const filteredAnalysts = analysts.filter((analyst) => {
//     const matchesSearch =
//       analyst.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       analyst.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       analyst.department?.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesFilter =
//       activeFilter === "all" ||
//       (activeFilter === "active" && analyst.is_active) ||
//       (activeFilter === "inactive" && !analyst.is_active) ||
//       (activeFilter === "senior" && analyst.role?.name === "senior_analyst");

//     return matchesSearch && matchesFilter;
//   });

//   const getStatusColor = (analyst) => {
//     return analyst.is_active
//       ? "bg-green-100 text-green-800 border-green-200"
//       : "bg-red-100 text-red-800 border-red-200";
//   };

//   const getRoleColor = (analyst) => {
//     const role = analyst.role?.name || "analyst";
//     return role === "senior_analyst"
//       ? "bg-purple-100 text-purple-800 border-purple-200"
//       : "bg-blue-100 text-blue-800 border-blue-200";
//   };

//   const getPerformanceColor = (score) => {
//     if (score >= 95) return "text-green-600";
//     if (score >= 90) return "text-blue-600";
//     if (score >= 85) return "text-orange-600";
//     return "text-red-600";
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Never";
//     try {
//       return new Date(dateString).toLocaleDateString();
//     } catch {
//       return "Invalid Date";
//     }
//   };

//   const renderAnalystModal = () => {
//     if (!showModal) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//           {/* Modal Header */}
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-white bg-opacity-20 rounded-lg">
//                   {modalMode === "create" && <UserPlus size={24} />}
//                   {modalMode === "edit" && <Edit3 size={24} />}
//                   {modalMode === "view" && <Eye size={24} />}
//                 </div>
//                 <h2 className="text-xl font-bold">
//                   {modalMode === "create" && "Create New Analyst"}
//                   {modalMode === "edit" && "Edit Analyst"}
//                   {modalMode === "view" && "Analyst Details"}
//                 </h2>
//               </div>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           </div>

//           <div className="p-6">
//             {modalMode === "view" ? (
//               /* View Mode */
//               <div className="space-y-6">
//                 {/* Basic Information */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                       <User size={16} />
//                       Basic Information
//                     </h3>
//                     <div className="space-y-2">
//                       <div>
//                         <span className="text-sm text-gray-600">Name:</span>
//                         <p className="font-medium">
//                           {selectedAnalyst?.username}
//                         </p>
//                       </div>
//                       <div>
//                         <span className="text-sm text-gray-600">Username:</span>
//                         <p className="font-medium">
//                           {selectedAnalyst?.username}
//                         </p>
//                       </div>
//                       <div>
//                         <span className="text-sm text-gray-600">Email:</span>
//                         <p className="font-medium">{selectedAnalyst?.email}</p>
//                       </div>
//                       <div>
//                         <span className="text-sm text-gray-600">Phone:</span>
//                         <p className="font-medium">
//                           {selectedAnalyst?.phone || "Not provided"}
//                         </p>
//                       </div>
//                       <div>
//                         <span className="text-sm text-gray-600">
//                           Department:
//                         </span>
//                         <p className="font-medium">
//                           {selectedAnalyst?.department || "Not assigned"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                       <Activity size={16} />
//                       Status & Performance
//                     </h3>
//                     <div className="space-y-2">
//                       <div>
//                         <span className="text-sm text-gray-600">Status:</span>
//                         <span
//                           className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
//                             selectedAnalyst
//                           )}`}
//                         >
//                           {selectedAnalyst?.is_active ? "Active" : "Inactive"}
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-sm text-gray-600">Role:</span>
//                         <span
//                           className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(
//                             selectedAnalyst
//                           )}`}
//                         >
//                           {(selectedAnalyst?.role?.name || "analyst").replace(
//                             "_",
//                             " "
//                           )}
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-sm text-gray-600">
//                           Join Date:
//                         </span>
//                         <p className="font-medium">
//                           {formatDate(selectedAnalyst?.date_joined)}
//                         </p>
//                       </div>
//                       <div>
//                         <span className="text-sm text-gray-600">
//                           Last Login:
//                         </span>
//                         <p className="font-medium">
//                           {formatDate(selectedAnalyst?.last_login)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Assigned Categories */}
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                     <Tag size={16} />
//                     Assigned Categories
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {categoryAssignments[selectedAnalyst?.id]?.map(
//                       (category) => (
//                         <span
//                           key={category}
//                           className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
//                         >
//                           {category}
//                         </span>
//                       )
//                     ) || (
//                       <span className="text-gray-500 text-sm">
//                         No categories assigned
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Workload Information */}
//                 {workloadData[selectedAnalyst?.id] && (
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                       <Briefcase size={16} />
//                       Current Workload
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       <div className="text-center">
//                         <div className="text-2xl font-bold text-blue-600">
//                           {workloadData[selectedAnalyst.id].totalProducts}
//                         </div>
//                         <div className="text-sm text-gray-600">
//                           Total Products
//                         </div>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-2xl font-bold text-green-600">
//                           {workloadData[selectedAnalyst.id].reviewedProducts}
//                         </div>
//                         <div className="text-sm text-gray-600">Reviewed</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-2xl font-bold text-orange-600">
//                           {workloadData[selectedAnalyst.id].pendingProducts}
//                         </div>
//                         <div className="text-sm text-gray-600">Pending</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-2xl font-bold text-purple-600">
//                           {workloadData[selectedAnalyst.id].completionRate}%
//                         </div>
//                         <div className="text-sm text-gray-600">
//                           Completion Rate
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               /* Create/Edit Form */
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Username *
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.username}
//                       onChange={(e) =>
//                         setFormData({ ...formData, username: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                       required
//                       disabled={modalMode === "edit"}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Email *
//                     </label>
//                     <input
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) =>
//                         setFormData({ ...formData, email: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Phone
//                     </label>
//                     <input
//                       type="tel"
//                       value={formData.phone}
//                       onChange={(e) =>
//                         setFormData({ ...formData, phone: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Department
//                     </label>
//                     <select
//                       value={formData.department}
//                       onChange={(e) =>
//                         setFormData({ ...formData, department: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     >
//                       <option value="">Select Department</option>
//                       {availableDepartments.map((dept) => (
//                         <option key={dept} value={dept}>
//                           {dept}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Role
//                     </label>
//                     <select
//                       value={formData.role}
//                       onChange={(e) =>
//                         setFormData({ ...formData, role: e.target.value })
//                       }
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     >
//                       <option value="analyst">Analyst</option>
//                       <option value="senior_analyst">Senior Analyst</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Status
//                     </label>
//                     <select
//                       value={formData.is_active}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           is_active: e.target.value === "true",
//                         })
//                       }
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     >
//                       <option value={true}>Active</option>
//                       <option value={false}>Inactive</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Assigned Categories */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Assigned Categories
//                   </label>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
//                     {availableCategories.map((category) => (
//                       <label
//                         key={category}
//                         className="flex items-center space-x-2"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={formData.assigned_categories.includes(
//                             category
//                           )}
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setFormData({
//                                 ...formData,
//                                 assigned_categories: [
//                                   ...formData.assigned_categories,
//                                   category,
//                                 ],
//                               });
//                             } else {
//                               setFormData({
//                                 ...formData,
//                                 assigned_categories:
//                                   formData.assigned_categories.filter(
//                                     (c) => c !== category
//                                   ),
//                               });
//                             }
//                           }}
//                           className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                         />
//                         <span className="text-sm text-gray-700">
//                           {category}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleSaveAnalyst}
//                     className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
//                   >
//                     <Save size={16} />
//                     {modalMode === "create"
//                       ? "Create Analyst"
//                       : "Update Analyst"}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Toast Notification */}
//       {toast.show && (
//         <div
//           className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
//             toast.type === "success"
//               ? "bg-green-100 text-green-800 border border-green-200"
//               : "bg-red-100 text-red-800 border border-red-200"
//           }`}
//         >
//           <div className="flex items-center gap-2">
//             {toast.type === "success" ? (
//               <CheckCircle size={16} />
//             ) : (
//               <AlertCircle size={16} />
//             )}
//             <span className="text-sm font-medium">{toast.message}</span>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto p-6">
//         {/* Enhanced Header */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
//           <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 rounded-t-xl">
//             <div className="flex justify-between items-start">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-2">
//                   <button
//                     onClick={() => navigate("/dashboard")}
//                     className="text-white opacity-80 hover:opacity-100 flex items-center gap-2 transition-opacity"
//                   >
//                     <ArrowLeft size={16} />
//                     Back to Dashboard
//                   </button>
//                 </div>
//                 <h1 className="text-2xl font-bold text-white">
//                   Analyst Management
//                 </h1>
//                 <p className="text-indigo-100 mt-1">
//                   Monitor and manage analyst performance, workload, and
//                   assignments
//                 </p>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={handleRefresh}
//                   disabled={loading || refreshing}
//                   className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 border border-white/20 disabled:opacity-50"
//                 >
//                   <RefreshCw
//                     size={16}
//                     className={refreshing ? "animate-spin" : ""}
//                   />
//                   Refresh
//                 </button>
//                 <button
//                   onClick={handleCreateAnalyst}
//                   className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 border border-white/20"
//                 >
//                   <UserPlus size={18} />
//                   Add Analyst
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <Users className="text-blue-600" size={24} />
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-gray-900">
//                   {analysts.length}
//                 </div>
//                 <div className="text-sm text-gray-600">Total Analysts</div>
//               </div>
//             </div>
//             <div className="mt-2 text-xs text-blue-600">
//               +{Math.floor(Math.random() * 3) + 1} this month
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-green-100 rounded-lg">
//                 <Activity className="text-green-600" size={24} />
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-gray-900">
//                   {analysts.filter((a) => a.is_active).length}
//                 </div>
//                 <div className="text-sm text-gray-600">Active Analysts</div>
//               </div>
//             </div>
//             <div className="mt-2 text-xs text-green-600">
//               {Math.round(
//                 (analysts.filter((a) => a.is_active).length / analysts.length) *
//                   100
//               )}
//               % active rate
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-purple-100 rounded-lg">
//                 <Package className="text-purple-600" size={24} />
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-gray-900">
//                   {Object.values(workloadData).reduce(
//                     (sum, data) => sum + (data?.totalProducts || 0),
//                     0
//                   )}
//                 </div>
//                 <div className="text-sm text-gray-600">Total Products</div>
//               </div>
//             </div>
//             <div className="mt-2 text-xs text-purple-600">
//               Assigned across all analysts
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-orange-100 rounded-lg">
//                 <TrendingUp className="text-orange-600" size={24} />
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-gray-900">
//                   {Object.values(workloadData).length > 0
//                     ? Math.round(
//                         Object.values(workloadData).reduce(
//                           (sum, data) => sum + (data?.completionRate || 0),
//                           0
//                         ) / Object.values(workloadData).length
//                       )
//                     : 0}
//                   %
//                 </div>
//                 <div className="text-sm text-gray-600">Avg Completion</div>
//               </div>
//             </div>
//             <div className="mt-2 text-xs text-orange-600">
//               Cross-analyst average
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Filters and Search */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//             <div className="relative flex-1 max-w-md">
//               <Search
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 size={20}
//               />
//               <input
//                 type="text"
//                 placeholder="Search analysts..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>

//             <div className="flex gap-2">
//               {["all", "active", "inactive", "senior"].map((filter) => (
//                 <button
//                   key={filter}
//                   onClick={() => setActiveFilter(filter)}
//                   className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
//                     activeFilter === filter
//                       ? "bg-indigo-100 text-indigo-700"
//                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                   }`}
//                 >
//                   {filter.charAt(0).toUpperCase() + filter.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Bulk Actions */}
//           {selectedAnalysts.length > 0 && (
//             <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-blue-800">
//                   {selectedAnalysts.length} analyst
//                   {selectedAnalysts.length > 1 ? "s" : ""} selected
//                 </span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleBulkAction("activate")}
//                     className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
//                   >
//                     <Activity size={14} className="inline mr-1" />
//                     Activate
//                   </button>
//                   <button
//                     onClick={() => handleBulkAction("deactivate")}
//                     className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
//                   >
//                     <Ban size={14} className="inline mr-1" />
//                     Deactivate
//                   </button>
//                   <button
//                     onClick={() => handleBulkAction("delete")}
//                     className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
//                   >
//                     <Trash2 size={14} className="inline mr-1" />
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Enhanced Analysts Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Analyst List ({filteredAnalysts.length})
//             </h3>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
//             </div>
//           ) : filteredAnalysts.length === 0 ? (
//             <div className="text-center py-12">
//               <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600">No analysts found</p>
//               <p className="text-gray-500 text-sm mt-1">
//                 {searchQuery
//                   ? "Try adjusting your search terms"
//                   : "Create your first analyst account"}
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr>
//                     <th className="px-6 py-3 text-left">
//                       <input
//                         type="checkbox"
//                         checked={
//                           selectedAnalysts.length === filteredAnalysts.length &&
//                           filteredAnalysts.length > 0
//                         }
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             setSelectedAnalysts(
//                               filteredAnalysts.map((a) => a.id)
//                             );
//                           } else {
//                             setSelectedAnalysts([]);
//                           }
//                         }}
//                         className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                       />
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Analyst
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Department
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Workload
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Categories
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Performance
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredAnalysts.map((analyst) => {
//                     const workload = workloadData[analyst.id];
//                     const categories = categoryAssignments[analyst.id] || [];

//                     return (
//                       <tr
//                         key={analyst.id}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4">
//                           <input
//                             type="checkbox"
//                             checked={selectedAnalysts.includes(analyst.id)}
//                             onChange={(e) => {
//                               if (e.target.checked) {
//                                 setSelectedAnalysts([
//                                   ...selectedAnalysts,
//                                   analyst.id,
//                                 ]);
//                               } else {
//                                 setSelectedAnalysts(
//                                   selectedAnalysts.filter(
//                                     (id) => id !== analyst.id
//                                   )
//                                 );
//                               }
//                             }}
//                             className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                           />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10">
//                               <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
//                                 <span className="text-sm font-medium text-indigo-600">
//                                   {analyst.username.charAt(0).toUpperCase()}
//                                 </span>
//                               </div>
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {analyst.username}
//                               </div>
//                               <div className="text-sm text-gray-500">
//                                 {analyst.email}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">
//                             {analyst.department || "Not assigned"}
//                           </div>
//                           <div
//                             className={`text-sm px-2 py-1 rounded-full border ${getRoleColor(
//                               analyst
//                             )}`}
//                           >
//                             {(analyst.role?.name || "analyst").replace(
//                               "_",
//                               " "
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {workload ? (
//                             <div className="space-y-1">
//                               <div className="flex items-center gap-2">
//                                 <Package size={14} className="text-blue-500" />
//                                 <span className="text-sm font-medium text-gray-900">
//                                   {workload.totalProducts} products
//                                 </span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <Target size={14} className="text-green-500" />
//                                 <span className="text-sm text-gray-600">
//                                   {workload.completionRate}% complete
//                                 </span>
//                               </div>
//                             </div>
//                           ) : (
//                             <span className="text-sm text-gray-400">
//                               Loading...
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex flex-wrap gap-1">
//                             {categories.slice(0, 2).map((category) => (
//                               <span
//                                 key={category}
//                                 className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
//                               >
//                                 {category}
//                               </span>
//                             ))}
//                             {categories.length > 2 && (
//                               <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
//                                 +{categories.length - 2}
//                               </span>
//                             )}
//                             {categories.length === 0 && (
//                               <span className="text-xs text-gray-400">
//                                 No categories
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {workload ? (
//                             <div className="space-y-1">
//                               <div
//                                 className={`text-sm font-medium ${getPerformanceColor(
//                                   workload.completionRate
//                                 )}`}
//                               >
//                                 {workload.completionRate}%
//                               </div>
//                               <div className="w-full bg-gray-200 rounded-full h-2">
//                                 <div
//                                   className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                                   style={{
//                                     width: `${workload.completionRate}%`,
//                                   }}
//                                 ></div>
//                               </div>
//                             </div>
//                           ) : (
//                             <span className="text-sm text-gray-400">
//                               Loading...
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
//                               analyst
//                             )}`}
//                           >
//                             <div
//                               className={`w-2 h-2 rounded-full mr-1 ${
//                                 analyst.is_active
//                                   ? "bg-green-500"
//                                   : "bg-red-500"
//                               }`}
//                             ></div>
//                             {analyst.is_active ? "Active" : "Inactive"}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex items-center gap-1">
//                             <button
//                               onClick={() => handleViewAnalyst(analyst)}
//                               className="text-indigo-600 hover:text-indigo-900 p-2 rounded transition-colors hover:bg-indigo-50"
//                               title="View Details"
//                             >
//                               <Eye size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleEditAnalyst(analyst)}
//                               className="text-blue-600 hover:text-blue-900 p-2 rounded transition-colors hover:bg-blue-50"
//                               title="Edit Analyst"
//                             >
//                               <Edit3 size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleToggleStatus(analyst.id)}
//                               className={`p-2 rounded transition-colors ${
//                                 analyst.is_active
//                                   ? "text-orange-600 hover:text-orange-900 hover:bg-orange-50"
//                                   : "text-green-600 hover:text-green-900 hover:bg-green-50"
//                               }`}
//                               title={
//                                 analyst.is_active ? "Deactivate" : "Activate"
//                               }
//                             >
//                               {analyst.is_active ? (
//                                 <Ban size={16} />
//                               ) : (
//                                 <Unlock size={16} />
//                               )}
//                             </button>
//                             <button
//                               onClick={() => handleDeleteAnalyst(analyst.id)}
//                               className="text-red-600 hover:text-red-900 p-2 rounded transition-colors hover:bg-red-50"
//                               title="Delete Analyst"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {renderAnalystModal()}
//     </div>
//   );
// };

// export default AnalystManagement;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  UserPlus,
  Edit3,
  Trash2,
  Search,
  Eye,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Mail,
  Calendar,
  Shield,
  Tag,
  Activity,
  TrendingUp,
  Clock,
  RefreshCw,
  User,
  Ban,
  Unlock,
  Target,
  Database,
  Monitor,
  Sparkles,
  Crown,
  Grid3X3,
} from "lucide-react";

const AnalystManagement = () => {
  const navigate = useNavigate();
  const [analysts, setAnalysts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnalyst, setSelectedAnalyst] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedAnalysts, setSelectedAnalysts] = useState([]);
  const [categoryAssignments, setCategoryAssignments] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    department: "",
    assigned_categories: [],
    is_active: true,
    role: "analyst",
    permissions: [],
  });

  const availableCategories = [
    "Bridge Gem742",
    "Gold262&270",
    "Womens Silver260&404",
    "Precious",
    "Fine Pearl",
    "Semi",
    "Diamond",
    "Bridal",
    "Men's",
  ];

  const availableDepartments = [
    "Sales Forecasting",
    "Market Analysis",
    "Product Analytics",
    "Trend Analysis",
  ];

  useEffect(() => {
    fetchAnalysts();
  }, []);

  const fetchAnalysts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/users/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analysts");
      }

      const data = await response.json();
      const analystUsers = data.filter(
        (user) =>
          user.role?.name === "analyst" || user.role?.name === "senior_analyst"
      );

      setAnalysts(analystUsers);
    } catch (error) {
      console.error("Error fetching analysts:", error);
      showToast("Failed to load analysts", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalystCategories = async (analystId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/forecast/query/filter_products/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const allProducts = await response.json();
        const analystProducts = allProducts.filter(
          (p) => p.assigned_to === analystId
        );
        const categories = [
          ...new Set(analystProducts.map((p) => p.category).filter(Boolean)),
        ];

        setCategoryAssignments((prev) => ({
          ...prev,
          [analystId]: categories,
        }));

        return categories;
      }
    } catch (error) {
      console.error("Error fetching analyst categories:", error);
    }
    return [];
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalysts();
    setRefreshing(false);
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const handleCreateAnalyst = () => {
    setModalMode("create");
    setFormData({
      username: "",
      email: "",
      phone: "",
      department: "",
      assigned_categories: [],
      is_active: true,
      role: "analyst",
      permissions: [],
    });
    setShowModal(true);
  };

  const handleEditAnalyst = async (analyst) => {
    setSelectedAnalyst(analyst);
    setModalMode("edit");

    const categories = await fetchAnalystCategories(analyst.id);

    setFormData({
      username: analyst.username,
      email: analyst.email,
      phone: analyst.phone || "",
      department: analyst.department || "",
      assigned_categories: categories,
      is_active: analyst.is_active,
      role: analyst.role?.name || "analyst",
      permissions: analyst.permissions || [],
    });
    setShowModal(true);
  };

  const handleViewAnalyst = async (analyst) => {
    setSelectedAnalyst(analyst);
    setModalMode("view");
    await fetchAnalystCategories(analyst.id);
    setShowModal(true);
  };

  const handleDeleteAnalyst = async (analystId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this analyst? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/users/${analystId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete analyst");
        }

        setAnalysts((prev) => prev.filter((a) => a.id !== analystId));
        showToast("Analyst deleted successfully", "success");
      } catch (error) {
        console.error("Error deleting analyst:", error);
        showToast("Failed to delete analyst", "error");
      }
    }
  };

  const handleToggleStatus = async (analystId) => {
    try {
      const analyst = analysts.find((a) => a.id === analystId);
      const newStatus = !analyst.is_active;

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/users/${analystId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setAnalysts((prev) =>
        prev.map((a) =>
          a.id === analystId ? { ...a, is_active: newStatus } : a
        )
      );
      showToast("Status updated successfully", "success");
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Failed to update status", "error");
    }
  };

  const handleSaveAnalyst = async () => {
    try {
      if (modalMode === "create") {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/register/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              password: "TempPassword123!",
              role: formData.role,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create analyst");
        }

        showToast("Analyst created successfully", "success");
        await fetchAnalysts();
      } else if (modalMode === "edit") {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/users/${
            selectedAnalyst.id
          }/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update analyst");
        }

        showToast("Analyst updated successfully", "success");
        await fetchAnalysts();
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving analyst:", error);
      showToast(error.message, "error");
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedAnalysts.length === 0) {
      showToast("Please select analysts first", "error");
      return;
    }

    try {
      const promises = selectedAnalysts.map((analystId) => {
        switch (action) {
          case "activate":
            return fetch(
              `${import.meta.env.VITE_API_BASE_URL}/auth/users/${analystId}/`,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                  )}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ is_active: true }),
              }
            );
          case "deactivate":
            return fetch(
              `${import.meta.env.VITE_API_BASE_URL}/auth/users/${analystId}/`,
              {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                  )}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ is_active: false }),
              }
            );
          case "delete":
            return fetch(
              `${import.meta.env.VITE_API_BASE_URL}/auth/users/${analystId}/`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                  )}`,
                  "Content-Type": "application/json",
                },
              }
            );
          default:
            return Promise.resolve();
        }
      });

      if (action === "delete") {
        if (
          !window.confirm(
            `Are you sure you want to delete ${selectedAnalysts.length} analysts?`
          )
        ) {
          return;
        }
      }

      await Promise.all(promises);

      showToast(
        `${selectedAnalysts.length} analysts ${action}d successfully`,
        "success"
      );
      setSelectedAnalysts([]);
      await fetchAnalysts();
    } catch (error) {
      console.error("Bulk action failed:", error);
      showToast("Bulk action failed", "error");
    }
  };

  const filteredAnalysts = analysts.filter((analyst) => {
    const matchesSearch =
      analyst.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analyst.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analyst.department?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "active" && analyst.is_active) ||
      (activeFilter === "inactive" && !analyst.is_active) ||
      (activeFilter === "senior" && analyst.role?.name === "senior_analyst");

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (analyst) => {
    return analyst.is_active
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-red-50 text-red-700 border-red-200";
  };

  const getRoleColor = (analyst) => {
    const role = analyst.role?.name || "analyst";
    return role === "senior_analyst"
      ? "bg-gradient-to-r from-purple-500 to-purple-600"
      : "bg-gradient-to-r from-blue-500 to-blue-600";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const renderAnalystModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-white/20">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-8 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  {modalMode === "create" && <UserPlus size={24} />}
                  {modalMode === "edit" && <Edit3 size={24} />}
                  {modalMode === "view" && <Eye size={24} />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {modalMode === "create" && "Create New Analyst"}
                    {modalMode === "edit" && "Edit Analyst Profile"}
                    {modalMode === "view" && "Analyst Details"}
                  </h2>
                  <p className="text-blue-100 mt-1">
                    {modalMode === "create" &&
                      "Add a new team member to your analytics team"}
                    {modalMode === "edit" &&
                      "Update analyst information and assignments"}
                    {modalMode === "view" && "Comprehensive analyst overview"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/20 hover:scale-105"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-8">
            {modalMode === "view" ? (
              /* View Mode */
              <div className="space-y-8">
                {/* Analyst Header Card */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-2xl border border-slate-200/50">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {selectedAnalyst?.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {selectedAnalyst?.username}
                      </h3>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-slate-600">
                          {selectedAnalyst?.email}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            selectedAnalyst
                          )}`}
                        >
                          {selectedAnalyst?.is_active ? "Active" : "Inactive"}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getRoleColor(
                            selectedAnalyst
                          )} shadow-sm`}
                        >
                          {(selectedAnalyst?.role?.name || "analyst").replace(
                            "_",
                            " "
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>
                            Joined {formatDate(selectedAnalyst?.date_joined)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>
                            Last active{" "}
                            {formatDate(selectedAnalyst?.last_login)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Contact & Basic Info */}
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm">
                    <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <User size={20} className="text-slate-600" />
                      </div>
                      Contact Information
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-sm font-medium text-slate-600">
                          Email Address
                        </span>
                        <span className="text-sm text-slate-900 font-medium">
                          {selectedAnalyst?.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-sm font-medium text-slate-600">
                          Phone Number
                        </span>
                        <span className="text-sm text-slate-900 font-medium">
                          {selectedAnalyst?.phone || "Not provided"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-sm font-medium text-slate-600">
                          Department
                        </span>
                        <span className="text-sm text-slate-900 font-medium">
                          {selectedAnalyst?.department || "Not assigned"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Categories */}
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm">
                    <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Tag size={20} className="text-slate-600" />
                      </div>
                      Category Assignments
                    </h4>
                    <div className="space-y-3">
                      {categoryAssignments[selectedAnalyst?.id]?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                          {categoryAssignments[selectedAnalyst.id].map(
                            (category) => (
                              <div
                                key={category}
                                className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200"
                              >
                                <span className="text-sm font-medium text-blue-800">
                                  {category}
                                </span>
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Tag
                            size={32}
                            className="text-slate-300 mx-auto mb-2"
                          />
                          <p className="text-slate-500 text-sm">
                            No categories assigned
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Create/Edit Form */
              <form className="space-y-8">
                {/* Basic Information Section */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-slate-200 rounded-lg">
                      <User size={20} className="text-slate-600" />
                    </div>
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Username *
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                        required
                        disabled={modalMode === "edit"}
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                        required
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Department
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            department: e.target.value,
                          })
                        }
                        className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                      >
                        <option value="">Select Department</option>
                        {availableDepartments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Role & Status Section */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-slate-200 rounded-lg">
                      <Shield size={20} className="text-slate-600" />
                    </div>
                    Role & Access
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Role Level
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                      >
                        <option value="analyst">Analyst</option>
                        <option value="senior_analyst">Senior Analyst</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Account Status
                      </label>
                      <select
                        value={formData.is_active}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_active: e.target.value === "true",
                          })
                        }
                        className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                      >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Category Assignments */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-slate-200 rounded-lg">
                      <Tag size={20} className="text-slate-600" />
                    </div>
                    Category Assignments
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto p-4 border border-slate-300 rounded-xl bg-white">
                    {availableCategories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200"
                      >
                        <input
                          type="checkbox"
                          checked={formData.assigned_categories.includes(
                            category
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                assigned_categories: [
                                  ...formData.assigned_categories,
                                  category,
                                ],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                assigned_categories:
                                  formData.assigned_categories.filter(
                                    (c) => c !== category
                                  ),
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-8 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAnalyst}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-3 font-medium shadow-lg hover:shadow-xl"
                  >
                    <Save size={18} />
                    {modalMode === "create"
                      ? "Create Analyst"
                      : "Update Profile"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(148_163_184_/_0.15)_1px,transparent_0)] [background-size:24px_24px] pointer-events-none"></div>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl transition-all duration-300 backdrop-blur-xl border ${
            toast.type === "success"
              ? "bg-emerald-50/90 text-emerald-800 border-emerald-200"
              : "bg-red-50/90 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-8">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="text-white/80 hover:text-white flex items-center gap-2 transition-all duration-200 hover:gap-3 group"
                  >
                    <ArrowLeft
                      size={16}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                    <span className="text-sm font-medium">
                      Back to Dashboard
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-1">
                      Analyst Management
                    </h1>
                    <p className="text-blue-100 text-lg">
                      Manage your analytics team and assignments
                    </p>
                  </div>
                </div>
                <p className="text-slate-300 mb-4 max-w-2xl">
                  Comprehensive analyst oversight with team management and
                  category assignments for optimal workflow organization.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-400/30">
                    <Monitor size={14} className="text-blue-300" />
                    <span className="text-blue-100 text-sm font-medium">
                      Team Management
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-400/30">
                    <Sparkles size={14} className="text-emerald-300" />
                    <span className="text-emerald-100 text-sm">
                      Advanced Controls
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading || refreshing}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-200 hover:scale-105 border border-white/20 disabled:opacity-50 group"
                >
                  <RefreshCw
                    size={18}
                    className={`${
                      refreshing ? "animate-spin" : "group-hover:rotate-180"
                    } transition-transform duration-300`}
                  />
                  <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
                </button>
                <button
                  onClick={handleCreateAnalyst}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl flex items-center gap-3 font-medium transition-all duration-200 hover:scale-105 border border-white/20 group"
                >
                  <UserPlus
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span>Add Analyst</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="group bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Users className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">
                    {analysts.length}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">
                    Total Analysts
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600 font-medium">
                  Team members
                </span>
                <TrendingUp size={14} className="text-blue-400" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                  <Activity className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">
                    {analysts.filter((a) => a.is_active).length}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">
                    Active Analysts
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-600 font-medium">
                  {Math.round(
                    (analysts.filter((a) => a.is_active).length /
                      (analysts.length || 1)) *
                      100
                  )}
                  % active rate
                </span>
                <Target size={14} className="text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Tag className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">
                    {availableCategories.length}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">
                    Categories
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-600 font-medium">
                  Available categories
                </span>
                <Database size={14} className="text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search analysts by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 w-full border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all font-medium placeholder:text-slate-400"
              />
            </div>

            <div className="flex gap-3">
              {["all", "active", "inactive", "senior"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  {filter === "all" && (
                    <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      {filteredAnalysts.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedAnalysts.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <span className="font-semibold text-blue-800">
                    {selectedAnalysts.length} analyst
                    {selectedAnalysts.length > 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleBulkAction("activate")}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <Activity size={14} />
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction("deactivate")}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-lg transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <Ban size={14} />
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Analysts Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Grid3X3 size={20} className="text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Team Directory ({filteredAnalysts.length})
                </h3>
              </div>
              <div className="text-sm text-slate-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">
                  Loading analysts...
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Fetching team data
                </p>
              </div>
            </div>
          ) : filteredAnalysts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No analysts found
              </h3>
              <p className="text-slate-500 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms or filters"
                  : "Get started by creating your first analyst account"}
              </p>
              <button
                onClick={handleCreateAnalyst}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                <UserPlus size={18} />
                Create First Analyst
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedAnalysts.length === filteredAnalysts.length &&
                          filteredAnalysts.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAnalysts(
                              filteredAnalysts.map((a) => a.id)
                            );
                          } else {
                            setSelectedAnalysts([]);
                          }
                        }}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Analyst Profile
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Department & Role
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Categories
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/60 backdrop-blur-sm divide-y divide-slate-200">
                  {filteredAnalysts.map((analyst) => {
                    const categories = categoryAssignments[analyst.id] || [];

                    return (
                      <tr
                        key={analyst.id}
                        className="hover:bg-white/80 transition-all duration-200 group"
                      >
                        <td className="px-8 py-6">
                          <input
                            type="checkbox"
                            checked={selectedAnalysts.includes(analyst.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAnalysts([
                                  ...selectedAnalysts,
                                  analyst.id,
                                ]);
                              } else {
                                setSelectedAnalysts(
                                  selectedAnalysts.filter(
                                    (id) => id !== analyst.id
                                  )
                                );
                              }
                            }}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                          />
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                                <span className="text-lg font-bold text-white">
                                  {analyst.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                  analyst.is_active
                                    ? "bg-emerald-400"
                                    : "bg-red-400"
                                }`}
                              ></div>
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-lg">
                                {analyst.username}
                              </div>
                              <div className="text-slate-600 text-sm flex items-center gap-1">
                                <Mail size={12} />
                                {analyst.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-slate-900">
                              {analyst.department || "Not assigned"}
                            </div>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm ${getRoleColor(
                                analyst
                              )}`}
                            >
                              {analyst.role?.name === "senior_analyst" && (
                                <Crown size={12} className="mr-1" />
                              )}
                              {(analyst.role?.name || "analyst").replace(
                                "_",
                                " "
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-2">
                            {categories.length > 0 ? (
                              <>
                                <div className="flex flex-wrap gap-1">
                                  {categories.slice(0, 3).map((category) => (
                                    <span
                                      key={category}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                    >
                                      {category}
                                    </span>
                                  ))}
                                  {categories.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                      +{categories.length - 3} more
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {categories.length} categor
                                  {categories.length === 1 ? "y" : "ies"}{" "}
                                  assigned
                                </div>
                              </>
                            ) : (
                              <div className="text-center py-2">
                                <Tag
                                  size={16}
                                  className="text-slate-300 mx-auto mb-1"
                                />
                                <div className="text-xs text-slate-400">
                                  No categories
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium border shadow-sm ${getStatusColor(
                              analyst
                            )}`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                analyst.is_active
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                              } animate-pulse`}
                            ></div>
                            {analyst.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewAnalyst(analyst)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110 group/btn"
                              title="View Details"
                            >
                              <Eye
                                size={16}
                                className="group-hover/btn:scale-110 transition-transform"
                              />
                            </button>
                            <button
                              onClick={() => handleEditAnalyst(analyst)}
                              className="p-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-200 hover:scale-110 group/btn"
                              title="Edit Analyst"
                            >
                              <Edit3
                                size={16}
                                className="group-hover/btn:scale-110 transition-transform"
                              />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(analyst.id)}
                              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 group/btn ${
                                analyst.is_active
                                  ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                  : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              }`}
                              title={
                                analyst.is_active ? "Deactivate" : "Activate"
                              }
                            >
                              {analyst.is_active ? (
                                <Ban
                                  size={16}
                                  className="group-hover/btn:scale-110 transition-transform"
                                />
                              ) : (
                                <Unlock
                                  size={16}
                                  className="group-hover/btn:scale-110 transition-transform"
                                />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteAnalyst(analyst.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 group/btn"
                              title="Delete Analyst"
                            >
                              <Trash2
                                size={16}
                                className="group-hover/btn:scale-110 transition-transform"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {renderAnalystModal()}
    </div>
  );
};

export default AnalystManagement;
