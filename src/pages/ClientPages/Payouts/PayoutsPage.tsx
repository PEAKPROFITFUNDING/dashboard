import React, { useEffect, useState } from "react";
import ThemedDataTable, {
  ThemedDataTableColumn,
} from "../../../components/common/ThemedDataTable";
import PayoutRequestModal from "../../../components/payout/PayoutRequestModal";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import Badge from "../../../components/ui/badge/Badge";
import {
  fetchTraderChallenges,
  submitPayoutRequest,
  Challenge,
  PayoutRequest,
} from "../../../services/payoutService";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

const PAGE_SIZE = 10;

function formatCountdown(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "Now";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days}d ${hours}h`;
}

const PayoutsPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchTraderChallenges()
      .then(setChallenges)
      .catch(() => setError("Failed to load challenges"))
      .finally(() => setLoading(false));
  }, []);

  const handleRequestPayout = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setModalOpen(true);
    setModalError(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedChallenge(null);
    setModalError(null);
  };

  const handleModalSubmit = async (data: PayoutRequest) => {
    setModalLoading(true);
    setModalError(null);
    try {
      await submitPayoutRequest(data);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      handleModalClose();
    } catch {
      setModalError("Failed to submit payout request");
    } finally {
      setModalLoading(false);
    }
  };

  // Sortable header component
  const SortableHeader = ({
    field,
    label,
  }: {
    field: string;
    label: string;
  }) => (
    <span
      onClick={() => {
        if (sortField === field) {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
          setSortField(field);
          setSortOrder("asc");
        }
      }}
      className="flex items-center gap-1 cursor-pointer text-gray-500 dark:text-white hover:text-gray-700 dark:hover:text-white"
    >
      {label}
      {sortField === field ? (
        sortOrder === "asc" ? (
          <ArrowUp className="w-4 h-4" />
        ) : (
          <ArrowDown className="w-4 h-4" />
        )
      ) : (
        <ArrowUpDown className="w-4 h-4 opacity-50" />
      )}
    </span>
  );

  const filtered = challenges.filter((ch) =>
    ch.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let comparison = 0;
    if (sortField === "profit" || sortField === "drawdown") {
      comparison = a[sortField] - b[sortField];
    } else if (sortField === "eligible") {
      comparison = Number(a.eligible) - Number(b.eligible);
    } else if (sortField === "nextPayoutDate") {
      comparison =
        new Date(a.nextPayoutDate).getTime() -
        new Date(b.nextPayoutDate).getTime();
    } else {
      comparison = a[sortField].localeCompare(b[sortField]);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const total = sorted.length;
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: ThemedDataTableColumn<Challenge>[] = [
    {
      key: "name",
      label: <SortableHeader field="name" label="Challenge" />,
      render: (ch) => (
        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
          {ch.name}
        </span>
      ),
      className: "px-5 py-4 sm:px-6 text-start",
    },
    {
      key: "profit",
      label: <SortableHeader field="profit" label="Profit" />,
      render: (ch) => (
        <span className="text-gray-700 dark:text-gray-200">
          ${ch.profit.toLocaleString()}
        </span>
      ),
      className: "px-4 py-3 text-theme-sm",
    },
    {
      key: "drawdown",
      label: <SortableHeader field="drawdown" label="Drawdown" />,
      render: (ch) => (
        <span className="text-gray-700 dark:text-gray-200">
          ${ch.drawdown.toLocaleString()}
        </span>
      ),
      className: "px-4 py-3 text-theme-sm",
    },
    {
      key: "eligible",
      label: <SortableHeader field="eligible" label="Eligibility" />,
      render: (ch) => (
        <Badge size="sm" color={ch.eligible ? "success" : "error"}>
          {ch.eligible ? "Eligible" : "Not Eligible"}
        </Badge>
      ),
      className: "px-4 py-3 text-theme-sm",
    },
    {
      key: "nextPayoutDate",
      label: <SortableHeader field="nextPayoutDate" label="Next Payout" />,
      render: (ch) => (
        <span className="text-gray-700 dark:text-white">
          {formatCountdown(ch.nextPayoutDate)}
        </span>
      ),
      className: "px-4 py-3 text-theme-sm",
    },
    {
      key: "actions",
      label: "",
      render: (ch) => {
        if (ch.payoutStatus === "requested") {
          return (
            <Badge size="sm" color="warning">
              Payout Requested
            </Badge>
          );
        }
        if (ch.payoutStatus === "paid") {
          return (
            <Badge size="sm" color="success">
              Paid
            </Badge>
          );
        }

        if (!ch.eligible) {
          return null; // not eligible, render nothing
        }
        return (
          <button
            className="px-3 py-1 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50"
            disabled={!ch.eligible || !ch.payoutWindowOpen}
            onClick={() => handleRequestPayout(ch)}
          >
            Request Payout
          </button>
        );
      },
      className: "px-4 py-3 text-theme-sm",
    },
  ];

  return (
    <div>
      <PageBreadCrumb pageTitle="Payouts" />
      {showToast && (
        <div className="mb-4 bg-green-500 text-white px-4 py-2 rounded shadow">
          Payout request submitted successfully!
        </div>
      )}
      <ThemedDataTable
        columns={columns}
        data={paginated}
        loading={loading}
        error={error}
        enableSearch
        searchPlaceholder="Search challenges..."
        onSearch={setSearch}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={setSortField}
        pagination={{
          currentPage: page,
          pageSize: PAGE_SIZE,
          total,
          onPageChange: setPage,
        }}
        rowKey={(ch) => ch.id}
        emptyMessage="No challenges found."
      />
      <PayoutRequestModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        challenge={selectedChallenge}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
        error={modalError}
      />
    </div>
  );
};

export default PayoutsPage;
