import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import axiosInstance from "../../../../api/axiosInstance";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import Badge from "../../../../components/ui/badge/Badge";
import Button from "../../../../components/ui/button/Button";
import FilterBar, { FilterOption } from "../../../../components/FilterBar";
import { SearchBar } from "../../../../components/SearchBar";
import { Pagination } from "../../../../components/Pagination";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import SortableHeader from "../../../../components/SortableHeader";

type KYCStatus = "pending" | "approved" | "rejected";

type KYCUser = {
  _id: string;
  name: string;
  email: string;
};

type KYCApplication = {
  _id: string;
  user: KYCUser;
  dateOfBirth: string;
  socials: string;
  idFrontImage: string;
  idBackImage: string;
  status: KYCStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
};

type KYCResponse = {
  result: {
    data: KYCApplication[];
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  message: string;
};

type SortField = "name" | "socials" | "createdAt" | "status" | "dateOfBirth"; // adjust fields for KYC table
type SortOrder = "asc" | "desc";

const UsersKYCTable: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<KYCApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters and search
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination data
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Counts for filter badges
  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const filterOptions: FilterOption[] = [
    { key: "all", label: "All Applications" },
    { key: "pending", label: "Pending", color: "warning" },
    { key: "approved", label: "Approved", color: "success" },
    { key: "rejected", label: "Rejected", color: "error" },
  ];

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortApplications = (applications) => {
    return [...applications].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "socials":
          comparison = Number(a.socials) - Number(b.socials);
          break;

        case "dateOfBirth":
          comparison =
            new Date(a.dateOfBirth).getTime() -
            new Date(b.dateOfBirth).getTime();
          break;
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "status":
          comparison = (a.isVerified ? 1 : 0) - (b.isVerified ? 1 : 0);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  const fetchKYCApplications = async (
    status?: string,
    search?: string,
    page: number = 1
  ) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (status && status !== "all") params.append("status", status);
      if (search) params.append("search", search);
      params.append("pageNo", page.toString());

      const response = await axiosInstance.get<KYCResponse>(
        `/admin/kycApplications?${params.toString()}`
      );

      setApplications(response.data.result.data);
      setPaginationData(response.data.result.pagination);

      // Update counts (you might want to get these from a separate endpoint)
      setCounts((prev) => ({
        ...prev,
        all: response.data.result.pagination.totalItems,
        // These would ideally come from the API
      }));
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch KYC applications"
      );
      console.error("Error fetching KYC applications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch counts for all statuses
  const fetchCounts = async () => {
    try {
      const [allRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
        axiosInstance.get("/admin/kycApplications?pageNo=1"),
        axiosInstance.get("/admin/kycApplications?status=pending&pageNo=1"),
        axiosInstance.get("/admin/kycApplications?status=approved&pageNo=1"),
        axiosInstance.get("/admin/kycApplications?status=rejected&pageNo=1"),
      ]);

      setCounts({
        all: allRes.data.result.pagination.totalItems,
        pending: pendingRes.data.result.pagination.totalItems,
        approved: approvedRes.data.result.pagination.totalItems,
        rejected: rejectedRes.data.result.pagination.totalItems,
      });
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  };

  useEffect(() => {
    fetchKYCApplications(activeFilter, searchQuery, currentPage);
    fetchCounts();
  }, [activeFilter, currentPage]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchKYCApplications(activeFilter, searchQuery, 1);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchKYCApplications(activeFilter, "", 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewKYC = (id: string) => {
    navigate(`/kyc/${id}`);
  };

  const getBadgeColor = (
    status: KYCStatus
  ): "warning" | "success" | "error" => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "warning";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getUserInitials = (name: string) => {
    return name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase();
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <Button
          onClick={() =>
            fetchKYCApplications(activeFilter, searchQuery, currentPage)
          }
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}

      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        filterOptions={filterOptions}
        counts={counts}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-4 border-b border-gray-100 dark:border-white/[0.05]">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            onClear={handleSearchClear}
            placeholder="Search by name or email..."
          />
        </div>
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <SortableHeader
                field="name"
                label="User"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />

              <SortableHeader
                field="socials"
                label="Social Security"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableHeader
                field="email"
                label="Date Of Birth"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableHeader
                field="status"
                label="KYC Status"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableHeader
                field="createdAt"
                label="Submitted At"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No KYC applications found
                </TableCell>
              </TableRow>
            ) : (
              sortApplications(applications).map((app) => (
                <TableRow key={app._id}>
                  {/* User */}
                  <TableCell className="px-5 py-3 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
                        {getUserInitials(app.user.name)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-600 dark:text-white">
                          {app.user.name}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-white">
                          {app.user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Social Security */}
                  <TableCell className="px-5 py-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {app.socials}
                    </span>
                  </TableCell>

                  {/* Date of Birth */}
                  <TableCell className="px-5 py-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(app.dateOfBirth)}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-5 py-3">
                    <Badge
                      color={getBadgeColor(app.status)}
                      variant="light"
                      size="sm"
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-5 py-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(app.createdAt)}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-5 py-3">
                    <Button
                      size="sm"
                      variant="primary"
                      startIcon={<Eye className="w-4 h-4" />}
                      onClick={() => handleViewKYC(app._id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!loading && applications.length > 0 && (
          <Pagination
            currentPage={paginationData.currentPage}
            totalPages={paginationData.totalPages}
            totalItems={paginationData.totalItems}
            itemsPerPage={paginationData.perPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default UsersKYCTable;
