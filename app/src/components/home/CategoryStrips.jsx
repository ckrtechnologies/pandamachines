/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../../utils/basicInfo";
import ProductSectionStrip from "../products/ProductSectionStrip";

// Category strips start at gradientIndex 3 so they don't clash
// with New Arrivals (0), Hot Deals (1), Top Rated (2)
const GRADIENT_OFFSET = 3;

const CategoryStrips = ({ isRefreshing }) => {
    const navigation = useNavigation();
    const [strips, setStrips] = useState([]); // [{ category, products }]
    const [loading, setLoading] = useState(true);

    const fetchStrips = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/home/category-strips`);
            setStrips(res.data?.data || []);
        } catch (err) {
            console.error("CategoryStrips fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStrips();
    }, [fetchStrips]);

    useEffect(() => {
        if (isRefreshing) fetchStrips();
    }, [isRefreshing]);

    // While loading render 2 skeleton strips as placeholders
    if (loading) {
        return (
            <>
                <ProductSectionStrip
                    title="Loading..."
                    data={null}
                    loading={true}
                    gradientIndex={GRADIENT_OFFSET}
                />
                <ProductSectionStrip
                    title="Loading..."
                    data={null}
                    loading={true}
                    gradientIndex={GRADIENT_OFFSET + 1}
                />
            </>
        );
    }

    // Nothing configured yet — render nothing, don't break layout
    if (!strips.length) return null;

    return (
        <>
            {strips.map((strip, index) => (
                <ProductSectionStrip
                    key={strip.category._id}
                    title={strip.category.name}
                    data={strip.products}
                    loading={false}
                    gradientIndex={GRADIENT_OFFSET + index}
                    onSeeAll={() =>
                        navigation.navigate('CategoriesStack', {
                            screen: 'CategoriesMain',
                            params: {
                                selectedCategoryId: strip.category._id,
                            },
                        })
                    }
                />
            ))}
        </>
    );
};

export default React.memo(CategoryStrips);