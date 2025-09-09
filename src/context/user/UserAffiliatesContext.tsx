import { createContext, useCallback, useContext, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { AffiliateType } from "../../types/Affiliates";

export interface AffiliateProfileContextType {
  affiliate: AffiliateType | null;
  loading: boolean;
  error: string | null;
  fetchAffiliateProfile: () => Promise<void>;
  clearAffiliate: () => void;
  hasData: boolean;
}

export const AffiliateProfileContext = createContext<
  AffiliateProfileContextType | undefined
>(undefined);

export const AffiliateProfileProvider = ({ children }) => {
  const [affiliate, setAffiliate] = useState<AffiliateType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAffiliateProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<{ result: AffiliateType }>(
        "/affiliate/profile"
      );

      setAffiliate(response.data.result);
      setError(null);
    } catch (err) {
      console.error("Error fetching affiliate profile:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch affiliate profile"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAffiliate = useCallback(() => {
    setAffiliate(null);
    setError(null);
  }, []);

  const value: AffiliateProfileContextType = {
    affiliate,
    loading,
    error,
    fetchAffiliateProfile,
    clearAffiliate,
    hasData: affiliate !== null,
  };

  return (
    <AffiliateProfileContext.Provider value={value}>
      {children}
    </AffiliateProfileContext.Provider>
  );
};

// 🔹 Custom Hook
export const useAffiliateProfile = () => {
  const context = useContext(AffiliateProfileContext);
  if (!context) {
    throw new Error(
      "useAffiliateProfile must be used within an AffiliateProfileProvider"
    );
  }
  return context;
};
