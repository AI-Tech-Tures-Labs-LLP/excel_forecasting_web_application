import React from "react";

const LoadingSpinner = ({ size = "md", color = "indigo" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    indigo: "border-indigo-200 border-t-indigo-600",
    blue: "border-blue-200 border-t-blue-600",
    green: "border-green-200 border-t-green-600",
    red: "border-red-200 border-t-red-600",
    gray: "border-gray-200 border-t-gray-600",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-2 ${colorClasses[color]} rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
