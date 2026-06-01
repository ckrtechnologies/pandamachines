
import { Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

const AuthLayout = ({ children, noSidebar = false }) => {
  const location = useLocation();

  const adminData = localStorage.getItem("pm-admin-data");
  const supplierData = localStorage.getItem("pm-supplier-data");

  if (!adminData && !supplierData) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <DashboardLayout noSidebar={noSidebar}>
      {children}
      {/* <div className="fixed bottom-6 right-6 z-50">
        <AdminInquiry />
      </div> */}
    </DashboardLayout>
  );
};
export default AuthLayout;
