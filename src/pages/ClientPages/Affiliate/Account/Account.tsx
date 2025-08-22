// import { useParams } from "react-router";
// import { useState } from "react";
// import {
//   ProfileCard,
//   PerformanceMetrics,
//   PerformanceChart,
//   ReferralList,
//   ConfirmationModal,
//   affiliateDetailsData,
//   referralData,
//   type AffiliateDetails,
// } from "./components";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import ProfileCard from "./components/ProfileCard";
import AffiliateReferralList from "./components/AffiliateReferralList";
import { affiliateReferralData } from "./affiliateReferralData";

export default function Account() {
  //   const { id } = useParams<{ id: string }>();
  //   const affiliateId = parseInt(id || "1");
  //   const [affiliate, setAffiliate] = useState<AffiliateDetails | undefined>(
  //     affiliateDetailsData[affiliateId]
  //   );
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  //   const [pendingAction, setPendingAction] = useState<
  //     "activate" | "deactivate" | null
  //   >(null);

  //   if (!affiliate) {
  //     return (
  //       <div className="flex items-center justify-center h-64">
  //         <div className="text-center">
  //           <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
  //             Affiliate Not Found
  //           </h2>
  //           <p className="text-gray-500 dark:text-gray-400">
  //             The affiliate with ID {id} could not be found.
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   }

  //   const handleStatusChange = (newStatus: "active" | "inactive") => {
  //     setAffiliate((prev) => (prev ? { ...prev, status: newStatus } : undefined));
  //     // Here you would typically make an API call to update the status
  //     console.log(`Affiliate status changed to: ${newStatus}`);
  //     setIsModalOpen(false);
  //     setPendingAction(null);
  //   };

  //   const openConfirmationModal = (action: "activate" | "deactivate") => {
  //     setPendingAction(action);
  //     setIsModalOpen(true);
  //   };

  const affiliate = {
    id: 1,
    fullName: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    joinedDate: "2024-01-15",
    referralCode: "JOHN123",
    status: "active",
    performance: {
      totalClicks: 1250,
      totalSignups: 45,
      totalFundedAccounts: 23,
      totalCommissionEarned: 1250.5,
    },
    referralStats: {
      totalReferrals: 45,
      signedUp: 32,
      deposited: 18,
      passedChallenge: 12,
    },
  };

  return (
    <>
      <PageMeta
        title="Client PeakProfit"
        description="Peak Profit Affiliate Account Page"
      />
      <PageBreadcrumb pageTitle={`Affiliate Account`} />

      <div>
        <ProfileCard affiliate={affiliate} />

        <AffiliateReferralList referrals={affiliateReferralData} />

        {/* <PerformanceChart />

        <PerformanceMetrics affiliate={affiliate} />

        <ReferralList referrals={referralData} /> */}
      </div>

      {/* <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pendingAction={pendingAction}
        affiliate={affiliate}
        onConfirm={handleStatusChange}
      /> */}
    </>
  );
}
