import React from "react";
import UserNavbar from "../../components/common/UserNavbar";
import BedsCarousel from "../../components/common/BedsCarousel";
import AllUserFooter from "../../components/common/AllUserFooter";
import SearchContents from "../../components/SearchResults/SearchContents";

const UsersSearchResults = () => {
  return (
    <React.Fragment>
      <UserNavbar />
      <BedsCarousel />
      <SearchContents />
      <AllUserFooter />
    </React.Fragment>
  );
};

export default UsersSearchResults;
