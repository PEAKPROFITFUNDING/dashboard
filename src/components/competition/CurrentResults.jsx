import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const CurrentResults = () => {
  const resultStats = [
    {
      mainLabel: "Max Daily Drawdown",
      firstLabel: "Initial Limit",
      secondLabel: "Remaining",
      firstAmount: 4120,
      secondAmount: 4120,
      success: true,
    },
    {
      mainLabel: "Max Permitted Losses",
      firstLabel: "Max Loss",
      secondLabel: "Remaining",
      firstAmount: 6000,
      secondAmount: 9002,
      success: true,
    },
    {
      mainLabel: "Minimum Trading Days",
      firstLabel: "Objective",
      secondLabel: "Current",
      firstValue: 2,
      secondValue: 6,
      success: true,
    },
    {
      mainLabel: "Profit Target",
      firstLabel: "Objective",
      secondLabel: "Remaining",
      firstAmount: 10000,
      secondAmount: 6997,
      success: false,
    },
    {
      mainLabel: "Consistency Rule",
      firstLabel: "Suggested Daily Profit",
      secondLabel: "Highest Day Profit",
      firstValue: "$3,000.00 | 30%",
      secondValue: "$2,269.37 | 75%",
      success: false,
    },
  ];

  const formatAmount = (amount) => {
    if (typeof amount === "number") {
      return `$${amount.toLocaleString()}`;
    }
    return amount;
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-800 bg-white shadow-default rounded-2xl dark:bg-gray-900">
      <div className="text-gray-800 text-2xl dark:text-white/90 font-semibold pb-2">
        Current Results
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resultStats.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-start px-3 py-3 bg-gray-100 rounded-t-xl dark:bg-gray-800 text-gray-800 text-lg dark:text-white/90 gap-2">
              {item.success ? (
                <FaCheckCircle className="text-green-400" />
              ) : (
                <FaTimesCircle className="text-red-500" />
              )}
              <div>{item.mainLabel}</div>
            </div>
            <div className="flex flex-col items-start pl-4 py-2 space-y-2">
              <div>
                <div className="flex space-x-2">
                  <div className="text-gray-500 dark:text-gray-400">
                    {item.firstLabel}:
                  </div>
                  <div className="text-gray-800 dark:text-white/90">
                    {item.firstAmount !== undefined
                      ? formatAmount(item.firstAmount)
                      : item.firstValue}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="text-gray-500 dark:text-gray-400">
                    {item.secondLabel}:
                  </div>
                  <div className="text-gray-800 dark:text-white/90 font-bold">
                    {item.secondAmount !== undefined
                      ? formatAmount(item.secondAmount)
                      : item.secondValue}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentResults;
