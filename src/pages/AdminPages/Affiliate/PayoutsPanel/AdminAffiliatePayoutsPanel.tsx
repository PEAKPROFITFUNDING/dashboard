import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";

import { CheckCircle, DollarSign, Calendar } from "lucide-react";
import { StatsCard } from "./components/StatsCard";
import { PayoutsTable } from "./components/PayoutsTable";

// Types
export type SortField =
  | "affiliate"
  | "amount"
  | "date"
  | "status"
  | "method"
  | "transactionId"
  | "paidDate";
export type FilterType = "all" | "pending" | "approved" | "paid" | "rejected";
export type PaymentMethod =
  | "paypal"
  | "bank_transfer"
  | "wire_transfer"
  | "crypto";

export interface PayoutRequest {
  id: number;
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
  amount: number;
  requestedDate: string;
  status: "pending" | "approved" | "paid" | "rejected";
  method: PaymentMethod;
  accountDetails: {
    paypalEmail?: string;
    bankAccount?: string;
    iban?: string;
    walletAddress?: string;
    accountHolder?: string;
  };
  transactionId?: string;
  paidDate?: string;
  fees: number;
}

// Dummy data
const overviewStats = {
  pendingRequests: { count: 8, amount: 4250 },
  approvedUnpaid: { count: 5, amount: 2800 },
  paidThisMonth: 15600,
  lifetimePaid: 125000,
};

const payoutRequests: PayoutRequest[] = [
  {
    id: 1,
    affiliateId: "AFF-001",
    affiliateName: "John Doe",
    affiliateEmail: "john@example.com",
    amount: 800,
    requestedDate: "2025-08-20T10:30:00Z",
    status: "pending",
    method: "paypal",
    accountDetails: { paypalEmail: "john@example.com" },
    fees: 24,
  },
  {
    id: 2,
    affiliateId: "AFF-002",
    affiliateName: "Sarah Wilson",
    affiliateEmail: "sarah@example.com",
    amount: 1200,
    requestedDate: "2025-08-19T14:15:00Z",
    status: "approved",
    method: "bank_transfer",
    accountDetails: {
      bankAccount: "****1234",
      iban: "GB29 NWBK 6016 1331 9268 19",
      accountHolder: "Sarah Wilson",
    },
    fees: 15,
  },
  {
    id: 3,
    affiliateId: "AFF-003",
    affiliateName: "Mike Johnson",
    affiliateEmail: "mike@example.com",
    amount: 650,
    requestedDate: "2025-08-18T16:45:00Z",
    status: "paid",
    method: "paypal",
    accountDetails: { paypalEmail: "mike@example.com" },
    transactionId: "TXN-789123456",
    paidDate: "2025-08-21T09:30:00Z",
    fees: 19.5,
  },
  {
    id: 4,
    affiliateId: "AFF-004",
    affiliateName: "Emily Chen",
    affiliateEmail: "emily@example.com",
    amount: 950,
    requestedDate: "2025-08-17T11:20:00Z",
    status: "approved",
    method: "crypto",
    accountDetails: { walletAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" },
    fees: 10,
  },
  {
    id: 5,
    affiliateId: "AFF-005",
    affiliateName: "David Brown",
    affiliateEmail: "david@example.com",
    amount: 300,
    requestedDate: "2025-08-16T13:45:00Z",
    status: "rejected",
    method: "paypal",
    accountDetails: { paypalEmail: "david@example.com" },
    fees: 9,
  },
];

export default function AdminAffiliatePayoutsPanel() {
  const pendingRequests = payoutRequests.filter((r) => r.status === "pending");
  const approvedRequests = payoutRequests.filter(
    (r) => r.status === "approved"
  );
  const paidRequests = payoutRequests.filter((r) => r.status === "paid");

  return (
    <>
      <PageMeta
        title="Admin - Payout Management"
        description="Admin dashboard for managing affiliate payouts"
      />
      <PageBreadcrumb pageTitle={`Payout Management`} />

      <div className="space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Pending Requests"
            value={`${
              overviewStats.pendingRequests.count
            } ($${overviewStats.pendingRequests.amount.toLocaleString()})`}
            subtitle={`${overviewStats.pendingRequests.count} requests awaiting review`}
            icon={<Calendar className="w-8 h-8" />}
          />
          <StatsCard
            title="Approved (Unpaid)"
            value={`${
              overviewStats.approvedUnpaid.count
            } ($${overviewStats.approvedUnpaid.amount.toLocaleString()})`}
            subtitle={`${overviewStats.approvedUnpaid.count} requests ready for payment`}
            icon={<CheckCircle className="w-8 h-8" />}
          />
          <StatsCard
            title="Paid This Month"
            value={overviewStats.paidThisMonth}
            subtitle="Total paid out this month"
            icon={<DollarSign className="w-8 h-8" />}
          />
          <StatsCard
            title="Lifetime Paid"
            value={overviewStats.lifetimePaid}
            subtitle="Total paid to all affiliates"
            icon={<DollarSign className="w-8 h-8" />}
          />
        </div>

        {/* Pending Requests Table */}
        <PayoutsTable
          title="Pending & Approved Requests"
          requests={payoutRequests.filter(
            (r) => r.status === "pending" || r.status === "approved"
          )}
          showActions={true}
        />

        {/* Paid History Table */}
        <PayoutsTable
          title="Payment History"
          requests={paidRequests}
          showActions={false}
        />
      </div>
    </>
  );
}
