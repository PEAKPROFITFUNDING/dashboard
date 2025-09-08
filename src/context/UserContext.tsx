import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

type UserRole = "Admin" | "User";
type AffiliateStatus = "pending" | "rejected" | "accepted" | null;

type UserData = {
  name: string;
  email: string;
  role: UserRole;
  affiliateId?: string | null;
  referredBy?: string | null;
  affiliateStatus?: AffiliateStatus;
};

type UserContextType = {
  userName: string | null;
  userEmail: string | null;
  userRole: UserRole | null;
  affiliateId: string | null;
  referredBy: string | null;
  affiliateStatus: AffiliateStatus;
  isUserLoaded: boolean;
  setUser: (userData: UserData) => void;
  updateRole: (role: UserRole) => void;
  updateAffiliateStatus: (status: AffiliateStatus) => void;
  updateAffiliateId: (affiliateId: string | null) => void;
  clearUser: () => void;
  setUserLoaded: (loaded: boolean) => void;
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
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [affiliateId, setAffiliateId] = useState<string | null>(null);
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const [affiliateStatus, setAffiliateStatus] = useState<AffiliateStatus>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const setUserLoaded = useCallback((loaded: boolean) => {
    setIsUserLoaded(loaded);
  }, []);

  const setUser = useCallback((userData: UserData) => {
    setUserName(userData.name);
    setUserEmail(userData.email);
    setUserRole(userData.role);
    setAffiliateId(userData.affiliateId || null);
    setReferredBy(userData.referredBy || null);
    setAffiliateStatus(userData.affiliateStatus || null);
    setIsUserLoaded(true);
  }, []);

  const updateRole = useCallback((role: UserRole) => {
    setUserRole(role);
  }, []);

  const updateAffiliateStatus = useCallback((status: AffiliateStatus) => {
    setAffiliateStatus(status);
  }, []);

  const updateAffiliateId = useCallback((id: string | null) => {
    setAffiliateId(id);
  }, []);

  const clearUser = useCallback(() => {
    setUserName(null);
    setUserEmail(null);
    setUserRole(null);
    setAffiliateId(null);
    setReferredBy(null);
    setAffiliateStatus(null);
    setIsUserLoaded(false);
  }, []);

  // Helper methods
  const isAffiliate = useCallback(() => {
    return affiliateId !== null;
  }, [affiliateId]);

  const canEarnCommissions = useCallback(() => {
    return affiliateId !== null && affiliateStatus === "accepted";
  }, [affiliateId, affiliateStatus]);

  const hasReferrer = useCallback(() => {
    return referredBy !== null;
  }, [referredBy]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      userName,
      userEmail,
      userRole,
      affiliateId,
      referredBy,
      affiliateStatus,
      isUserLoaded,
      setUser,
      updateRole,
      updateAffiliateStatus,
      updateAffiliateId,
      clearUser,
      setUserLoaded,
      isAffiliate,
      canEarnCommissions,
      hasReferrer,
    }),
    [
      userName,
      userEmail,
      userRole,
      affiliateId,
      referredBy,
      affiliateStatus,
      isUserLoaded,
      setUser,
      updateRole,
      updateAffiliateStatus,
      updateAffiliateId,
      clearUser,
      setUserLoaded,
      isAffiliate,
      canEarnCommissions,
      hasReferrer,
    ]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
