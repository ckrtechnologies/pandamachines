import React, { useState } from "react";
import axios from "axios";

const RazorpayForOrder = ({
  amount,
  customerData,
  bookingData,
  onSuccess,
  onFailure,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async () => {
    try {
      const orderData = {
        amount: amount,
        name: customerData.fullName,
        email: customerData.email,
        number: customerData.mobileNumber,
        address: customerData.address || "Not provided",
        product: customerData.product || "Product Order",
        profile_name: customerData.fullName.toLowerCase().replace(/\s+/g, "_"),
      };

      // console.log("Creating order with data:", orderData);
      // console.log("Amount in rupees:", amount);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/razorpay/create-order`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Order created successfully:", response.data);
      // console.log("Order amount from backend:", response.data.amount);
      // console.log("Order ID from backend:", response.data.id);

      if (!response.data.amount) {
        console.error("Backend didn't return amount!");
      }

      return response.data;
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const initiatePayment = async () => {
    setLoading(true);

    try {
      // console.log("Environment check:", {
      //   hasRazorpayKey: !!process.env.REACT_APP_RAZORPAY_KEY_ID,
      //   razorpayKey:
      //     process.env.REACT_APP_RAZORPAY_KEY_ID?.substring(0, 10) + "...",
      //   hasApiUrl: !!process.env.REACT_APP_API_URL,
      //   apiUrl: process.env.REACT_APP_API_URL,
      // });

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay script");
      }

      const orderData = await createOrder();

      const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error(
          "Razorpay key not found. Please check your environment variables."
        );
      }

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Panda Machines",
        description: "Product Order Payment",
        order_id: orderData.id,
        handler: async (response) => {
          console.log("Payment successful with response:", response);
          console.log("Original order data:", orderData);

          try {
            console.log("Payment Response Details:", {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
              original_order_id: orderData.id,
            });

            console.log("Payment successful, returning payment data...");

            onSuccess({
              paymentData: response,
              orderData: orderData,
            });
          } catch (error) {
            console.error("Error in payment success handler:", error);
            onFailure({
              type: "success_handler_failed",
              message: "Payment successful but processing failed",
              error: error,
              paymentData: response,
            });
          }
        },
        prefill: {
          name: customerData.fullName,
          email: customerData.email,
          contact: customerData.mobileNumber,
        },
        notes: {
          order_type: bookingData?.orderType || "product_order",
          category: bookingData?.category || "e-commerce",
        },
        theme: {
          color: "#F97316",
        },
        modal: {
          ondismiss: () => {
            console.log("Payment modal dismissed by user");
            setLoading(false);
            if (onClose) onClose();
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", async (response) => {
        console.error("Razorpay payment failed:", response.error);

        onFailure({
          type: "payment_failed",
          message: response.error.description || "Payment failed",
          error: response.error,
        });
      });

      console.log("Opening Razorpay payment modal...");
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation error:", error);

      onFailure({
        type: "initiation_failed",
        message: error.message || "Failed to initiate payment",
        error: error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="razorpay-payment">
      <button
        onClick={initiatePayment}
        disabled={loading}
        className="bg-orange-400 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full justify-center"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            Pay ₹{amount.toLocaleString()} - Proceed to Payment
          </>
        )}
      </button>
    </div>
  );
};

export default RazorpayForOrder;
