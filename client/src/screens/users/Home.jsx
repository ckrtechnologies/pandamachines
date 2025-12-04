import React from "react";
import UserNavbar from "../../components/common/UserNavbar";
import HeaderSection from "../../components/Home/HeaderSection";
// import HomeProducts from '../../components/Home/HomeProducts';
import BestSellingProducts from "../../components/Home/BestSellingProducts";
import FeaturesRow from "../../components/Home/FeaturesRow";
import CategorySlider from "../../components/Home/CategorySlider";
import AllUserFooter from "../../components/common/AllUserFooter";
import OfferBanners from "../../components/Home/OfferBanners";
import TopCategoriesSection from "../../components/Home/TopCategoriesSection";

const Home = () => (
  <React.Fragment>
    <UserNavbar />
    <TopCategoriesSection />
    <HeaderSection />
    {/* <HomeProducts /> */}
    <BestSellingProducts />

    <CategorySlider />
    {/* <OfferBanners /> */}
    <FeaturesRow />
    <AllUserFooter />
  </React.Fragment>
);

export default Home;


