// Loading Screen Component
const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading Product Details
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch the product information...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
