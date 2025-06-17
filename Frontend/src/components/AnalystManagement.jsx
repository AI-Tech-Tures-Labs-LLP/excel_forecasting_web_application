// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Users,
//   UserPlus,
//   Edit3,
//   Trash2,
//   Search,
//   Filter,
//   ArrowLeft,
//   Mail,
//   Calendar,
//   Shield,
//   Tag,
//   Save,
//   X,
//   AlertCircle,
//   CheckCircle,
//   Eye,
//   Settings,
// } from "lucide-react";
// import axios from "axios";

// const AnalystManagement = () => {
//   const navigate = useNavigate();
//   const [analysts, setAnalysts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState("create"); // 'create', 'edit', 'view'
//   const [selectedAnalyst, setSelectedAnalyst] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [toast, setToast] = useState({ show: false, message: "", type: "" });

//   // Form state for create/edit modal
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     first_name: "",
//     last_name: "",
//     assigned_categories: [],
//     is_active: true,
//   });

//   // Available categories for assignment
//   const availableCategories = [
//     "Bridge Gem",
//     "Gold",
//     "Womens Silver",
//     "Precious",
//     "Fine Pearl",
//     "Semi",
//     "Diamond",
//     "Bridal",
//     "Men's",
//   ];

//   useEffect(() => {
//     fetchAnalysts();
//   }, []);

//   const fetchAnalysts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}/auth/users/`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         }
//       );

//       // Filter to only show analysts
//       const analystUsers = response.data.filter(
//         (user) => user.role?.name === "analyst"
//       );
//       setAnalysts(analystUsers);
//     } catch (error) {
//       console.error("Error fetching analysts:", error);
//       showToast("Failed to fetch analysts", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showToast = (message, type = "info") => {
//     setToast({ show: true, message, type });
//     setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
//   };

//   const handleCreateAnalyst = () => {
//     setModalMode("create");
//     setFormData({
//       username: "",
//       email: "",
//       password: "",
//       first_name: "",
//       last_name: "",
//       assigned_categories: [],
//       is_active: true,
//     });
//     setShowModal(true);
//   };

//   const handleEditAnalyst = (analyst) => {
//     setModalMode("edit");
//     setSelectedAnalyst(analyst);
//     setFormData({
//       username: analyst.username,
//       email: analyst.email,
//       password: "",
//       first_name: analyst.first_name || "",
//       last_name: analyst.last_name || "",
//       assigned_categories: analyst.assigned_categories || [],
//       is_active: analyst.is_active,
//     });
//     setShowModal(true);
//   };

//   const handleViewAnalyst = (analyst) => {
//     setModalMode("view");
//     setSelectedAnalyst(analyst);
//     setShowModal(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (modalMode === "create") {
//         await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}/auth/register/`,
//           {
//             ...formData,
//             role: "analyst",
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//             },
//           }
//         );
//         showToast("Analyst created successfully", "success");
//       } else if (modalMode === "edit") {
//         await axios.patch(
//           `${import.meta.env.VITE_API_BASE_URL}/auth/users/${
//             selectedAnalyst.id
//           }/`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//             },
//           }
//         );
//         showToast("Analyst updated successfully", "success");
//       }

//       setShowModal(false);
//       fetchAnalysts();
//     } catch (error) {
//       console.error("Error saving analyst:", error);
//       showToast(
//         error.response?.data?.error || "Failed to save analyst",
//         "error"
//       );
//     }
//   };

//   const handleDeleteAnalyst = async (analystId) => {
//     if (!confirm("Are you sure you want to delete this analyst?")) return;

//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_API_BASE_URL}/auth/users/${analystId}/`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         }
//       );
//       showToast("Analyst deleted successfully", "success");
//       fetchAnalysts();
//     } catch (error) {
//       console.error("Error deleting analyst:", error);
//       showToast("Failed to delete analyst", "error");
//     }
//   };

//   const handleCategoryToggle = (category) => {
//     setFormData((prev) => ({
//       ...prev,
//       assigned_categories: prev.assigned_categories.includes(category)
//         ? prev.assigned_categories.filter((c) => c !== category)
//         : [...prev.assigned_categories, category],
//     }));
//   };

//   const filteredAnalysts = analysts.filter(
//     (analyst) =>
//       analyst.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       analyst.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (analyst.first_name &&
//         analyst.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       (analyst.last_name &&
//         analyst.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Toast Notification */}
//       {toast.show && (
//         <div
//           className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
//             toast.type === "success"
//               ? "bg-green-100 text-green-800 border border-green-200"
//               : toast.type === "error"
//               ? "bg-red-100 text-red-800 border border-red-200"
//               : "bg-blue-100 text-blue-800 border border-blue-200"
//           }`}
//         >
//           <div className="flex items-center gap-2">
//             {toast.type === "success" && <CheckCircle size={16} />}
//             {toast.type === "error" && <AlertCircle size={16} />}
//             <span className="text-sm font-medium">{toast.message}</span>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto p-6">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
//           <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 rounded-t-xl">
//             <div className="flex justify-between items-start">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-2">
//                   <button
//                     onClick={() => navigate("/file-upload")}
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
//                   Create and manage analyst accounts with category assignments
//                 </p>
//               </div>

//               <button
//                 onClick={handleCreateAnalyst}
//                 className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 border border-white/20"
//               >
//                 <UserPlus size={18} />
//                 Create Analyst
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filter */}
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
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <Users size={16} />
//               <span>{filteredAnalysts.length} analysts found</span>
//             </div>
//           </div>
//         </div>

//         {/* Analysts Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Analyst Accounts
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
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Analyst
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Contact
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Assigned Categories
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Created
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredAnalysts.map((analyst) => (
//                     <tr key={analyst.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10">
//                             <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
//                               <span className="text-sm font-medium text-indigo-600">
//                                 {analyst.username.charAt(0).toUpperCase()}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {analyst.first_name && analyst.last_name
//                                 ? `${analyst.first_name} ${analyst.last_name}`
//                                 : analyst.username}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               @{analyst.username}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {analyst.email}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {analyst.role?.name || "analyst"}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex flex-wrap gap-1">
//                           {analyst.assigned_categories?.length > 0 ? (
//                             analyst.assigned_categories
//                               .slice(0, 3)
//                               .map((category, idx) => (
//                                 <span
//                                   key={idx}
//                                   className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
//                                 >
//                                   {category}
//                                 </span>
//                               ))
//                           ) : (
//                             <span className="text-sm text-gray-400">
//                               No categories assigned
//                             </span>
//                           )}
//                           {analyst.assigned_categories?.length > 3 && (
//                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
//                               +{analyst.assigned_categories.length - 3}
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
//                             analyst.is_active
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {analyst.is_active ? "Active" : "Inactive"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(analyst.date_joined)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => handleViewAnalyst(analyst)}
//                             className="text-indigo-600 hover:text-indigo-900 p-1 rounded transition-colors"
//                             title="View Details"
//                           >
//                             <Eye size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleEditAnalyst(analyst)}
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
//                             title="Edit Analyst"
//                           >
//                             <Edit3 size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteAnalyst(analyst.id)}
//                             className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
//                             title="Delete Analyst"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal for Create/Edit/View */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-white bg-opacity-20 rounded-lg">
//                     {modalMode === "create" && <UserPlus size={24} />}
//                     {modalMode === "edit" && <Edit3 size={24} />}
//                     {modalMode === "view" && <Eye size={24} />}
//                   </div>
//                   <h2 className="text-xl font-bold">
//                     {modalMode === "create" && "Create New Analyst"}
//                     {modalMode === "edit" && "Edit Analyst"}
//                     {modalMode === "view" && "Analyst Details"}
//                   </h2>
//                 </div>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6">
//               {modalMode === "view" ? (
//                 // View Mode
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Username
//                       </label>
//                       <p className="text-gray-900">
//                         {selectedAnalyst?.username}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Email
//                       </label>
//                       <p className="text-gray-900">{selectedAnalyst?.email}</p>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         First Name
//                       </label>
//                       <p className="text-gray-900">
//                         {selectedAnalyst?.first_name || "Not set"}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Last Name
//                       </label>
//                       <p className="text-gray-900">
//                         {selectedAnalyst?.last_name || "Not set"}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Status
//                       </label>
//                       <span
//                         className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
//                           selectedAnalyst?.is_active
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {selectedAnalyst?.is_active ? "Active" : "Inactive"}
//                       </span>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Created
//                       </label>
//                       <p className="text-gray-900">
//                         {formatDate(selectedAnalyst?.date_joined)}
//                       </p>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Assigned Categories
//                     </label>
//                     <div className="flex flex-wrap gap-2">
//                       {selectedAnalyst?.assigned_categories?.length > 0 ? (
//                         selectedAnalyst.assigned_categories.map(
//                           (category, idx) => (
//                             <span
//                               key={idx}
//                               className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
//                             >
//                               {category}
//                             </span>
//                           )
//                         )
//                       ) : (
//                         <p className="text-gray-500">No categories assigned</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 // Create/Edit Form
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Username *
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.username}
//                         onChange={(e) =>
//                           setFormData({ ...formData, username: e.target.value })
//                         }
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                         disabled={modalMode === "edit"}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Email *
//                       </label>
//                       <input
//                         type="email"
//                         value={formData.email}
//                         onChange={(e) =>
//                           setFormData({ ...formData, email: e.target.value })
//                         }
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         First Name
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.first_name}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             first_name: e.target.value,
//                           })
//                         }
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Last Name
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.last_name}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             last_name: e.target.value,
//                           })
//                         }
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                       />
//                     </div>
//                     {modalMode === "create" && (
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Password *
//                         </label>
//                         <input
//                           type="password"
//                           value={formData.password}
//                           onChange={(e) =>
//                             setFormData({
//                               ...formData,
//                               password: e.target.value,
//                             })
//                           }
//                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                           required
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Status
//                     </label>
//                     <label className="inline-flex items-center">
//                       <input
//                         type="checkbox"
//                         checked={formData.is_active}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             is_active: e.target.checked,
//                           })
//                         }
//                         className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Active</span>
//                     </label>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                       Assign Categories
//                     </label>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                       {availableCategories.map((category) => (
//                         <label
//                           key={category}
//                           className="inline-flex items-center"
//                         >
//                           <input
//                             type="checkbox"
//                             checked={formData.assigned_categories.includes(
//                               category
//                             )}
//                             onChange={() => handleCategoryToggle(category)}
//                             className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                           />
//                           <span className="ml-2 text-sm text-gray-700">
//                             {category}
//                           </span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//                     <button
//                       type="button"
//                       onClick={() => setShowModal(false)}
//                       className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
//                     >
//                       <Save size={16} />
//                       {modalMode === "create"
//                         ? "Create Analyst"
//                         : "Update Analyst"}
//                     </button>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AnalystManagement;

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  UserPlus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Eye,
  Settings,
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
  FileText,
  Clock,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  User,
  Phone,
  MapPin,
  Briefcase,
  Award,
  AlertTriangle,
  Ban,
  Unlock,
  Key,
} from "lucide-react";

const AnalystManagement = () => {
  const [analysts, setAnalysts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnalyst, setSelectedAnalyst] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // 'view', 'edit', 'create'
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedAnalysts, setSelectedAnalysts] = useState([]);

  // Form data for create/edit
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    department: "",
    assigned_categories: [],
    is_active: true,
    role: "analyst",
    permissions: [],
  });

  const availableCategories = [
    "Bridge Gem",
    "Gold",
    "Womens Silver",
    "Precious",
    "Fine Pearl",
    "Semi",
    "Diamond",
    "Bridal",
    "Men's",
  ];

  const availableRoles = [
    { value: "analyst", label: "Analyst" },
    { value: "senior_analyst", label: "Senior Analyst" },
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

      // Filter to only show analysts (not admins)
      const analystUsers = data.filter(
        (user) =>
          user.role?.name === "analyst" || user.role?.name === "senior_analyst"
      );

      // Enrich data with additional fields for dashboard
      const enrichedAnalysts = analystUsers.map((user) => ({
        ...user,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        assignedCategories: user.assigned_categories || [],
        status: user.is_active ? "active" : "inactive",
        department: user.department || "Not Assigned",
        phone: user.phone || "",
        joinDate: user.date_joined,
        lastLogin: user.last_login || "Never",
        // Add calculated fields (these would normally come from your analytics API)
        totalForecasts: Math.floor(Math.random() * 100) + 10, // Mock - replace with real data
        completedForecasts: Math.floor(Math.random() * 90) + 5, // Mock - replace with real data
        avgAccuracy: Math.floor(Math.random() * 15) + 85, // Mock - replace with real data
        currentWorkload: Math.floor(Math.random() * 20), // Mock - replace with real data
        activeProjects: [], // Would come from projects API
        recentActivity: [], // Would come from activity logs API
        performance: {
          accuracy: Math.floor(Math.random() * 15) + 85,
          timeliness: Math.floor(Math.random() * 15) + 85,
          collaboration: Math.floor(Math.random() * 15) + 85,
          innovation: Math.floor(Math.random() * 15) + 85,
        },
      }));

      setAnalysts(enrichedAnalysts);
      console.log("Loaded analysts:", enrichedAnalysts);
    } catch (error) {
      console.error("Error fetching analysts:", error);
      showToast("Failed to load analysts", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleCreateAnalyst = () => {
    setModalMode("create");
    setFormData({
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      department: "",
      assigned_categories: [],
      is_active: true,
      role: "analyst",
      permissions: [],
    });
    setShowModal(true);
  };

  const handleEditAnalyst = (analyst) => {
    setSelectedAnalyst(analyst);
    setModalMode("edit");
    setFormData({
      username: analyst.username,
      email: analyst.email,
      first_name: analyst.first_name || analyst.firstName,
      last_name: analyst.last_name || analyst.lastName,
      phone: analyst.phone || "",
      department: analyst.department || "",
      assigned_categories:
        analyst.assigned_categories || analyst.assignedCategories || [],
      is_active:
        analyst.is_active !== undefined
          ? analyst.is_active
          : analyst.status === "active",
      role: analyst.role?.name || analyst.role || "analyst",
      permissions: analyst.permissions || [],
    });
    setShowModal(true);
  };

  const handleViewAnalyst = (analyst) => {
    setSelectedAnalyst(analyst);
    setModalMode("view");
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
          a.id === analystId
            ? {
                ...a,
                is_active: newStatus,
                status: newStatus ? "active" : "inactive",
              }
            : a
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
              password: "TempPassword123!", // You might want to generate this or have user set it
              role: formData.role,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create analyst");
        }

        showToast("Analyst created successfully", "success");
        fetchAnalysts(); // Refresh the list
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
        fetchAnalysts(); // Refresh the list
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
      fetchAnalysts(); // Refresh the list
    } catch (error) {
      console.error("Bulk action failed:", error);
      showToast("Bulk action failed", "error");
    }
  };

  const filteredAnalysts = analysts.filter((analyst) => {
    const matchesSearch =
      (analyst.first_name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (analyst.last_name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (analyst.firstName?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (analyst.lastName?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      analyst.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analyst.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (analyst.department?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "active" &&
        (analyst.is_active || analyst.status === "active")) ||
      (activeFilter === "inactive" &&
        (!analyst.is_active || analyst.status === "inactive")) ||
      (activeFilter === "senior" &&
        (analyst.role?.name === "senior_analyst" ||
          analyst.role === "senior_analyst"));

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (analyst) => {
    const isActive =
      analyst.is_active !== undefined
        ? analyst.is_active
        : analyst.status === "active";
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getRoleColor = (analyst) => {
    const role = analyst.role?.name || analyst.role;
    return role === "senior_analyst"
      ? "bg-purple-100 text-purple-800 border-purple-200"
      : "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getPerformanceColor = (score) => {
    if (score >= 95) return "text-green-600";
    if (score >= 90) return "text-blue-600";
    if (score >= 85) return "text-orange-600";
    return "text-red-600";
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Never") return "Never";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString || dateString === "Never") return "Never";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  const renderAnalystModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  {modalMode === "create" && <UserPlus size={24} />}
                  {modalMode === "edit" && <Edit3 size={24} />}
                  {modalMode === "view" && <Eye size={24} />}
                </div>
                <h2 className="text-xl font-bold">
                  {modalMode === "create" && "Create New Analyst"}
                  {modalMode === "edit" && "Edit Analyst"}
                  {modalMode === "view" && "Analyst Details"}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            {modalMode === "view" ? (
              /* View Mode */
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <User size={16} />
                      Basic Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Name:</span>
                        <p className="font-medium">
                          {selectedAnalyst?.first_name ||
                            selectedAnalyst?.firstName}{" "}
                          {selectedAnalyst?.last_name ||
                            selectedAnalyst?.lastName}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Username:</span>
                        <p className="font-medium">
                          {selectedAnalyst?.username}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <p className="font-medium">{selectedAnalyst?.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Phone:</span>
                        <p className="font-medium">
                          {selectedAnalyst?.phone || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">
                          Department:
                        </span>
                        <p className="font-medium">
                          {selectedAnalyst?.department}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Activity size={16} />
                      Status & Performance
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Status:</span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            selectedAnalyst
                          )}`}
                        >
                          {selectedAnalyst?.is_active !== undefined
                            ? selectedAnalyst.is_active
                              ? "active"
                              : "inactive"
                            : selectedAnalyst?.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Role:</span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                            selectedAnalyst
                          )}`}
                        >
                          {(
                            selectedAnalyst?.role?.name ||
                            selectedAnalyst?.role ||
                            "analyst"
                          ).replace("_", " ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">
                          Join Date:
                        </span>
                        <p className="font-medium">
                          {formatDate(
                            selectedAnalyst?.date_joined ||
                              selectedAnalyst?.joinDate
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">
                          Last Login:
                        </span>
                        <p className="font-medium">
                          {formatDateTime(
                            selectedAnalyst?.last_login ||
                              selectedAnalyst?.lastLogin
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">
                          Avg Accuracy:
                        </span>
                        <p
                          className={`font-medium ${getPerformanceColor(
                            selectedAnalyst?.avgAccuracy || 0
                          )}`}
                        >
                          {selectedAnalyst?.avgAccuracy || 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Categories */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Tag size={16} />
                    Assigned Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(
                      selectedAnalyst?.assigned_categories ||
                      selectedAnalyst?.assignedCategories ||
                      []
                    ).map((category) => (
                      <span
                        key={category}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                    {(!selectedAnalyst?.assigned_categories &&
                      !selectedAnalyst?.assignedCategories) ||
                    (
                      selectedAnalyst?.assigned_categories ||
                      selectedAnalyst?.assignedCategories ||
                      []
                    ).length === 0 ? (
                      <span className="text-gray-500 text-sm">
                        No categories assigned
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Performance Metrics */}
                {selectedAnalyst?.performance && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <BarChart3 size={16} />
                      Performance Metrics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(selectedAnalyst.performance).map(
                        ([key, value]) => (
                          <div key={key} className="text-center">
                            <div
                              className={`text-2xl font-bold ${getPerformanceColor(
                                value
                              )}`}
                            >
                              {value}%
                            </div>
                            <div className="text-sm text-gray-600 capitalize">
                              {key}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Workload Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Briefcase size={16} />
                    Workload Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedAnalyst?.totalForecasts || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Forecasts
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedAnalyst?.completedForecasts || 0}
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedAnalyst?.currentWorkload || 0}
                      </div>
                      <div className="text-sm text-gray-600">Current Load</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedAnalyst?.activeProjects?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Active Projects
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Create/Edit Form */
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      disabled={modalMode === "edit"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {availableRoles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.value === "true",
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Assigned Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Categories
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                    {availableCategories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-2"
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
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAnalyst}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={16} />
                    {modalMode === "create"
                      ? "Create Analyst"
                      : "Update Analyst"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            toast.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 rounded-t-xl">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => window.history.back()}
                    className="text-white opacity-80 hover:opacity-100 flex items-center gap-2 transition-opacity"
                  >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                  </button>
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Analyst Management
                </h1>
                <p className="text-indigo-100 mt-1">
                  Monitor and manage analyst performance, workload, and
                  permissions
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => fetchAnalysts()}
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 border border-white/20 disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
                <button
                  onClick={handleCreateAnalyst}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 border border-white/20"
                >
                  <UserPlus size={18} />
                  Add Analyst
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {analysts.length}
                </div>
                <div className="text-sm text-gray-600">Total Analysts</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="text-green-600" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {
                    analysts.filter((a) => a.is_active || a.status === "active")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Active Analysts</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="text-purple-600" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {
                    analysts.filter(
                      (a) => (a.role?.name || a.role) === "senior_analyst"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Senior Analysts</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="text-orange-600" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {analysts.length > 0
                    ? Math.round(
                        analysts.reduce(
                          (acc, a) => acc + (a.avgAccuracy || 0),
                          0
                        ) / analysts.length
                      )
                    : 0}
                  %
                </div>
                <div className="text-sm text-gray-600">Avg Performance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search analysts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-2">
              {["all", "active", "inactive", "senior"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedAnalysts.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">
                  {selectedAnalysts.length} analyst
                  {selectedAnalysts.length > 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction("activate")}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction("deactivate")}
                    className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analysts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Analyst List ({filteredAnalysts.length})
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredAnalysts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No analysts found</p>
              <p className="text-gray-500 text-sm mt-1">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Create your first analyst account"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
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
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Analyst
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAnalysts.map((analyst) => (
                    <tr key={analyst.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
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
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-indigo-600">
                                {(
                                  analyst.first_name ||
                                  analyst.firstName ||
                                  ""
                                ).charAt(0)}
                                {(
                                  analyst.last_name ||
                                  analyst.lastName ||
                                  ""
                                ).charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {analyst.first_name || analyst.firstName}{" "}
                              {analyst.last_name || analyst.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {analyst.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {analyst.department}
                        </div>
                        <div
                          className={`text-sm px-2 py-1 rounded-full border ${getRoleColor(
                            analyst
                          )}`}
                        >
                          {(
                            analyst.role?.name ||
                            analyst.role ||
                            "analyst"
                          ).replace("_", " ")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(
                            analyst.assigned_categories ||
                            analyst.assignedCategories ||
                            []
                          )
                            .slice(0, 2)
                            .map((category) => (
                              <span
                                key={category}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {category}
                              </span>
                            ))}
                          {(
                            analyst.assigned_categories ||
                            analyst.assignedCategories ||
                            []
                          ).length > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              +
                              {(
                                analyst.assigned_categories ||
                                analyst.assignedCategories ||
                                []
                              ).length - 2}
                            </span>
                          )}
                          {(!analyst.assigned_categories &&
                            !analyst.assignedCategories) ||
                            ((
                              analyst.assigned_categories ||
                              analyst.assignedCategories ||
                              []
                            ).length === 0 && (
                              <span className="text-xs text-gray-400">
                                No categories
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${getPerformanceColor(
                            analyst.avgAccuracy || 0
                          )}`}
                        >
                          {analyst.avgAccuracy || 0}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {analyst.completedForecasts || 0}/
                          {analyst.totalForecasts || 0} completed
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(analyst.date_joined || analyst.joinDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Last:{" "}
                          {formatDate(analyst.last_login || analyst.lastLogin)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            analyst
                          )}`}
                        >
                          {analyst.is_active !== undefined
                            ? analyst.is_active
                              ? "active"
                              : "inactive"
                            : analyst.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewAnalyst(analyst)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditAnalyst(analyst)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="Edit Analyst"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(analyst.id)}
                            className={`p-1 rounded transition-colors ${
                              (
                                analyst.is_active !== undefined
                                  ? analyst.is_active
                                  : analyst.status === "active"
                              )
                                ? "text-orange-600 hover:text-orange-900"
                                : "text-green-600 hover:text-green-900"
                            }`}
                            title={
                              (
                                analyst.is_active !== undefined
                                  ? analyst.is_active
                                  : analyst.status === "active"
                              )
                                ? "Deactivate"
                                : "Activate"
                            }
                          >
                            {(
                              analyst.is_active !== undefined
                                ? analyst.is_active
                                : analyst.status === "active"
                            ) ? (
                              <Ban size={16} />
                            ) : (
                              <Unlock size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteAnalyst(analyst.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                            title="Delete Analyst"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
