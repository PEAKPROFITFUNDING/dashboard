import React from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import KYCForm from "./components/KYCForm";

const KYC = () => {
  return (
    <>
      <PageMeta title="KYC" description="Peak Profit User KYC" />
      <PageBreadcrumb pageTitle={`KYC`} />
      <KYCForm />
    </>
  );
};

export default KYC;
