import React, { useState } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import KYCForm from "./components/KYCForm";
import { KYCPending } from "./components/KYCPending";
import { KYCApproved } from "./components/KYCApproved";
import { KYCRejected } from "./components/KYCRejected";
import { useUser } from "../../../../context/UserContext";

const KYC = () => {
  const { kyc } = useUser();

  const [showResubmitForm, setShowResubmitForm] = useState(false);

  return (
    <>
      <PageMeta title="KYC" description="Peak Profit User KYC" />
      <PageBreadcrumb pageTitle="KYC" />

      {(!kyc || showResubmitForm) && (
        <KYCForm setShowResubmitForm={setShowResubmitForm} />
      )}

      {kyc?.status === "pending" && <KYCPending />}

      {kyc?.status === "approved" && <KYCApproved />}

      {kyc?.status === "rejected" && !showResubmitForm && (
        <KYCRejected
          rejectionReason={kyc.rejectionReason || "Your KYC was rejected."}
          onResubmit={() => setShowResubmitForm(true)}
        />
      )}
    </>
  );
};

export default KYC;
