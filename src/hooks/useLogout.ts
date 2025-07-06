import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useContactMessagesContext } from "../context/ContactMessagesContext";

const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { clearUser } = useUser();
  const { resetContactMessage } = useContactMessagesContext();

  const logout = useCallback(() => {
    setIsLoggingOut(true);

    // Simulate an asynchronous logout process
    setTimeout(() => {
      try {
        // 1. Remove authToken from localStorage
        localStorage.removeItem("authToken");

        // 2. Clear user context
        clearUser();

        // 3. Reset contact messages context to prevent stale data
        resetContactMessage();

        setIsLoggingOut(false);

        // 4. Navigate to login page
        navigate("/login", { replace: true });
      } catch {
        setIsLoggingOut(false);
      }
    }, 500);
  }, [navigate, clearUser, resetContactMessage]);

  return { logout, isLoggingOut };
};

export default useLogout;
