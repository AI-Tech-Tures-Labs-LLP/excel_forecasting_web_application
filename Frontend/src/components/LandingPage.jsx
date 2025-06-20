import React from "react";
import { Link } from "react-router-dom";
import { FileSpreadsheet, TrendingUp, List, HardDrive } from "lucide-react";
import Navbar from "./Navbar";

function LandingPage() {
  return (
    <>
      {/* <Navbar/> */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-5xl w-full mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Data Processing Dashboard
          </h1>

          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Upload, process and visualize your data with our suite of
            specialized tools
          </p>

          {/* Centered cards with increased width */}
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
              {/* Pricing Sheet Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                <div className="p-10">
                  <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <FileSpreadsheet size={40} className="text-blue-600" />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Pricing Sheet
                  </h2>

                  <p className="text-gray-600 mb-8">
                    Upload and process pricing data with our specialized tool.
                  </p>

                  <Link
                    to="/pricing"
                    className="block w-full py-4 px-8 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center text-lg"
                  >
                    Go to Pricing Tool
                  </Link>
                </div>
              </div>

              {/* Forecast Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                <div className="p-10">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <TrendingUp size={40} className="text-green-600" />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Create Forecast
                  </h2>

                  <p className="text-gray-600 mb-8">
                    Create new sales forecasts with our advanced forecasting
                    tool.
                  </p>

                  <Link
                    to="/dashboard"
                    className="block w-full py-4 px-8 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-center text-lg"
                  >
                    Start Forecasting
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-gray-500 text-sm">
            <p>© 2025 Data Processing Tools. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
