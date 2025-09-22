import React from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import KYCForm from "./components/KYCForm";
import { KYCPending } from "./components/KYCPending";
import { KYCApproved } from "./components/KYCApproved";
import { KYCRejected } from "./components/KYCRejected";
import { useUser } from "../../../../context/UserContext";

const KYC = () => {
  const { kyc } = useUser();

  return (
    <>
      <PageMeta title="KYC" description="Peak Profit User KYC" />
      <PageBreadcrumb pageTitle="KYC" />

      {!kyc && <KYCForm />}

      {kyc?.status === "pending" && <KYCPending />}

      {kyc?.status === "approved" && <KYCApproved />}

      {kyc?.status === "rejected" && (
        <KYCRejected
          rejectionReason={kyc.rejectionReason || "Your KYC was rejected."}
          onResubmit={() => console.log("resubmitting")}
        />
      )}
    </>
  );
};

export default KYC;
