import React from "react";
import { Navigate } from "react-router";

const AdminRedirect: React.FC = () => {
  return <Navigate to="/users-list" replace />;
};

export default AdminRedirect;
