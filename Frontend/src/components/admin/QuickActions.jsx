import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowRight } from "lucide-react";

const QuickActions = ({ stats, isAdmin, filteredActions }) => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
            <Zap className="text-white" size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
        </div>
        <div className="text-sm text-slate-500">
          {filteredActions.length} available actions
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <div
              key={action.path}
              onClick={() => handleCardClick(action.path)}
              className="group relative bg-white/60 backdrop-blur-sm border border-white/40 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white/80 overflow-hidden"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${action.iconBg} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent size={24} className={action.iconColor} />
                  </div>
                  <ArrowRight
                    className="opacity-0 group-hover:opacity-100 text-slate-400 group-hover:translate-x-1 transition-all duration-300"
                    size={20}
                  />
                </div>

                <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-slate-800">
                  {action.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  {action.description}
                </p>

                <div className="flex items-center justify-between">
                  {action.count !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-slate-800">
                        {action.count}
                      </span>
                      <span className="text-sm text-slate-500">items</span>
                    </div>
                  )}
                  {action.badge && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${action.gradient} text-white shadow-sm`}
                    >
                      {action.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
