import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // 👇 Redirect to login if user not found
    return <Navigate to="/login" replace />;
  }

  // 👇 If user exists, render the protected page
  return children;
};

export default ProtectedRoute;
