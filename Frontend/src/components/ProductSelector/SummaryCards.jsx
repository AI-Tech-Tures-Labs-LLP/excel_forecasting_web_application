// ProductSelector/SummaryCards.jsx
import React from "react";
import { Package, CheckCircle, AlertCircle, Clock } from "lucide-react";

const SummaryCards = ({ totalProducts, processedProducts }) => {
  const reviewedCount = Object.values(processedProducts).filter(
    (data) => data.status === "reviewed"
  ).length;

  const notReviewedCount = Object.values(processedProducts).filter(
    (data) => data.status === "not_reviewed"
  ).length;

  const pendingCount = Object.values(processedProducts).filter(
    (data) => data.status === "pending"
  ).length;

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800">Total Products</p>
            <p className="text-2xl font-bold text-blue-900">{totalProducts}</p>
          </div>
          <Package className="text-blue-600" size={24} />
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-800">Reviewed</p>
            <p className="text-2xl font-bold text-green-900">{reviewedCount}</p>
          </div>
          <CheckCircle className="text-green-600" size={24} />
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-800">Not Reviewed</p>
            <p className="text-2xl font-bold text-red-900">
              {notReviewedCount}
            </p>
          </div>
          <AlertCircle className="text-red-600" size={24} />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-yellow-800">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
          </div>
          <Clock className="text-yellow-600" size={24} />
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
