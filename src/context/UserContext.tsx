import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

type UserRole = "Admin" | "User";

type UserContextType = {
  userName: string | null;
  userEmail: string | null;
  userRole: UserRole | null;
  isUserLoaded: boolean;
  setUser: (name: string, email: string, role: UserRole) => void;
  updateRole: (role: UserRole) => void;
  clearUser: () => void;
  setUserLoaded: (loaded: boolean) => void;
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
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const setUserLoaded = useCallback((loaded: boolean) => {
    setIsUserLoaded(loaded);
  }, []);

  const setUser = useCallback((name: string, email: string, role: UserRole) => {
    setUserName(name);
    setUserEmail(email);
    setUserRole(role);
    setIsUserLoaded(true);
  }, []);

  const updateRole = useCallback((role: UserRole) => {
    setUserRole(role);
  }, []);

  const clearUser = useCallback(() => {
    setUserName(null);
    setUserEmail(null);
    setUserRole(null);
    setIsUserLoaded(false);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      userName,
      userEmail,
      userRole,
      isUserLoaded,
      setUser,
      updateRole,
      clearUser,
      setUserLoaded,
    }),
    [
      userName,
      userEmail,
      userRole,
      isUserLoaded,
      setUser,
      updateRole,
      clearUser,
      setUserLoaded,
    ]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
