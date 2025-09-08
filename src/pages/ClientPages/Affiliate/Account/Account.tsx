import { useState, useEffect } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import ProfileCard from "./components/ProfileCard";
import AffiliateReferralList from "./components/AffiliateReferralList";
import axiosInstance from "../../../../api/axiosInstance";
import { Users, DollarSign, Wallet, Percent } from "lucide-react";

export default function Account() {
  const [affiliateData, setAffiliateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAffiliateProfile();
  }, []);

  const fetchAffiliateProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/affiliate/profile");
      setAffiliateData(response.data.result);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch affiliate profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!affiliateData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            No Data Found
          </h2>
          <p className="text-gray-600">Unable to load affiliate profile</p>
        </div>
      </div>
    );
  }

  // Transform API data to match component structure
  const transformedAffiliate = {
    fullName: affiliateData.userId.name,
    email: affiliateData.userId.email,
    joinedDate: affiliateData.createdAt,
    referralCode: affiliateData.referralCode,
    referralLink: affiliateData.referralLink,
    tier: affiliateData.tier,
    totalEarnings: affiliateData.totalEarnings,
    balance: affiliateData.balance,
    commissionPercentage: affiliateData.commissionPercentage,
    totalReferrals: affiliateData.totalReferrals,
    totalWithdrawn: affiliateData.totalWithdrawn,
  };

  // Transform referrals data
  const transformedReferrals = affiliateData.referrals.map((referral) => ({
    id: referral._id,
    fullName: referral.referredUser.name,
    email: referral.referredUser.email,
    phone: "N/A", // Not provided in API response
    signUpDate: referral.signupDate,
    totalCommission: referral.totalEarnings,
    currentStatus:
      referral.purchases.length > 0 ? "active_trader" : "signed_up",
    steps: [
      {
        id: `signup-${referral._id}`,
        type: "signup",
        title: "Account Registration",
        date: referral.signupDate,
        status: "completed",
        details: {
          commissionEarned: referral.signupCommission,
        },
      },
      ...referral.purchases.map((purchase, purchaseIndex) => ({
        id: `challenge-${purchase._id}`,
        type: "challenge",
        title: "Challenge Purchase",
        date: purchase.purchaseDate,
        status: "completed",
        details: {
          challenge: {
            name: `Challenge ${purchaseIndex + 1}`,
            price: purchase.challengeCost,
            status: "completed",
            commissionEarned: purchase.commissionEarned,
            completedDate: purchase.purchaseDate,
          },
        },
      })),
    ],
  }));

  const stats = [
    {
      title: "Total Referrals",
      value: (data) => data.totalReferrals,
      icon: Users,
      bg: "bg-blue-100 dark:bg-blue-900",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Earnings",
      value: (data) => `$${data.totalEarnings}`,
      icon: DollarSign,
      bg: "bg-green-100 dark:bg-green-900",
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Current Balance",
      value: (data) => `$${data.balance}`,
      icon: Wallet,
      bg: "bg-purple-100 dark:bg-purple-900",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Commission Rate",
      value: (data) => `${data.commissionPercentage}%`,
      icon: Percent,
      bg: "bg-orange-200 dark:bg-orange-800",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <>
      <PageMeta
        title="PeakProfit - Affiliate Account"
        description="Peak Profit Affiliate Account Page"
      />
      <PageBreadcrumb pageTitle={`Affiliate Account`} />

      <div className="space-y-8">
        {/* Profile Card */}
        <ProfileCard affiliate={transformedAffiliate} />

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white dark:border-white/[0.05] dark:bg-white/[0.03] rounded-xl shadow-lg border border-gray-200  overflow-hidden p-6"
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

        {/* Referrals List */}
        <AffiliateReferralList referrals={transformedReferrals} />
      </div>
    </>
  );
}
