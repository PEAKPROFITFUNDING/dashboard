import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

type SortOrder = "asc" | "desc";
type SortField = string; // generic: can be any string field name

interface SortableHeaderProps {
  field: SortField;
  label: string;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

export default function SortableHeader({
  field,
  label,
  sortField,
  sortOrder,
  onSort,
}: SortableHeaderProps) {
  return (
    <th
      scope="col"
      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
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
    </th>
  );
}
