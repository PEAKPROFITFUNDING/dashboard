import { useState, useEffect } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import AffiliateReferralList from "../../../../components/affiliates/AffiliateReferralList";
import axiosInstance from "../../../../api/axiosInstance";
import AffiliateProfileCard from "../../../../components/affiliates/AffiliateProfileCard";
import AffiliateProfileStats from "../../../../components/affiliates/AffiliateProfileStats";

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

  return (
    <>
      <PageMeta
        title="PeakProfit - Affiliate Account"
        description="Peak Profit Affiliate Account Page"
      />
      <PageBreadcrumb pageTitle={`Affiliate Account`} />

      <div className="space-y-8">
        {/* Profile Card */}
        <AffiliateProfileCard affiliate={transformedAffiliate} />

        {/* Performance Stats */}
        <AffiliateProfileStats affiliateData={affiliateData} />

        {/* Referrals List */}
        <AffiliateReferralList referrals={transformedReferrals} />
      </div>
    </>
  );
}
