import React from 'react';
import SupplierRegister from '../nonAuth/Supplier/SupplierRegister';
import { useNavigate } from 'react-router-dom';

const SellerRegister = () => {
    const navigate = useNavigate();
    return (
        <section>
            <SupplierRegister onClose={() => navigate("/become-seller")} isPage={true} />
        </section>
    );
};

export default SellerRegister;