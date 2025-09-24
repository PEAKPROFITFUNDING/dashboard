import type { FC } from "react";
import type { TicketType } from "../../../../context/user/UserTicketsContext";
import TicketCard from "./TicketCard";

interface TicketsListProps {
  tickets: TicketType[];
  loading: boolean;
  error: string | null;
  hasData: boolean;
}

const TicketsList: FC<TicketsListProps> = ({
  tickets,
  loading,
  error,
  hasData,
}) => {
  if (loading && hasData) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && hasData) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (!hasData && !loading) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No tickets found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new support ticket.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketCard key={ticket._id} ticket={ticket} />
      ))}
    </div>
  );
};

export default TicketsList;
