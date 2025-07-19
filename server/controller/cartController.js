const Cart = require("../model/Cart");
const Product = require("../model/Product");

exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity, selectedSize } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let price = 0;

        if (product.sizeType === "one") {
            price = product.singleSize.price;
        } else if (product.sizeType === "multiple") {
            const matchedSize = product.multipleSizes.find(sizeObj => sizeObj.size === selectedSize);
            if (!matchedSize) {
                return res.status(400).json({ message: "Selected size not found in product" });
            }
            price = matchedSize.price;
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity, selectedSize, price }]
            });
        } else {
            const itemIndex = cart.items.findIndex(item =>
                item.product.toString() === productId &&
                item.selectedSize === selectedSize
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity, selectedSize, price });
            }
        }

        await cart.save();
        res.status(200).json({ message: "Product added to cart", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart) return res.status(404).json({ message: "Cart is empty" });

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            return res.status(200).json({ message: "Cart updated", cart });
        }
        res.status(404).json({ message: "Product not found in cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.query;

        if (!userId || !productId) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const initialItemCount = cart.items.length;

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        if (cart.items.length === initialItemCount) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        await cart.save();
        res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.query;
        await Cart.findOneAndDelete({ user: userId });
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCartCount = async (req, res) => {
    try {
        const { userId } = req.query;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(200).json({ count: 0 });
        const count = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCartItems = async (req, res) => {
    try {
        const { userId, items } = req.body;

        // Validate input
        if (!userId || !items || !Array.isArray(items)) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Create a map for quick lookup of items to update
        const updatesMap = new Map();
        items.forEach(item => {
            if (item.productId && item.quantity) {
                updatesMap.set(item.productId.toString(), item.quantity);
            }
        });

        // Update quantities in the cart
        let hasUpdates = false;
        cart.items.forEach(item => {
            const newQuantity = updatesMap.get(item.product.toString());
            if (newQuantity !== undefined && newQuantity !== item.quantity) {
                item.quantity = newQuantity;
                hasUpdates = true;
            }
        });

        if (!hasUpdates) {
            return res.status(200).json({ message: "No changes detected", cart });
        }

        await cart.save();
        
        // Optionally populate the products if needed in response
        const updatedCart = await Cart.findOne({ user: userId }).populate("items.product");
        
        res.status(200).json({ 
            message: "Cart items updated successfully", 
            cart: updatedCart 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};