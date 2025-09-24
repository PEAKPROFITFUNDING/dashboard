import {
  createContext,
  useRef,
  useCallback,
  useContext,
  useState,
} from "react";
import axiosInstance from "../../api/axiosInstance";

export interface TicketType {
  _id: string;
  category: "technical" | "billing" | "general" | "other";
  subject: string;
  description: string;
  attachments: Array<{
    filename: string;
    originalName: string;
    path: string;
    size: number;
    _id: string;
  }>;
  status: "open" | "in progress" | "resolved" | "closed";
  createdBy: {
    _id: string;
    email: string;
    name: string;
  };
  priority: "low" | "medium" | "high" | "not assigned";
  closedAt: string | null;
  internalNotes: Array<{
    admin: string;
    note: string;
    _id: string;
    createdAt: string;
  }>;
  replies: Array<{
    user: string;
    isFromSupport: boolean;
    message: string;
    attachments: Array<{
      filename: string;
      originalName: string;
      path: string;
      size: number;
      _id: string;
    }>;
    _id: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface TicketsResponseType {
  result: {
    tickets: TicketType[];
    currentPage: number;
    totalPages: number;
    totalTickets: number;
    filters: {
      search: string;
      category: string;
      status: string;
    };
  };
  message: string;
}

export interface TicketsFilters {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
}

export interface TicketsContextType {
  tickets: TicketType[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalTickets: number;
  filters: TicketsFilters;
  fetchTickets: (filters?: TicketsFilters) => Promise<void>;
  clearTickets: () => void;
  updateFilters: (newFilters: TicketsFilters) => void;
  hasData: boolean;
}

export const TicketsContext = createContext<TicketsContextType | undefined>(
  undefined
);

export const TicketsProvider = ({ children }) => {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const [filters, setFilters] = useState<TicketsFilters>({});

  // Use ref to track the latest filters without causing re-renders
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Move buildQueryString outside of useCallback to avoid dependency issues
  const buildQueryString = (filterParams: TicketsFilters) => {
    const params = new URLSearchParams();

    if (filterParams.category) {
      params.append("category", filterParams.category);
    }
    if (filterParams.status) {
      params.append("status", filterParams.status);
    }
    if (filterParams.search) {
      params.append("search", filterParams.search);
    }
    if (filterParams.page) {
      params.append("page", filterParams.page.toString());
    }

    return params.toString();
  };

  const fetchTickets = useCallback(
    async (filterParams: TicketsFilters = {}) => {
      try {
        setLoading(true);
        const queryString = buildQueryString(filterParams);
        const url = queryString ? `/ticket?${queryString}` : "/ticket";

        const response = await axiosInstance.get<TicketsResponseType>(url);

        setTickets(response.data.result.tickets);
        setCurrentPage(response.data.result.currentPage);
        setTotalPages(response.data.result.totalPages);
        setTotalTickets(response.data.result.totalTickets);
        setFilters(filterParams);
        setError(null);
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
    []
  ); // Remove buildQueryString dependency

  const updateFilters = useCallback(
    (newFilters: TicketsFilters) => {
      const updatedFilters = { ...filtersRef.current, ...newFilters, page: 1 };
      fetchTickets(updatedFilters);
    },
    [fetchTickets]
  );

  const clearTickets = useCallback(() => {
    setTickets([]);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalTickets(0);
    setFilters({});
    setError(null);
  }, []);

  const value: TicketsContextType = {
    tickets,
    loading,
    error,
    currentPage,
    totalPages,
    totalTickets,
    filters,
    fetchTickets,
    clearTickets,
    updateFilters,
    hasData: tickets.length > 0,
  };

  return (
    <TicketsContext.Provider value={value}>{children}</TicketsContext.Provider>
  );
};

// 🔹 Custom Hook (keep this the same)
export const useTickets = () => {
  const context = useContext(TicketsContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketsProvider");
  }
  return context;
};
