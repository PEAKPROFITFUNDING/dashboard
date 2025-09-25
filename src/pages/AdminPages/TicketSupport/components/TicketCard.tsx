import React from "react";
import { Clock, Mail, User, Calendar, AlertCircle } from "lucide-react";
import Badge from "../../../../components/ui/badge/Badge";
import { Ticket } from "../../../../context/admin/TicketsAdminContext";
import { Link } from "react-router";

interface TicketCardProps {
  ticket: Ticket;
  onCardClick?: (ticketId: string) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to get time difference
  const getTimeDifference = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "info";
      case "in progress":
        return "warning";
      case "resolved":
        return "success";
      case "closed":
        return "light";
      default:
        return "light";
    }
  };

  // Helper function to get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "info";
      case "low":
        return "success";
      case "not assigned":
        return "light";
      default:
        return "light";
    }
  };

  // Helper function to get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical":
        return "info";
      case "billing":
        return "warning";
      case "general":
        return "primary";
      case "other":
        return "light";
      default:
        return "light";
    }
  };

  return (
    <div
      className={`bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6 transition-all hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500/30 `}
    >
      <Link to={`/support-tickets/${ticket._id}`}>
        {/* Header Section */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {ticket.subject}
                </h3>
                <Badge
                  variant="light"
                  color={getStatusColor(ticket.status)}
                  size="sm"
                >
                  {ticket.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge
                  variant="solid"
                  color={getPriorityColor(ticket.priority)}
                  size="sm"
                  startIcon={
                    ticket.priority === "urgent" ? (
                      <AlertCircle className="w-3 h-3" />
                    ) : undefined
                  }
                >
                  {ticket.priority === "not assigned"
                    ? "Priority not assigned"
                    : ticket.priority}
                </Badge>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
              {ticket.description}
            </p>
          </div>
        </div>

        {/* Loose layout */}
        {/* <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 dark:bg-white/[0.02] rounded-lg">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
          {ticket.createdBy.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {ticket.createdBy.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400 text-xs truncate">
              {ticket.createdBy.email}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Badge
            variant="light"
            color={getCategoryColor(ticket.category)}
            size="sm"
          >
            {ticket.category}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(ticket.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Updated {getTimeDifference(ticket.updatedAt)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{ticket.replies.length} replies</span>
          </div>
        </div>
      </div> */}

        {/* User + Details Section in one row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-3 bg-gray-50 dark:bg-white/[0.02] rounded-lg">
          {/* User Info */}
          <div className="flex items-center gap-4 sm:flex-1/3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
              {ticket.createdBy.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                  {ticket.createdBy.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400 text-xs truncate">
                  {ticket.createdBy.email}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 sm:flex-2/3 justify-around">
            <div className="flex items-center gap-2">
              <Badge
                variant="solid"
                color={getCategoryColor(ticket.category)}
                size="sm"
              >
                {ticket.category}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(ticket.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Updated {getTimeDifference(ticket.updatedAt)}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>{ticket.replies.length} replies</span>
            </div>
          </div>
        </div>

        {/* Compact Layout */}
        {/* <div
        className=" bg-gray-50 mt-4
       dark:bg-white/[0.02] rounded-lg p-4 grid mb-4 grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-xs text-gray-600 dark:text-gray-400"
      >
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span className="truncate">{ticket.createdBy.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Mail className="w-3 h-3" />
          <span className="truncate">{ticket.createdBy.email}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(ticket.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{getTimeDifference(ticket.updatedAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          <span>{ticket.replies.length} replies</span>
        </div>
        <div>
          <Badge
            variant="light"
            color={getCategoryColor(ticket.category)}
            size="sm"
          >
            {ticket.category}
          </Badge>
        </div>
      </div> */}

        {/* Footer Section */}

        <div className="flex justify-between items-center pt-4 px-1">
          {ticket.internalNotes.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>
                  {ticket.internalNotes.length} internal note
                  {ticket.internalNotes.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>No internal notes</span>
            </div>
          )}

          <Link
            to={`/support-tickets/${ticket._id}`}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            View details →
          </Link>
        </div>
      </Link>
    </div>
  );
};

export default TicketCard;
