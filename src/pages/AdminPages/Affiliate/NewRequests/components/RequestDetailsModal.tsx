import { useState } from "react";
import { Modal } from "../../../../../components/ui/modal";
import Button from "../../../../../components/ui/button/Button";
import { AffiliateRequest, Comment } from "./types";

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: AffiliateRequest | null;
  onStatusChange: (id: number, status: "approved" | "rejected") => void;
  onFlagChange: (id: number, flag: string) => void;
  onCommentAdd: (id: number, comment: Comment) => void;
}

export default function RequestDetailsModal({
  isOpen,
  onClose,
  request,
  onStatusChange,
}: // onFlagChange,
// onCommentAdd,
RequestDetailsModalProps) {
  const [selectedFlag, setSelectedFlag] = useState("");

  // Update selected flag when request changes
  if (request && selectedFlag !== (request.flag || "")) {
    setSelectedFlag(request.flag || "");
  }

  // const handleFlagChange = (flag: string) => {
  //   setSelectedFlag(flag);
  //   if (request) {
  //     onFlagChange(request.id, flag);
  //   }
  // };

  const handleStatusChange = (status: "approved" | "rejected") => {
    if (request) {
      onStatusChange(request.id, status);
      // Don't close modal here - let the parent component handle it after confirmation
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl w-full mx-4 max-h-[90vh] "
    >
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 ">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Affiliate Request Details
          </h3>
        </div>

        {/* Scrollable Content */}
        {request && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Request Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <p className="text-gray-900 dark:text-white">
                  {request.fullName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <p className="text-gray-900 dark:text-white">{request.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Applied Date
                </label>
                <p className="text-gray-900 dark:text-white">
                  {request.appliedDate}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    request.status === "approved"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : request.status === "rejected"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {request.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Social Media Link
                </label>
                <a
                  href={request.socialMediaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 break-all"
                >
                  {request.socialMediaLink}
                </a>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website Link
                </label>
                <a
                  href={request.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 break-all"
                >
                  {request.websiteLink}
                </a>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Strategy
              </label>
              <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                {request.strategy}
              </p>
            </div>

            {/* Flag Selection */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Flag Status
              </label>
              <Select
                options={flagOptions}
                defaultValue={selectedFlag}
                onChange={handleFlagChange}
                placeholder="Select a flag"
                className="w-full"
              />
            </div> */}

            {/* Comment Section */}
            {/* <CommentSection request={request} onCommentAdd={onCommentAdd} /> */}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                className="text-xs"
              >
                Close
              </Button>
              {request.status === "pending" && (
                <>
                  <button
                    onClick={() => handleStatusChange("approved")}
                    className="px-4 py-3 text-xs text-success-600 bg-white border border-success-300 rounded-lg hover:bg-success-50 transition-colors dark:bg-gray-800 dark:border-success-600 dark:text-success-400 dark:hover:bg-success-500/10"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange("rejected")}
                    className="px-4 py-3 text-xs text-error-600 bg-white border border-error-300 rounded-lg hover:bg-error-50 transition-colors dark:bg-gray-800 dark:border-error-600 dark:text-error-400 dark:hover:bg-error-500/10"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
