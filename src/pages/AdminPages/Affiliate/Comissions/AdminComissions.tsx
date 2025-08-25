import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import { useState } from "react";
import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Modal } from "../../../../components/ui/modal";
import Badge from "../../../../components/ui/badge/Badge";
import Button from "../../../../components/ui/button/Button";

// Types
type SortField =
  | "affiliate"
  | "customer"
  | "amount"
  | "date"
  | "status"
  | "type"
  | "orderId";
type FilterType = "all" | "pending" | "approved" | "paid" | "rejected";
type CommissionType = "purchase" | "referral" | "bonus" | "recurring" | "tier2";

interface Commission {
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

// Overview Stats Cards Component
function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
}) {
  const colorClasses = {
    blue: "text-blue-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
    gray: "text-gray-500",
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-6 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {typeof value === "number" ? `$${value.toLocaleString()}` : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`${colorClasses[color]} opacity-80`}>{icon}</div>
      </div>
    </div>
  );
}

// Commission Details Modal Component
function CommissionModal({
  isOpen,
  onClose,
  commission,
}: {
  isOpen: boolean;
  onClose: () => void;
  commission: Commission | null;
}) {
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  if (!commission) return null;

  const getTypeLabel = (type: CommissionType) => {
    switch (type) {
      case "purchase":
        return "Purchase Commission";
      case "referral":
        return "Referral Commission";
      case "bonus":
        return "Performance Bonus";
      case "recurring":
        return "Recurring Commission";
      case "tier2":
        return "Tier 2 Commission";
    }
  };

  const getTypeDescription = (type: CommissionType) => {
    switch (type) {
      case "purchase":
        return "Commission earned from direct customer purchase";
      case "referral":
        return "Commission earned from referring new affiliate";
      case "bonus":
        return "Special bonus commission";
      case "recurring":
        return "Recurring subscription commission";
      case "tier2":
        return "Commission from sub-affiliate's sale";
    }
  };

  const handleStatusChange = (newStatus: string) => {
    console.log("Status changed:", {
      commissionId: commission.id,
      newStatus,
      notes,
    });
    onClose();
    setStatus("");
    setNotes("");
  };

  const handleCancel = () => {
    onClose();
    setStatus("");
    setNotes("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      className="max-w-2xl mx-4 max-h-[90vh] overflow-y-scroll"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Commission Details
        </h2>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge
              size="md"
              color={
                commission.status === "pending"
                  ? "warning"
                  : commission.status === "approved"
                  ? "success"
                  : commission.status === "paid"
                  ? "primary"
                  : "error"
              }
            >
              {commission.status.charAt(0).toUpperCase() +
                commission.status.slice(1)}
            </Badge>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${commission.amount.toLocaleString()}
            </span>
          </div>

          {/* Commission Type */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-gray-900 dark:text-white">
            <h3 className="font-semibold  mb-2">
              {getTypeLabel(commission.commissionType)}
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              {getTypeDescription(commission.commissionType)}
            </p>
            {commission.rate > 0 && (
              <div className="text-sm">
                <span className="font-medium">Rate:</span> {commission.rate}% of
                ${commission.orderValue.toLocaleString()} = $
                {commission.amount.toLocaleString()}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900 dark:text-white">
            {/* Affiliate Info */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Affiliate Details</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span>
                  <Link
                    to={`/admin/affiliates/${commission.affiliateId}`}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {commission.affiliateName}
                  </Link>
                </p>
                <p>
                  <span className="font-medium">ID:</span>{" "}
                  {commission.affiliateId}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {commission.affiliateEmail}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Customer Details
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {commission.customerName}
                </p>
                <p>
                  <span className="font-medium">ID:</span>{" "}
                  {commission.customerId}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {commission.customerEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Order & Transaction Info */}
          <div className="border border-gray-200 text-gray-900 dark:text-white dark:border-white/[0.05] rounded-lg p-4">
            <h3 className="font-semibold  mb-3">Transaction Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <span className="font-medium">Date Earned:</span>{" "}
                  {new Date(commission.dateEarned).toLocaleString()}
                </p>
                {commission.orderId && (
                  <p>
                    <span className="font-medium">Order ID:</span>{" "}
                    {commission.orderId}
                  </p>
                )}
                {commission.transactionId && (
                  <p>
                    <span className="font-medium">Transaction ID:</span>{" "}
                    {commission.transactionId}
                  </p>
                )}
              </div>
              <div>
                {commission.orderValue > 0 && (
                  <p>
                    <span className="font-medium">Order Value:</span> $
                    {commission.orderValue.toLocaleString()}
                  </p>
                )}
                {commission.rate > 0 && (
                  <p>
                    <span className="font-medium">Commission Rate:</span>{" "}
                    {commission.rate}%
                  </p>
                )}
              </div>
            </div>
            {commission.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/[0.05]">
                <p className="text-sm">
                  <span className="font-medium">Notes:</span> {commission.notes}
                </p>
              </div>
            )}
          </div>

          {/* Status Management */}
          {commission.status !== "paid" && (
            <div className="border border-gray-200 dark:border-white/[0.05] rounded-lg p-4 text-gray-900 dark:text-white">
              <h3 className="font-semibold  mb-3">Update Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select new status...</option>
                    {commission.status === "pending" && (
                      <option value="approved">Approve</option>
                    )}
                    {commission.status === "pending" && (
                      <option value="rejected">Reject</option>
                    )}
                    {commission.status === "approved" && (
                      <option value="paid">Mark as Paid</option>
                    )}
                    {commission.status === "approved" && (
                      <option value="rejected">Reject</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this status change..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              {commission.status === "paid" ? "Close" : "Cancel"}
            </Button>
            {commission.status !== "paid" && status && (
              <Button
                variant="primary"
                onClick={() => handleStatusChange(status)}
                className="flex-1"
              >
                Update Status
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Filter Bar Component
function FilterBar({
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  commissions,
  affiliateFilter,
  onAffiliateFilterChange,
  typeFilter,
  onTypeFilterChange,
}: {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  commissions: Commission[];
  affiliateFilter: string;
  onAffiliateFilterChange: (affiliate: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
}) {
  const getFilterCount = (filter: FilterType) => {
    if (filter === "all") return commissions.length;
    return commissions.filter((commission) => commission.status === filter)
      .length;
  };

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "paid", label: "Paid" },
    { key: "rejected", label: "Rejected" },
  ];

  const uniqueAffiliates = Array.from(
    new Set(commissions.map((c) => c.affiliateName))
  ).sort();
  const commissionTypes = [
    { key: "", label: "All Types" },
    { key: "purchase", label: "Purchase" },
    { key: "referral", label: "Referral" },
    { key: "bonus", label: "Bonus" },
    { key: "recurring", label: "Recurring" },
    { key: "tier2", label: "Tier 2" },
  ];

  return (
    <div className="space-y-4">
      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key as FilterType)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === filter.key
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {filter.label} ({getFilterCount(filter.key as FilterType)})
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by affiliate or customer name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={affiliateFilter}
            onChange={(e) => onAffiliateFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Affiliates</option>
            {uniqueAffiliates.map((affiliate) => (
              <option key={affiliate} value={affiliate}>
                {affiliate}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {commissionTypes.map((type) => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// Main Commissions Table Component
function CommissionsTable({ commissions }: { commissions: Commission[] }) {
  const [statusFilter, setStatusFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [affiliateFilter, setAffiliateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedCommission, setSelectedCommission] =
    useState<Commission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  const sortedAndFilteredData = [...commissions]
    .filter((commission) => {
      if (statusFilter !== "all" && commission.status !== statusFilter)
        return false;
      if (affiliateFilter && commission.affiliateName !== affiliateFilter)
        return false;
      if (typeFilter && commission.commissionType !== typeFilter) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          commission.affiliateName.toLowerCase().includes(search) ||
          commission.customerName.toLowerCase().includes(search) ||
          commission.affiliateId.toLowerCase().includes(search) ||
          commission.customerId.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField as keyof Commission];
      let bValue: any = b[sortField as keyof Commission];

      if (sortField === "date") {
        aValue = new Date(a.dateEarned).getTime();
        bValue = new Date(b.dateEarned).getTime();
      } else if (sortField === "amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue || "").toLowerCase();
        bValue = String(bValue || "").toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const paginatedData = sortedAndFilteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "paid":
        return "primary";
      case "rejected":
        return "error";
      default:
        return "error";
    }
  };

  const getTypeColor = (type: CommissionType) => {
    switch (type) {
      case "purchase":
        return "primary";
      case "referral":
        return "success";
      case "bonus":
        return "warning";
      case "recurring":
        return "info";
      case "tier2":
        return "primary";
      default:
        return "primary";
    }
  };

  const handleRowClick = (commission: Commission) => {
    setSelectedCommission(commission);
    setIsModalOpen(true);
  };

  const handleApprove = (e: React.MouseEvent, commission: Commission) => {
    e.stopPropagation();
    console.log("Approving commission:", commission.id);
  };

  const handleReject = (e: React.MouseEvent, commission: Commission) => {
    e.stopPropagation();
    console.log("Rejecting commission:", commission.id);
  };

  const handleMarkPaid = (e: React.MouseEvent, commission: Commission) => {
    e.stopPropagation();
    console.log("Marking as paid:", commission.id);
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Commission Management
        </h3>
      </div>

      {/* Filter Bar */}
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.05]">
        <FilterBar
          activeFilter={statusFilter}
          onFilterChange={(filter) => {
            setStatusFilter(filter);
            setCurrentPage(1);
          }}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          commissions={commissions}
          affiliateFilter={affiliateFilter}
          onAffiliateFilterChange={setAffiliateFilter}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
        />
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("affiliate")}
                >
                  Affiliate {getSortIcon("affiliate")}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("customer")}
                >
                  Customer {getSortIcon("customer")}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("type")}
                >
                  Type {getSortIcon("type")}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("amount")}
                >
                  Amount {getSortIcon("amount")}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("status")}
                >
                  Status {getSortIcon("status")}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort("date")}
                >
                  Date Earned {getSortIcon("date")}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 font-medium text-gray-500 text-start text-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedData.map((commission) => (
              <TableRow
                key={commission.id}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => handleRowClick(commission)}
              >
                <TableCell className="px-6 py-4 text-start">
                  <div>
                    <Link
                      to={`/admin/affiliates/${commission.affiliateId}`}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {commission.affiliateName}
                    </Link>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {commission.affiliateId}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {commission.customerName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {commission.customerId}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <Badge
                    size="sm"
                    color={getTypeColor(commission.commissionType)}
                  >
                    {commission.commissionType.charAt(0).toUpperCase() +
                      commission.commissionType.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${commission.amount.toLocaleString()}
                    </span>
                    {commission.rate > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {commission.rate}% of $
                        {commission.orderValue.toLocaleString()}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <Badge size="sm" color={getStatusColor(commission.status)}>
                    {commission.status.charAt(0).toUpperCase() +
                      commission.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(commission.dateEarned)}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-start">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(commission);
                      }}
                      className="text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {commission.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={(e) => handleApprove(e, commission)}
                          className="text-xs"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleReject(e, commission)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {commission.status === "approved" && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={(e) => handleMarkPaid(e, commission)}
                        className="text-xs"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/[0.05]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                sortedAndFilteredData.length
              )}{" "}
              of {sortedAndFilteredData.length} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Commission Details Modal */}
      <CommissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        commission={selectedCommission}
      />
    </div>
  );
}

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
