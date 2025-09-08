type LoginResponse = {
  result: {
    _id: string;
    email: string;
    profilePicture: string;
    role: "Admin" | "User";
    token: string;
    name: string;
    affiliateId: string | null;
    referredBy: string | null;
    affiliateStatus: "pending" | "rejected" | "accepted" | null;
  };
  message: string;
};

type UserData = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  profilePicture: string;
  affiliateId: string | null;
  referredBy: string | null;
  affiliateStatus: "pending" | "rejected" | "accepted" | null;
};
import { AxiosResponse } from "axios";

export const isAuthenticated = () => {
  const authToken = localStorage.getItem("authToken");

  // A user is considered authenticated if both an auth token and user data exist.
  return !!authToken;
};

export const isFullyAuthenticated = (
  userRole: string | null,
  isUserLoaded: boolean
) => {
  return isAuthenticated() && isUserLoaded && !!userRole;
};

export const clearAuth = () => {
  localStorage.removeItem("authToken");
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

// Utility to check if we need to fetch user data
export const shouldFetchUserData = (
  userRole: string | null,
  isUserLoaded: boolean
) => {
  const hasToken = isAuthenticated();
  return hasToken && !isUserLoaded;
};

// Utility to handle login response
export const handleLoginResponse = (
  response: AxiosResponse<LoginResponse>
): UserData => {
  const { result } = response.data;

  // Store the token
  localStorage.setItem("authToken", result.token);

  // Return normalized user data
  return {
    id: result._id,
    name: result.name,
    email: result.email,
    role: result.role,
    profilePicture: result.profilePicture,
    affiliateId: result.affiliateId,
    referredBy: result.referredBy,
    affiliateStatus: result.affiliateStatus,
  };
};
