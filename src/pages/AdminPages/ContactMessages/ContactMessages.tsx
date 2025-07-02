import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import MessagesTable from "./components/MessagesTable";

export default function ContactMessages() {
  return (
    <>
      <PageMeta
        title="Admin PeakProfit"
        description="Peak Profit Admin Contact Messages Page"
      />
      <PageBreadcrumb pageTitle="Contact Messages" />
      <MessagesTable />
    </>
  );
}
