import React from "react";
import DashboardCards from "../../../components/AdminSideComponents/Dashboards/DashboardCards";
import NewUsersChart from "../../../components/AdminSideComponents/Dashboards/NewUsersChart";

const AdminDashboard = () => {

  return (
    <div className="dashboardContainer p-6">
      <DashboardCards />
      <NewUsersChart />
    </div>
  );
};

export default AdminDashboard;
