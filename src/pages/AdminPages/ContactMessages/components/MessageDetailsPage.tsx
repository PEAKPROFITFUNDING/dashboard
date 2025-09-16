import React, { useState, useEffect } from "react";
import { useContactMessagesContext } from "../../../../context/ContactMessagesContext";
import { useParams } from "react-router";
import Badge from "../../../../components/ui/badge/Badge";
import Input from "../../../../components/form/input/InputField";
import TextArea from "../../../../components/form/input/TextArea";
import Button from "../../../../components/ui/button/Button";
import Label from "../../../../components/form/Label";
import axiosInstance from "../../../../api/axiosInstance";

// Extend ContactData locally to include replies for type safety
interface Reply {
  email: string;
  name: string;
  subject: string;
  message: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactDataWithReplies {
  _id: string;
  email: string;
  name: string;
  subject: string;
  message: string;
  status: string;
  replies?: Reply[];
  createdAt: string;
  updatedAt?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "new":
      return "warning";
    case "read":
      return "info";
    case "replied":
      return "success";
    case "viewed":
      return "primary";
    default:
      return "primary";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MessageDetailsPage = () => {
  const { contactMessages, setContactMessageStatus } =
    useContactMessagesContext();
  const { id } = useParams();
  const contact = contactMessages.find((c) => c._id === id) as
    | ContactDataWithReplies
    | undefined;

  // Reply form state
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [replySuccess, setReplySuccess] = useState("");

  // Mark as viewed if status is 'new'
  useEffect(() => {
    if (contact && contact.status === "new" && id) {
      axiosInstance
        .put(`/contact/${id}/status`, { status: "viewed" })
        .then(() => {
          setContactMessageStatus(id, "viewed");
        })
        .catch(() => {
          // Optionally handle error
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact?.status, id]);

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        Contact message not found.
      </div>
    );
  }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReplyLoading(true);
    setReplyError("");
    setReplySuccess("");
    if (!replySubject.trim() || !replyMessage.trim()) {
      setReplyError("Subject and message are required.");
      setReplyLoading(false);
      return;
    }
    try {
      await axiosInstance.post(`/admin/contacts/${contact._id}/reply`, {
        subject: replySubject,
        message: replyMessage,
      });
      setReplySuccess("Reply sent successfully.");
      setReplySubject("");
      setReplyMessage("");
      // Update the contact in context: set status to 'replied' and add the reply
      setContactMessageStatus(contact._id, "replied");
      // Add the reply to the replies array in the context
      if (contact.replies) {
        contact.replies.unshift({
          email: "admin", // Optionally use real admin info if available
          name: "Admin",
          subject: replySubject,
          message: replyMessage,
          _id: Date.now().toString(), // Temporary ID
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        contact.replies = [
          {
            email: "admin",
            name: "Admin",
            subject: replySubject,
            message: replyMessage,
            _id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setReplyError(
        err?.response?.data?.message ||
          "Failed to send reply. Please try again."
      );
    } finally {
      setReplyLoading(false);
    }
  };

  const replies = contact.replies || [];

  return (
    <div className="w-full p-4">
      {/* Contact Message Card */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {contact.name}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {contact.email}
            </span>
          </div>
          <Badge size="sm" color={getStatusColor(contact.status)}>
            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
          </Badge>
        </div>
        <div className="mb-2">
          <span className="text-xs text-gray-400">
            Submitted: {formatDate(contact.createdAt)}
          </span>
        </div>
        <div className="mb-2">
          <span className="block text-base font-medium text-gray-700 dark:text-gray-300">
            Subject:
          </span>
          <span className="block text-base text-gray-800 dark:text-white/90 font-light">
            {contact.subject}
          </span>
        </div>
        <div className="mb-2">
          <span className="block text-base font-medium text-gray-700 dark:text-gray-300">
            Message:
          </span>
          <span className="block text-base text-gray-800 dark:text-white/90 whitespace-pre-line font-light">
            {contact.message}
          </span>
        </div>
      </div>

      {/* Reply Card (if replied) */}
      {contact.status === "replied" && replies.length > 0 && (
        <div className="mb-6 rounded-2xl border border-success-200 bg-success-50 p-6 shadow-sm dark:border-success-800 dark:bg-success-900/10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold text-success-700 dark:text-success-400">
                {replies[0].name}
              </span>
              <span className="text-sm text-success-600 dark:text-success-400">
                {replies[0].email}
              </span>
            </div>
            <Badge size="sm" color="success">
              Replied
            </Badge>
          </div>
          <div className="mb-2">
            <span className="text-xs text-gray-400">
              Replied: {formatDate(replies[0].createdAt)}
            </span>
          </div>
          <div className="mb-2">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject:
            </span>
            <span className="block text-base text-gray-800 dark:text-white/90">
              {replies[0].subject}
            </span>
          </div>
          <div className="mb-2">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message:
            </span>
            <span className="block text-base text-gray-800 dark:text-white/90 whitespace-pre-line">
              {replies[0].message}
            </span>
          </div>
        </div>
      )}

      {/* Reply Form (if not replied) */}
      {contact.status !== "replied" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Send a Reply
          </h3>
          <form onSubmit={handleReplySubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="reply-subject">Subject</Label>
              <Input
                id="reply-subject"
                name="reply-subject"
                placeholder="Reply Subject"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reply-message">Message</Label>
              <TextArea
                placeholder="Reply Message"
                value={replyMessage}
                onChange={setReplyMessage}
                rows={5}
              />
            </div>
            {replyError && (
              <div className="text-error-500 text-sm">{replyError}</div>
            )}
            {replySuccess && (
              <div className="text-success-500 text-sm">{replySuccess}</div>
            )}
            <Button type="submit" size="md" disabled={replyLoading}>
              {replyLoading ? "Sending..." : "Send Reply"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MessageDetailsPage;
