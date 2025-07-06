import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import Badge from "../../../../components/ui/badge/Badge";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, X } from "lucide-react";
import { useNavigate } from "react-router";
import {
  useContactMessagesContext,
  SortField,
} from "../../../../context/ContactMessagesContext";

export default function MessagesTable() {
  const navigate = useNavigate();
  const {
    contactMessages,
    loading,
    pagination,
    sortField,
    sortOrder,
    searchQuery,
    setPagination,
    handleSort,
    handleSearch,
    handleClearSearch,
    handleSearchInputChange,
    handleKeyPress,
    sortContactMessages,
  } = useContactMessagesContext();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "warning";
      case "read":
        return "info";
      case "replied":
        return "success";
      default:
        return "primary";
    }
  };

  const trimSubject = (subject: string, maxLength = 30) => {
    return subject.length > maxLength
      ? subject.slice(0, maxLength) + "..."
      : subject;
  };

  const SortableHeader = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
    <TableCell
      isHeader
      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
    >
      <div
        className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
        onClick={() => handleSort(field)}
      >
        {label}
        {sortField === field ? (
          sortOrder === "asc" ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )
        ) : (
          <ArrowUpDown className="w-4 h-4 opacity-50" />
        )}
      </div>
    </TableCell>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const sortedContacts = sortContactMessages(contactMessages);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Search contacts by name, email, or subject..."
              className="w-full px-4 py-2 pl-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white/90"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            Search
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <SortableHeader field="name" label="Name" />
              <SortableHeader field="email" label="Email" />
              <SortableHeader field="subject" label="Subject" />
              <SortableHeader field="status" label="Status" />
              <SortableHeader field="createdAt" label="Created At" />
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {sortedContacts.map((contact) => (
              <TableRow
                key={contact._id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => navigate(`/contact-messages/${contact._id}`)}
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {contact.name}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {contact.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {trimSubject(contact.subject)}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color={getStatusColor(contact.status)}>
                    {contact.status.charAt(0).toUpperCase() +
                      contact.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {formatDate(contact.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-white/[0.05]">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          {contactMessages.length > 0
            ? (pagination.currentPage - 1) * pagination.perPage + 1
            : 0}{" "}
          to{" "}
          {contactMessages.length > 0
            ? (pagination.currentPage - 1) * pagination.perPage +
              contactMessages.length
            : 0}{" "}
          of {pagination.totalItems} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setPagination({
                ...pagination,
                currentPage: pagination.currentPage - 1,
              })
            }
            disabled={!pagination.hasPreviousPage}
            className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-200 rounded-md disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setPagination({
                ...pagination,
                currentPage: pagination.currentPage + 1,
              })
            }
            disabled={!pagination.hasNextPage}
            className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-200 rounded-md disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
