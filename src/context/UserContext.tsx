import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "Admin" | "User";

type UserContextType = {
  userName: string | null;
  userEmail: string | null;
  userRole: UserRole | null;
  setUser: (name: string, email: string, role: UserRole) => void;
  updateRole: (role: UserRole) => void;
  clearUser: () => void;
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

  const setUser = (name: string, email: string, role: UserRole) => {
    setUserName(name);
    setUserEmail(email);
    if (role) setUserRole(role);
  };

  const updateRole = (role: UserRole) => {
    setUserRole(role);
  };

  const clearUser = () => {
    setUserName(null);
    setUserEmail(null);
    setUserRole(null);
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        userEmail,
        userRole,
        setUser,
        updateRole,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
