import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../../utils/basicInfo";
import ProductSectionStrip from "../products/ProductSectionStrip";

const HotDeals = ({ isRefreshing }) => {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchProducts = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/home/hot-deals`, {
                params: { limit: 10 },
            });
            setProducts(res.data?.data || []);
        } catch (err) {
            console.error("HotDeals fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (isRefreshing) fetchProducts();
    }, [isRefreshing]);

    return (
        <ProductSectionStrip
            title="Hot Deals"
            data={products}
            loading={loading}
            gradientIndex={1}
            onSeeAll={() =>
                navigation.navigate("ProductSearch", {
                    section: "hot_deals",
                })
            }
        />
    );
};

export default React.memo(HotDeals);