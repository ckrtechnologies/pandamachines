import React, { createContext, useContext, useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);

  const getUserData = () => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
  };

  const isUserLoggedIn = () => {
    return !!localStorage.getItem("pm-user-data");
  };

  const fetchCartCount = async () => {
    if (!isUserLoggedIn()) {
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      const user = getUserData();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/cart/get-users-cart/${user._id}`
      );

      const distinctProductsCount = response.data.items?.length || 0;

      setCartCount(distinctProductsCount);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  const incrementCartCount = () => {
    setCartCount((prevCount) => prevCount + 1);
  };

  const decrementCartCount = () => {
    setCartCount((prevCount) => Math.max(0, prevCount - 1));
  };

  const resetCartCount = () => {
    setCartCount(0);
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      fetchCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const value = {
    cartCount,
    loading,
    fetchCartCount,
    incrementCartCount,
    decrementCartCount,
    resetCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
