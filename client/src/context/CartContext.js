import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [buyNowItem, setBuyNowItem] = useState(null);

  const CACHE_DURATION = 30000;
  const abortControllerRef = useRef(null);

  const getUserData = useCallback(() => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
  }, []);

  const isUserLoggedIn = useCallback(() => {
    return !!localStorage.getItem("pm-user-data");
  }, []);

  const setBuyNow = useCallback((product, options = {}) => {
    const data = {
      product,
      quantity: options.quantity || 1,
      measurement: options.measurement || product.measurement || null,
      selectedVariant: options.selectedVariant || null,
    };

    setBuyNowItem(data);

    // optional: keep compatibility with current checkout
    localStorage.setItem("buy-now-product", JSON.stringify(data));
  }, []);

  const fetchCartData = useCallback(
    async (forceRefresh = false) => {
      if (!isUserLoggedIn()) {
        setCartCount(0);
        setCartItems([]);
        return { items: [], count: 0 };
      }

      const now = Date.now();
      const shouldUseCache =
        !forceRefresh && now - lastFetchTime < CACHE_DURATION;

      if (shouldUseCache && cartItems.length > 0) {
        return { items: cartItems, count: cartCount };
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        const user = getUserData();

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cart/get-users-cart/${user._id}`,
          {
            signal: abortControllerRef.current.signal,
            timeout: 5000,
          }
        );

        const items = response.data.items || [];
        const transformedItems = items.map((item) => ({
          id: item._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
          productId: item.product._id,
          gstPercentage: item.product.gstPercentage || 0,
          extraTaxPercentage: item.product.extraTaxPercentage || 0,
          shippingCharge: item.product.shippingCharge || 0,
          measurement: item.measurement,
          variantModel: item.variantModel,
          product: item.product, // Include the full product object as Checkout.jsx expects it
        }));

        setCartItems(transformedItems);
        setCartCount(items.length);
        setLastFetchTime(now);

        return { items: transformedItems, count: items.length };
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Request was aborted");
          return { items: cartItems, count: cartCount };
        }

        console.error("Error fetching cart data:", error);
        setCartCount(0);
        setCartItems([]);
        return { items: [], count: 0 };
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [isUserLoggedIn, getUserData, cartItems, cartCount, lastFetchTime]
  );

  const fetchCartCount = useCallback(async () => {
    if (!isUserLoggedIn()) {
      setCartCount(0);
      return;
    }

    try {
      const user = getUserData();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/cart/get-users-cart/${user._id}`,
        {
          timeout: 3000,
          params: { countOnly: true },
        }
      );

      const count = response.data.items?.length || 0;
      setCartCount(count);
      setLastFetchTime(Date.now());
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  }, [isUserLoggedIn, getUserData]);

  // New method to update cart count directly
  const updateCartCount = useCallback((newCount) => {
    setCartCount(newCount);
  }, []);

  const updateCartOptimistically = useCallback((productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeFromCartOptimistically = useCallback((productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
    setCartCount((prevCount) => Math.max(0, prevCount - 1));
  }, []);

  const addToCartOptimistically = useCallback((newItem) => {
    setCartItems((prevItems) => [...prevItems, newItem]);
    setCartCount((prevCount) => prevCount + 1);
  }, []);

  const incrementCartCount = useCallback(() => {
    setCartCount((prevCount) => prevCount + 1);
  }, []);

  const decrementCartCount = useCallback(() => {
    setCartCount((prevCount) => Math.max(0, prevCount - 1));
  }, []);

  const resetCartCount = useCallback(() => {
    setCartCount(0);
    setCartItems([]);
    setLastFetchTime(0);
  }, []);

  // New method to refresh cart data after adding/removing items
  const refreshCart = useCallback(async () => {
    await fetchCartData(true);
  }, [fetchCartData]);

  // Method to add item to cart and refresh count
  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!isUserLoggedIn()) {
        return { success: false, message: "User not logged in" };
      }

      try {
        const user = getUserData();
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/cart/add-product-to-cart`,
          {
            userId: user._id,
            productId: productId,
            quantity: quantity,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        // Update cart count after successful addition
        await fetchCartCount();

        return { success: true, data: response.data };
      } catch (error) {
        console.error("Error adding to cart:", error);
        return { success: false, error };
      }
    },
    [isUserLoggedIn, getUserData, fetchCartCount]
  );

  // Method to remove item from cart and refresh count
  const removeFromCart = useCallback(
    async (productId) => {
      if (!isUserLoggedIn()) {
        return { success: false, message: "User not logged in" };
      }

      try {
        const user = getUserData();
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/cart/remove-product-from-cart`,
          {
            userId: user._id,
            productId: productId,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        // Update cart count after successful removal
        await fetchCartCount();

        return { success: true, data: response.data };
      } catch (error) {
        console.error("Error removing from cart:", error);
        return { success: false, error };
      }
    },
    [isUserLoggedIn, getUserData, fetchCartCount]
  );

  // Method to update item quantity in cart
  const updateCartItemQuantity = useCallback(
    async (productId, quantity) => {
      if (!isUserLoggedIn()) {
        return { success: false, message: "User not logged in" };
      }

      try {
        const user = getUserData();
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/cart/update-cart-item-quantity`,
          {
            userId: user._id,
            productId: productId,
            quantity: quantity,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        // Update cart count after successful update
        await fetchCartCount();

        return { success: true, data: response.data };
      } catch (error) {
        console.error("Error updating cart item quantity:", error);
        return { success: false, error };
      }
    },
    [isUserLoggedIn, getUserData, fetchCartCount]
  );

  // Method to clear entire cart
  const clearCart = useCallback(async () => {
    if (!isUserLoggedIn()) {
      return { success: false, message: "User not logged in" };
    }

    try {
      const user = getUserData();
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/clear-cart`,
        {
          userId: user._id,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Reset cart count after successful clear
      resetCartCount();

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error clearing cart:", error);
      return { success: false, error };
    }
  }, [isUserLoggedIn, getUserData, resetCartCount]);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  useEffect(() => {
    const handleStorageChange = () => {
      fetchCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchCartCount]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const value = {
    addToCart,
    setBuyNow,
    buyNowItem,

    cartCount,
    cartItems,
    loading,
    fetchCartCount,
    fetchCartData,
    incrementCartCount,
    decrementCartCount,
    resetCartCount,
    updateCartCount,
    updateCartOptimistically,
    removeFromCartOptimistically,
    addToCartOptimistically,
    refreshCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
