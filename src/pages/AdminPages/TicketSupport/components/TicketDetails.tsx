import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useTicketsAdmin } from "../../../../context/admin/TicketsAdminContext";
import axiosInstance from "../../../../api/axiosInstance";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import Badge from "../../../../components/ui/badge/Badge";

// Icons (simplified inline SVGs)
const BackIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

const SendIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const PaperclipIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// Modal Component
const Modal = ({ isOpen, onClose, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

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

// File Attachment Component
const FileAttachment = ({ filename, onDownload }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg border">
      <PaperclipIcon />
      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
        {filename}
      </span>
      <button
        onClick={() => onDownload(filename)}
        className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
      >
        <DownloadIcon />
      </button>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ reply, isFromSupport }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDownload = (filename) => {
    // Implementation for file download
    window.open(`/api/attachments/${filename}`, "_blank");
  };

  return (
    <div
      className={`flex gap-3 mb-4 ${
        isFromSupport ? "justify-end" : "justify-start"
      }`}
    >
      {!isFromSupport && <Avatar name={reply.user.name} size="sm" />}
      <div className={`max-w-2xl ${isFromSupport ? "order-first" : ""}`}>
        <div
          className={`p-3 rounded-lg ${
            isFromSupport
              ? "bg-blue-500 text-white ml-12"
              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          }`}
        >
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">
                {isFromSupport ? "Support" : reply.user.name}
              </span>
              <span
                className={`text-xs ${
                  isFromSupport
                    ? "text-blue-100"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {formatDate(reply.createdAt)}
              </span>
            </div>
            <p className="whitespace-pre-wrap">{reply.message}</p>
          </div>
          {reply.attachments && reply.attachments.length > 0 && (
            <div className="space-y-2 mt-3">
              {reply.attachments.map((attachment, index) => (
                <FileAttachment
                  key={index}
                  filename={attachment}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {isFromSupport && <Avatar name="Support" size="sm" />}
    </div>
  );
};

// Status Update Modal Component
const StatusUpdateModal = ({ isOpen, onClose, ticket, onUpdate }) => {
  const [status, setStatus] = useState(ticket?.status || "");
  const [priority, setPriority] = useState(ticket?.priority || "");
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: "open", label: "Open" },
    { value: "in progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
    { value: "not assigned", label: "Not Assigned" },
  ];

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(`/admin/updateTicket/${ticket._id}`, {
        status,
        priority,
      });
      onUpdate({ status, priority });
      onClose();
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("Failed to update ticket");
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md w-full p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Update Ticket Status
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Reply Form Component
const ReplyForm = ({ ticketId, onReplyAdded }) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("message", message);
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await axiosInstance.post(`/ticket/${ticketId}/reply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("");
      setAttachments([]);
      onReplyAdded();
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 dark:border-gray-700 p-4"
    >
      <div className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your reply... (Ctrl+Enter to send)"
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          disabled={loading}
        />

        {attachments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Attachments:
            </h4>
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              disabled={loading}
            >
              <PaperclipIcon />
              Attach Files
            </button>
            <span className="text-xs text-gray-500">
              {message.length}/5000 characters
            </span>
          </div>

          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendIcon />
            {loading ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </div>
    </form>
  );
};

// Internal Notes Component
const InternalNotes = ({ ticketId, notes, onNoteAdded }) => {
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLoading(true);
    try {
      await axiosInstance.post(`/admin/ticketNote/${ticketId}`, {
        note: newNote,
      });
      setNewNote("");
      onNoteAdded();
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Internal Notes
      </h3>

      {notes && notes.length > 0 && (
        <div className="space-y-3 mb-4">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-white dark:bg-gray-800 p-3 rounded border"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  {note.admin.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(note.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {note.note}
              </p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAddNote}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add internal note..."
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!newNote.trim() || loading}
          className="mt-2 px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Note"}
        </button>
      </form>
    </div>
  );
};

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
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
          <button
            onClick={() => navigate("/admin/tickets")}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/tickets")}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <BackIcon />
              Back to Tickets
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {ticket.subject}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Badge color={getStatusBadgeColor(ticket.status)} variant="light">
              {ticket.status}
            </Badge>
            <Badge
              color={getPriorityBadgeColor(ticket.priority)}
              variant="light"
            >
              {ticket.priority}
            </Badge>
            <button
              onClick={() => setShowStatusModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Ticket Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
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

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Ticket Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      ID:
                    </span>
                    <p className="text-sm text-gray-900 dark:text-white font-mono">
                      {ticket._id}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
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
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Created:
                    </span>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Last Updated:
                    </span>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatDate(ticket.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Description
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>

              {ticket.attachments && ticket.attachments.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Attachments
                  </h3>
                  <div className="space-y-2">
                    {ticket.attachments.map((attachment, index) => (
                      <FileAttachment
                        key={index}
                        filename={attachment}
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

          {/* Center - Conversation */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Conversation
                </h3>
              </div>

              <div className="max-h-96 overflow-y-auto p-6">
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
          <div className="lg:col-span-1">
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
