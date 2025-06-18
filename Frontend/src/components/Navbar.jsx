import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Upload,
  TrendingUp,
  Package,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import { logout, selectUser, selectUserRole } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);

  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      manager: "bg-blue-100 text-blue-800",
      analyst: "bg-green-100 text-green-800",
      viewer: "bg-gray-100 text-gray-800",
    };
    return colors[role] || colors.viewer;
  };

  const handleNavigate = (path) => {
    navigate(path);
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Home button */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                Forecast System
              </h1>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <button
                onClick={() => navigate("/dashboard")}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-700">
                      {currentUser?.username || user?.username || "User"}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(
                          currentUser?.role || userRole
                        )}`}
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {currentUser?.role || userRole}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </button>

              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900">
                      {currentUser?.username || user?.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {currentUser?.email || user?.email}
                    </p>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(
                          currentUser?.role || userRole
                        )}`}
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {currentUser?.role || userRole}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Options */}
                  <div className="py-1">
                    <button
                      onClick={() => handleNavigate("/dashboard")}
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Home className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                      Dashboard
                    </button>

                    <button
                      onClick={() => handleNavigate("/file-upload")}
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Upload className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                      Files
                    </button>

                    {/* <button
                      onClick={() => handleNavigate("/products")}
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Package className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                      Products
                    </button> */}

                    {/* Admin-only options */}
                    {currentUser?.role === "admin" && (
                      <>
                        <button
                          onClick={() => handleNavigate("/forecast")}
                          className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <TrendingUp className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                          Generate Forecast
                          <span className="ml-auto px-1 py-0.5 text-xs bg-red-100 text-red-600 rounded">
                            Admin
                          </span>
                        </button>

                        <button
                          onClick={() => handleNavigate("/analysts")}
                          className={`group flex items-center px-4 py-2 text-sm w-full text-left transition-colors ${
                            location.pathname === "/analysts"
                              ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <Users
                            className={`mr-3 h-4 w-4 ${
                              location.pathname === "/analysts"
                                ? "text-indigo-500"
                                : "text-gray-400 group-hover:text-gray-500"
                            }`}
                          />
                          Manage Analysts
                          <span className="ml-auto px-1 py-0.5 text-xs bg-red-100 text-red-600 rounded">
                            Admin
                          </span>
                        </button>

                        <button
                          onClick={() => handleNavigate("/register")}
                          className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <UserPlus className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                          Create Analyst
                          <span className="ml-auto px-1 py-0.5 text-xs bg-red-100 text-red-600 rounded">
                            Admin
                          </span>
                        </button>
                      </>
                    )}

                    {/* <button
                      onClick={() => handleNavigate("/settings")}
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                      Settings
                    </button> */}
                  </div>

                  {/* User Actions */}
                  <div className="py-1">
                    {/* <button
                      onClick={() => handleNavigate("/profile")}
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <User className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                      Profile Settings
                    </button> */}

                    <button
                      onClick={handleLogout}
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <button
            onClick={() => navigate("/dashboard")}
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left ${
              location.pathname === "/dashboard"
                ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-3" />
              Home
            </div>
          </button>

          {/* Mobile Admin Menu Items */}
          {currentUser?.role === "admin" && (
            <>
              <button
                onClick={() => navigate("/analysts")}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left ${
                  location.pathname === "/analysts"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-3" />
                  Manage Analysts
                  <span className="ml-auto px-1 py-0.5 text-xs bg-red-100 text-red-600 rounded">
                    Admin
                  </span>
                </div>
              </button>

              <button
                onClick={() => navigate("/forecast")}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left ${
                  location.pathname === "/forecast"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-3" />
                  Generate Forecast
                  <span className="ml-auto px-1 py-0.5 text-xs bg-red-100 text-red-600 rounded">
                    Admin
                  </span>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
