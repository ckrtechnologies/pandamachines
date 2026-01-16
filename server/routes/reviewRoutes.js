const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController");

router.get("/product-reviews/:productId", reviewController.getProductReviews);
router.get("/user-reviews/:userId", reviewController.getUserReviews);
router.get(
  "/check/:userId/:productId",
  reviewController.checkReviewEligibility
);
router.get("/review-by-id/:id", reviewController.getReviewById);
router.post("/create-review", reviewController.createReview);
router.put("/update-review/:id", reviewController.updateReview);
router.delete("/delete-review/:id", reviewController.deleteReview);
router.get(
  "/my-product-review/:userId/:productId",
  reviewController.getMyProductReview
);

module.exports = router;
