import React from 'react';
import UserNavbar from '../../components/common/UserNavbar';
import HeaderSection from '../../components/Home/HeaderSection';
import HomeProducts from '../../components/Home/HomeProducts';

const Home = () => (
    <React.Fragment>
        <UserNavbar />
        <HeaderSection />
        <HomeProducts />
    </React.Fragment>
);

export default Home;
