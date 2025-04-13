// components/EquityChart.tsx
import { useState } from "react";
import AccountChart from "../common/AccountChart";
import ChartTab from "../common/ChartTab";

export default function EquityChart() {
  const [selectedTab, setSelectedTab] =
    (useState < "optionOne") | ("optionTwo" > "optionOne");

  // Hardcoded equity data for one month (30 days)
  const equityData = Array.from(
    { length: 30 },
    () => Math.floor(Math.random() * (95000 - 90000 + 1)) + 95000
  );
  const minEquity = Math.min(...equityData);
  const maxEquity = Math.max(...equityData);

  // Hardcoded balance data for one month (30 days)
  const balanceData = Array.from(
    { length: 30 },
    () => Math.floor(Math.random() * (100000 - 99000 + 1)) + 99000
  );
  const minBalance = Math.min(...balanceData);
  const maxBalance = Math.max(...balanceData);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Account {selectedTab === "optionOne" ? "Balance" : "Equity"} Chart
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            One month account{" "}
            {selectedTab === "optionOne" ? "balance" : "equity"} ( $
            {selectedTab === "optionOne"
              ? minBalance.toLocaleString()
              : minEquity.toLocaleString()}{" "}
            - $
            {selectedTab === "optionOne"
              ? maxBalance.toLocaleString()
              : maxEquity.toLocaleString()}
            )
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab selected={selectedTab} setSelected={setSelectedTab} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {selectedTab === "optionOne" ? (
            <AccountChart
              data={balanceData}
              minValue={minBalance}
              maxValue={maxBalance}
              name="Account Balance"
              color="#10B981" // Green color for balance
              isBalance={true}
            />
          ) : (
            <AccountChart
              data={equityData}
              minValue={minEquity}
              maxValue={maxEquity}
              name="Account Equity"
              color="#465FFF" // Blue color for equity
            />
          )}
        </div>
      </div>
    </div>
  );
}
