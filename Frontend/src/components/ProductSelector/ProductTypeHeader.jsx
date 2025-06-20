// ProductSelector/ProductTypeHeader.jsx
import React from "react";
import { Store, Package, Globe } from "lucide-react";

const ProductTypeHeader = ({
  selectedProductType,
  onProductTypeChange,

  storeProducts,
  comProducts,
  omniProducts,
  storeProductCount,
  comProductCount,
  omniProductCount,
}) => {
  const productTypeConfig = {
    store: {
      icon: Store,
      label: "Store Products",
      color: "blue",
    },
    com: {
      icon: Package,
      label: "COM Products",
      color: "green",
    },
    omni: {
      icon: Globe,
      label: "Omni Products",
      color: "purple",
    },
  };

  const getProductCount = (productType) => {
    switch (productType) {
      case "store":
        return storeProductCount;
      case "com":
        return comProductCount;
      case "omni":
        return omniProductCount;
      default:
        return 0;
    }
  };

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {Object.entries(productTypeConfig).map(([type, config]) => {
          const IconComponent = config.icon;
          return (
            <button
              key={type}
              onClick={() => onProductTypeChange(type)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedProductType === type
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <IconComponent size={18} />
              {config.label}
              <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {getProductCount(type)}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProductTypeHeader;
