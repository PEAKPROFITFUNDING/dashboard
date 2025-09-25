import { createContext, useCallback, useContext, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

// Types
export interface TicketUser {
  _id: string;
  email: string;
  name: string;
}

export interface InternalNote {
  admin: TicketUser;
  note: string;
  _id: string;
  createdAt: string;
}

export interface TicketReply {
  user: TicketUser;
  isFromSupport: boolean;
  message: string;
  attachments: string[];
  _id: string;
  createdAt: string;
}

export interface Ticket {
  _id: string;
  category: "technical" | "billing" | "general" | "other";
  subject: string;
  description: string;
  attachments: string[];
  status: "open" | "in progress" | "resolved" | "closed";
  createdBy: TicketUser;
  priority: "low" | "medium" | "high" | "urgent" | "not assigned";
  closedAt: string | null;
  internalNotes: InternalNote[];
  replies: TicketReply[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TicketFilters {
  status: string | null;
  priority: string | null;
  category: string | null;
}

export interface TicketPagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TicketsResponse {
  data: Ticket[];
  pagination: TicketPagination;
  filters: TicketFilters;
}

export interface TicketsAdminContextType {
  tickets: Ticket[] | null;
  pagination: TicketPagination | null;
  filters: TicketFilters | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  searchQuery: string;
  activeStatus: string;
  activeCategory: string;
  activePriority: string;
  fetchTickets: (params?: {
    pageNo?: number;
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    forceRefresh?: boolean;
  }) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setActiveStatus: (status: string) => void;
  setActiveCategory: (category: string) => void;
  setActivePriority: (priority: string) => void;
  clearTickets: () => void;
  hasData: boolean;
}

export const TicketsAdminContext = createContext<
  TicketsAdminContextType | undefined
>(undefined);

export const TicketsAdminProvider = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [pagination, setPagination] = useState<TicketPagination | null>(null);
  const [filters, setFilters] = useState<TicketFilters | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePriority, setActivePriority] = useState("all");

  const fetchTickets = useCallback(
    async (params?: {
      pageNo?: number;
      search?: string;
      status?: string;
      priority?: string;
      category?: string;
      forceRefresh?: boolean;
    }) => {
      const {
        pageNo = currentPage,
        search = searchQuery,
        status = activeStatus,
        priority = activePriority,
        category = activeCategory,
        forceRefresh = false,
      } = params || {};

      // Use cached data if available and not forcing refresh
      if (tickets && !forceRefresh && pageNo === currentPage) {
        return;
      }

      try {
        setLoading(true);

        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append("pageNo", pageNo.toString());

        if (search.trim()) {
          queryParams.append("search", search.trim());
        }

        if (status && status !== "all") {
          queryParams.append("status", status);
        }

        if (priority && priority !== "all") {
          queryParams.append("priority", priority);
        }

        if (category && category !== "all") {
          queryParams.append("category", category);
        }

        const response = await axiosInstance.get<{
          result: TicketsResponse;
          message: string;
        }>(`/admin/tickets?${queryParams.toString()}`);

        setTickets(response.data.result.data);
        setPagination(response.data.result.pagination);
        setFilters(response.data.result.filters);
        setError(null);

        // Update current states
        setCurrentPage(pageNo);
        setSearchQuery(search);
        setActiveStatus(status);
        setActiveCategory(category);
        setActivePriority(priority);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch tickets"
        );
      } finally {
        setLoading(false);
      }
    },
    [
      currentPage,
      searchQuery,
      activeStatus,
      activePriority,
      activeCategory,
      tickets,
    ]
  );

  const clearTickets = useCallback(() => {
    setTickets(null);
    setPagination(null);
    setFilters(null);
    setError(null);
    setCurrentPage(1);
    setSearchQuery("");
    setActiveStatus("all");
    setActiveCategory("all");
    setActivePriority("all");
  }, []);

  const value: TicketsAdminContextType = {
    tickets,
    pagination,
    filters,
    loading,
    error,
    currentPage,
    searchQuery,
    activeStatus,
    activeCategory,
    activePriority,
    fetchTickets,
    setCurrentPage,
    setSearchQuery,
    setActiveStatus,
    setActiveCategory,
    setActivePriority,
    clearTickets,
    hasData: tickets !== null,
  };

  return (
    <TicketsAdminContext.Provider value={value}>
      {children}
    </TicketsAdminContext.Provider>
  );
};

// Custom Hook
export const useTicketsAdmin = () => {
  const context = useContext(TicketsAdminContext);
  if (!context) {
    throw new Error(
      "useTicketsAdmin must be used within a TicketsAdminProvider"
    );
  }
  return context;
};
