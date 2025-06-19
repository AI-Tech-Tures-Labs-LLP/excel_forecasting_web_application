import React from "react";
import { Monitor, Database, Workflow } from "lucide-react";

const SystemHealth = () => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
          <Monitor className="text-white" size={18} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">System Health</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-800">
              System Status
            </span>
          </div>
          <span className="text-sm font-bold text-emerald-700">
            Operational
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <Database size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Database</span>
          </div>
          <span className="text-sm font-bold text-blue-700">99.9% Uptime</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-center gap-3">
            <Workflow size={16} className="text-purple-600" />
            <span className="text-sm font-medium text-purple-800">
              API Response
            </span>
          </div>
          <span className="text-sm font-bold text-purple-700">245ms avg</span>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
