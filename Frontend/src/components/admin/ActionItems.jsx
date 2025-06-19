import React from "react";
import { AlertTriangle, Users, TrendingDown, CheckCircle } from "lucide-react";

const ActionItems = ({ stats }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
          <AlertTriangle className="text-white" size={18} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Action Items</h3>
      </div>

      <div className="space-y-3">
        {stats.pendingTasks > 10 && (
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
            <AlertTriangle
              size={16}
              className="text-amber-600 mt-0.5 flex-shrink-0"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">
                High Pending Tasks
              </p>
              <p className="text-xs text-amber-600">
                {stats.pendingTasks} tasks need review
              </p>
            </div>
          </div>
        )}

        {stats.activeAnalysts < stats.totalAnalysts && (
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <Users size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">
                Inactive Analysts
              </p>
              <p className="text-xs text-blue-600">
                {stats.totalAnalysts - stats.activeAnalysts} analysts offline
              </p>
            </div>
          </div>
        )}

        {stats.completionRate < 80 && (
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
            <TrendingDown
              size={16}
              className="text-red-600 mt-0.5 flex-shrink-0"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                Low Completion Rate
              </p>
              <p className="text-xs text-red-600">
                Only {stats.completionRate}% completion
              </p>
            </div>
          </div>
        )}

        {stats.pendingTasks <= 10 &&
          stats.activeAnalysts === stats.totalAnalysts &&
          stats.completionRate >= 80 && (
            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <CheckCircle
                size={16}
                className="text-emerald-600 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-800">
                  All Systems Optimal
                </p>
                <p className="text-xs text-emerald-600">
                  Everything running smoothly
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ActionItems;
