import { default as React, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useWishlist } from "../../context/WishlistContext";
import { COLORS } from "../../theme/colors";
import { getCloudinaryImageUrl } from "../../utils/getCloudinaryImageUrl";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const CARD_FIXED_WIDTH = 190;
const CARD_FIXED_HEIGHT = 290;

const StarRating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, i) => {
        if (i + 1 <= Math.floor(rating)) return "full";
        if (i < rating && i + 1 > rating) return "half";
        return "empty";
    });

    return (
        <View style={styles.ratingRow}>
            {stars.map((type, i) => (
                <View key={i} style={styles.starWrapper}>
                    <MaterialIcons
                        name="star-border"
                        size={13}
                        color="#d1d5db"
                        style={StyleSheet.absoluteFill}
                    />
                    {type === "full" && (
                        <MaterialIcons
                            name="star"
                            size={13}
                            color="#f59e0b"
                            style={StyleSheet.absoluteFill}
                        />
                    )}
                    {type === "half" && (
                        <View style={styles.halfStarClip}>
                            <MaterialIcons
                                name="star"
                                size={13}
                                color="#f59e0b"
                            />
                        </View>
                    )}
                </View>
            ))}
            <Text style={styles.ratingText}>
                ({rating.toFixed(1)})
            </Text>
        </View>
    );
};

//  Skeleton 
export const ProductCardSkeleton = ({ gridMode = false, cardWidth }) => {
    const containerStyle = gridMode
        ? { width: cardWidth || "100%", height: CARD_FIXED_HEIGHT }
        : { width: CARD_FIXED_WIDTH, height: CARD_FIXED_HEIGHT };

    return (
        <View style={[styles.card, containerStyle, styles.skeleton]}>
            {/* Image placeholder */}
            <View style={[styles.imagePlaceholder, styles.shimmer]} />

            {/* Name */}
            <View style={{ marginTop: 8 }}>
                <View style={[styles.shimmer, { height: 11, borderRadius: 4, width: "90%" }]} />
                <View style={[styles.shimmer, { height: 11, borderRadius: 4, width: "65%", marginTop: 5 }]} />
            </View>

            {/* Rating */}
            <View style={[styles.shimmer, { height: 13, borderRadius: 4, width: "50%", marginTop: 7 }]} />

            {/* Price */}
            <View style={{ flexDirection: "row", gap: 6, marginTop: 7 }}>
                <View style={[styles.shimmer, { height: 13, borderRadius: 4, width: 48 }]} />
                <View style={[styles.shimmer, { height: 11, borderRadius: 4, width: 36 }]} />
            </View>

            {/* Discount badge */}
            <View style={[styles.shimmer, { height: 18, borderRadius: 4, width: 56, marginTop: 5 }]} />

            {/* Actions */}
            <View style={{ flexDirection: "row", gap: 6, marginTop: 10 }}>
                <View style={[styles.shimmer, { width: 36, height: 36, borderRadius: 8 }]} />
                <View style={[styles.shimmer, { width: 36, height: 36, borderRadius: 8 }]} />
                <View style={[styles.shimmer, { flex: 1, height: 36, borderRadius: 8 }]} />
            </View>
        </View>
    );
};

const ProductCard = ({
    product,
    gridMode = false,
    cardWidth,
}) => {
    const navigation = useNavigation();
    const { isLoggedIn } = useAuth();
    // ── Cart ─────────────────────────────────────────────────────────────────
    const { addToCart, cartItems } = useCart();

    const isInCart = useMemo(
        () => cartItems.some(item => item.productId === product._id),
        [cartItems, product._id]
    );

    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const addedTimer = useRef(null);

    // keep local "added" flash in sync if item removed from cart externally
    useEffect(() => {
        if (!isInCart) setAdded(false);
    }, [isInCart]);

    useEffect(() => () => clearTimeout(addedTimer.current), []);

    const handleAddToCart = async () => {
        if (adding) return;

        if (!isLoggedIn) {
            navigation.navigate("AuthPage");
            return;
        }

        // already in cart → navigate to cart
        if (isInCart || added) {
            navigation.navigate("Cart");
            return;
        }

        setAdding(true);

        const res = await addToCart(product._id, 1);

        if (res?.success) {
            setAdded(true);
            Toast.show({
                type: "success",
                text1: "Added to Cart",
                text2: `${product.name} added successfully`,
                position: "bottom",
                visibilityTime: 2500,
            });
            addedTimer.current = setTimeout(() => setAdded(false), 2500);
        } else {
            Toast.show({
                type: "error",
                text1: "Failed",
                text2: res?.message || "Could not add item to cart",
                position: "bottom",
                visibilityTime: 2500,
            });
        }

        setAdding(false);
    };

    // ── Wishlist ──────────────────────────────────────────────────────────────
    const { isWishlisted, toggleWishlist } = useWishlist();

    const isLiked = isWishlisted(product._id);

    const handleToggleWishlist = useCallback(() => {
        if (!isLoggedIn) {
            navigation.navigate("AuthPage");
            return;
        }

        const wasLiked = isLiked;

        // fire-and-forget — context is already optimistic + rolls back on failure
        toggleWishlist(product._id);

        Toast.show({
            type: "success",
            text1: wasLiked ? "Removed from Wishlist" : "Added to Wishlist",
            text2: wasLiked ? `${product.name} removed` : `${product.name} saved`,
            position: "bottom",
            visibilityTime: 2000,
        });
    }, [isLoggedIn, isLiked, product._id, product.name, toggleWishlist, navigation]);

    // ── Image / discount ──────────────────────────────────────────────────────
    const image = product?.images?.[0];

    const optimizedImage = useMemo(() => {
        return getCloudinaryImageUrl(image, { width: 300 });
    }, [image]);

    const discount =
        product.previous_price > product.price
            ? Math.round(
                ((product.previous_price - product.price) / product.previous_price) * 100
            )
            : product.discount || 0;

    // ── Navigation defaults ───────────────────────────────────────────────────
    const handlePress = () =>
        navigation.navigate("ProductDetails", {
            productId: product._id,
            productTitle: product.name,
        });

    const handleBuyNow = () =>
        navigation.navigate("BuyNow", { productId: product._id });

    const handleQuotation = () =>
        navigation.navigate("ProductDetails", {
            productId: product._id,
            productTitle: product.name,
        });

    // ── Cart button derived state ─────────────────────────────────────────────
    const showSuccess = isInCart || added;

    const containerStyle = gridMode
        ? {
            width: cardWidth || "100%",
            height: CARD_FIXED_HEIGHT,
        }
        : {
            width: CARD_FIXED_WIDTH,
            height: CARD_FIXED_HEIGHT,
        };

    return (
        <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.card, containerStyle]}
            onPress={handlePress}
        >
            <View style={styles.imageContainer}>
                <TouchableOpacity
                    style={styles.wishlistBtn}
                    onPress={handleToggleWishlist}
                    hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
                >
                    <MaterialIcons
                        key={isLiked ? "filled" : "empty"}
                        name={isLiked ? "favorite" : "favorite-border"}
                        size={18}
                        color={isLiked ? "#ef4444" : "#9ca3af"}
                    />

                </TouchableOpacity>

                {image ? (
                    <Image
                        source={{ uri: optimizedImage }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.noImage}>
                        <MaterialIcons
                            name="image"
                            size={28}
                            color="#d1d5db"
                        />
                    </View>
                )}
            </View>

            <Text numberOfLines={1} style={styles.name}>
                {product.name}
            </Text>

            <View style={styles.ratingContainer}>
                {product.ratings != null ? (
                    <StarRating rating={product.ratings} />
                ) : null}
            </View>

            <View style={styles.priceRow}>
                <Text style={styles.price}>
                    ₹{product.price}
                </Text>
                {product.previous_price > 0 ? (
                    <Text style={styles.oldPrice}>
                        ₹{product.previous_price}
                    </Text>
                ) : null}
            </View>

            <View style={styles.discountContainer}>
                {discount > 0 ? (
                    <Text style={styles.discount}>
                        {discount}% OFF
                    </Text>
                ) : (
                    <View style={styles.discountPlaceholder} />
                )}
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[
                        styles.iconBtn,
                        styles.cartBtn,
                        showSuccess && styles.cartBtnAdded,
                    ]}
                    onPress={handleAddToCart}
                >

                    {adding ? (
                        <ActivityIndicator
                            size="small"
                            color={COLORS.primary}
                        />
                    ) : showSuccess ? (
                        <MaterialIcons
                            name="shopping-cart"
                            size={16}
                            color="#fff"
                        />
                    ) : (
                        <MaterialIcons
                            name="shopping-cart"
                            size={16}
                            color={COLORS.primary}
                        />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.iconBtn, styles.quotationBtn]}
                    onPress={handleQuotation}
                >
                    <MaterialIcons
                        name="description"
                        size={16}
                        color={COLORS.primary}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buyBtn}
                    onPress={handleBuyNow}
                >
                    <Text style={styles.buyText}>
                        Buy Now
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

//  Styles 
const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: "#f0f0f0",
        // shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },

    //  Image
    imageContainer: {
        width: "100%",
        height: 126,
        backgroundColor: "#f9fafb",
        borderRadius: 10,
        overflow: "hidden",
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    noImage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    wishlistBtn: {
        position: "absolute",
        top: 4,
        right: 4,
        zIndex: 10,
        backgroundColor: "rgba(255,255,255,0.7)",
        borderRadius: 20,
        padding: 4,
    },
    wishlistLoader: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.25)",
        borderRadius: 20,
    },

    //  Name
    name: {
        fontSize: 12,
        fontWeight: "500",
        marginTop: 8,
        color: "#1f2937",
        lineHeight: 17,
        height: 17,
    },

    //  Rating
    ratingContainer: {
        height: 20,
        justifyContent: "center",
        marginTop: 4,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
    },
    starWrapper: {
        width: 13,
        height: 13,
        position: "relative",
    },
    halfStarClip: {
        width: "50%",
        overflow: "hidden",
        position: "absolute",
    },
    ratingText: {
        fontSize: 10,
        color: "#6b7280",
        marginLeft: 3,
    },

    //  Price
    priceRow: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 6,
        marginTop: 4,
        flexWrap: "wrap",
        height: 20,
    },
    price: {
        fontSize: 13,
        fontWeight: "700",
        color: "#111827",
    },
    oldPrice: {
        fontSize: 10,
        color: "#9ca3af",
        textDecorationLine: "line-through",
    },

    //  Discount
    discountContainer: {
        height: 22,
        justifyContent: "center",
        marginTop: 3,
    },
    discount: {
        fontSize: 10,
        fontWeight: "600",
        color: "#16a34a",
        backgroundColor: "#f0fdf4",
        alignSelf: "flex-start",
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountPlaceholder: {
        height: 18,
    },

    //  Actions
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 8,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    },
    cartBtn: {
        borderColor: COLORS.primary,
    },
    cartBtnAdded: {
        backgroundColor: "#16a34a",
        borderColor: "#16a34a",
    },
    quotationBtn: {
        borderColor: COLORS.primary,
    },
    buyBtn: {
        flex: 1,
        height: 36,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
    },
    buyText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    //  Skeleton
    skeleton: {
        overflow: "hidden",
    },
    imagePlaceholder: {
        width: "100%",
        height: 120,
        borderRadius: 10,
    },
    shimmer: {
        backgroundColor: "#e5e7eb",
    },
});

export default ProductCard;