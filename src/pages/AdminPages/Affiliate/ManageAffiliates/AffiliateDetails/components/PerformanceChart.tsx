import LineChartOne from "../../../../../../components/charts/line/LineChartOne";

export default function PerformanceChart() {
  // Sample data for line chart
  const chartSeries = [
    {
      name: "Signups",
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
    },
    {
      name: "Commissions",
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Performance Trends
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <LineChartOne
          series={chartSeries}
          title="Monthly Performance Overview"
        />
      </div>
    </div>
  );
}
