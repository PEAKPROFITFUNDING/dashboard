import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate(); // Hook for programmatic navigation

  // useCallback memoizes the logout function to prevent unnecessary re-renders
  const logout = useCallback(() => {
    setIsLoggingOut(true); // Indicate that logout is in progress

    // Simulate an asynchronous logout process, e.g., an API call to invalidate a session.
    // In a real application, you would replace this setTimeout with your actual API call.
    setTimeout(() => {
      // 1. Remove authToken from localStorage
      localStorage.removeItem("authToken");
      console.log("authToken removed from localStorage.");

      setIsLoggingOut(false); // Reset logging out state

      navigate("/login", { replace: true });
      console.log("Logout successful and redirected to /login.");
    }, 500); // Simulated network delay
  }, [navigate]); // navigate is a dependency of useCallback

  return { logout, isLoggingOut };
};

export default useLogout;
