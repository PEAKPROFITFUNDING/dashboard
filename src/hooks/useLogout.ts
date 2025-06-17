import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate(); // Hook for programmatic navigation
  const { clearUser } = useUser();

  // useCallback memoizes the logout function to prevent unnecessary re-renders
  const logout = useCallback(() => {
    setIsLoggingOut(true); // Indicate that logout is in progress

    // Simulate an asynchronous logout process, e.g., an API call to invalidate a session.
    // In a real application, you would replace this setTimeout with your actual API call.
    setTimeout(() => {
      // 1. Remove authToken from localStorage
      localStorage.removeItem("authToken");
      console.log("authToken removed from localStorage.");

      // 2. Clear user context
      clearUser();
      console.log("User context cleared.");

      setIsLoggingOut(false); // Reset logging out state

      navigate("/login", { replace: true });
      console.log("Logout successful and redirected to /login.");
    }, 500); // Simulated network delay
  }, [navigate, clearUser]); // navigate and clearUser are dependencies of useCallback

  return { logout, isLoggingOut };
};

export default useLogout;
