import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const getUserData = () => {
    const userData = localStorage.getItem("pm-user-data");
    return userData ? JSON.parse(userData) : null;
};

const isUserLoggedIn = () => {
    return !!localStorage.getItem("pm-user-data");
};

export const useWishlist = ({ onAuthRequired } = {}) => {
    const [wishlistSet, setWishlistSet] = useState(new Set());
    const [updatingWishlist, setUpdatingWishlist] = useState(new Set());
    const [loading, setLoading] = useState(false);

    // fetch wishlist
    const fetchWishlist = useCallback(async () => {
        try {
            const user = getUserData();
            if (!user) return;

            setLoading(true);

            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/wishlist/wishlist-by-user/${user._id}`
            );

            const ids = res.data.products.map(p => p._id);
            setWishlistSet(new Set(ids));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // optimistic toggle
    const toggleWishlist = useCallback(async (productId) => {
        if (!isUserLoggedIn()) {
            if (onAuthRequired) onAuthRequired();
            return;
        }

        if (updatingWishlist.has(productId)) return;

        const user = getUserData();
        const isAlready = wishlistSet.has(productId);

        const prevSet = new Set(wishlistSet);

        // mark loading
        setUpdatingWishlist(prev => new Set(prev).add(productId));

        // optimistic update
        setWishlistSet(prev => {
            const newSet = new Set(prev);
            if (isAlready) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });

        try {
            if (isAlready) {
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/wishlist/remove-from-wishlist`,
                    { userId: user._id, productId }
                );
                toast.success("Removed from wishlist");
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/wishlist/add-to-wishlist`,
                    { userId: user._id, productId }
                );
                toast.success("Added to wishlist");
            }
        } catch (err) {
            // rollback
            setWishlistSet(prevSet);
            toast.error("Wishlist update failed");
        } finally {
            // remove loading
            setUpdatingWishlist(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    }, [wishlistSet, updatingWishlist, onAuthRequired]);

    // helper
    const isWishlisted = useCallback(
        (productId) => wishlistSet.has(productId),
        [wishlistSet]
    );

    useEffect(() => {
        if (isUserLoggedIn()) {
            fetchWishlist();
        }
    }, [fetchWishlist]);

    return {
        wishlistSet,
        isWishlisted,
        toggleWishlist,
        updatingWishlist,
        loading,
        refreshWishlist: fetchWishlist
    };
};