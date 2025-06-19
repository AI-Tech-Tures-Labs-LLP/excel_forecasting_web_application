import React from "react";
import { TrendingUp } from "lucide-react";

const StatsCards = ({ stats }) => {
  const statCards = [
    {
      title: "Total Analysts",
      value: stats.totalAnalysts,
      change: `${stats.activeAnalysts} active`,
      changeType:
        stats.activeAnalysts === stats.totalAnalysts ? "positive" : "neutral",
      icon: "Users",
      gradient: "from-blue-500 to-blue-600",
      trend: "+2 this month",
      percentage: Math.round(
        (stats.activeAnalysts / stats.totalAnalysts) * 100
      ),
    },
    {
      title: "Active Forecasts",
      value: stats.totalForecasts,
      change: `${stats.pendingTasks} pending`,
      changeType: stats.pendingTasks < 10 ? "positive" : "warning",
      icon: "TrendingUp",
      gradient: "from-purple-500 to-purple-600",
      trend: "+18 this week",
      percentage: stats.totalForecasts
        ? Math.round(
            ((stats.totalForecasts - stats.pendingTasks) /
              stats.totalForecasts) *
              100
          )
        : 0,
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      change:
        stats.completionRate > 80
          ? "Excellent"
          : stats.completionRate > 60
          ? "Good"
          : "Needs Attention",
      changeType:
        stats.completionRate > 80
          ? "positive"
          : stats.completionRate > 60
          ? "neutral"
          : "negative",
      icon: "Target",
      gradient: "from-emerald-500 to-emerald-600",
      trend: "+5% from last month",
      percentage: stats.completionRate,
    },
    {
      title: "Avg Performance",
      value: `${stats.avgPerformance}%`,
      change: "Cross-team average",
      changeType: stats.avgPerformance > 85 ? "positive" : "neutral",
      icon: "Award",
      gradient: "from-orange-500 to-orange-600",
      trend:
        stats.avgPerformance > 85 ? "Above target" : "Room for improvement",
      percentage: stats.avgPerformance,
    },
  ];

  // Map icon names to actual components (you'd import these at the top)
  const getIconComponent = (iconName) => {
    // For now, using TrendingUp as fallback
    // You would import and map all needed icons here
    return TrendingUp;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => {
        const IconComponent = getIconComponent(card.icon);
        return (
          <div
            key={index}
            className="group bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/90 relative overflow-hidden"
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            ></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}
                >
                  <IconComponent className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {card.value}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">
                    {card.title}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${
                      card.changeType === "positive"
                        ? "text-emerald-600"
                        : card.changeType === "negative"
                        ? "text-red-600"
                        : card.changeType === "warning"
                        ? "text-amber-600"
                        : "text-slate-600"
                    }`}
                  >
                    {card.change}
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {card.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${card.gradient} shadow-sm`}
                    style={{ width: `${card.percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{card.trend}</span>
                <TrendingUp
                  size={14}
                  className="text-slate-400 group-hover:text-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
