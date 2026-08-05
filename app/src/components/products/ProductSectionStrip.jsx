import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { COLORS } from "../../theme/colors";
import ProductCard, { ProductCardSkeleton } from "../products/ProductCard";


const SKELETON_COUNT = 5;


// Each section gets a different gradient pair
const SECTION_GRADIENTS = [
    // New Arrivals — cool blue-green
    ["#E8F4FD", "#D6F5EC", "#EAF7FF30", "#EAF7FF00"],

    // Hot Deals — warm amber-peach
    ["#FFF4E6", "#FFE8D6", "#FFF8F030", "#FFF8F000"],

    // Top Rated — soft violet-rose
    ["#F3F0FF", "#FFE8F5", "#f9f0ff30", "#f9f0ff00"],

    // Category strips
    ["#E6FFF4", "#F0FFF8", "#EAFFF530", "#EAFFF500"],
    ["#FFF0F0", "#FFF5F5", "#FFF0E830", "#FFF0E800"],
    ["#F0F4FF", "#EEF2FF", "#F5F8FF30", "#F5F8FF00"],
];


// ─── ProductSectionStrip ──────────────────────────────────────────────────────
// Props:
//   title          string        Section heading
//   data           array         Product objects (or null while loading)
//   loading        bool
//   gradientIndex  number        Which gradient to use (0–5)
//   onSeeAll       fn | null     If provided, shows "See All" button
//   onProductPress fn
//   onBuyNow       fn
//   onAddToCart    fn
//   onQuotation    fn
//   isWishlisted   fn(id) → bool
//   toggleWishlist fn(id)
//   updatingWishlist Set
// ─────────────────────────────────────────────────────────────────────────────

const ProductSectionStrip = ({
    title,
    data,
    loading = false,
    gradientIndex = 0,
    onSeeAll,
}) => {
    const gradientColors =
        SECTION_GRADIENTS[gradientIndex % SECTION_GRADIENTS.length];

    const renderItem = ({ item }) => {
        if (item.__skeleton) {
            return <ProductCardSkeleton gridMode={false} />;
        }

        return (
            <ProductCard
                product={item}
                gridMode={false}
            />
        );
    };

    const listData = loading
        ? Array.from({ length: SKELETON_COUNT }, (_, i) => ({
            __skeleton: true,
            _id: `sk-${i}`,
        }))
        : data || [];

    // Don't render section at all if loaded and empty
    if (!loading && listData.length === 0) return null;

    return (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <View
                        style={[styles.titleAccent, { backgroundColor: COLORS.accent }]}
                    />
                    <Text style={styles.title}>{title}</Text>
                </View>

                {onSeeAll && !loading && (
                    <TouchableOpacity onPress={onSeeAll} style={styles.seeAllBtn}>
                        <Text style={[styles.seeAllText, { color: COLORS.accent }]}>
                            See All →
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Product Strip */}
            <FlatList
                data={listData}
                renderItem={renderItem}
                keyExtractor={(item, index) => item._id ?? `sk-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                scrollEventThrottle={16}
                initialNumToRender={4}
                maxToRenderPerBatch={4}
                windowSize={5}
                // View All card at end
                ListFooterComponent={
                    onSeeAll && !loading ? (
                        <TouchableOpacity style={styles.viewAllCard} onPress={onSeeAll}>
                            <Text style={[styles.viewAllCardText, { color: COLORS.accent }]}>
                                View All →
                            </Text>
                        </TouchableOpacity>
                    ) : null
                }
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 18,
        paddingBottom: 6,
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        marginBottom: 14,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    titleAccent: {
        width: 3,
        height: 18,
        borderRadius: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        letterSpacing: -0.3,
    },

    seeAllBtn: {
        paddingVertical: 4,
        paddingHorizontal: 2,
    },
    seeAllText: {
        fontSize: 13,
        fontWeight: "600",
    },

    // List
    listContent: {
        paddingHorizontal: 14,
        gap: 10,
        paddingTop: 6,
        paddingBottom: 20,
    },

    // View All card (last item in strip)
    viewAllCard: {
        width: 80,
        height: 282, // same fixed height as ProductCard
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.7)",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        justifyContent: "center",
        alignItems: "center",
    },
    viewAllCardText: {
        fontSize: 13,
        fontWeight: "700",
        textAlign: "center",
        paddingHorizontal: 8,
        lineHeight: 20,
    },
});

export default React.memo(ProductSectionStrip);