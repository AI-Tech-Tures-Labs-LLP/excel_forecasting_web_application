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
} from "lucide-react";
import { logout, selectUser, selectUserRole } from "../redux/authSlice";
import RoleBasedComponent from "./auth/RoleBasedComponent";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);

  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    {
      path: "/dashboard",
      icon: Home,
      label: "Dashboard",
      permission: "dashboard",
    },
    {
      path: "/file-upload",
      icon: Upload,
      label: "Upload",
      permission: "forecast",
    },
    {
      path: "/forecast",
      icon: TrendingUp,
      label: "Forecast",
      permission: "forecast",
    },
    {
      path: "/products",
      icon: Package,
      label: "Products",
      permission: "products",
    },
    {
      path: "/settings",
      icon: Settings,
      label: "Settings",
      permission: "settings",
    },
  ];

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      manager: "bg-blue-100 text-blue-800",
      analyst: "bg-green-100 text-green-800",
      viewer: "bg-gray-100 text-gray-800",
    };
    return colors[role] || colors.viewer;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Forecast Pro</h1>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navItems.map((item) => (
                <RoleBasedComponent
                  key={item.path}
                  requiredPermission={item.permission}
                >
                  <button
                    onClick={() => navigate(item.path)}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === item.path
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                </RoleBasedComponent>
              ))}
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
                      {user?.username || "User"}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(
                          userRole
                        )}`}
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {userRole}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </button>

              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900">{user?.username}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    <RoleBasedComponent requiredPermission="settings">
                      <button
                        onClick={() => navigate("/profile")}
                        className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <User className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                        Profile Settings
                      </button>
                    </RoleBasedComponent>

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
          {navItems.map((item) => (
            <RoleBasedComponent
              key={item.path}
              requiredPermission={item.permission}
            >
              <button
                onClick={() => navigate(item.path)}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left ${
                  location.pathname === item.path
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </div>
              </button>
            </RoleBasedComponent>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
