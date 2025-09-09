import { useState } from "react";
import Badge from "../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import ProgressModal from "../../pages/ClientPages/Affiliate/Account/components/ReferralProgressModal";

interface AffiliateReferralListProps {
  referrals: Array<{
    id: string;
    fullName: string;
    email: string;
    signUpDate: string;
    totalCommission: number;
    currentStatus: string;
    steps: Array<{
      id: string;
      type: string;
      title: string;
      date: string;
      status: string;
      details;
    }>;
  }>;
}

export default function AffiliateReferralList({
  referrals,
}: AffiliateReferralListProps) {
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
      case "active_trader":
        return "success";
      case "signed_up":
        return "info";
      case "pending":
      default:
        return "primary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "active_trader":
        return "Active Trader";
      case "signed_up":
        return "Signed Up";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const openModal = (referral) => {
    setSelectedReferral(referral);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReferral(null);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Your Referrals
      </h2>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Total Commission
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Sign Up Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {referrals.map((referral) => (
                <TableRow
                  key={referral.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-5 py-4 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {referral.fullName}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {referral.email}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start">
                    <div className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(referral.totalCommission)}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {referral.signUpDate
                      ? formatDate(referral.signUpDate)
                      : "-"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={getStatusBadgeColor(referral.currentStatus)}
                    >
                      {getStatusLabel(referral.currentStatus)}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start">
                    <button
                      onClick={() => openModal(referral)}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-700 rounded-lg transition-colors"
                    >
                      Show Progress
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {referrals.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-600 text-lg mb-2">
                No referrals yet
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                Share your referral link to start earning commissions
              </div>
            </div>
          )}
        </div>
      </div>

      <ProgressModal
        isOpen={isModalOpen}
        onClose={closeModal}
        referral={selectedReferral}
      />
    </div>
  );
}
