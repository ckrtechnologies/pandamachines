import React from "react";
import UserNavbar from "../../components/common/UserNavbar";
import HeaderSection from "../../components/Home/HeaderSection";
// import HomeProducts from '../../components/Home/HomeProducts';
// import OfferBanners from "../../components/Home/OfferBanners";
import AllUserFooter from "../../components/common/AllUserFooter";
import BestSellingProducts from "../../components/Home/BestSellingProducts";
import CategorySlider from "../../components/Home/CategorySlider";
import FeaturesRow from "../../components/Home/FeaturesRow";
import TopCategoriesSection from "../../components/Home/TopCategoriesSection";
import { useCart } from "../../utils/CartContext";
import MobileBottomBar from "../../components/userNavbar/MobileBottomBar";

const Home = () => {
  const { cartCount } = useCart();

  return (
    <React.Fragment>
      <UserNavbar />

      <section className="md:hidden">
        <HeaderSection />
      </section>

      <TopCategoriesSection />

      <section className="hidden md:block">
        <HeaderSection />
      </section>

      {/* <HomeProducts /> */}
      <BestSellingProducts />

      <CategorySlider />
      {/* <OfferBanners /> */}
      <FeaturesRow />
      <AllUserFooter />
      
      <MobileBottomBar cartCount={cartCount} />

    </React.Fragment>
  )
};

export default Home;
