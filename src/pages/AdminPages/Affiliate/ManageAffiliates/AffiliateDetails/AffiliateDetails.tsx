import { useParams } from "react-router";
import { useState } from "react";
import PageMeta from "../../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../../components/common/PageBreadCrumb";
import {
  ProfileCard,
  PerformanceMetrics,
  PerformanceChart,
  ReferralList,
  ConfirmationModal,
  referralData,
  type AffiliateDetails,
} from "./components";
import { useAffiliates } from "../../../../../context/AffiliateContext";

export default function AffiliateDetails() {
  const { id } = useParams<{ id: string }>();
  const affiliateId = parseInt(id || "1");
  const { affiliates, setAffiliates } = useAffiliates();
  const [affiliate, setAffiliate] = useState<AffiliateDetails | undefined>(
    affiliates.find((a) => a.id === affiliateId)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "activate" | "deactivate" | null
  >(null);

  if (!affiliate) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Affiliate Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            The affiliate with ID {id} could not be found.
          </p>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: "active" | "inactive") => {
    // Update local affiliate state
    setAffiliate((prev) => (prev ? { ...prev, status: newStatus } : undefined));

    // Update context (global list)
    setAffiliates((prevAffiliates) =>
      prevAffiliates.map((a) =>
        a.id === affiliateId ? { ...a, status: newStatus } : a
      )
    );

    setIsModalOpen(false);
    setPendingAction(null);

    console.log(`Affiliate status changed to: ${newStatus}`);
  };

  const openConfirmationModal = (action: "activate" | "deactivate") => {
    setPendingAction(action);
    setIsModalOpen(true);
  };

  return (
    <>
      <PageMeta
        title="Admin PeakProfit"
        description="Peak Profit Affiliate Details Page"
      />
      <PageBreadcrumb pageTitle={`Affiliate Details - ${affiliate.fullName}`} />

      <div>
        <ProfileCard
          affiliate={affiliate}
          onOpenConfirmationModal={openConfirmationModal}
        />

        <PerformanceChart />

        <PerformanceMetrics affiliate={affiliate} />

        <ReferralList referrals={referralData} />
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pendingAction={pendingAction}
        affiliate={affiliate}
        onConfirm={handleStatusChange}
      />
    </>
  );
}
