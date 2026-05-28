import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [buyNowItem, setBuyNowItem] = useState(null);

  // ─────────────────────────────────────────────
  // Cart Count
  // ─────────────────────────────────────────────

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [cartItems]);

  // ─────────────────────────────────────────────
  // Cart Totals
  // ─────────────────────────────────────────────

  const cartTotals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) =>
        sum + (item.price || 0) * item.quantity,
      0
    );
    const discount = cartItems.reduce(
      (sum, item) => {
        const previousPrice =
          item.product?.previous_price || 0;

        const currentPrice =
          item.price || 0;

        if (previousPrice > currentPrice) {
          return (
            sum +
            (previousPrice - currentPrice) *
            item.quantity
          );
        }

        return sum;
      },
      0
    );
    const shipping = cartItems.reduce(
      (sum, item) => {
        const shippingType =
          item.product?.shippingType;

        const shippingCharge =
          item.product?.shippingCharge || 0;

        if (shippingType === "free") {
          return sum;
        }

        return (
          sum + shippingCharge * item.quantity
        );
      },
      0
    );

    const gst = cartItems.reduce(
      (sum, item) =>
        sum +
        (((item.price || 0) *
          item.quantity *
          (item.product?.gstPercentage || 0)) /
          100),
      0
    );

    const extraTax = cartItems.reduce(
      (sum, item) =>
        sum +
        (((item.price || 0) *
          item.quantity *
          (item.product?.extraTaxPercentage || 0)) /
          100),
      0
    );

    const total =
      subtotal +
      shipping +
      gst +
      extraTax;

    return {
      subtotal,
      shipping,
      gst,
      discount,
      extraTax,
      total,
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

      const formattedItems = items.map((item) => ({
        _id: item._id,

        productId: item?.product?._id,

        product: item.product,

        quantity: item.quantity,

        selectedSize: item.selectedSize || "",

        price:
          item.price ||
          item?.product?.price ||
          0,

        name: item?.product?.name || "",

        image:
          item?.product?.images?.[0] || "",
      }));

      setCartItems(formattedItems);
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

    // determine price

    let price = product?.price || 0;

    if (
      product?.sizeType === "multiple" &&
      selectedSize
    ) {
      const matchedSize =
        product?.multipleSizes?.find(
          (sizeObj) =>
            sizeObj.size === selectedSize
        );

      if (matchedSize?.price) {
        price = matchedSize.price;
      }
    }

    // check existing item

    const existingItemIndex =
      cartItems.findIndex(
        (item) =>
          item.productId === productId &&
          item.selectedSize === selectedSize
      );

    // optimistic update

    if (existingItemIndex > -1) {
      setCartItems((prev) =>
        prev.map((item, index) =>
          index === existingItemIndex
            ? {
              ...item,
              quantity:
                item.quantity + quantity,
            }
            : item
        )
      );
    } else {
      const optimisticItem = {
        _id: `temp-${Date.now()}`,

        productId,

        product,

        quantity,

        selectedSize,

        price,

        name: product?.name || "",

        image:
          product?.images?.[0] || "",
      };

      setCartItems((prev) => [
        optimisticItem,
        ...prev,
      ]);
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/add-product-to-cart`,
        {
          userId: user._id,
          productId,
          quantity,
          selectedSize,
          price,
        }
      );

      // sync with backend actual state

      await fetchCart();

      return {
        success: true,
      };
    } catch (err) {
      // rollback

      setCartItems(previousCart);

      console.error(
        "Add To Cart Error:",
        err
      );

      return {
        success: false,
        error: err,
      };
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

    // instant UI update

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId &&
          item.selectedSize === selectedSize
          ? {
            ...item,
            quantity,
          }
          : item
      )
    );

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/cart/update-cart-item-count`,
        {
          userId: user._id,
          productId,
          quantity,
          selectedSize,
        }
      );

      return {
        success: true,
      };
    } catch (err) {
      // rollback

      setCartItems(previousCart);

      console.error("Update Cart Error:", err);

      return {
        success: false,
        error: err,
      };
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

    // optimistic remove
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.selectedSize === selectedSize
          )
      )
    );

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/cart/remove-cart-item`,
        {
          data: {
            userId: user._id,
            productId,
            selectedSize,
          },
        }
      );

      return {
        success: true,
      };
    } catch (err) {
      // rollback

      setCartItems(previousCart);

      console.error("Remove Cart Error:", err);

      return {
        success: false,
        error: err,
      };
    }
  };

  // ─────────────────────────────────────────────
  // Clear Cart
  // ─────────────────────────────────────────────

  const clearCart = async () => {
    const previousCart = [...cartItems];

    // instant clear

    setCartItems([]);

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/cart/clear-cart`,
        {
          data: {
            userId: user._id,
          },
        }
      );

      return {
        success: true,
      };
    } catch (err) {
      // rollback

      setCartItems(previousCart);

      console.error("Clear Cart Error:", err);

      return {
        success: false,
        error: err,
      };
    }
  };

  // ─────────────────────────────────────────────
  // Buy Now
  // ─────────────────────────────────────────────

  const setBuyNow = (
    product,
    {
      quantity = 1,
      selectedSize = "",
    } = {}
  ) => {
    setBuyNowItem({
      product,
      quantity,
      selectedSize,
    });
  };

  // ─────────────────────────────────────────────
  // Initial Fetch
  // ─────────────────────────────────────────────

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn, user?._id]);

  return (
    <CartContext.Provider
      value={{
        loading,

        cartItems,
        cartCount,
        cartTotals,

        buyNowItem,
        setBuyNow,

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