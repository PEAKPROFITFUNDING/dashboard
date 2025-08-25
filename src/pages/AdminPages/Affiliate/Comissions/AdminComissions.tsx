import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import {
  CheckCircle,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { StatsCard } from "./components/StatsCard";
import { CommissionsTable } from "./components/CommissionsTable";

// Types
export type SortField =
  | "affiliate"
  | "customer"
  | "amount"
  | "date"
  | "status"
  | "type"
  | "orderId";
export type FilterType = "all" | "pending" | "approved" | "paid" | "rejected";
export type CommissionType =
  | "purchase"
  | "referral"
  | "bonus"
  | "recurring"
  | "tier2";

export interface Commission {
  id: number;
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  commissionType: CommissionType;
  amount: number;
  rate: number;
  orderValue: number;
  status: "pending" | "approved" | "paid" | "rejected";
  dateEarned: string;
  orderId?: string;
  transactionId?: string;
  notes?: string;
}

// Dummy data
const overviewStats = {
  totalLifetimeCommissions: 284500,
  thisMonthCommissions: 18750,
  pendingCommissions: { count: 12, amount: 3420 },
  approvedCommissions: { count: 8, amount: 2180 },
  paidCommissions: { count: 156, amount: 45600 },
};

const commissions: Commission[] = [
  {
    id: 1,
    affiliateId: "AFF-001",
    affiliateName: "John Doe",
    affiliateEmail: "john@example.com",
    customerId: "CUST-123",
    customerName: "Alice Johnson",
    customerEmail: "alice@customer.com",
    commissionType: "purchase",
    amount: 125,
    rate: 10,
    orderValue: 1250,
    status: "pending",
    dateEarned: "2025-08-24T14:30:00Z",
    orderId: "ORD-789456",
  },
  {
    id: 2,
    affiliateId: "AFF-002",
    affiliateName: "Sarah Wilson",
    affiliateEmail: "sarah@example.com",
    customerId: "CUST-456",
    customerName: "Bob Smith",
    customerEmail: "bob@customer.com",
    commissionType: "referral",
    amount: 200,
    rate: 15,
    orderValue: 1333,
    status: "approved",
    dateEarned: "2025-08-23T10:15:00Z",
    orderId: "ORD-123789",
  },
  {
    id: 3,
    affiliateId: "AFF-003",
    affiliateName: "Mike Johnson",
    affiliateEmail: "mike@example.com",
    customerId: "CUST-789",
    customerName: "Carol Davis",
    customerEmail: "carol@customer.com",
    commissionType: "purchase",
    amount: 75,
    rate: 8,
    orderValue: 937.5,
    status: "paid",
    dateEarned: "2025-08-22T16:45:00Z",
    orderId: "ORD-456123",
    transactionId: "TXN-PAY-789",
  },
  {
    id: 4,
    affiliateId: "AFF-004",
    affiliateName: "Emily Chen",
    affiliateEmail: "emily@example.com",
    customerId: "CUST-321",
    customerName: "David Wilson",
    customerEmail: "david@customer.com",
    commissionType: "bonus",
    amount: 500,
    rate: 0,
    orderValue: 0,
    status: "approved",
    dateEarned: "2025-08-21T09:20:00Z",
    notes: "Monthly performance bonus",
  },
  {
    id: 5,
    affiliateId: "AFF-001",
    affiliateName: "John Doe",
    affiliateEmail: "john@example.com",
    customerId: "CUST-654",
    customerName: "Eva Martinez",
    customerEmail: "eva@customer.com",
    commissionType: "recurring",
    amount: 45,
    rate: 5,
    orderValue: 900,
    status: "paid",
    dateEarned: "2025-08-20T12:30:00Z",
    orderId: "ORD-SUB-456",
    transactionId: "TXN-PAY-456",
  },
  {
    id: 6,
    affiliateId: "AFF-005",
    affiliateName: "David Brown",
    affiliateEmail: "david@example.com",
    customerId: "CUST-987",
    customerName: "Frank Miller",
    customerEmail: "frank@customer.com",
    commissionType: "purchase",
    amount: 30,
    rate: 12,
    orderValue: 250,
    status: "rejected",
    dateEarned: "2025-08-19T15:45:00Z",
    orderId: "ORD-234567",
    notes: "Customer requested refund",
  },
  {
    id: 7,
    affiliateId: "AFF-006",
    affiliateName: "Lisa Anderson",
    affiliateEmail: "lisa@example.com",
    customerId: "CUST-111",
    customerName: "Grace Lee",
    customerEmail: "grace@customer.com",
    commissionType: "tier2",
    amount: 25,
    rate: 3,
    orderValue: 833,
    status: "pending",
    dateEarned: "2025-08-24T11:20:00Z",
    orderId: "ORD-TIER2-123",
  },
  {
    id: 8,
    affiliateId: "AFF-002",
    affiliateName: "Sarah Wilson",
    affiliateEmail: "sarah@example.com",
    customerId: "CUST-222",
    customerName: "Henry Taylor",
    customerEmail: "henry@customer.com",
    commissionType: "purchase",
    amount: 180,
    rate: 12,
    orderValue: 1500,
    status: "approved",
    dateEarned: "2025-08-23T14:10:00Z",
    orderId: "ORD-333444",
  },
];

export default function AdminCommissions() {
  return (
    <>
      <PageMeta
        title="Admin - Commission Management"
        description="Admin dashboard for managing affiliate commissions"
      />
      <PageBreadcrumb pageTitle={`Commission Management`} />

      <div className="space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsCard
            title="Total Lifetime"
            value={overviewStats.totalLifetimeCommissions}
            subtitle="All-time commissions earned"
            icon={<TrendingUp className="w-8 h-8" />}
            color="blue"
          />
          <StatsCard
            title="This Month"
            value={overviewStats.thisMonthCommissions}
            subtitle="Commissions earned this month"
            icon={<DollarSign className="w-8 h-8" />}
            color="green"
          />
          <StatsCard
            title="Pending"
            value={`${
              overviewStats.pendingCommissions.count
            } (${overviewStats.pendingCommissions.amount.toLocaleString()})`}
            subtitle={`${overviewStats.pendingCommissions.count} awaiting approval`}
            icon={<Clock className="w-8 h-8" />}
            color="yellow"
          />
          <StatsCard
            title="Approved"
            value={`${
              overviewStats.approvedCommissions.count
            } (${overviewStats.approvedCommissions.amount.toLocaleString()})`}
            subtitle={`${overviewStats.approvedCommissions.count} ready for payout`}
            icon={<CheckCircle className="w-8 h-8" />}
            color="purple"
          />
          <StatsCard
            title="Paid"
            value={`${
              overviewStats.paidCommissions.count
            } (${overviewStats.paidCommissions.amount.toLocaleString()})`}
            subtitle={`${overviewStats.paidCommissions.count} completed payments`}
            icon={<Users className="w-8 h-8" />}
            color="gray"
          />
        </div>

        {/* Commissions Table */}
        <CommissionsTable commissions={commissions} />
      </div>
    </>
  );
}
