import React from "react";
import DashboardCards from "../../../components/AdminSideComponents/Dashboards/DashboardCards";
import NewUsersChart from "../../../components/AdminSideComponents/Dashboards/NewUsersChart";
import DashboardsmallCards from "../../../components/AdminSideComponents/Dashboards/DashboardsmallCards";

const AdminDashboard = () => {

  return (
    <div className="dashboardContainer p-4 md:p-6">
      <DashboardsmallCards/>
      <DashboardCards />
      <NewUsersChart />
    </div>
  );
};

export default AdminDashboard;
