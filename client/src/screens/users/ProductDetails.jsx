import React from 'react'
import UserNavbar from '../../components/common/UserNavbar'
import AllUserFooter from '../../components/common/AllUserFooter'
import FilterSection from '../../components/Products/FilterSection'
// import ProductCards from '../../components/Products/ProductCards'

const ProductDetails = () => {
  return (
    <div>
        <UserNavbar />
        <FilterSection />
        {/* <ProductCards /> */}
        <AllUserFooter />
    </div>
  )
}

export default ProductDetails