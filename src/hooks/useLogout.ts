import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { clearUser } = useUser();

  const logout = useCallback(() => {
    setIsLoggingOut(true);

    // Simulate an asynchronous logout process
    setTimeout(() => {
      try {
        // 1. Remove authToken from localStorage
        localStorage.removeItem("authToken");

        // 2. Clear user context
        clearUser();

        setIsLoggingOut(false);

        // 3. Navigate to login page
        navigate("/login", { replace: true });
      } catch {
        setIsLoggingOut(false);
      }
    }, 500);
  }, [navigate, clearUser]);

  return { logout, isLoggingOut };
};

export default useLogout;
