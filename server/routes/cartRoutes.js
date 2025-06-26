const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");

router.post("/add-product-to-cart", cartController.addToCart);
router.get("/get-users-cart/:userId", cartController.getCart);
router.put("/update-cart-item-count", cartController.updateCartItem);
router.delete("/remove-cart-item", cartController.removeCartItem);
router.delete("/clear-cart", cartController.clearCart);
router.get("/cart-count", cartController.getCartCount);

module.exports = router;
