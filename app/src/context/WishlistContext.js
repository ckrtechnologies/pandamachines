import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import axios from "axios";
import { Alert } from "react-native";

import { navigate } from "../../src/utils/navigationService";
import { API_BASE_URL } from "../utils/basicInfo";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);
    
export const WishlistProvider = ({ children }) => {
    const { user, isLoggedIn } = useAuth();
    const [wishlistSet, setWishlistSet] = useState(new Set());
    const [updatingWishlist, setUpdatingWishlist] = useState(new Set());
    const [loading, setLoading] = useState(false);

    // fetch wishlist
    const fetchWishlist = useCallback(async () => {
        try {
            if (!user?._id) {
                setWishlistSet(new Set());
                return;
            }

            setLoading(true);

            const res = await axios.get(
                `${API_BASE_URL}/wishlist/wishlist-by-user/${user._id}`
            );

            const ids = res.data.products.map((p) => p._id);

            setWishlistSet(new Set(ids));
        } catch (err) {
            console.error("Wishlist fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // optimistic toggle
    const toggleWishlist = async (productId) => {
        if (!isLoggedIn) {
            navigate("AuthPage")
            return;
        }

        if (updatingWishlist.has(productId)) return;

        const currentlyWishlisted = wishlistSet.has(productId);

        // loading state
        setUpdatingWishlist((prev) => {
            const next = new Set(prev);
            next.add(productId);
            return next;
        });

        // optimistic update
        setWishlistSet((prev) => {
            const next = new Set(prev);

            if (next.has(productId)) {
                next.delete(productId);
            } else {
                next.add(productId);
            }

            return next;
        });

        try {
            if (currentlyWishlisted) {
                await axios.post(
                    `${API_BASE_URL}/wishlist/remove-from-wishlist`,
                    {
                        userId: user._id,
                        productId,
                    }
                );
            } else {
                await axios.post(
                    `${API_BASE_URL}/wishlist/add-to-wishlist`,
                    {
                        userId: user._id,
                        productId,
                    }
                );
            }
        } catch (err) {
            console.error("Wishlist update failed:", err);

            // rollback
            setWishlistSet((prev) => {
                const next = new Set(prev);

                if (currentlyWishlisted) {
                    next.add(productId);
                } else {
                    next.delete(productId);
                }

                return next;
            });

            Alert.alert("Error", "Wishlist update failed");
        } finally {
            setUpdatingWishlist((prev) => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
        }
    };

    // helper
    const isWishlisted = useCallback(
        (productId) => wishlistSet.has(productId),
        [wishlistSet]
    );

    useEffect(() => {
        if (isLoggedIn) {
            fetchWishlist();
        } else {
            setWishlistSet(new Set());
        }
    }, [isLoggedIn, fetchWishlist]);

    return (
        <WishlistContext.Provider
            value={{
                wishlistSet,
                updatingWishlist,
                loading,
                toggleWishlist,
                isWishlisted,
                refreshWishlist: fetchWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};