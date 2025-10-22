import React from "react";
import NewUsersChart from "../../../components/AdminSideComponents/Dashboards/NewUsersChart";
import SupplierDashboardsmallCards from "../../../components/Supplier/SupplierDashboard/SupplierDashboardsmallCards";
import SupplierDashboardCards from "../../../components/Supplier/SupplierDashboard/SupplierDashboardCards";

const SupplierDashboard = () => {
  return (
    <div className="dashboardContainer p-4 md:p-6">
      <SupplierDashboardsmallCards />
      <SupplierDashboardCards />
      <NewUsersChart />
    </div>
  );
};

export default SupplierDashboard;
