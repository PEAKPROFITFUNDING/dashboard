import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import BecomeAffiliateForm from "./components/BecomeAffiliateForm";

export default function BecomeAffiliate() {
  return (
    <>
      <PageMeta
        title="Become Affiliate"
        description="Peak Profit Become AFfiliate Page"
      />
      <PageBreadcrumb pageTitle={`New Affiliate`} />
      <BecomeAffiliateForm />
    </>
  );
}
