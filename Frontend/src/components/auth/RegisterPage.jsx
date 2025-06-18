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
// import ProtectedRoute from "./ProtectedRoute";

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
//       navigate("/file-upload", {
//         state: { message: "Analyst user created successfully!" },
//       });
//     } catch (error) {
//       // Error is handled by Redux
//     }
//   };

//   // Show loading or unauthorized message if not admin
//   return (
//     <ProtectedRoute requiredPermission="admin">
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
//           <div className="text-center mb-8">
//             <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
//               <UserPlus className="w-8 h-8 text-white" />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Create New Analyst
//             </h1>
//             <p className="text-gray-600 mt-2">
//               Add a new analyst user to the platform
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                 <p className="text-red-600 text-sm">{error}</p>
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Username
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                     validation.username
//                       ? "border-red-300 focus:ring-red-500"
//                       : "border-gray-300"
//                   }`}
//                   placeholder="Enter username"
//                 />
//               </div>
//               {validation.username && (
//                 <p className="mt-1 text-sm text-red-600">
//                   {validation.username}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                     validation.email
//                       ? "border-red-300 focus:ring-red-500"
//                       : "border-gray-300"
//                   }`}
//                   placeholder="Enter email address"
//                 />
//               </div>
//               {validation.email && (
//                 <p className="mt-1 text-sm text-red-600">{validation.email}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Role
//               </label>
//               <div className="relative">
//                 <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   {roles.map((role) => (
//                     <option key={role.value} value={role.value}>
//                       {role.label} - {role.description}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                     validation.password
//                       ? "border-red-300 focus:ring-red-500"
//                       : "border-gray-300"
//                   }`}
//                   placeholder="Set user password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//               {validation.password && (
//                 <p className="mt-1 text-sm text-red-600">
//                   {validation.password}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
//                     validation.confirmPassword
//                       ? "border-red-300 focus:ring-red-500"
//                       : "border-gray-300"
//                   }`}
//                   placeholder="Confirm password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//               {validation.confirmPassword && (
//                 <p className="mt-1 text-sm text-red-600">
//                   {validation.confirmPassword}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Creating analyst...
//                 </>
//               ) : (
//                 <>
//                   <UserPlus className="w-5 h-5" />
//                   Create Analyst User
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <Link
//               to="/file-upload"
//               className="text-green-600 hover:text-green-700 font-medium"
//             >
//               ← Back to Dashboard
//             </Link>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default RegisterPage;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  UserPlus,
  Shield,
  Crown,
} from "lucide-react";
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
    role: "analyst", // Default to analyst
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validation, setValidation] = useState({});

  // Allow admin to create both analyst and admin users
  const roles = [
    {
      value: "analyst",
      label: "Analyst",
      description: "Create and analyze forecasts",
      icon: User,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      value: "admin",
      label: "Administrator",
      description: "Full system access and user management",
      icon: Crown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
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

  const handleRoleSelect = (roleValue) => {
    setFormData((prev) => ({
      ...prev,
      role: roleValue,
    }));
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

      // Success message and redirect based on role created
      const userType = formData.role === "admin" ? "Administrator" : "Analyst";
      navigate("/dashboard", {
        state: { message: `${userType} user created successfully!` },
      });
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const selectedRole = roles.find((role) => role.value === formData.role);

  return (
    <ProtectedRoute requiredPermission="admin">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New User
            </h1>
            <p className="text-gray-600 mt-2">
              Add a new{" "}
              {formData.role === "admin" ? "administrator" : "analyst"} to the
              platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                User Role
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roles.map((role) => {
                  const IconComponent = role.icon;
                  const isSelected = formData.role === role.value;
                  return (
                    <div
                      key={role.value}
                      onClick={() => handleRoleSelect(role.value)}
                      className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                        isSelected
                          ? `${role.borderColor} ${role.bgColor} shadow-sm`
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 ${
                            isSelected ? role.color : "text-gray-400"
                          }`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h3
                              className={`text-sm font-medium ${
                                isSelected ? role.color : "text-gray-900"
                              }`}
                            >
                              {role.label}
                              {role.value === "admin" && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  Super User
                                </span>
                              )}
                            </h3>
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? `${role.borderColor.replace(
                                      "border-",
                                      "border-"
                                    )} ${role.bgColor}`
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <div
                                  className={`w-2 h-2 rounded-full ${role.color.replace(
                                    "text-",
                                    "bg-"
                                  )}`}
                                ></div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {role.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

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
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
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
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
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
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    validation.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Set user password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
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
                  className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    validation.confirmPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

            {/* Admin Creation Warning */}
            {formData.role === "admin" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-amber-600 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800">
                      Creating Administrator Account
                    </h4>
                    <p className="text-sm text-amber-700 mt-1">
                      This user will have full system access including user
                      management, forecast generation, and system administration
                      privileges.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 ${
                formData.role === "admin"
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating{" "}
                  {formData.role === "admin" ? "administrator" : "analyst"}...
                </>
              ) : (
                <>
                  {selectedRole && <selectedRole.icon className="w-5 h-5" />}
                  Create{" "}
                  {formData.role === "admin" ? "Administrator" : "Analyst"} User
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/dashboard"
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
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
