import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import TicketsList from "./TicketsList";

const TicketSupport = () => {
  return (
    <>
      <PageMeta
        title="Support Tickets"
        description="Peak Profit Admin Support Tickets Page"
      />
      <PageBreadcrumb pageTitle="Support Tickets" />
      <TicketsList />
    </>
  );
};

export default TicketSupport;
