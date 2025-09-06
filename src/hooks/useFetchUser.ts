import { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { useUser } from "../context/UserContext";

const useFetchUser = () => {
  const { setUser, setUserLoaded, isUserLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasInitialized = useRef(false);
  const isFetching = useRef(false);

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("authToken");

      // If no token, mark as loaded immediately
      if (!token) {
        setLoading(false);
        setError("");
        setUserLoaded(true);
        hasInitialized.current = true;
        return;
      }

      // If we have a token but user is already loaded, just stop loading
      if (token && isUserLoaded) {
        setLoading(false);
        hasInitialized.current = true;
        return;
      }

      // Fetch user data
      if (token && !isUserLoaded) {
        isFetching.current = true;
        try {
          setLoading(true);
          setError("");

          const response = await axiosInstance.get("/user/get-user");
          const userData = response.data;

          // Set user data with affiliate details
          setUser({
            name: userData.name || userData.email,
            email: userData.email,
            role: userData.role,
            affiliateId: userData.affiliateId,
            referredBy: userData.referredBy,
            affiliateStatus: userData.affiliateStatus,
          });
        } catch (err: unknown) {
          const error = err as {
            response?: { data?: { error?: string }; status?: number };
          };
          const msg = error.response?.data?.error || "Failed to fetch user";
          setError(msg);

          // If unauthorized, clear any invalid token
          if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
          }

          // Mark as loaded even on error to prevent infinite loops
          setUserLoaded(true);
        } finally {
          setLoading(false);
          isFetching.current = false;
          hasInitialized.current = true;
        }
      }
    };

    // Reset initialization flag when user data is cleared (logout scenario)
    if (!isUserLoaded && hasInitialized.current) {
      hasInitialized.current = false;
      isFetching.current = false;
    }

    // Prevent multiple initializations and concurrent fetches
    if (hasInitialized.current || isFetching.current) {
      return;
    }

    initializeUser();
  }, [setUser, setUserLoaded, isUserLoaded]);

  return { loading, error };
};

export default useFetchUser;
