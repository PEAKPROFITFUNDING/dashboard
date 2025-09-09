import { createContext, useCallback, useContext, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { AffiliateType } from "../../types/Affiliates";

export interface AffiliatesAdminContextType {
  affiliates: AffiliateType[] | null;
  loading: boolean;
  error: string | null;
  fetchAffiliates: (forceRefresh?: boolean) => Promise<void>;
  clearAffiliates: () => void;
  hasData: boolean;
}

export const AffiliatesAdminContext = createContext<
  AffiliatesAdminContextType | undefined
>(undefined);

export const AffiliatesAdminProvider = ({ children }) => {
  const [affiliates, setAffiliates] = useState<AffiliateType[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAffiliates = useCallback(
    async (forceRefresh = false) => {
      if (affiliates && !forceRefresh) {
        return; // use cached data
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get<{
          result: { data: AffiliateType[] };
        }>("/admin/affiliates?pageNo=1");

        setAffiliates(response.data.result.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching affiliates:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch affiliates"
        );
      } finally {
        setLoading(false);
      }
    },
    [affiliates]
  );

  const clearAffiliates = useCallback(() => {
    setAffiliates(null);
    setError(null);
  }, []);

  const value: AffiliatesAdminContextType = {
    affiliates,
    loading,
    error,
    fetchAffiliates,
    clearAffiliates,
    hasData: affiliates !== null,
  };

  return (
    <AffiliatesAdminContext.Provider value={value}>
      {children}
    </AffiliatesAdminContext.Provider>
  );
};

// 🔹 Custom Hook
export const useAffiliatesAdmin = () => {
  const context = useContext(AffiliatesAdminContext);
  if (!context) {
    throw new Error(
      "useAffiliatesAdmin must be used within an AffiliatesAdminProvider"
    );
  }
  return context;
};
