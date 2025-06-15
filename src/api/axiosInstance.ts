import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 400 || status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
      return;
    }

    if (status === 401 && !originalRequest._retry) {
      alert("Unauthorized access. Please log in again.");
    } else if (status >= 500) {
      alert("Server error. Try again later.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
