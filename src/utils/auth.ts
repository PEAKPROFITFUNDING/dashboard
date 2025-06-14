export const isAuthenticated = () => {
  const authToken = localStorage.getItem("authToken");

  // A user is considered authenticated if both an auth token and user data exist.
  return !!authToken;
};
