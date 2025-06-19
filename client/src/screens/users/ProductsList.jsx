import React from 'react'
import UserNavbar from "../../components/common/UserNavbar";
import AllUserFooter from "../../components/common/AllUserFooter";
import FilterSection from "../../components/Products/FilterSection";
import ProductCards from "../../components/Products/ProductCards";
const ProductsList = () => {
  return (
    <React.Fragment>
      <UserNavbar />
      <div className="flex flex-col md:flex-row bg-[#F2F7FF]">
        <FilterSection />
        <ProductCards />
      </div>
      <AllUserFooter />
    </React.Fragment>
  )
}

export default ProductsList