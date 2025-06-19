import React from "react";
import { BarChart3, PieChart, Crown, Layers } from "lucide-react";

const QuickInsights = ({ stats, performanceData }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
          <BarChart3 className="text-white" size={18} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Quick Insights</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <PieChart size={16} className="text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              Avg Tasks/Analyst
            </span>
          </div>
          <span className="text-lg font-bold text-slate-900">
            {Math.round(stats.totalForecasts / (stats.totalAnalysts || 1))}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <Crown size={16} className="text-amber-500" />
            <span className="text-sm font-medium text-slate-700">
              Top Performer
            </span>
          </div>
          <span className="text-sm font-bold text-slate-900">
            {performanceData.length > 0
              ? performanceData
                  .reduce((prev, current) =>
                    prev.performance > current.performance ? prev : current
                  )
                  .name.split(" ")[0]
              : "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <Layers size={16} className="text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              Categories
            </span>
          </div>
          <span className="text-lg font-bold text-slate-900">
            {stats.categoriesManaged}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickInsights;
