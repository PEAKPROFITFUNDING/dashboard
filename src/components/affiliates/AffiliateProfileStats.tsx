import { AffiliateType } from "../../types/Affiliates";
import { Users, DollarSign, Wallet, Percent } from "lucide-react";

interface Props {
  affiliateData: AffiliateType;
}

const AffiliateProfileStats = ({ affiliateData }: Props) => {
  const stats = [
    {
      title: "Total Referrals",
      value: (data: AffiliateType) => data?.totalReferrals,
      icon: Users,
      bg: "bg-blue-100 dark:bg-blue-900",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Earnings",
      value: (data: AffiliateType) => `$${data?.totalEarnings?.toFixed(2)}`,
      icon: DollarSign,
      bg: "bg-green-100 dark:bg-green-900",
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Current Balance",
      value: (data: AffiliateType) => `$${data?.balance?.toFixed(2)}`,
      icon: Wallet,
      bg: "bg-purple-100 dark:bg-purple-900",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Commission Rate",
      value: (data: AffiliateType) => `${data?.commissionPercentage}%`,
      icon: Percent,
      bg: "bg-orange-200 dark:bg-orange-800",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-white dark:border-white/[0.05] dark:bg-white/[0.03] rounded-xl shadow-lg border border-gray-200 overflow-hidden p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value(affiliateData)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AffiliateProfileStats;
