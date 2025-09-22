import { createContext, useCallback, useContext, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export type KYCStatus = "pending" | "approved" | "rejected";

export type KYCUser = {
  _id: string;
  name: string;
  email: string;
};

export type KYCApplication = {
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

export type KYCResponse = {
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

export interface KYCAdminContextType {
  applications: KYCApplication[] | null;
  loading: boolean;
  error: string | null;
  paginationData: KYCResponse["result"]["pagination"] | null;
  fetchApplications: (
    status?: string,
    search?: string,
    page?: number,
    forceRefresh?: boolean
  ) => Promise<void>;
  clearApplications: () => void;
  hasData: boolean;
}

export const KYCAdminContext = createContext<KYCAdminContextType | undefined>(
  undefined
);

export const KYCAdminProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [applications, setApplications] = useState<KYCApplication[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationData, setPaginationData] = useState<
    KYCResponse["result"]["pagination"] | null
  >(null);

  const fetchApplications = useCallback(
    async (
      status?: string,
      search?: string,
      page: number = 1,
      forceRefresh = false
    ) => {
      if (applications && !forceRefresh) {
        return; // use cached data
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (status && status !== "all") params.append("status", status);
        if (search) params.append("search", search);
        params.append("pageNo", page.toString());

        const response = await axiosInstance.get<KYCResponse>(
          `/admin/kycApplications?${params.toString()}`
        );

        setApplications(response.data.result.data);
        setPaginationData(response.data.result.pagination);
        setError(null);
      } catch (err) {
        console.error("Error fetching KYC applications:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch KYC applications"
        );
      } finally {
        setLoading(false);
      }
    },
    [applications]
  );

  const clearApplications = useCallback(() => {
    setApplications(null);
    setPaginationData(null);
    setError(null);
  }, []);

  const value: KYCAdminContextType = {
    applications,
    loading,
    error,
    paginationData,
    fetchApplications,
    clearApplications,
    hasData: applications !== null,
  };

  return (
    <KYCAdminContext.Provider value={value}>
      {children}
    </KYCAdminContext.Provider>
  );
};

export const useKYCAdmin = () => {
  const context = useContext(KYCAdminContext);
  if (!context) {
    throw new Error("useKYCAdmin must be used within a KYCAdminProvider");
  }
  return context;
};
