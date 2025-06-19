import React from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ExternalLink, Upload } from "lucide-react";

const RecentActivity = ({ recentActivities }) => {
  const navigate = useNavigate();

  const getActivityColor = (type) => {
    switch (type) {
      case "success":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "warning":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <Activity className="text-white" size={16} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
        </div>
        <button
          onClick={() => navigate("/file-upload")}
          className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          View All
          <ExternalLink size={12} />
        </button>
      </div>
      <div className="max-h-[525px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent space-y-3">
        {recentActivities.length > 0 ? (
          recentActivities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div
                key={activity.id}
                className="group flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50/50 transition-all duration-200 border border-transparent hover:border-slate-200/50"
              >
                <div
                  className={`p-1.5 rounded-lg border ${getActivityColor(
                    activity.type
                  )} group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}
                >
                  <IconComponent size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {activity.user}
                    </p>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-1">
                    {activity.action}
                  </p>
                  <p
                    className="text-xs text-blue-600 font-medium truncate mb-2"
                    title={activity.target}
                  >
                    {activity.target}
                  </p>

                  {activity.categories && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {activity.categories
                        .split(", ")
                        .slice(0, 2)
                        .map((cat, i) => (
                          <span
                            key={i}
                            className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full"
                          >
                            {cat}
                          </span>
                        ))}
                      {activity.categories.split(", ").length > 2 && (
                        <span className="text-xs text-slate-400">
                          +{activity.categories.split(", ").length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {activity.percentage && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                          {activity.percentage}%
                        </span>
                      )}
                      {activity.monthRange && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">
                          {activity.monthRange}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                        activity.status === "processed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {activity.status === "processed" ? "✓" : "⏳"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Upload size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium mb-1 text-sm">
              No recent uploads
            </p>
            <p className="text-slate-400 text-xs mb-3">
              Start by uploading your first file
            </p>
            <button
              onClick={() => navigate("/file-upload")}
              className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:underline"
            >
              Upload File →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
