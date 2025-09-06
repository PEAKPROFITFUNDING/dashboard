import { useEffect, useState, useRef, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import { useUser } from "../context/UserContext";

const useFetchUser = () => {
  const { setUser, setUserLoaded, isUserLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasInitialized = useRef(false);
  const isFetching = useRef(false);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setLoading(false);
      setError("");
      setUserLoaded(true);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/user/get-user");
      const userData = response.data;

      setUser({
        name: userData.name || userData.email,
        email: userData.email,
        role: userData.role,
        affiliateId: userData.affiliateId,
        referredBy: userData.referredBy,
        affiliateStatus: userData.affiliateStatus,
      });
      setUserLoaded(true);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { error?: string }; status?: number };
      };
      const msg = error.response?.data?.error || "Failed to fetch user";
      setError(msg);

      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
      }

      setUserLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [setUser, setUserLoaded]);

  useEffect(() => {
    if (!hasInitialized.current && !isFetching.current) {
      hasInitialized.current = true;
      isFetching.current = true;
      fetchUser().finally(() => {
        isFetching.current = false;
      });
    }
  }, [fetchUser]);

  // Expose refetchUser to manually refresh
  return { loading, error, refetchUser: fetchUser };
};

export default useFetchUser;
