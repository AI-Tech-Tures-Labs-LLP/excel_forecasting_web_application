import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Monitor,
  Shield,
  Sparkles,
  Bell,
  RefreshCw,
} from "lucide-react";

const DashboardHeader = ({
  currentUser,
  isAdmin,
  notifications,
  refreshing,
  onRefresh,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate("/")}
                className="text-white/80 hover:text-white flex items-center gap-2 transition-all duration-200 hover:gap-3 group"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                <span className="text-sm font-medium">Back to Home</span>
              </button>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Monitor className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">
                  {isAdmin ? "Admin Dashboard" : "Dashboard"}
                </h1>
                <p className="text-blue-100 text-lg">
                  Welcome back,{" "}
                  <span className="font-semibold text-white">
                    {currentUser?.username}
                  </span>
                </p>
              </div>
            </div>
            <p className="text-slate-300 mb-4 max-w-2xl">
              Comprehensive system overview with real-time analytics and
              performance insights. Monitor your team's progress and manage
              operations efficiently.
            </p>
            {isAdmin && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-400/30">
                  <Shield size={14} className="text-emerald-300" />
                  <span className="text-emerald-100 text-sm font-medium">
                    Administrator Access
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-400/30">
                  <Sparkles size={14} className="text-blue-300" />
                  <span className="text-blue-100 text-sm">
                    Premium Features Enabled
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl transition-all duration-200 hover:scale-105 border border-white/20 group">
                <Bell size={20} className="group-hover:animate-pulse" />
                {notifications.filter((n) => n.unread).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium shadow-lg animate-pulse">
                    {notifications.filter((n) => n.unread).length}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={onRefresh}
              disabled={refreshing}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
