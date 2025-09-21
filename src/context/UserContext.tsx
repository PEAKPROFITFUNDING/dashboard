import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import axiosInstance from "../api/axiosInstance";

type UserRole = "Admin" | "User";
type AffiliateStatus = "pending" | "rejected" | "accepted" | null;

type KycData = {
  id: string;
  status: string;
  rejectionReason?: string; // Only present when status is "rejected"
};

type UserData = {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  affiliateId?: string | null;
  referredBy?: string | null;
  affiliateStatus?: AffiliateStatus;
  kyc?: KycData | null;
};

type UserState = UserData | null;

type UserContextType = {
  // User data getters
  user: UserState;
  userName: string | null;
  userEmail: string | null;
  userRole: UserRole | null;
  affiliateId: string | null;
  referredBy: string | null;
  affiliateStatus: AffiliateStatus;
  kyc: KycData | null;

  // Loading and error states
  isUserLoaded: boolean;
  loading: boolean;
  error: string;

  // User actions
  setUser: (userData: UserData) => void;
  updateUser: (updates: Partial<UserData>) => void;
  updateRole: (role: UserRole) => void;
  updateAffiliateStatus: (status: AffiliateStatus) => void;
  updateAffiliateId: (affiliateId: string | null) => void;
  clearUser: () => void;

  // Fetch actions
  fetchUser: () => Promise<void>;
  refetchUser: () => Promise<void>;

  // Helper methods for affiliate functionality
  isAffiliate: () => boolean;
  canEarnCommissions: () => boolean;
  hasReferrer: () => boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Consolidated user state
  const [user, setUserState] = useState<UserState>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Refs for initialization control
  const hasInitialized = useRef(false);
  const isFetching = useRef(false);

  // Fetch user data
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setLoading(false);
      setError("");
      setIsUserLoaded(true);
      return;
    }

    try {
      setLoading(true);
      setError("");
      isFetching.current = true;

      const response = await axiosInstance.get("/user/get-user");
      const userData = response.data;

      setUserState({
        id: userData.id,
        name: userData.name || userData.email,
        email: userData.email,
        role: userData.role,
        profilePicture: userData.profilePicture,
        affiliateId: userData.affiliateId,
        referredBy: userData.referredBy,
        affiliateStatus: userData.affiliateStatus,
        kyc: userData.kyc,
      });
      setIsUserLoaded(true);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { error?: string }; status?: number };
      };
      const msg = error.response?.data?.error || "Failed to fetch user";
      setError(msg);

      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        setUserState(null);
      }

      setIsUserLoaded(true);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, []);

  // Initialize user fetch on mount
  useEffect(() => {
    if (!hasInitialized.current && !isFetching.current) {
      hasInitialized.current = true;
      fetchUser();
    }
  }, [fetchUser]);

  // User management functions
  const setUser = useCallback((userData: UserData) => {
    setUserState(userData);
    setIsUserLoaded(true);
  }, []);

  const updateUser = useCallback((updates: Partial<UserData>) => {
    setUserState((prevUser) => (prevUser ? { ...prevUser, ...updates } : null));
  }, []);

  const updateRole = useCallback(
    (role: UserRole) => {
      updateUser({ role });
    },
    [updateUser]
  );

  const updateAffiliateStatus = useCallback(
    (status: AffiliateStatus) => {
      updateUser({ affiliateStatus: status });
    },
    [updateUser]
  );

  const updateAffiliateId = useCallback(
    (affiliateId: string | null) => {
      updateUser({ affiliateId });
    },
    [updateUser]
  );

  const clearUser = useCallback(() => {
    setUserState(null);
    setIsUserLoaded(false);
    setError("");
    localStorage.removeItem("authToken");
  }, []);

  const refetchUser = useCallback(() => {
    return fetchUser();
  }, [fetchUser]);

  // Helper methods
  const isAffiliate = useCallback(() => {
    return user?.affiliateId !== null && user?.affiliateId !== undefined;
  }, [user?.affiliateId]);

  const canEarnCommissions = useCallback(() => {
    return (
      user?.affiliateId !== null &&
      user?.affiliateId !== undefined &&
      user?.affiliateStatus === "accepted"
    );
  }, [user?.affiliateId, user?.affiliateStatus]);

  const hasReferrer = useCallback(() => {
    return user?.referredBy !== null && user?.referredBy !== undefined;
  }, [user?.referredBy]);

  // Computed values for backward compatibility
  const userName = user?.name || null;
  const userEmail = user?.email || null;
  const userRole = user?.role || null;
  const affiliateId = user?.affiliateId || null;
  const referredBy = user?.referredBy || null;
  const affiliateStatus = user?.affiliateStatus || null;
  const kyc = user?.kyc || null;

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      // User data
      user,
      userName,
      userEmail,
      userRole,
      affiliateId,
      referredBy,
      affiliateStatus,
      kyc,

      // Loading and error states
      isUserLoaded,
      loading,
      error,

      // User actions
      setUser,
      updateUser,
      updateRole,
      updateAffiliateStatus,
      updateAffiliateId,
      clearUser,

      // Fetch actions
      fetchUser,
      refetchUser,

      // Helper methods
      isAffiliate,
      canEarnCommissions,
      hasReferrer,
    }),
    [
      user,
      userName,
      userEmail,
      userRole,
      affiliateId,
      referredBy,
      affiliateStatus,
      kyc,
      isUserLoaded,
      loading,
      error,
      setUser,
      updateUser,
      updateRole,
      updateAffiliateStatus,
      updateAffiliateId,
      clearUser,
      fetchUser,
      refetchUser,
      isAffiliate,
      canEarnCommissions,
      hasReferrer,
    ]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
