import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import UsersKYCTable from "./components/UsersKYCTable";

export default function UsersKYC() {
  return (
    <>
      <PageMeta
        title="User's KYC"
        description="Peak Profit Admin KYC List Page"
      />
      <PageBreadcrumb pageTitle="KYC Applications" />
      <UsersKYCTable />
    </>
  );
}
