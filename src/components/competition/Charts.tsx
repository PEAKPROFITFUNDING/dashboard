import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import { useState } from "react";

export default function AccountChart() {
  const [tab, setTab] = useState("balance");

  // Hardcoded equity data for one month (30 days)
  const equityData = Array.from(
    { length: 30 },
    () => Math.floor(Math.random() * (95000 - 90000 + 1)) + 95000
  );

  // Hardcoded balance data for one month (30 days)
  // Balance will be slightly higher than equity to simulate unrealized profits
  const balanceData = equityData.map(
    (equity) => equity + Math.floor(Math.random() * 5000)
  );

  // Get the active data based on selected tab
  const activeData = tab === "equity" ? equityData : balanceData;

  // Calculate min and max values for the active dataset
  const minValue = Math.min(...activeData);
  const maxValue = Math.max(...activeData);

  // Generate dates for the current month (showing only every 5th day to reduce clutter)
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = 30; // Using 30 days for simplicity

  const dates = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentYear, currentMonth, i + 1);
    return (i + 1) % 5 === 0 || i === 0 || i === daysInMonth - 1
      ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "";
  });

  // Determine y-axis range based on active data
  const yAxisMin = Math.floor(minValue * 0.99); // 1% buffer below min
  const yAxisMax = Math.ceil(maxValue * 1.01); // 1% buffer above max

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontSize: "14px",
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const date = new Date(currentYear, currentMonth, dataPointIndex + 1);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const value = series[seriesIndex][dataPointIndex];
        const label = tab.charAt(0).toUpperCase() + tab.slice(1);

        return `
          <div class="p-2 bg-white shadow-lg rounded-md border border-gray-200">
            <div class="text-sm font-semibold">${formattedDate}</div>
            <div class="text-sm mt-1">
              <span class="font-medium">${label}:</span> $${value.toLocaleString()}
            </div>
            <div class="text-xs mt-1 text-gray-500">
              <span>Min: $${minValue.toLocaleString()}</span> | 
              <span> Max: $${maxValue.toLocaleString()}</span>
            </div>
          </div>
        `;
      },
    },
    xaxis: {
      type: "category",
      categories: dates,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: "#6B7280",
        },
        formatter: function (value) {
          return value; // Only show dates that aren't empty strings
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: (value) => `$${(value / 1000).toFixed(0)}k`,
      },
      min: yAxisMin,
      max: yAxisMax,
      tickAmount: 6,
    },
  };

  const series = [
    {
      name: tab === "equity" ? "Account Equity" : "Account Balance",
      data: activeData,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Account Chart
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            One month {tab} data
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab selectedTab={tab} setSelectedTab={setTab} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={365} />
        </div>
      </div>
    </div>
  );
}
