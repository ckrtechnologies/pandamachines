import React, { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import AuthNavbar from "../components/common/AuthNavbar";
import FooterDashBoard from "../components/AdminSideComponents/DashBoardFooter/FooterDashBoard";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <React.Fragment>
      <AuthNavbar setIsSidebarOpen={setIsSidebarOpen} />
      <div style={{ display: "flex" }} className="mt-[3.9rem]">
        <div className="lg:w-[15%] h-[100vh]">
          {/* Only show the Sidebar when isSidebarOpen is true */}
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        </div>

        <main className="lg:w-[90%] w-[100%] h-[100vh] overflow-y-scroll">
          {children}
          <FooterDashBoard />
        </main>
      </div>
    </React.Fragment>
  );
};

export default DashboardLayout;
