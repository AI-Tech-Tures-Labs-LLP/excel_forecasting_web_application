import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  FileSpreadsheet,
  TrendingUp,
  List,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Mock user data - replace with actual user data from your auth context
  const user = {
    name: "Shrey",
    avatar: null, // Set to null to show initials instead
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine if a link is active
  const isActive = (path) => {
    return location.pathname === path
      ? "text-indigo-600 border-indigo-600"
      : "text-gray-600 border-transparent hover:text-indigo-600 hover:border-indigo-300";
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    // For example:
    // - Clear localStorage/sessionStorage
    // - Clear auth tokens
    // - Redirect to login page
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="text-xl font-bold text-gray-800 flex items-center gap-2"
              >
                <span className="text-indigo-600">
                  <HomeIcon size={24} />
                </span>
                Dashboard
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/pricing"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive(
                  "/pricing"
                )}`}
              >
                <FileSpreadsheet className="mr-2" size={18} />
                Pricing Tool
              </Link>
              <Link
                to="/forecast"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive(
                  "/forecast"
                )}`}
              >
                <TrendingUp className="mr-2" size={18} />
                Forecast
              </Link>
              <Link
                to="/products"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive(
                  "/products"
                )}`}
              >
                <List className="mr-2" size={18} />
                Product Selector
              </Link>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center">
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {/* Profile Avatar */}
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <span className="hidden md:block">{user.name}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt="Profile"
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  {/* <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        // Navigate to profile page or open profile modal
                        console.log("View Profile clicked");
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User size={16} />
                      View Profile
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        // Navigate to settings page
                        console.log("Settings clicked");
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                  </div> */}

                  {/* Logout */}
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - shows at bottom of screen on small devices */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3">
        <div className="flex justify-around">
          <Link
            to="/pricing"
            className={`flex flex-col items-center px-3 py-2 rounded-md text-xs font-medium ${
              location.pathname === "/pricing"
                ? "text-indigo-600"
                : "text-gray-600"
            }`}
          >
            <FileSpreadsheet size={20} />
            <span className="mt-1">Pricing</span>
          </Link>
          <Link
            to="/forecast"
            className={`flex flex-col items-center px-3 py-2 rounded-md text-xs font-medium ${
              location.pathname === "/forecast"
                ? "text-indigo-600"
                : "text-gray-600"
            }`}
          >
            <TrendingUp size={20} />
            <span className="mt-1">Forecast</span>
          </Link>
          <Link
            to="/products"
            className={`flex flex-col items-center px-3 py-2 rounded-md text-xs font-medium ${
              location.pathname === "/products"
                ? "text-indigo-600"
                : "text-gray-600"
            }`}
          >
            <List size={20} />
            <span className="mt-1">Products</span>
          </Link>
          {/* Mobile Profile */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex flex-col items-center px-3 py-2 rounded-md text-xs font-medium text-gray-600"
          >
            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {getInitials(user.name).slice(0, 1)}
            </div>
            <span className="mt-1">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;