// src/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, authUser }) => {
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const AdminRoute = ({ children, authUser }) => {
  if (!authUser) {
    return <Navigate to="/adminlogin" replace />;
  }
  if (authUser.role !== "admin") {
    return <Navigate to="/adminpanel" replace />;
  }
  return children;
};
