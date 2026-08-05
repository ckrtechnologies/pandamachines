import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import SideScreenNavbar from "../../components/Navbar/SideScreenNavbar";
import { API_BASE_URL } from "../../utils/basicInfo";
import { useNavigation } from "@react-navigation/native";
import ProductCard, { ProductCardSkeleton } from "../products/ProductCard";

const { width } = Dimensions.get("window");
const HORIZONTAL_PADDING = 16;
const COLUMN_GAP = 10;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - COLUMN_GAP) / 2;

const SKELETON_COUNT = 6;

// ─── Empty state ─────────────────────────────────────────────────────────────
const EmptyWishlist = ({ onShop }) => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconWrap}>
      <MaterialIcons name="favorite-border" size={44} color="#d1d5db" />
    </View>
    <Text style={styles.emptyTitle}>No saved items</Text>
    <Text style={styles.emptySubtitle}>
      Tap the heart on any product to save it here
    </Text>
    <TouchableOpacity style={styles.shopBtn} onPress={onShop} activeOpacity={0.85}>
      <Text style={styles.shopBtnText}>Browse Products</Text>
    </TouchableOpacity>
  </View>
);

// ─── Not logged in ────────────────────────────────────────────────────────────
const NotLoggedIn = ({ onLogin }) => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconWrap}>
      <MaterialIcons name="lock-outline" size={44} color="#d1d5db" />
    </View>
    <Text style={styles.emptyTitle}>Login to view wishlist</Text>
    <Text style={styles.emptySubtitle}>
      Save your favourite products and access them anytime
    </Text>
    <TouchableOpacity style={styles.shopBtn} onPress={onLogin} activeOpacity={0.85}>
      <Text style={styles.shopBtnText}>Login Now</Text>
    </TouchableOpacity>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
const WishlistScreen = () => {
  const navigation = useNavigation();
  const { user, isLoggedIn } = useAuth();
  const { wishlistSet, refreshWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ── Fetch full product objects ────────────────────────────────────────────
  const fetchWishlistProducts = useCallback(async (silent = false) => {
    if (!user?._id) {
      setProducts([]);
      setLoading(false);
      return;
    }

    if (!silent) setLoading(true);

    try {
      const res = await axios.get(
        `${API_BASE_URL}/wishlist/wishlist-by-user/${user._id}`
      );
      setProducts(res.data?.products || []);
    } catch (err) {
      console.error("WishlistScreen fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlistProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [isLoggedIn, fetchWishlistProducts]);

  // Sync removals made via ProductCard heart (optimistic via WishlistContext)
  useEffect(() => {
    setProducts(prev => prev.filter(p => wishlistSet.has(p._id)));
  }, [wishlistSet]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshWishlist();
    await fetchWishlistProducts(true);
  };

  // ── Render card ───────────────────────────────────────────────────────────
  const renderCard = ({ item }) => (
    <ProductCard
      product={item}
      gridMode
      cardWidth={CARD_WIDTH}
    />
  );

  // ── Skeleton (manual 2-col flex-wrap) ────────────────────────────────────
  const SkeletonGrid = () => (
    <View style={styles.skeletonFlex}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <View key={i} style={styles.skeletonCell}>
          <ProductCardSkeleton gridMode cardWidth={CARD_WIDTH} />
        </View>
      ))}
    </View>
  );

  // ── Guards ────────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <View style={styles.root}>
        <SideScreenNavbar pageName="Wishlist" navigation={navigation} />
        <NotLoggedIn onLogin={() => navigation.navigate("AuthPage")} />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.root}>
        <SideScreenNavbar pageName="Wishlist" navigation={navigation} />
        <SkeletonGrid />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SideScreenNavbar pageName="Wishlist" navigation={navigation} />

      {products.length > 0 && (
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {products.length} {products.length === 1 ? "item" : "items"} saved
          </Text>
        </View>
      )}

      {products.length === 0 ? (
        <EmptyWishlist onShop={() => navigation.navigate("Home")} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item._id}
          renderItem={renderCard}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6b7280"
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },

  // ── Count row
  countRow: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 14,
    paddingBottom: 4,
  },
  countText: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  // ── List
  listContent: {
    padding: HORIZONTAL_PADDING,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: COLUMN_GAP,
  },

  // ── Skeleton
  skeletonFlex: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: HORIZONTAL_PADDING,
    gap: COLUMN_GAP,
    paddingTop: 14,
  },
  skeletonCell: {
    width: CARD_WIDTH,
  },

  // ── Empty / login states
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 28,
  },
  shopBtn: {
    backgroundColor: "#111827",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  shopBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});

export default WishlistScreen;