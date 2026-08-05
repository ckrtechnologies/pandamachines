/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../../utils/basicInfo";
import ProductSectionStrip from "../products/ProductSectionStrip";


const NewArrivals = ({ isRefreshing }) => {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/home/new-arrivals`, {
                params: { limit: 10 },
            });
            setProducts(res.data?.data || []);
        } catch (err) {
            console.error("NewArrivals fetch error:", err);
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
            title="New Arrivals"
            data={products}
            loading={loading}
            gradientIndex={0}
            onSeeAll={() =>
                navigation.navigate("ProductSearch", {
                    section: "new_arrivals",
                })
            }
        />
    );
};

export default React.memo(NewArrivals);