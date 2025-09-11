import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface MonthlyData {
  month: number;
  monthName: string;
  signups: {
    count: number;
    amount: number;
  };
  purchases: {
    count: number;
    amount: number;
  };
  total: {
    count: number;
    amount: number;
  };
}

interface EarningsChartProps {
  monthlyData: MonthlyData[];
}

export default function CommissionsChart({ monthlyData }: EarningsChartProps) {
  const options: ApexOptions = {
    colors: ["#465fff", "#10b981"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
      labels: {
        formatter: (val: number) => `$${val.toFixed(0)}`,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `$${val.toFixed(2)}`,
      },
    },
  };

  // Convert monthly data to chart series
  const signupSeries = monthlyData.map((month) => month.signups.amount);
  const purchaseSeries = monthlyData.map((month) => month.purchases.amount);

  const series = [
    {
      name: "Signup Commissions",
      data: signupSeries,
    },
    {
      name: "Purchase Commissions",
      data: purchaseSeries,
    },
  ];

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar ">
      <div id="earningsChart" className="min-w-[1000px] px-4 ">
        <Chart options={options} series={series} type="bar" height={250} />
      </div>
    </div>
  );
}
