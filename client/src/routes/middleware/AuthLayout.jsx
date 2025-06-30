import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const location = useLocation();
  
  // Add your authentication check here
  // if (!localStorage.getItem("adminInfo")) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default AuthLayout;




// import React from "react";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import { Navigate } from "react-router-dom";

// const AuthLayout = (props) => {
//   // console.log("Local Storage Admin Info:", localStorage.getItem("adminInfo"));

//   return (
//     <React.Fragment>
//       <DashboardLayout>{props.children}</DashboardLayout>
//     </React.Fragment>
//   );
// };

// export default AuthLayout;
