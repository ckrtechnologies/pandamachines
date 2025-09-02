const Razorpay = require("razorpay");
const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpayController = {
  // ✅ Create Razorpay Order (Fixed async/await)
  createOrder: async (req, res) => {
    try {
      const razorpayInstance = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      });

      const amountInPaise = Math.round(req.body.amount * 100);

      const orderOptions = {
        amount: amountInPaise,
        currency: "INR",
        receipt: `TXN${Date.now()}`,
        notes: {
          name: req.body.name,
          email: req.body.email,
          number: req.body.number,
          address: req.body.address,
          product: req.body.product,
          profileName: req.body.profile_name,
        },
      };

      const order = await razorpayInstance.orders.create(orderOptions);

      // Add console.log to debug
      console.log("Created order:", order);
      console.log("Amount sent to Razorpay:", amountInPaise);
      console.log("Amount in rupees:", req.body.amount);

      // Return the complete order object
      res.status(200).json({
        message: "Order created successfully",
        ...order, // This includes id, amount, currency, etc.
        // OR specifically:
        // id: order.id,
        // amount: order.amount,
        // currency: order.currency,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // ✅ Handle Razorpay Payment Callback (Success)
  handlePaymentSuccess: async (req, res) => {
    try {
      const { razorpay_signature, razorpay_payment_id, razorpay_order_id } =
        req.body;

      const generatedSignature = crypto
        .createHmac("sha256", razorpayKeySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature === razorpay_signature) {
        console.log("✅ Payment successful");
        return res.status(200).json({
          message: "Payment successful",
          paymentStatus: true,
          paymentId: razorpay_payment_id,
        });
      } else {
        console.log("❌ Invalid payment signature");
        return res.status(400).json({
          error: "Invalid payment signature",
          paymentStatus: false,
        });
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // ✅ Handle Razorpay Payment Failure
  handlePaymentFailure: async (req, res) => {
    console.error("❌ Payment failed:", req.body);
    res.status(400).json({
      error: "Payment failed",
      paymentStatus: false,
    });
  },

  // ✅ Create Razorpay Contact with Better Error Handling
  createContact: async (req, res) => {
    try {
      const requestData = req.body;
      const config = {
        method: "post",
        url: "https://api.razorpay.com/v1/contacts",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${razorpayKeyId}:${razorpayKeySecret}`
          ).toString("base64")}`,
        },
        data: requestData,
      };

      const response = await axios(config);
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error creating contact:", error.response?.data || error);
      res.status(500).json({ error: "Failed to create contact" });
    }
  },
};

module.exports = razorpayController;
