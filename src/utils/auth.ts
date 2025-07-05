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
export const handleLoginResponse = (response: {
  data: {
    result: { token: string; name?: string; email: string; role: string };
  };
}) => {
  const { result } = response.data;

  if (result.token) {
    setAuthToken(result.token);
    return {
      token: result.token,
      name: result.name || result.email,
      email: result.email,
      role: result.role,
    };
  }

  throw new Error("No token received from login response");
};
