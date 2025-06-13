// ProductSelector/CategoryDownloadModal.jsx
import React from "react";
import { X, Package, FileDown } from "lucide-react";

const CategoryDownloadModal = ({
  categoryDownloadModal,
  setCategoryDownloadModal,
  onToast,
}) => {
  const handleCloseCategoryDownload = () => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      isOpen: false,
      selectedCategories: [],
      isDownloading: false,
    }));
  };

  const handleCategorySelectionChange = (category, checked) => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      selectedCategories: checked
        ? [...prev.selectedCategories, category]
        : prev.selectedCategories.filter((cat) => cat !== category),
    }));
  };

  const handleSelectAllCategories = () => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      selectedCategories: [...prev.availableCategories],
    }));
  };

  const handleDeselectAllCategories = () => {
    setCategoryDownloadModal((prev) => ({
      ...prev,
      selectedCategories: [],
    }));
  };

  const handleDownloadSelectedCategories = async () => {
    if (categoryDownloadModal.selectedCategories.length === 0) {
      onToast({
        type: "error",
        message: "Please select at least one category to download",
        duration: 3000,
      });
      return;
    }

    setCategoryDownloadModal((prev) => ({ ...prev, isDownloading: true }));

    try {
      // Convert display names to file names by removing brackets and spaces
      const processedCategories = categoryDownloadModal.selectedCategories.map(
        (category) => {
          // Remove brackets and extra spaces to match file names
          return category.replace(/\s*\([^)]*\)/, "");
        }
      );

      const categoriesParam = processedCategories.join(",");

      // Get the output filename from localStorage forecast data
      const forecastData = JSON.parse(
        localStorage.getItem("forecastData") || "{}"
      );
      const outputFileName = forecastData.outputFileName || "";

      console.log(
        "Original categories:",
        categoryDownloadModal.selectedCategories
      );
      console.log("Processed categories:", processedCategories);
      console.log("Using output filename:", outputFileName);

      // Use 'file_path' parameter to match backend
      const downloadUrl = `${
        import.meta.env.VITE_API_BASE_URL
      }/forecast/download-category/?category=${encodeURIComponent(
        categoriesParam
      )}&file_path=${encodeURIComponent(outputFileName)}`;

      console.log("Full download URL:", downloadUrl);

      // Create a temporary link to trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download =
        processedCategories.length === 1
          ? `${processedCategories[0]}.xlsx`
          : "categories.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      handleCloseCategoryDownload();
    } catch (error) {
      console.error("Error downloading categories:", error);
      onToast({
        type: "error",
        message: "Failed to download category files",
        duration: 5000,
      });
    } finally {
      setCategoryDownloadModal((prev) => ({ ...prev, isDownloading: false }));
    }
  };

  if (!categoryDownloadModal.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Select Categories to Download
          </h3>
          <button
            onClick={handleCloseCategoryDownload}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {categoryDownloadModal.availableCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No categories available for download</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex gap-2">
              <button
                onClick={handleSelectAllCategories}
                className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAllCategories}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Deselect All
              </button>
            </div>

            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
              {categoryDownloadModal.availableCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={categoryDownloadModal.selectedCategories.includes(
                      category
                    )}
                    onChange={(e) =>
                      handleCategorySelectionChange(category, e.target.checked)
                    }
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {categoryDownloadModal.selectedCategories.length} categories
                selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCloseCategoryDownload}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDownloadSelectedCategories}
                  disabled={
                    categoryDownloadModal.selectedCategories.length === 0 ||
                    categoryDownloadModal.isDownloading
                  }
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {categoryDownloadModal.isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <FileDown size={16} />
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryDownloadModal;
  