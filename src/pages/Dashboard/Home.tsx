import MonthlySalesChart from "../../components/competition/MonthlySalesChart";
import StatisticsChart from "../../components/competition/StatisticsChart";
import MonthlyTarget from "../../components/competition/MonthlyTarget";
import RecentOrders from "../../components/competition/RecentOrders";
import DemographicCard from "../../components/competition/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import OverallMetrics from "../../components/competition/OverallMetrics";
import AverageMetrics from "../../components/competition/AverageMetrics";
import CurrentResults from "../../components/competition/CurrentResults";
import Charts from "../../components/competition/Charts";
import TradingLogsTable from "../../components/competition/TradingLogsTable";

export default function Home() {
  return (
    <>
      <PageMeta
        title="PeakProfit Client Dashboard"
        description="This is PeakProfit Client Dashboard description"
      />
      <div className="grid grid-cols-12 gap-6 ">
        <div className="grid grid-cols-12 col-span-12 gap-4">
          <div className="space-y-4 col-span-12  md:col-span-4 ">
            <OverallMetrics />
          </div>
          <div className="space-y-4 col-span-12 md:col-span-8">
            <AverageMetrics />
            <Charts />
          </div>
        </div>

        <div className="col-span-12 space-y-4">
          <CurrentResults />
        </div>
        <div className="col-span-12 space-y-4">
          <TradingLogsTable />
        </div>
        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
    </>
  );
}
