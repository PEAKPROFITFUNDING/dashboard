import { useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import Button from "../../../../components/ui/button/Button";
import { Modal } from "../../../../components/ui/modal";

export const StatusUpdateModal = ({ isOpen, onClose, ticket, onUpdate }) => {
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
          <Button
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
