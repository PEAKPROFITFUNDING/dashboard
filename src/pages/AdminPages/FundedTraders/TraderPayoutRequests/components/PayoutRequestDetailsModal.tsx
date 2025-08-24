"use client";
import { Modal } from "../../../../../components/ui/modal";
import Button from "../../../../../components/ui/button/Button";
import { AdminPayoutRequest } from "../../../../../services/payoutService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  request: AdminPayoutRequest | null;
  onStatusChange: (id: string, status: "approved" | "declined") => void;
}

export default function PayoutRequestDetailsModal({
  isOpen,
  onClose,
  request,
  onStatusChange,
}: Props) {
  if (!request) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg w-full mx-4">
      <div className="p-6 space-y-4 dark:text-white">
        <h2 className="text-xl font-semibold mb-4">Payout Request Details</h2>

        <div className="space-y-2 ">
          <p>
            <span className="font-medium">User:</span> {request.username}
          </p>
          <p>
            <span className="font-medium">Challenge ID:</span>{" "}
            {request.challengeId}
          </p>
          <p>
            <span className="font-medium">Method:</span> {request.method}
          </p>
          <p>
            <span className="font-medium">Account Holder:</span>{" "}
            {request.accountHolder}
          </p>
          <p>
            <span className="font-medium">Details:</span> {request.details}
          </p>
          <p>
            <span className="font-medium">Amount:</span> ${request.amount}
          </p>
          <p>
            <span className="font-medium">Requested At:</span>{" "}
            {new Date(request.requestedAt).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Status:</span> {request.status}
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onStatusChange(request.id, "approved")}
          >
            Approve
          </Button>
          <Button
            variant="outline"
            onClick={() => onStatusChange(request.id, "declined")}
          >
            Decline
          </Button>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
