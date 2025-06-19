import React from "react";
import { useNavigate } from "react-router-dom";
import { BarChart2, ExternalLink, Star } from "lucide-react";

const TeamPerformance = ({
  performanceData,
  selectedTimeframe,
  setSelectedTimeframe,
}) => {
  const navigate = useNavigate();

  if (!performanceData || performanceData.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
            <BarChart2 className="text-white" size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Team Performance
          </h2>
        </div>
        <div className="flex gap-2">
          {["7days", "30days", "90days"].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedTimeframe === timeframe
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {timeframe === "7days"
                ? "7 Days"
                : timeframe === "30days"
                ? "30 Days"
                : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {performanceData.map((analyst, index) => (
          <div
            key={index}
            className="group bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer border border-slate-200/50 hover:border-slate-300/50 hover:-translate-y-1"
            onClick={() => navigate("/analysts")}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {analyst.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 truncate text-sm">
                    {analyst.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {analyst.workload} tasks
                  </p>
                </div>
              </div>
              <ExternalLink
                size={14}
                className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 font-medium">
                  Performance
                </span>
                <span
                  className={`text-lg font-bold ${
                    analyst.performance > 90
                      ? "text-emerald-600"
                      : analyst.performance > 80
                      ? "text-blue-600"
                      : analyst.performance > 70
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {analyst.performance}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    analyst.performance > 90
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                      : analyst.performance > 80
                      ? "bg-gradient-to-r from-blue-400 to-blue-500"
                      : analyst.performance > 70
                      ? "bg-gradient-to-r from-amber-400 to-amber-500"
                      : "bg-gradient-to-r from-red-400 to-red-500"
                  } shadow-sm`}
                  style={{ width: `${analyst.performance}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-amber-400" />
                  <span className="text-xs text-slate-500">Efficiency</span>
                </div>
                <span className="text-xs font-medium text-slate-700">
                  {Math.round((analyst.performance / analyst.workload) * 10) /
                    10}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPerformance;
