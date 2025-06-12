import React from "react";
import PropTypes from "prop-types";
import { Calendar } from "lucide-react";

const MonthlyForecastTables = ({ productData, year, forecastRows }) => {
  const formatValue = (value, isPercentage = false, isCurrency = false) => {
    if (value === null || value === undefined || value === "") return "-";

    if (isPercentage) {
      const percentValue =
        typeof value === "number" ? value * 100 : parseFloat(value) * 100;
      return `${percentValue.toFixed(2)}%`;
    }

    if (isCurrency)
      return `$${typeof value === "number" ? value.toLocaleString() : value}`;
    return typeof value === "number" ? value.toLocaleString() : value;
  };

  if (!productData?.monthly_forecast) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          No monthly forecast data available for {year}
        </p>
      </div>
    );
  }

  const yearForecasts = productData.monthly_forecast.filter(
    (f) => f.year === year
  );

  if (yearForecasts.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No forecast data available for {year}</p>
      </div>
    );
  }

  const months = [
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
    "jan",
  ];

  const monthLabels = [
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
    "JAN",
  ];

  const calculateTotals = (forecast) => {
    if (!forecast) return { annual: 0, spring: 0, fall: 0 };

    const values = months.map((month) => forecast[month] || 0);
    const annual = values.reduce((sum, val) => sum + val, 0);
    const spring = values.slice(1, 7).reduce((sum, val) => sum + val, 0);
    const fall = [...values.slice(7), values[0]].reduce(
      (sum, val) => sum + val,
      0
    );

    return { annual, spring, fall };
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
              <th className="border-r border-gray-300 px-4 py-4 text-left text-sm font-bold text-gray-700 bg-white sticky left-0 z-10 min-w-[200px]">
                TOTAL {year}
              </th>
              {monthLabels.map((month) => (
                <th
                  key={month}
                  className="border-r border-gray-300 px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[90px]"
                >
                  {month}
                </th>
              ))}
              <th className="border-r border-gray-300 px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[100px]">
                ANNUAL
              </th>
              <th className="border-r border-gray-300 px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[100px]">
                SPRING
              </th>
              <th className="px-3 py-4 text-center text-sm font-bold text-gray-700 min-w-[100px]">
                FALL
              </th>
            </tr>
          </thead>
          <tbody>
            {forecastRows.map((row, index) => {
              const forecast = yearForecasts.find(
                (f) => f.variable_name === row.key
              );

              if (!forecast) {
                return (
                  <tr
                    key={row.key}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="border-r border-gray-300 px-4 py-3 text-sm font-bold text-gray-800 bg-white sticky left-0 z-10">
                      {row.label}
                    </td>
                    {monthLabels.map((_, i) => (
                      <td
                        key={i}
                        className="border-r border-gray-300 px-3 py-3 text-center text-sm text-gray-400"
                      >
                        -
                      </td>
                    ))}
                    <td className="border-r border-gray-300 px-3 py-3 text-center text-sm font-bold text-gray-400">
                      -
                    </td>
                    <td className="border-r border-gray-300 px-3 py-3 text-center text-sm text-gray-400">
                      -
                    </td>
                    <td className="px-3 py-3 text-center text-sm text-gray-400">
                      -
                    </td>
                  </tr>
                );
              }

              const totals = calculateTotals(forecast);

              return (
                <tr
                  key={row.key}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50 transition-colors`}
                >
                  <td className="border-r border-gray-300 px-4 py-3 text-sm font-bold text-gray-800 bg-white sticky left-0 z-10">
                    {row.label}
                  </td>
                  {months.map((month) => (
                    <td
                      key={month}
                      className="border-r border-gray-300 px-3 py-3 text-center text-sm font-medium text-gray-800"
                    >
                      {formatValue(forecast[month], row.isPercentage)}
                    </td>
                  ))}
                  <td className="border-r border-gray-300 px-3 py-3 text-center text-sm font-bold text-gray-900 bg-blue-50">
                    {formatValue(totals.annual, row.isPercentage)}
                  </td>
                  <td className="border-r border-gray-300 px-3 py-3 text-center text-sm font-bold text-gray-900 bg-green-50">
                    {formatValue(totals.spring, row.isPercentage)}
                  </td>
                  <td className="px-3 py-3 text-center text-sm font-bold text-gray-900 bg-orange-50">
                    {formatValue(totals.fall, row.isPercentage)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

MonthlyForecastTables.propTypes = {
  productData: PropTypes.object,
  year: PropTypes.number.isRequired,
  forecastRows: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      isPercentage: PropTypes.bool,
    })
  ).isRequired,
};

export default MonthlyForecastTables;
