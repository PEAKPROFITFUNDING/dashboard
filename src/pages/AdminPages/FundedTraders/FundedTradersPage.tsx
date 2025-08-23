import React, { useEffect, useState, useMemo } from "react";
import ThemedDataTable, {
  ThemedDataTableColumn,
} from "../../../components/common/ThemedDataTable";
import {
  fetchAllFundedChallenges,
  Challenge,
  dummyChallenges,
} from "../../../services/payoutService";
import Badge from "../../../components/ui/badge/Badge";
import PageBreadCrumb from "../../../components/common/PageBreadCrumb";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Avatar from "../../../components/ui/avatar/Avatar";

const PAGE_SIZE = 10;

const eligibilityFilters = [
  { key: "all", label: "All" },
  { key: "eligible", label: "Eligible" },
  { key: "ineligible", label: "Ineligible" },
];

function formatCountdown(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "Now";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days}d ${hours}h`;
}

const FundedTradersPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [eligibilityFilter, setEligibilityFilter] = useState<
    "all" | "eligible" | "ineligible"
  >("all");

  useEffect(() => {
    setLoading(true);
    // TEMPORARY: use dummy data
    setChallenges(dummyChallenges);
    setLoading(false);
  }, []);

  // Inline SortableHeader component
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
      className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
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

  const filtered = useMemo(() => {
    let filtered = challenges.filter((ch) =>
      ch.name.toLowerCase().includes(search.toLowerCase())
    );
    if (eligibilityFilter === "eligible")
      filtered = filtered.filter((ch) => ch.eligible);
    if (eligibilityFilter === "ineligible")
      filtered = filtered.filter((ch) => !ch.eligible);
    return filtered;
  }, [challenges, search, eligibilityFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortField === "profit" || sortField === "drawdown") {
        comparison = (a as any)[sortField] - (b as any)[sortField];
      } else if (
        [
          "eligible",
          "targetMet",
          "rulesRespected",
          "payoutWindowOpen",
        ].includes(sortField)
      ) {
        comparison =
          Number((a as any)[sortField]) - Number((b as any)[sortField]);
      } else if (sortField === "nextPayoutDate") {
        comparison =
          new Date(a.nextPayoutDate).getTime() -
          new Date(b.nextPayoutDate).getTime();
      } else {
        comparison = (a as any)[sortField].localeCompare((b as any)[sortField]);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [filtered, sortField, sortOrder]);

  const total = sorted.length;
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: ThemedDataTableColumn<Challenge>[] = [
    {
      key: "trader",
      label: "Trader",
      render: (ch) => (
        <div className="flex items-center gap-2">
          <Avatar src={ch.avatarUrl} alt={ch.username} size="small" />
          <span className="text-gray-800 dark:text-white text-theme-sm">
            {ch.username}
          </span>
        </div>
      ),
      className: "px-4 py-3 text-theme-sm dark:text-white",
    },
    {
      key: "name",
      label: <SortableHeader field="name" label="Challenge" />,
      render: (ch) => (
        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
          {ch.name}
        </span>
      ),
      className: "px-5 py-4 sm:px-6 text-start dark:text-white",
    },
    {
      key: "profit",
      label: <SortableHeader field="profit" label="Profit" />,
      render: (ch) => (
        <span className="text-gray-700 dark:text-gray-200">
          ${ch.profit.toLocaleString()}
        </span>
      ),
      className: "px-4 py-3 text-theme-sm dark:text-white",
    },
    {
      key: "drawdown",
      label: <SortableHeader field="drawdown" label="Drawdown" />,
      render: (ch) => (
        <span className="text-gray-700 dark:text-gray-200">
          ${ch.drawdown.toLocaleString()}
        </span>
      ),
      className: "px-4 py-3 text-theme-sm dark:text-white",
    },
    {
      key: "eligible",
      label: <SortableHeader field="eligible" label="Eligibility" />,
      render: (ch) => (
        <Badge size="sm" color={ch.eligible ? "success" : "error"}>
          {ch.eligible ? "Eligible" : "Not Eligible"}
        </Badge>
      ),
      className: "px-4 py-3 text-theme-sm dark:text-white",
    },
    {
      key: "eligibilityReason",
      label: "Reason",
      render: (ch) => ch.eligibilityReason || "-",
      className: "px-4 py-3 text-theme-sm  dark:text-white",
    },
    {
      key: "targetMet",
      label: <SortableHeader field="targetMet" label="Target Met" />,
      render: (ch) => (
        <Badge size="sm" color={ch.targetMet ? "success" : "error"}>
          {ch.targetMet ? "✅" : "❌"}
        </Badge>
      ),
      className: "px-4 py-3 text-theme-sm dark:text-white",
    },
    {
      key: "rulesRespected",
      label: <SortableHeader field="rulesRespected" label="Rules Respected" />,
      render: (ch) => (
        <Badge size="sm" color={ch.rulesRespected ? "success" : "error"}>
          {ch.rulesRespected ? "✅" : "❌"}
        </Badge>
      ),
      className: "px-4 py-3 text-theme-sm dark:text-white",
    },
    {
      key: "payoutWindowOpen",
      label: <SortableHeader field="payoutWindowOpen" label="Payout Window" />,
      render: (ch) => (
        <Badge size="sm" color={ch.payoutWindowOpen ? "success" : "error"}>
          {ch.payoutWindowOpen ? "✅" : "❌"}
        </Badge>
      ),
      className: "px-4 py-3 text-theme-sm dark:text-white",
    },
    {
      key: "nextPayoutDate",
      label: <SortableHeader field="nextPayoutDate" label="Next Payout" />,
      render: (ch) => <span>{formatCountdown(ch.nextPayoutDate)}</span>,
      className: "px-4 py-3 text-theme-sm dark:text-white",
    },
    {
      key: "performanceSummary",
      label: "Performance",
      render: (ch) => ch.performanceSummary,
      className: "px-4 py-3 text-theme-sm dark:text-white",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageBreadCrumb pageTitle="Funded Traders" />
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        {eligibilityFilters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setEligibilityFilter(filter.key as any)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              eligibilityFilter === filter.key
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
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
        emptyMessage="No funded challenges found."
      />
    </div>
  );
};

export default FundedTradersPage;
