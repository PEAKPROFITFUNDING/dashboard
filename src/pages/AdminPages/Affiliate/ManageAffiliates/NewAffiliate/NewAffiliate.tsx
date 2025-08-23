import React from "react";
import PageMeta from "../../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../../components/common/PageBreadCrumb";
import AddAffiliateForm from "../components/AddAffiliateForm";
import { useAffiliates } from "../../../../../context/AffiliateContext";

export default function NewAffiliate() {
  const { setAffiliates } = useAffiliates();
  return (
    <>
      <PageMeta title="Admin - Add Affiliate" description="Add new affiliate" />
      <PageBreadcrumb pageTitle="Add Affiliate" />
      <AddAffiliateForm setAffiliates={setAffiliates} />
    </>
  );
}
