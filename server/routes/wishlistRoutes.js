const express = require("express");
const router = express.Router();
const wishlistController = require("../controller/wishlistController");

router.post("/add-to-wishlist", wishlistController.addToWishlist);
router.post("/remove-from-wishlist", wishlistController.removeFromWishlist);
router.get("/wishlist-by-user/:userId", wishlistController.getUserWishlist);

module.exports = router;
