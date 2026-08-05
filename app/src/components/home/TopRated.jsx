import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../../utils/basicInfo";
import ProductSectionStrip from "../products/ProductSectionStrip";
import { useNavigation } from "@react-navigation/native";

const TopRated = ({ isRefreshing }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const fetchProducts = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/home/top-rated`, {
                params: { limit: 10 },
            });
            setProducts(res.data?.data || []);
        } catch (err) {
            console.error("TopRated fetch error:", err);
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
            title="Top Rated"
            data={products}
            loading={loading}
            gradientIndex={2}
            onSeeAll={() => {
                navigation.navigate("ProductSearch", {
                    section: "top_rated"
                })
            }}
        />
    );
};

export default React.memo(TopRated);