import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Navigate } from "react-router-dom";

const AuthLayout = (props) => {
  // console.log("Local Storage Admin Info:", localStorage.getItem("adminInfo"));

  return (
    <React.Fragment>
      <DashboardLayout>{props.children}</DashboardLayout>
    </React.Fragment>
  );
};

export default AuthLayout;
