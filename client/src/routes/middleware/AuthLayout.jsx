import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const location = useLocation();
  
  // Add your authentication check here
  if (!localStorage.getItem("pm-admin-data")) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default AuthLayout;
