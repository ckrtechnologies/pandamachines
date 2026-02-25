import React from "react";
import { Navigate } from "react-router-dom";

const NonAuthLayout = (props) => {
  if (localStorage.getItem("pm-admin-data")) {
    return <Navigate to={{ pathname: "/dashboard" }} />;
  }

  return (
    <React.Fragment>
      <div className="h-screen overflow-hidden no-scrollbar">
        {props.children}
      </div>
    </React.Fragment>
  );
};

export default NonAuthLayout;
