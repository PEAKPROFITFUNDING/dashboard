import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router";
import { useTicketsAdmin } from "../../../../context/admin/TicketsAdminContext";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import Badge from "../../../../components/ui/badge/Badge";
import Button from "../../../../components/ui/button/Button";
import FileAttachment from "./FileAttachment";
import { ArrowLeft } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { InternalNotes } from "./InternalNotes";
import { StatusUpdateModal } from "./StatusUpdateModal";
import { ReplyForm } from "./ReplyForm";

// Avatar Component
const Avatar = ({ name, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-orange-500",
  ];

  const colorIndex = name.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];

  return (
    <div
      className={`${sizeClasses[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

const TicketDetails = () => {
  const { ticketId } = useParams();
  const { tickets, fetchTickets } = useTicketsAdmin();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const conversationEndRef = useRef(null);

  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.replies]);

  useEffect(() => {
    const findTicket = async () => {
      if (tickets) {
        const foundTicket = tickets.find((t) => t._id === ticketId);
        if (foundTicket) {
          setTicket(foundTicket);
          setLoading(false);
          return;
        }
      }

      // If not found in context, fetch all tickets
      try {
        await fetchTickets({ forceRefresh: true });
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setLoading(false);
      }
    };

    findTicket();
  }, [ticketId, tickets, fetchTickets]);

  useEffect(() => {
    if (tickets && !ticket) {
      const foundTicket = tickets.find((t) => t._id === ticketId);
      if (foundTicket) {
        setTicket(foundTicket);
      }
      setLoading(false);
    }
  }, [tickets, ticketId, ticket]);

  const handleStatusUpdate = (updates) => {
    setTicket((prev) => ({ ...prev, ...updates }));
  };

  const handleReplyAdded = () => {
    // Refresh ticket data
    fetchTickets({ forceRefresh: true });
  };

  const handleNoteAdded = () => {
    // Refresh ticket data
    fetchTickets({ forceRefresh: true });
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      open: "info",
      "in progress": "warning",
      resolved: "success",
      closed: "dark",
    };
    return colors[status] || "light";
  };

  const getPriorityBadgeColor = (priority) => {
    const colors = {
      low: "light",
      medium: "warning",
      high: "error",
      urgent: "error",
      "not assigned": "light",
    };
    return colors[priority] || "light";
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      technical: "info",
      billing: "warning",
      general: "light",
      other: "light",
    };
    return colors[category] || "light";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ticket Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The ticket you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Link
            to={"/admin/support-tickets"}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Back to Tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left side */}
          <div className="flex items-center gap-3">
            <Link
              to={"/admin/support-tickets"}
              className="flex items-center gap-2 p-2 text-gray-600 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate max-w-[250px] sm:max-w-none">
              {ticket.subject}
            </h1>
            <Badge color={getStatusBadgeColor(ticket.status)} variant="light">
              {ticket.status}
            </Badge>
            <Badge
              color={getPriorityBadgeColor(ticket.priority)}
              variant="light"
            >
              {ticket.priority === "not assigned"
                ? "Priority not assigned"
                : ticket.priority}
            </Badge>
          </div>

          {/* Right side */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              size="sm"
              onClick={() => setShowStatusModal(true)}
              className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Update Status
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Left Sidebar - Ticket Info */}
          <div className="xl:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="p-6 space-y-6">
                {/* Customer */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                    Customer
                  </h3>
                  <div className="flex items-center gap-3">
                    <Avatar name={ticket.createdBy.name} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {ticket.createdBy.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {ticket.createdBy.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />

                {/* Ticket Details */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Ticket Details
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        ID:
                      </span>
                      <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                        {ticket._id}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Category:
                      </span>
                      <div className="mt-1">
                        <Badge
                          color={getCategoryBadgeColor(ticket.category)}
                          variant="light"
                          size="sm"
                        >
                          {ticket.category}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Created At:
                      </span>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(ticket.createdAt)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Last Updated:
                      </span>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(ticket.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                    Description
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                {ticket.attachments.length > 0 && (
                  <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />
                )}

                {/* Attachments */}
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                      Attachments
                    </h3>
                    <div className="space-y-2">
                      {ticket.attachments.map((attachment, index) => (
                        <FileAttachment
                          key={index}
                          filename={
                            attachment.originalName || attachment.filename
                          }
                          onDownload={() =>
                            window.open(
                              `/api/attachments/${attachment}`,
                              "_blank"
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center - Conversation */}
          <div className="xl:col-span-2">
            <div className="bg-white dark:border-white/[0.05] dark:bg-white/[0.03] rounded-lg border border-gray-200  overflow-hidden">
              <div className="p-4 border-b  dark:border-white/[0.05]">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Conversation
                </h3>
              </div>

              <div className="max-h-96 overflow-y-auto p-4">
                {ticket.replies && ticket.replies.length > 0 ? (
                  <div className="space-y-1">
                    {ticket.replies.map((reply) => (
                      <MessageBubble
                        key={reply._id}
                        reply={reply}
                        isFromSupport={reply.isFromSupport}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No replies yet. Be the first to respond!
                  </p>
                )}
                <div ref={conversationEndRef} />
              </div>

              <ReplyForm
                ticketId={ticket._id}
                onReplyAdded={handleReplyAdded}
              />
            </div>
          </div>

          {/* Right Sidebar - Internal Notes */}
          <div className="xl:col-span-1">
            <InternalNotes
              ticketId={ticket._id}
              notes={ticket.internalNotes}
              onNoteAdded={handleNoteAdded}
            />
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        ticket={ticket}
        onUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default TicketDetails;
