import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import MessageDetailsPage from "./components/MessageDetailsPage";

export default function MessageDetails() {
  return (
    <>
      <PageMeta
        title="Admin PeakProfit"
        description="Peak Profit Admin Contact Details Page"
      />
      <PageBreadcrumb pageTitle="Message Details" />
      <MessageDetailsPage />
    </>
  );
}
