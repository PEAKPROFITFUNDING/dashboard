import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, X } from "lucide-react";

export interface ThemedDataTableColumn<T> {
  key: keyof T | string;
  label: string | React.ReactNode;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface ThemedDataTableProps<T> {
  columns: ThemedDataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  enableSearch?: boolean;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
  pagination?: {
    currentPage: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

function ThemedDataTable<T>({
  columns,
  data,
  loading,
  error,
  searchPlaceholder = "Search...",
  onSearch,
  enableSearch = false,
  sortField,
  sortOrder,
  onSort,
  pagination,
  rowKey,
  emptyMessage = "No data found.",
}: ThemedDataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) onSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {enableSearch && (
        <div className="p-4 border-b border-gray-100 dark:border-white/[0.05]">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={searchPlaceholder}
                className="w-full px-4 py-2 pl-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white/90"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              Search
            </button>
          </div>
        </div>
      )}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key as string}
                  isHeader
                  className={
                    col.className ||
                    "px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  }
                >
                  {col.sortable && onSort ? (
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={() => onSort(col.key as string)}
                    >
                      {col.label}
                      {sortField === col.key ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowDown className="w-4 h-4" />
                        )
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-50" />
                      )}
                    </div>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-500 dark:text-white"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={rowKey(row)}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key as string}
                      className={col.className || ""}
                    >
                      {col.render
                        ? col.render(row)
                        : (row[col.key as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-white/[0.05]">
          <div className="text-sm text-gray-500 dark:text-white">
            Showing{" "}
            {Math.min(
              (pagination.currentPage - 1) * pagination.pageSize + 1,
              pagination.total
            )}{" "}
            to{" "}
            {Math.min(
              pagination.currentPage * pagination.pageSize,
              pagination.total
            )}{" "}
            of {pagination.total} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-200 rounded-md disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              Previous
            </button>
            <button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={
                pagination.currentPage * pagination.pageSize >= pagination.total
              }
              className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-200 rounded-md disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemedDataTable;
