import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useUser } from "../context/UserContext";

const useFetchUser = () => {
  const { userName, userEmail, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/user/get-user");
        const userData = response.data;

        setUser(userData.name || userData.email, userData.email, userData.role);
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to fetch user";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("authToken");
    // Only fetch if we have a token and no user data in context

    if (token && (!userName || !userEmail)) {
      fetchUser();
    } else {
      setLoading(false);
      if (!token) {
        setError("No auth token found");
      }
    }
  }, [userName, userEmail, setUser]);

  return { loading, error };
};

export default useFetchUser;
