import { Modal } from "../../../../../../components/ui/modal";
import CustomButton from "../../../../../../components/ui/button/CustomButton";
import { AffiliateDetails } from "./types";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingAction: "activate" | "deactivate" | null;
  affiliate: AffiliateDetails;
  onConfirm: (newStatus: "active" | "inactive") => void;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  pendingAction,
  affiliate,
  onConfirm,
}: ConfirmationModalProps) {
  return (
    <Modal className="max-w-4/12" isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Confirm Action
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to{" "}
          {pendingAction === "activate" ? "activate" : "deactivate"}
          {affiliate.fullName}?
        </p>
        <div className="flex gap-3 justify-end">
          <CustomButton onClick={onClose} variant="outline" size="sm">
            Cancel
          </CustomButton>
          <CustomButton
            onClick={() =>
              onConfirm(pendingAction === "activate" ? "active" : "inactive")
            }
            color={pendingAction === "activate" ? "green" : "red"}
            size="sm"
          >
            {pendingAction === "activate" ? "Activate" : "Deactivate"}
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
}
