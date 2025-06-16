// // src/components/LoginPage.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { Lock, User, Eye, EyeOff } from "lucide-react";
// import { useAuth } from "../App"; // Import from your App.jsx
// import { addToast } from "../redux/uiSlice"; // Assuming you have this action

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.username.trim()) {
//       newErrors.username = "Username is required";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsLoading(true);

//     // Simulate loading delay
//     setTimeout(() => {
//       if (formData.username === "Shrey" && formData.password === "Shrey@123") {
//         login(formData.username);

//         // Show success toast
//         dispatch(
//           addToast({
//             type: "success",
//             message: `Hi, ${formData.username}!`,
//           })
//         );

//         navigate("/", { replace: true });
//       } else {
//         setErrors({
//           general: "Invalid username or password. Please try again.",
//         });

//         // Show error toast
//         dispatch(
//           addToast({
//             type: "error",
//             message: "Invalid credentials. Please try again.",
//           })
//         );
//       }
//       setIsLoading(false);
//     }, 1000);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear errors when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//     if (errors.general) {
//       setErrors((prev) => ({
//         ...prev,
//         general: "",
//       }));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
//       <div className="max-w-md w-full">
//         <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
//           <div className="text-center mb-8">
//             <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Lock size={32} className="text-white" />
//             </div>
//             <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
//             <p className="text-gray-300">Sign in to access your dashboard</p>
//           </div>

//           {errors.general && (
//             <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6">
//               <p className="text-red-200 text-sm text-center">
//                 {errors.general}
//               </p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label
//                 htmlFor="username"
//                 className="block text-sm font-medium text-gray-200 mb-2"
//               >
//                 Username
//               </label>
//               <div className="relative">
//                 <User
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   size={20}
//                 />
//                 <input
//                   type="text"
//                   id="username"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
//                     errors.username ? "border-red-500" : "border-white/30"
//                   }`}
//                   placeholder="Enter your username"
//                 />
//               </div>
//               {errors.username && (
//                 <p className="text-red-400 text-sm mt-1">{errors.username}</p>
//               )}
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-200 mb-2"
//               >
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   size={20}
//                 />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
//                     errors.password ? "border-red-500" : "border-white/30"
//                   }`}
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-400 text-sm mt-1">{errors.password}</p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Signing In...
//                 </div>
//               ) : (
//                 "Sign In"
//               )}
//             </button>
//           </form>

//           <div className="mt-6 text-center"></div>
//         </div>

//         <div className="mt-6 text-center">
//           <p className="text-gray-400 text-xs">
//             © 2025 Data Processing Tools. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
