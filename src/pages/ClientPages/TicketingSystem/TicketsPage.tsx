import { useEffect, useCallback } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { useTickets } from "../../../context/user/UserTicketsContext";
import TicketsList from "./components/TicketsList";
import TicketsFilters from "./components/TicketsFilters";
import CreateTicketButton from "./components/CreateTicketButton";

export default function TicketsPage() {
  const { tickets, loading, error, fetchTickets, hasData } = useTickets();

  // Use useCallback to stabilize the fetchTicketsOnMount function
  const fetchTicketsOnMount = useCallback(() => {
    if (!hasData && !loading) {
      fetchTickets();
    }
  }, [fetchTickets, hasData, loading]);

  useEffect(() => {
    fetchTicketsOnMount();
  }, [fetchTicketsOnMount]);

  // Alternative simpler approach without useCallback:
  // useEffect(() => {
  //   if (!hasData && !loading) {
  //     fetchTickets();
  //   }
  // }, []); // Empty dependency array since fetchTickets is now stable

  if (loading && !hasData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !hasData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <button
            onClick={() => fetchTickets()}
            className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Support Tickets"
        description="Manage your support tickets"
      />
      <PageBreadcrumb pageTitle="Support Tickets" />

      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex justify-end items-center">
          <CreateTicketButton />
        </div>

        {/* Filters */}
        <TicketsFilters />

        {/* Tickets List */}
        <TicketsList
          tickets={tickets}
          loading={loading}
          error={error}
          hasData={hasData}
        />
      </div>
    </>
  );
}
