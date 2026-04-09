import React, { useState } from "react";
import AuthNavbar from "../components/common/AuthNavbar";
import Sidebar from "../components/common/Sidebar";

const DashboardLayout = ({ children, noSidebar = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <React.Fragment>
      <AuthNavbar setIsSidebarOpen={setIsSidebarOpen} />
      <div style={{ display: "flex" }} className="mt-[3.9rem]">
        {!noSidebar && (
          <div className="lg:w-[15%] h-[100vh]">
            {/* Only show the Sidebar when isSidebarOpen is true */}
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </div>
        )}

        <main className={`${noSidebar ? "w-[100%]" : "lg:w-[90%] w-[100%]"} h-[100vh] overflow-x-hidden`}>
          {children}
          {/* <FooterDashBoard /> */}
        </main>
      </div>
    </React.Fragment>
  );
};

export default DashboardLayout;
