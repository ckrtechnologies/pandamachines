const mongoose = require("mongoose");
const Review = require("../model/Review");
const Order = require("../model/Order");
const Product = require("../model/Product");
const User = require("../model/user");

const createReview = async (req, res) => {
  try {
    const { userId, productId, orderId, rating, reviewText, images } = req.body;
    if (!userId || !productId || !orderId || !rating) {
      return res.status(400).json({
        success: false,
        message: "User ID, product ID, order ID, and rating are required",
      });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      status: "Delivered",
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message:
          "Order not found, not delivered, or doesn't belong to this user",
      });
    }
    const productInOrder = order.products.some(
      (p) => p.product.toString() === productId
    );

    if (!productInOrder) {
      return res.status(400).json({
        success: false,
        message: "Product not found in this order",
      });
    }
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
      order: orderId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product for this order",
      });
    }
    const review = new Review({
      user: userId,
      product: productId,
      order: orderId,
      rating,
      reviewText: reviewText || "",
      images: images || [],
    });

    await review.save();
    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product for this order",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating } = req.query;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const query = { product: productId };
    if (rating) {
      query.rating = parseInt(rating);
    }

    const reviews = await Review.find(query)
      .populate({
        path: "user",
        select: "firstName lastName imageUrl",
      })
      .sort({ createdAt: -1 })
      .lean();
    const allReviews = await Review.find({ product: productId });

    let totalRating = 0;
    let totalReviews = allReviews.length;
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    allReviews.forEach((review) => {
      totalRating += review.rating;
      ratingDistribution[review.rating]++;
    });

    const averageRating =
      totalReviews > 0 ? Math.round((totalRating / totalReviews) * 10) / 10 : 0;

    res.json({
      success: true,
      data: {
        productId,
        reviews,
        statistics: {
          averageRating,
          totalReviews,
          ratingDistribution,
        },
      },
    });
  } catch (error) {
    console.error("Get product reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const reviews = await Review.find({ user: userId })
      .populate({
        path: "product",
        select: "name images price",
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        },
        reviews,
        totalReviews: reviews.length,
      },
    });
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const checkReviewEligibility = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const deliveredOrders = await Order.find({
      user: userId,
      status: "Delivered",
      "products.product": productId,
    }).select("_id createdAt");

    if (deliveredOrders.length === 0) {
      return res.json({
        success: true,
        data: {
          canReview: false,
          reason: "You need to purchase and receive this product to review it",
        },
      });
    }

    const orderIds = deliveredOrders.map((order) => order._id);
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
      order: { $in: orderIds },
    });

    if (existingReview) {
      return res.json({
        success: true,
        data: {
          canReview: false,
          reason: "You have already reviewed this product",
          existingReview,
        },
      });
    }

    res.json({
      success: true,
      data: {
        canReview: true,
        eligibleOrders: deliveredOrders.map((order) => ({
          orderId: order._id,
          orderDate: order.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Check review eligibility error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate({
        path: "user",
        select: "firstName lastName imageUrl",
      })
      .populate({
        path: "product",
        select: "name images",
      });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Get review by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating, reviewText, images } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const review = await Review.findOne({ _id: id, user: userId });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }
      review.rating = rating;
    }

    if (reviewText !== undefined) {
      review.reviewText = reviewText;
    }

    if (images !== undefined) {
      review.images = images;
    }

    await review.save();
    await updateProductRating(review.product);

    res.json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const review = await Review.findOne({ _id: id, user: userId });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const productId = review.product;
    await review.deleteOne();
    await updateProductRating(productId);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId });

    if (reviews.length > 0) {
      let totalRating = 0;
      reviews.forEach((review) => {
        totalRating += review.rating;
      });

      const averageRating =
        Math.round((totalRating / reviews.length) * 10) / 10;

      await Product.findByIdAndUpdate(
        productId,
        { ratings: averageRating },
        { new: true }
      );
    } else {
      await Product.findByIdAndUpdate(productId, { ratings: 0 }, { new: true });
    }
  } catch (error) {
    console.error("Update product rating error:", error);
  }
};
const getMyProductReview = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { orderId } = req.query;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required",
      });
    }
    const query = { user: userId, product: productId };
    if (orderId) {
      query.order = orderId;
    }

    const review = await Review.findOne(query)
      .populate({
        path: "user",
        select: "firstName lastName imageUrl",
      })
      .populate({
        path: "product",
        select: "name images",
      })
      .populate({
        path: "order",
        select: "orderNumber createdAt",
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!review) {
      const message = orderId
        ? "You haven't reviewed this product for this specific order yet"
        : "You haven't reviewed this product yet";

      return res.json({
        success: true,
        data: null,
        hasReviewed: false,
        message,
      });
    }

    res.json({
      success: true,
      data: review,
      hasReviewed: true,
    });
  } catch (error) {
    console.error("Get my product review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getUserReviews,
  checkReviewEligibility,
  getReviewById,
  updateReview,
  deleteReview,
  getMyProductReview,
};
