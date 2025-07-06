import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { ContactData, PaginationData } from "../hooks/useContactMessages";
import useContactMessages from "../hooks/useContactMessages";
import { useUser } from "./UserContext";

// Define SortField and SortOrder types locally
export type SortField = "name" | "email" | "subject" | "status" | "createdAt";
export type SortOrder = "asc" | "desc";

interface ContactMessagesContextType {
  contactMessages: ContactData[];
  loading: boolean;
  pagination: PaginationData;
  sortField: SortField;
  sortOrder: SortOrder;
  searchQuery: string;
  appliedSearchQuery: string;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  setSearchQuery: (query: string) => void;
  setAppliedSearchQuery: (query: string) => void;
  setPagination: (pagination: PaginationData) => void;
  handleSort: (field: SortField) => void;
  handleSearch: () => void;
  handleClearSearch: () => void;
  handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  sortContactMessages: (contactMessages: ContactData[]) => ContactData[];
  fetchContactMessages: (page?: number, search?: string) => Promise<void>;
  setContactMessageStatus: (id: string, status: string) => void;
  resetContactMessage: () => void;
}

const ContactMessagesContext = createContext<
  ContactMessagesContextType | undefined
>(undefined);

export const ContactMessagesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // State for all logic
  const [contactMessages, setContactMessages] = useState<ContactData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");

  // Use the hook only for fetching
  const { fetchContacts: fetchContactMessagesApi } = useContactMessages();
  const { userRole, isUserLoaded } = useUser();
  // Only fetch if we're in a private route (user is authenticated)

  // Fetch contact messages and update context state
  const fetchContactMessages = useCallback(
    async (page: number = 1, search: string = appliedSearchQuery) => {
      setLoading(true);
      try {
        const { data, pagination: pag } = await fetchContactMessagesApi(
          page,
          search
        );
        setContactMessages(data);
        setPagination(pag);
      } catch (error) {
        console.error("Error fetching contact messages:", error);
      } finally {
        setLoading(false);
      }
    },
    [appliedSearchQuery, fetchContactMessagesApi]
  );

  useEffect(() => {
    fetchContactMessages(pagination.currentPage, appliedSearchQuery);
  }, []);

  // Listen for authentication changes
  useEffect(() => {
    if (isUserLoaded && userRole === "Admin") {
      fetchContactMessages(pagination.currentPage, appliedSearchQuery);
    }
  }, [isUserLoaded, userRole]);

  // Handle pagination and search changes
  useEffect(() => {
    if (pagination.currentPage > 1) {
      fetchContactMessages(pagination.currentPage, appliedSearchQuery);
    }
  }, [pagination.currentPage, appliedSearchQuery]);

  // Sorting logic
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortContactMessages = (contactMessages: ContactData[]) => {
    return [...contactMessages].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "email":
          comparison = a.email.localeCompare(b.email);
          break;
        case "subject":
          comparison = a.subject.localeCompare(b.subject);
          break;
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  // Search logic
  const handleSearch = () => {
    setAppliedSearchQuery(searchQuery);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchContactMessages(1, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setAppliedSearchQuery("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchContactMessages(1, "");
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      setAppliedSearchQuery("");
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
      fetchContactMessages(1, "");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Add a function to update a contact message's status in the context
  const setContactMessageStatus = (id: string, status: string) => {
    setContactMessages((prev) =>
      prev.map((msg) =>
        msg._id === id
          ? { ...msg, status: status as ContactData["status"] }
          : msg
      )
    );
  };

  const resetContactMessage = () => {
    setContactMessages([]);
    setPagination({
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });
    setSortField("createdAt");
    setSortOrder("desc");
    setSearchQuery("");
    setAppliedSearchQuery("");
  };

  return (
    <ContactMessagesContext.Provider
      value={{
        contactMessages,
        loading,
        pagination,
        sortField,
        sortOrder,
        searchQuery,
        appliedSearchQuery,
        setSortField,
        setSortOrder,
        setSearchQuery,
        setAppliedSearchQuery,
        setPagination,
        handleSort,
        handleSearch,
        handleClearSearch,
        handleSearchInputChange,
        handleKeyPress,
        sortContactMessages,
        fetchContactMessages,
        setContactMessageStatus,
        resetContactMessage,
      }}
    >
      {children}
    </ContactMessagesContext.Provider>
  );
};

export const useContactMessagesContext = () => {
  const context = useContext(ContactMessagesContext);
  if (!context) {
    // Return a safe default instead of throwing an error
    // This prevents crashes during initialization
    return {
      contactMessages: [],
      loading: false,
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      sortField: "createdAt" as SortField,
      sortOrder: "desc" as SortOrder,
      searchQuery: "",
      appliedSearchQuery: "",
      setSortField: () => {},
      setSortOrder: () => {},
      setSearchQuery: () => {},
      setAppliedSearchQuery: () => {},
      setPagination: () => {},
      handleSort: () => {},
      handleSearch: () => {},
      handleClearSearch: () => {},
      handleSearchInputChange: () => {},
      handleKeyPress: () => {},
      sortContactMessages: (messages: ContactData[]) => messages,
      fetchContactMessages: async () => {},
      setContactMessageStatus: () => {},
      resetContactMessage: () => {},
    };
  }
  return context;
};
