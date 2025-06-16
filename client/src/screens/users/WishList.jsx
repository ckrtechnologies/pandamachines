import React from "react";
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";

const WishList = () => {
  return (
    <React.Fragment>
      <UserNavbar />

      <div className="h-screen w-full text-lg font-semibold flex justify-center items-center">
        WishList Under development
      </div>
      <AllUserFooter />
    </React.Fragment>
  );
};

export default WishList;
