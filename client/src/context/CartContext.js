import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import { useAuth } from "./AuthContext";
import { computePricing, normaliseItem } from "../utils/pricingUtils";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ─────────────────────────────────────────────
  // Derived — single shared pricing util
  // ─────────────────────────────────────────────

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  /**
   * cartTotals mirrors CheckoutContext.pricing shape exactly:
   *   { subtotal, discount, gst, extraTax, shipping, grandTotal }
   * The cart page currently uses `cartTotals.total` — we keep that alias
   * so no other files need changing.
   */
  const cartTotals = useMemo(() => {
    const pricing = computePricing(cartItems);
    return {
      ...pricing,
      // backward-compat alias used by Cart.jsx
      total: pricing.grandTotal,
    };
  }, [cartItems]);

  // ─────────────────────────────────────────────
  // Fetch Cart
  // ─────────────────────────────────────────────

  const fetchCart = async () => {
    if (!isLoggedIn || !user?._id) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/cart/get-users-cart/${user._id}`
      );

      const items = res?.data?.items || [];
      setCartItems(items.map((item) => normaliseItem(item)));
    } catch (err) {
      console.error("Fetch Cart Error:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Add To Cart
  // ─────────────────────────────────────────────

  const addToCart = async ({
    product,
    quantity = 1,
    selectedSize = "",
  }) => {
    const previousCart = [...cartItems];
    const productId = product?._id;

    // Resolve price
    let price = product?.price || 0;
    if (product?.sizeType === "multiple" && selectedSize) {
      const matchedSize = product?.multipleSizes?.find(
        (s) => s.size === selectedSize
      );
      if (matchedSize?.price) price = matchedSize.price;
    }

    // Optimistic update
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.productId === productId &&
        item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      setCartItems((prev) =>
        prev.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems((prev) => [
        normaliseItem({ product, quantity, selectedSize, price }),
        ...prev,
      ]);
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/add-product-to-cart`,
        { userId: user._id, productId, quantity, selectedSize, price }
      );

      await fetchCart(); // sync with server
      return { success: true };
    } catch (err) {
      setCartItems(previousCart);
      console.error("Add To Cart Error:", err);
      return { success: false, error: err };
    }
  };

  // ─────────────────────────────────────────────
  // Update Cart Item Quantity
  // ─────────────────────────────────────────────

  const updateCartItemQuantity = async ({
    productId,
    quantity,
    selectedSize = "",
  }) => {
    const previousCart = [...cartItems];

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/cart/update-cart-item-count`,
        { userId: user._id, productId, quantity, selectedSize }
      );
      return { success: true };
    } catch (err) {
      setCartItems(previousCart);
      console.error("Update Cart Error:", err);
      return { success: false, error: err };
    }
  };

  // ─────────────────────────────────────────────
  // Remove Cart Item
  // ─────────────────────────────────────────────

  const removeFromCart = async ({
    productId,
    selectedSize = "",
  }) => {
    const previousCart = [...cartItems];

    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.selectedSize === selectedSize)
      )
    );

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/cart/remove-cart-item`,
        { data: { userId: user._id, productId, selectedSize } }
      );
      return { success: true };
    } catch (err) {
      setCartItems(previousCart);
      console.error("Remove Cart Error:", err);
      return { success: false, error: err };
    }
  };

  // ─────────────────────────────────────────────
  // Clear Cart
  // ─────────────────────────────────────────────

  const clearCart = async () => {
    const previousCart = [...cartItems];
    setCartItems([]);

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/cart/clear-cart`,
        { data: { userId: user._id } }
      );
      return { success: true };
    } catch (err) {
      setCartItems(previousCart);
      console.error("Clear Cart Error:", err);
      return { success: false, error: err };
    }
  };

  // ─────────────────────────────────────────────
  // Initial Fetch
  // ─────────────────────────────────────────────

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn, user?._id]); // eslint-disable-line

  return (
    <CartContext.Provider
      value={{
        loading,
        cartItems,
        cartCount,
        cartTotals,
        fetchCart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};