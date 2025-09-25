import React, { useEffect } from "react";
import { Filter } from "lucide-react";
import { FilterOption } from "../../../components//FilterBar";
import { Pagination } from "../../../components//Pagination";
import TicketCard from "./components/TicketCard";
import TicketsFilterSection from "./components/TicketsFilterSection";
import { useTicketsAdmin } from "../../../context/admin/TicketsAdminContext";
import LoadingSpinner from "../../../components/LoadingSpinner";

const TicketsList: React.FC = () => {
  const {
    tickets,
    pagination,
    loading,
    error,
    currentPage,
    searchQuery,
    activeStatus,
    activeCategory,
    activePriority,
    fetchTickets,
    setCurrentPage,
    setSearchQuery,
    setActiveStatus,
    setActiveCategory,
    setActivePriority,
  } = useTicketsAdmin();

  // Filter options for status
  const statusFilterOptions: FilterOption[] = [
    { key: "all", label: "All Status" },
    { key: "open", label: "Open", color: "info" },
    { key: "in progress", label: "In Progress", color: "warning" },
    { key: "resolved", label: "Resolved", color: "success" },
    { key: "closed", label: "Closed" },
  ];

  // Category options
  const categoryOptions = [
    { key: "all", label: "All Categories" },
    { key: "technical", label: "Technical" },
    { key: "billing", label: "Billing" },
    { key: "general", label: "General" },
    { key: "other", label: "Other" },
  ];

  // Priority options
  const priorityOptions = [
    { key: "all", label: "All Priorities" },
    { key: "urgent", label: "Urgent" },
    { key: "high", label: "High" },
    { key: "medium", label: "Medium" },
    { key: "low", label: "Low" },
    { key: "not assigned", label: "Not Assigned" },
  ];

  // Calculate status counts (mock data - you might want to get this from API)
  const getStatusCounts = () => {
    if (!tickets) return {};

    const counts = {
      all: tickets.length,
      open: 0,
      "in progress": 0,
      resolved: 0,
      closed: 0,
    };

    tickets.forEach((ticket) => {
      counts[ticket.status] = (counts[ticket.status] || 0) + 1;
    });

    return counts;
  };

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets({ forceRefresh: true });
  }, []);

  // Handle search
  const handleSearch = () => {
    fetchTickets({
      search: searchQuery,
      pageNo: 1,
      forceRefresh: true,
    });
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    fetchTickets({
      search: "",
      pageNo: 1,
      forceRefresh: true,
    });
  };

  // Handle status filter change
  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    fetchTickets({
      status,
      pageNo: 1,
      forceRefresh: true,
    });
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    fetchTickets({
      category,
      pageNo: 1,
      forceRefresh: true,
    });
  };

  // Handle priority change
  const handlePriorityChange = (priority: string) => {
    setActivePriority(priority);
    fetchTickets({
      priority,
      pageNo: 1,
      forceRefresh: true,
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchTickets({ pageNo: page, forceRefresh: true });
  };

  // Handle ticket card click
  const handleTicketClick = (ticketId: string) => {
    // Navigate to ticket detail page
    console.log("Navigate to ticket:", ticketId);
    // You can implement navigation logic here
  };

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <p className="text-red-800 dark:text-red-300">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Support Tickets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and respond to customer support requests
          </p>
        </div>
      </div> */}

      {/* Filters and Search */}
      <TicketsFilterSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onSearchClear={handleSearchClear}
        searchPlaceholder="Search tickets by subject, description, or user..."
        activeStatus={activeStatus}
        onStatusChange={handleStatusChange}
        statusOptions={statusFilterOptions}
        statusCounts={getStatusCounts()}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        categoryOptions={categoryOptions}
        activePriority={activePriority}
        onPriorityChange={handlePriorityChange}
        priorityOptions={priorityOptions}
      />

      {/* Tickets List */}
      <div className="space-y-4">
        {loading ? (
          <LoadingSpinner />
        ) : tickets && tickets.length > 0 ? (
          <>
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                onCardClick={handleTicketClick}
              />
            ))}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05]">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.perPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tickets found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No tickets match your current filters. Try adjusting your search
              criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveStatus("all");
                setActiveCategory("all");
                setActivePriority("all");
                fetchTickets({
                  search: "",
                  status: "all",
                  category: "all",
                  priority: "all",
                  pageNo: 1,
                  forceRefresh: true,
                });
              }}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsList;
