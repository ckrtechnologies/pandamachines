const express = require("express");
const router = express.Router();
const razorpayController = require("../controller/razorpayController");

// Create order
router.post("/create-order", razorpayController.createOrder);

// Handle successful payment
router.post("/payment-success", razorpayController.handlePaymentSuccess);

// Handle failed payment
router.post("/payment-failure", razorpayController.handlePaymentFailure);

// Create Razorpay contact
router.post("/create-contact", razorpayController.createContact);

module.exports = router;
