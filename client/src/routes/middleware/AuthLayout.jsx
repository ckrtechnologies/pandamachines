// import React from "react";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import { Navigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import AdminInquiry from "../../components/AdminSideComponents/Admin-Inquiry/AdminInquiry";

// const AuthLayout = ({ children }) => {
//   const location = useLocation();

//   // Add your authentication check here
//   if (!localStorage.getItem("pm-admin-data")) {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   return (
//     <DashboardLayout>
//       {children}
//       <div className="fixed bottom-6 right-6 z-50">
//         <AdminInquiry />
//       </div>
//     </DashboardLayout>
//   );
// };

// export default AuthLayout;

import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AdminInquiry from "../../components/AdminSideComponents/Admin-Inquiry/AdminInquiry";

const AuthLayout = ({ children }) => {
  const location = useLocation();

  const adminData = localStorage.getItem("pm-admin-data");
  const supplierData = localStorage.getItem("pm-supplier-data");

  if (!adminData && !supplierData) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <DashboardLayout>
      {children}
      <div className="fixed bottom-6 right-6 z-50">
        <AdminInquiry />
      </div>
    </DashboardLayout>
  );
};
export default AuthLayout;
