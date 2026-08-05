import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { COLORS } from "../../theme/colors";
import { API_BASE_URL } from "../../utils/basicInfo";
import ProductCard, { ProductCardSkeleton } from "../products/ProductCard";
import { useCart } from "../../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import { useWishlist } from "../../context/WishlistContext";

// Layout constants
const SCREEN_WIDTH = Dimensions.get("window").width;
const H_PADDING = 12;
const COLUMN_GAP = 10;
const NUM_COLUMNS = 2;

const CARD_WIDTH =
  (SCREEN_WIDTH - H_PADDING * 2 - COLUMN_GAP) / NUM_COLUMNS;

const SKELETON_COUNT = 12;

// Component
const BestSellingProducts = ({ refreshKey }) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // optimistic add-to-cart loading state
  const [addingToCart, setAddingToCart] = useState({});

  const { addToCart } = useCart();

  const navigation = useNavigation();

  const {
    isWishlisted,
    toggleWishlist,
    updatingWishlist,
  } = useWishlist();

  const onBuyNow = (product) => {
    navigation.navigate("BuyNow", {
      productId: product._id,
    });
  };

  const handleExploreMoreClick = () => {
    navigation.navigate("ProductSearch");
  };

  const onProductPress = (product) => {
    navigation.navigate("ProductDetails", {
      productId: product._id,
      productTitle: product.name,
    });
  };

  const fetchProducts = useCallback(async () => {

    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE_URL}/products/featured`,
        {
          params: {
            page: 1,
            limit: 12,
          },
        }
      );

      setProducts(res.data?.data || []);

    } catch (err) {
      console.error(
        "BestSellingProducts fetch error:",
        err
      );
    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Re-fetch when parent triggers a refresh
  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  const handleAddToCart = async (product) => {

    // prevent spam clicks
    if (addingToCart[product._id]) return;

    // optimistic loading state
    setAddingToCart(prev => ({
      ...prev,
      [product._id]: true,
    }));

    try {

      const result = await addToCart(
        product._id,
        1,
      );

      if (result.success) {

        Alert.alert(
          "Added to Cart",
          `${product.name} added successfully`,
          [
            {
              text: "Continue Shopping",
              style: "cancel",
            },
            {
              text: "Go To Cart",
              onPress: () => {
                navigation.navigate("Cart");
              },
            },
          ]
        );

      } else {

        Alert.alert(
          "Failed",
          result.message || "Failed to add item to cart",
        );

      }

    } catch (err) {

      console.log(
        "Add to cart error:",
        err
      );

      Alert.alert(
        "Error",
        "Something went wrong while adding to cart",
      );

    } finally {

      setAddingToCart(prev => ({
        ...prev,
        [product._id]: false,
      }));

    }
  };

  // Render item
  const renderProduct = useCallback(({ item }) => {

    if (item.__skeleton) {
      return (
        <ProductCardSkeleton
          gridMode
          cardWidth={CARD_WIDTH}
        />
      );
    }

    return (
      <ProductCard
        product={item}
        gridMode
        cardWidth={CARD_WIDTH}
        onPress={onProductPress}
        onBuyNow={onBuyNow}
        onQuotation={onProductPress}
        isWishlisted={isWishlisted(item._id)}
        isUpdating={updatingWishlist.has(item._id)}
        toggleWishlist={toggleWishlist}

        // add-to-cart loading state
        isAddingToCart={addingToCart[item._id]}

        // real context handler
        onAddToCart={handleAddToCart}
      />
    );

  }, [
    isWishlisted,
    updatingWishlist,
    toggleWishlist,
    onProductPress,
    onBuyNow,
    addingToCart,
  ]);

  const keyExtractor = useCallback(
    (item, index) =>
      item._id ?? `skeleton-${index}`,
    []
  );

  // Show skeletons while loading
  const data = loading
    ? Array.from(
      { length: SKELETON_COUNT },
      (_, i) => ({
        __skeleton: true,
        _id: `sk-${i}`,
      })
    )
    : products;

  return (
    <LinearGradient
      colors={[
        "#c3f4e0",
        "#E6F4FF",
        COLORS.accent + "20",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >

      {/* Header */}
      <View style={styles.header}>

        <Text style={styles.title}>
          Our Best Products
        </Text>

        <TouchableOpacity
          onPress={handleExploreMoreClick}
        >
          <Text style={styles.exploreBtn}>
            Explore More →
          </Text>
        </TouchableOpacity>

      </View>

      {/* 2-column Grid */}
      <FlatList
        data={data}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={false}
      />

    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: H_PADDING,
    paddingTop: 20,
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.3,
  },

  exploreBtn: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FF6B00",
  },

  // Grid
  listContent: {
    gap: COLUMN_GAP,
  },

  row: {
    gap: COLUMN_GAP,
    marginBottom: COLUMN_GAP,
  },
});

export default React.memo(BestSellingProducts);