import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useFetchUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/user/get-user");
        setUser(response.data);
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to fetch user";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("authToken");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
      setError("No auth token found");
    }
  }, []);

  return { user, loading, error };
};

export default useFetchUser;
