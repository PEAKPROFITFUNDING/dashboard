import { useParams } from "react-router";
import { useState, useEffect } from "react";
import PageMeta from "../../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../../components/common/PageBreadCrumb";
import AffiliateProfileCard from "../../../../../components/affiliates/AffiliateProfileCard";
import AffiliateProfileStats from "../../../../../components/affiliates/AffiliateProfileStats";
import AffiliateReferralList from "../../../../../components/affiliates/AffiliateReferralList";
import { useAffiliatesAdmin } from "../../../../../context/admin/AdminAffiliatesContext";
import { AffiliateType } from "../../../../../types/Affiliates";

export default function AffiliateDetails() {
  const { id } = useParams<{ id: string }>();
  const { affiliates, fetchAffiliates, loading, error } = useAffiliatesAdmin();
  const [affiliateData, setAffiliateData] = useState<AffiliateType | null>(
    null
  );

  useEffect(() => {
    if (!affiliates?.length && !loading) {
      fetchAffiliates();
    }
  }, [affiliates?.length, loading, fetchAffiliates]);

  useEffect(() => {
    if (affiliates?.length && id) {
      const foundAffiliate = affiliates.find(
        (affiliate: AffiliateType) => affiliate._id === id
      );
      setAffiliateData(foundAffiliate || null);
    }
  }, [affiliates, id]);

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
            Affiliate Not Found
          </h2>
          <p className="text-gray-600">
            The affiliate with ID {id} could not be found.
          </p>
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
        title="Admin PeakProfit - Affiliate Details"
        description="Peak Profit Affiliate Details Page"
      />
      <PageBreadcrumb
        pageTitle={`Affiliate Details - ${transformedAffiliate.fullName}`}
      />

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
