// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import { Eye, EyeOff, Lock, User, Mail, UserPlus, Shield } from "lucide-react";
// import {
//   registerUser,
//   clearError,
//   selectRegisterLoading,
//   selectAuthError,
// } from "../../redux/authSlice";

// const RegisterPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const loading = useSelector(selectRegisterLoading);
//   const error = useSelector(selectAuthError);

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "viewer",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [validation, setValidation] = useState({});

//   const roles = [
//     {
//       value: "admin",
//       label: "Administrator",
//       description: "Full system access",
//     },
//     {
//       value: "manager",
//       label: "Manager",
//       description: "Manage products and reports",
//     },
//     {
//       value: "analyst",
//       label: "Analyst",
//       description: "Create and analyze forecasts",
//     },
//     { value: "viewer", label: "Viewer", description: "View-only access" },
//   ];

//   const validateForm = () => {
//     const errors = {};

//     if (!formData.username.trim()) {
//       errors.username = "Username is required";
//     } else if (formData.username.length < 3) {
//       errors.username = "Username must be at least 3 characters";
//     }

//     if (!formData.email.trim()) {
//       errors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       errors.email = "Invalid email format";
//     }

//     if (!formData.password) {
//       errors.password = "Password is required";
//     } else if (formData.password.length < 8) {
//       errors.password = "Password must be at least 8 characters";
//     }

//     if (formData.password !== formData.confirmPassword) {
//       errors.confirmPassword = "Passwords do not match";
//     }

//     setValidation(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear validation error for this field
//     if (validation[name]) {
//       setValidation((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     try {
//       await dispatch(
//         registerUser({
//           username: formData.username,
//           email: formData.email,
//           password: formData.password,
//           role: formData.role,
//         })
//       ).unwrap();

//       navigate("/login", {
//         state: { message: "Registration successful! Please sign in." },
//       });
//     } catch (error) {
//       // Error is handled by Redux
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
//         <div className="text-center mb-8">
//           <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
//             <UserPlus className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
//           <p className="text-gray-600 mt-2">Join our forecasting platform</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//               <p className="text-red-600 text-sm">{error}</p>
//             </div>
//           )}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Username
//             </label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   validation.username
//                     ? "border-red-300 focus:ring-red-500"
//                     : "border-gray-300"
//                 }`}
//                 placeholder="Choose a username"
//               />
//             </div>
//             {validation.username && (
//               <p className="mt-1 text-sm text-red-600">{validation.username}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email
//             </label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   validation.email
//                     ? "border-red-300 focus:ring-red-500"
//                     : "border-gray-300"
//                 }`}
//                 placeholder="Enter your email"
//               />
//             </div>
//             {validation.email && (
//               <p className="mt-1 text-sm text-red-600">{validation.email}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Role
//             </label>
//             <div className="relative">
//               <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 {roles.map((role) => (
//                   <option key={role.value} value={role.value}>
//                     {role.label} - {role.description}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   validation.password
//                     ? "border-red-300 focus:ring-red-500"
//                     : "border-gray-300"
//                 }`}
//                 placeholder="Create a password"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//             {validation.password && (
//               <p className="mt-1 text-sm text-red-600">{validation.password}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   validation.confirmPassword
//                     ? "border-red-300 focus:ring-red-500"
//                     : "border-gray-300"
//                 }`}
//                 placeholder="Confirm your password"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showConfirmPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//             {validation.confirmPassword && (
//               <p className="mt-1 text-sm text-red-600">
//                 {validation.confirmPassword}
//               </p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Creating account...
//               </>
//             ) : (
//               <>
//                 <UserPlus className="w-5 h-5" />
//                 Create Account
//               </>
//             )}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <p className="text-gray-600">
//             Already have an account?{" "}
//             <Link
//               to="/login"
//               className="text-green-600 hover:text-green-700 font-medium"
//             >
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;

// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import { Eye, EyeOff, Lock, User, Mail, UserPlus, Shield } from "lucide-react";
// import {
//   registerUser,
//   clearError,
//   selectRegisterLoading,
//   selectAuthError,
//   selectCurrentUser, // Add this selector to check if user is admin
// } from "../../redux/authSlice";

// const RegisterPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const loading = useSelector(selectRegisterLoading);
//   const error = useSelector(selectAuthError);
//   const currentUser = useSelector(selectCurrentUser); // Get current user to check admin status

//   // Redirect if not admin (this should ideally be handled by routing/auth guards)
//   React.useEffect(() => {
//     if (currentUser && currentUser.role !== "admin") {
//       navigate("/dashboard"); // or wherever non-admins should go
//     }
//   }, [currentUser, navigate]);

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "analyst", // Default to analyst since admins create analyst users
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [validation, setValidation] = useState({});

//   // Only allow admin to create analyst users
//   const roles = [
//     {
//       value: "analyst",
//       label: "Analyst",
//       description: "Create and analyze forecasts",
//     },
//     {
//       value: "viewer",
//       label: "Viewer",
//       description: "View-only access",
//     },
//   ];

//   const validateForm = () => {
//     const errors = {};

//     if (!formData.username.trim()) {
//       errors.username = "Username is required";
//     } else if (formData.username.length < 3) {
//       errors.username = "Username must be at least 3 characters";
//     }

//     if (!formData.email.trim()) {
//       errors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       errors.email = "Invalid email format";
//     }

//     if (!formData.password) {
//       errors.password = "Password is required";
//     } else if (formData.password.length < 8) {
//       errors.password = "Password must be at least 8 characters";
//     }

//     if (formData.password !== formData.confirmPassword) {
//       errors.confirmPassword = "Passwords do not match";
//     }

//     setValidation(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear validation error for this field
//     if (validation[name]) {
//       setValidation((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     try {
//       await dispatch(
//         registerUser({
//           username: formData.username,
//           email: formData.email,
//           password: formData.password,
//           role: formData.role,
//         })
//       ).unwrap();

//       // Success message and redirect to user management or dashboard
//       navigate("/users", {
//         state: { message: "User created successfully!" },
//       });
//     } catch (error) {
//       // Error is handled by Redux
//     }
//   };

//   // Show loading or unauthorized message if not admin
//   if (!currentUser || currentUser.role !== "admin") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
//           <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
//             <Shield className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">
//             Access Denied
//           </h1>
//           <p className="text-gray-600 mb-4">
//             Only administrators can create new users.
//           </p>
//           <Link
//             to="/dashboard"
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Return to Dashboard
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
//         <div className="text-center mb-8">
//           <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
//             <UserPlus className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
//           <p className="text-gray-600 mt-2">Add a new user to the platform</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//               <p className="text-red-600 text-sm">{error}</p>
//             </div>
//           )}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Username
//             </label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   validation.username
//                     ? "border-red-300 focus:ring-red-500"
//                     : "border-gray-300"
//                 }`}
//                 placeholder="Enter username"
//               />
//             </div>
//             {validation.username && (
//               <p className="mt-1 text-sm text-red-600">{validation.username}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email
//             </label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   validation.email
//                     ? "border-red-300 focus:ring-red-500"
//                     : "border-gray-300"
//                 }`}
//                 placeholder="Enter email address"
//               />
//             </div>
//             {validation.email && (
//               <p className="mt-1 text-sm text-red-600">{validation.email}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Role
//             </label>
//             <div className="relative">
//               <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 {roles.map((role) => (
//                   <option key={role.value} value={role.value}>
//                     {role.label} - {role.description}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   validation.password
//                     ? "border-red-300 focus:ring-red-500"
//                     : "border-gray-300"
//                 }`}
//                 placeholder="Set user password"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//             {validation.password && (
//               <p className="mt-1 text-sm text-red-600">{validation.password}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                   validation.confirmPassword
//                     ? "border-red-300 focus:ring-red-500"
//                     : "border-gray-300"
//                 }`}
//                 placeholder="Confirm password"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showConfirmPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//             {validation.confirmPassword && (
//               <p className="mt-1 text-sm text-red-600">
//                 {validation.confirmPassword}
//               </p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Creating user...
//               </>
//             ) : (
//               <>
//                 <UserPlus className="w-5 h-5" />
//                 Create User
//               </>
//             )}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <Link
//             to="/users"
//             className="text-green-600 hover:text-green-700 font-medium"
//           >
//             ← Back to User Management
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, User, Mail, UserPlus, Shield } from "lucide-react";
import {
  registerUser,
  clearError,
  selectRegisterLoading,
  selectAuthError,
} from "../../redux/authSlice";
import ProtectedRoute from "./ProtectedRoute";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectRegisterLoading);
  const error = useSelector(selectAuthError);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "analyst", // Default to analyst since admins create analyst users
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validation, setValidation] = useState({});

  // Only allow admin to create analyst users
  const roles = [
    {
      value: "analyst",
      label: "Analyst",
      description: "Create and analyze forecasts",
    },
  ];

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validation[name]) {
      setValidation((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(
        registerUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        })
      ).unwrap();

      // Success message and redirect to user management or dashboard
      navigate("/file-upload", {
        state: { message: "Analyst user created successfully!" },
      });
    } catch (error) {
      // Error is handled by Redux
    }
  };

  // Show loading or unauthorized message if not admin
  return (
    <ProtectedRoute requiredPermission="admin">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Analyst
            </h1>
            <p className="text-gray-600 mt-2">
              Add a new analyst user to the platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    validation.username
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter username"
                />
              </div>
              {validation.username && (
                <p className="mt-1 text-sm text-red-600">
                  {validation.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    validation.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter email address"
                />
              </div>
              {validation.email && (
                <p className="mt-1 text-sm text-red-600">{validation.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    validation.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Set user password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {validation.password && (
                <p className="mt-1 text-sm text-red-600">
                  {validation.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    validation.confirmPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {validation.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {validation.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating analyst...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Analyst User
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/file-upload"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default RegisterPage;
