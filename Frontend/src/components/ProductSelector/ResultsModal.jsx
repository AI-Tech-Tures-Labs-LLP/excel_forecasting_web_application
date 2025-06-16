// ProductSelector/ResultsModal.jsx
import React from "react";
import {
  X,
  CheckCircle,
  Package,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Settings,
  FileText,
} from "lucide-react";

const ResultsModal = ({ showResults, setShowResults, lastAppliedResults }) => {
  if (!showResults || !lastAppliedResults) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowResults(false);
        }
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl mx-4 max-h-[90vh] overflow-hidden"
        style={{
          width: "95%",
          maxWidth: "1000px",
          transform: "scale(1)",
          animation: "modalSlideIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  External Factor Applied Successfully!
                </h2>
                <p className="text-green-100 mt-1">
                  {lastAppliedResults.factorPercentage > 0
                    ? "Increased"
                    : "Decreased"}{" "}
                  quantities by {Math.abs(lastAppliedResults.factorPercentage)}%
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowResults(false)}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Products Updated Card */}
            <div className="bg-white rounded-lg p-4 border-2 border-blue-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600 font-medium">
                    Products Updated
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    {lastAppliedResults.totalProductsUpdated}
                  </p>
                </div>
              </div>
            </div>

            {/* Original Total Card */}
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ArrowUpDown className="w-5 h-5 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600 font-medium">
                    Original Total
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {lastAppliedResults.summary.totalOriginalQty.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* New Total Card */}
            <div className="bg-white rounded-lg p-4 border-2 border-green-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ChevronUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600 font-medium">New Total</p>
                  <p className="text-xl font-bold text-green-600">
                    {lastAppliedResults.summary.totalNewQty.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Net Change Card */}
            <div
              className={`bg-white rounded-lg p-4 shadow-sm border-2 ${
                lastAppliedResults.summary.totalDifference >= 0
                  ? "border-emerald-200"
                  : "border-red-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    lastAppliedResults.summary.totalDifference >= 0
                      ? "bg-emerald-100"
                      : "bg-red-100"
                  }`}
                >
                  {lastAppliedResults.summary.totalDifference >= 0 ? (
                    <ChevronUp className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600 font-medium">
                    Net Change
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      lastAppliedResults.summary.totalDifference >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {lastAppliedResults.summary.totalDifference >= 0 ? "+" : ""}
                    {lastAppliedResults.summary.totalDifference.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Applied Factor Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <Settings className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">
                Applied Factor Details
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs font-medium">
                  Percentage:
                </span>
                <span className="font-bold text-blue-800 text-lg">
                  {lastAppliedResults.factorPercentage > 0 ? "+" : ""}
                  {lastAppliedResults.factorPercentage}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs font-medium">
                  Applied At:
                </span>
                <span className="font-medium text-gray-800">
                  {lastAppliedResults.timestamp.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs font-medium">Note:</span>
                <span
                  className="font-medium text-gray-800 truncate"
                  title={lastAppliedResults.factorNote || "No notes provided"}
                >
                  {lastAppliedResults.factorNote || "No notes provided"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Results Table */}
        <div className="flex-1 overflow-hidden">
          <div className="p-6 pb-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Detailed Changes by Product
            </h3>
          </div>

          <div
            className="px-6 pb-6"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg bg-white">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Product ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Category
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Old User Added Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      New Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Change
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Factor Applied
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lastAppliedResults.results.map((result, index) => {
                    const change = result.newQty - result.originalQty;
                    return (
                      <tr
                        key={result.pid}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-4 py-3 text-sm font-mono text-gray-900 border-r border-gray-100">
                          {result.pid}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-100">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                            {result.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900 border-r border-gray-100">
                          {result.originalQty.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-green-600 border-r border-gray-100">
                          {result.newQty.toLocaleString()}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm text-right font-bold border-r border-gray-100 ${
                            change >= 0 ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {change >= 0 ? "+" : ""}
                          {change.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              result.factorApplied >= 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.factorApplied > 0 ? "+" : ""}
                            {result.factorApplied}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 text-center sm:text-left">
            Changes applied to {lastAppliedResults.totalProductsUpdated}{" "}
            products • Data refreshed automatically
          </div>
          <button
            onClick={() => setShowResults(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ResultsModal;
