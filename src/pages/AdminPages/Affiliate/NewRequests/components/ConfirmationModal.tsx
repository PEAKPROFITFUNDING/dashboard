import { Modal } from "../../../../../components/ui/modal";
import Button from "../../../../../components/ui/button/Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmVariant?: "success" | "error";
  loading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmVariant = "success",
  loading = false,
}: ConfirmationModalProps) {
  const confirmButtonClass =
    confirmVariant === "success"
      ? "px-4 py-3 text-xs text-success-600 bg-white border border-success-300 rounded-lg hover:bg-success-50 transition-colors dark:bg-gray-800 dark:border-success-600 dark:text-success-400 dark:hover:bg-success-500/10"
      : "px-4 py-3 text-xs text-error-600 bg-white border border-error-300 rounded-lg hover:bg-error-50 transition-colors dark:bg-gray-800 dark:border-error-600 dark:text-error-400 dark:hover:bg-error-500/10";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md w-full mx-4">
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="text-xs"
            disabled={loading}
          >
            Cancel
          </Button>
          <button
            onClick={onConfirm}
            className={confirmButtonClass}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
