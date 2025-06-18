import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import axiosInstance from "../../../api/axiosInstance";
import { User, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface UserData {
  _id: string;
  email: string;
  name: string;
  profilePicture: string;
  role: string;
  createdAt: string;
  isVerified: boolean;
}

interface PaginationData {
  currentPage: number;
  pageSize: number;
  from: number;
  to: number;
  total: number;
}

interface ApiResponse {
  result: {
    pagination: PaginationData;
    data: UserData[];
  };
  message: string;
}

type SortField = "name" | "email" | "createdAt" | "role" | "status";
type SortOrder = "asc" | "desc";

export default function UsersListTable() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    pageSize: 10,
    from: 1,
    to: 10,
    total: 0,
  });
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const fetchUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<ApiResponse>(
        `/admin/users?page=${page}`
      );
      setUsers(response.data.result.data);
      setPagination(response.data.result.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.currentPage);
  }, [pagination.currentPage]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortUsers = (users: UserData[]) => {
    return [...users].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "email":
          comparison = a.email.localeCompare(b.email);
          break;
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "role":
          comparison = a.role.localeCompare(b.role);
          break;
        case "status":
          comparison = (a.isVerified ? 1 : 0) - (b.isVerified ? 1 : 0);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const SortableHeader = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
    <TableCell
      isHeader
      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
    >
      <div
        className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
        onClick={() => handleSort(field)}
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
      </div>
    </TableCell>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const sortedUsers = sortUsers(users);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <SortableHeader field="name" label="User" />
              <SortableHeader field="email" label="Email" />
              <SortableHeader field="role" label="Role" />
              <SortableHeader field="status" label="Status" />
              <SortableHeader field="createdAt" label="Created At" />
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {sortedUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {user.profilePicture ? (
                        <img
                          width={40}
                          height={40}
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.name}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={user.role === "Admin" ? "success" : "warning"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={user.isVerified ? "success" : "error"}
                  >
                    {user.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {formatDate(user.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-white/[0.05]">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {pagination.from} to {pagination.to} of {pagination.total}{" "}
          entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchUsers(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-200 rounded-md disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          >
            Previous
          </button>
          <button
            onClick={() => fetchUsers(pagination.currentPage + 1)}
            disabled={pagination.to >= pagination.total}
            className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-200 rounded-md disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
