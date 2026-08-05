import axios from 'axios';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { API_BASE_URL } from '../utils/basicInfo';
import { useAuth } from './AuthContext';
import { computePricing, normaliseItem } from '../utils/pricingUtils';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  //  Derived 
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const cartTotals = useMemo(() => {
    const pricing = computePricing(cartItems);
    return { ...pricing, total: pricing.grandTotal }; // backward-compat alias
  }, [cartItems]);

  //  Fetch 
  const fetchCart = async () => {
    if (!isLoggedIn || !user?._id) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/cart/get-users-cart/${user._id}`);
      const items = res?.data?.items || [];
      setCartItems(items.map(normaliseItem));
    } catch (err) {
      console.error('Cart fetch failed:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  //  Add 
  const addToCart = async (productId, quantity = 1, selectedSize = '') => {
    if (!isLoggedIn || !user?._id) return { success: false, message: 'Login required' };

    try {
      await axios.post(`${API_BASE_URL}/cart/add-product-to-cart`, {
        userId: user._id,
        productId,
        quantity,
        selectedSize,
      });
      await fetchCart();
      return { success: true };
    } catch (err) {
      console.error('addToCart:', err);
      return { success: false, message: err?.response?.data?.message || 'Failed' };
    }
  };

  //  Remove ─
  const removeFromCart = async (productId) => {
    if (!isLoggedIn || !user?._id) return { success: false };

    const prev = [...cartItems];
    setCartItems(c => c.filter(i => i.productId !== productId));

    try {
      await axios.delete(`${API_BASE_URL}/cart/remove-cart-item`, {
        data: { userId: user._id, productId },
      });
      return { success: true };
    } catch (err) {
      setCartItems(prev);
      console.error('removeFromCart:', err);
      return { success: false };
    }
  };

  //  Update qty ─
  const updateQuantity = async (productId, quantity) => {
    if (!isLoggedIn || !user?._id) return { success: false };

    const prev = [...cartItems];
    setCartItems(c =>
      c.map(i => (i.productId === productId ? { ...i, quantity } : i)),
    );

    try {
      await axios.put(`${API_BASE_URL}/cart/update-cart-item-count`, {
        userId: user._id,
        productId,
        quantity,
      });

      return { success: true };
    } catch (err) {
      setCartItems(prev);
      return { success: false };
    }
  };

  //  Clear 
  const clearCart = async () => {
    if (!isLoggedIn || !user?._id) return { success: false };

    const prev = [...cartItems];
    setCartItems([]);

    try {
      await axios.delete(`${API_BASE_URL}/cart/clear-cart`, {
        data: { userId: user._id },
      });
      return { success: true };
    } catch (err) {
      setCartItems(prev);
      console.error('clearCart:', err);
      return { success: false };
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn, user?._id]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotals,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};