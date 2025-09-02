// import React, { useState } from "react";
// import axios from "axios";

// const RazorpayPayment = ({
//   amount,
//   customerData,
//   bookingData,
//   onSuccess,
//   onFailure,
//   onClose,
// }) => {
//   const [loading, setLoading] = useState(false);

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const createOrder = async () => {
//     try {
//       const orderData = {
//         amount: amount,
//         name: customerData.fullName,
//         email: customerData.email,
//         number: customerData.mobileNumber,
//         address: customerData.address || "Not provided",
//         product: customerData.product || "Guidance Consultation",
//         profile_name: customerData.fullName.toLowerCase().replace(/\s+/g, "_"),
//       };

//       console.log("Creating order with data:", orderData);

//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/razorpay/create-order`,
//         orderData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Order created successfully:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error(
//         "Error creating order:",
//         error.response?.data || error.message
//       );
//       throw error;
//     }
//   };

//   const createBooking = async (paymentResponse) => {
//     try {
//       console.log("Creating booking with data:", {
//         ...bookingData,
//         paymentId: paymentResponse.razorpay_payment_id,
//         orderId: paymentResponse.razorpay_order_id,
//         paymentStatus: "completed",
//       });

//       const bookingResponse = await axios.post(
//         `${process.env.REACT_APP_API_URL}/guidance-booking/book`,
//         {
//           ...bookingData,
//           paymentId: paymentResponse.razorpay_payment_id,
//           orderId: paymentResponse.razorpay_order_id,
//           paymentStatus: "completed",
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Booking created successfully:", bookingResponse.data);
//       return bookingResponse.data;
//     } catch (error) {
//       console.error("Error creating booking:", {
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data,
//       });
//       throw error;
//     }
//   };

//   const initiatePayment = async () => {
//     setLoading(true);

//     try {
//       console.log("Environment check:", {
//         hasRazorpayKey: !!process.env.REACT_APP_RAZORPAY_KEY_ID,
//         razorpayKey:
//           process.env.REACT_APP_RAZORPAY_KEY_ID?.substring(0, 10) + "...",
//         hasApiUrl: !!process.env.REACT_APP_API_URL,
//         apiUrl: process.env.REACT_APP_API_URL,
//       });

//       const scriptLoaded = await loadRazorpayScript();
//       if (!scriptLoaded) {
//         throw new Error("Failed to load Razorpay script");
//       }

//       const orderData = await createOrder();

//       const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;

//       if (!razorpayKey) {
//         throw new Error(
//           "Razorpay key not found. Please check your environment variables."
//         );
//       }

//       const options = {
//         key: razorpayKey,
//         amount: orderData.amount,
//         currency: orderData.currency || "INR",
//         name: "Panda Machines",
//         description: "Guidance Consultation Payment",
//         order_id: orderData.id,
//         handler: async (response) => {
//           console.log("Payment successful with response:", response);
//           console.log("Original order data:", orderData);

//           try {
//             // Log payment details
//             console.log("Payment Response Details:", {
//               payment_id: response.razorpay_payment_id,
//               order_id: response.razorpay_order_id,
//               signature: response.razorpay_signature,
//               original_order_id: orderData.id,
//             });

//             // Since payment is successful, create the booking directly
//             console.log("Payment successful, creating booking...");

//             const bookingResult = await createBooking(response);

//             console.log("All operations completed successfully");
//             onSuccess({
//               paymentData: response,
//               bookingData: bookingResult,
//             });
//           } catch (bookingError) {
//             console.error("Booking creation failed:", bookingError);

//             // Payment was successful but booking failed
//             onFailure({
//               type: "booking_failed",
//               message: "Payment successful but booking creation failed",
//               error: bookingError,
//               paymentData: response,
//             });
//           }
//         },
//         prefill: {
//           name: customerData.fullName,
//           email: customerData.email,
//           contact: customerData.mobileNumber,
//         },
//         notes: {
//           booking_type: "guidance_consultation",
//           discussion_time: bookingData.discussionTime,
//           category: bookingData.category,
//         },
//         theme: {
//           color: "#F97316",
//         },
//         modal: {
//           ondismiss: () => {
//             console.log("Payment modal dismissed by user");
//             setLoading(false);
//             if (onClose) onClose();
//           },
//         },
//       };

//       // Create and open Razorpay instance
//       const razorpay = new window.Razorpay(options);

//       razorpay.on("payment.failed", async (response) => {
//         console.error("Razorpay payment failed:", response.error);

//         // Handle the failure locally without making API call
//         onFailure({
//           type: "payment_failed",
//           message: response.error.description || "Payment failed",
//           error: response.error,
//         });
//       });

//       console.log("Opening Razorpay payment modal...");
//       razorpay.open();
//     } catch (error) {
//       console.error("Payment initiation error:", error);

//       onFailure({
//         type: "initiation_failed",
//         message: error.message || "Failed to initiate payment",
//         error: error,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="razorpay-payment">
//       <button
//         onClick={initiatePayment}
//         disabled={loading}
//         className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full justify-center"
//       >
//         {loading ? (
//           <>
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//             Processing Payment...
//           </>
//         ) : (
//           <>
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               <path
//                 fillRule="evenodd"
//                 d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Pay ₹{amount.toLocaleString()} - Proceed to Payment
//           </>
//         )}
//       </button>
//     </div>
//   );
// };

// export default RazorpayPayment;

import React, { useState } from "react";
import axios from "axios";

const RazorpayPayment = ({
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
      // Backend will handle conversion to paise, send amount in rupees
      const orderData = {
        amount: amount, // Send in rupees, backend will convert to paise
        name: customerData.fullName,
        email: customerData.email,
        number: customerData.mobileNumber,
        address: customerData.address || "Not provided",
        product: customerData.product || "Guidance Consultation",
        profile_name: customerData.fullName.toLowerCase().replace(/\s+/g, "_"),
      };

      console.log("Creating order with data:", orderData);
      console.log("Amount in rupees:", amount);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/razorpay/create-order`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Order created successfully:", response.data);
      console.log("Order amount from backend:", response.data.amount);
      console.log("Order ID from backend:", response.data.id);

      // Verify the response has the required fields
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

  const createBooking = async (paymentResponse) => {
    try {
      console.log("Creating booking with data:", {
        ...bookingData,
        paymentId: paymentResponse.razorpay_payment_id,
        orderId: paymentResponse.razorpay_order_id,
        paymentStatus: "completed",
      });

      const bookingResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/guidance-booking/book`,
        {
          ...bookingData,
          paymentId: paymentResponse.razorpay_payment_id,
          orderId: paymentResponse.razorpay_order_id,
          paymentStatus: "completed",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Booking created successfully:", bookingResponse.data);
      return bookingResponse.data;
    } catch (error) {
      console.error("Error creating booking:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  };

  const initiatePayment = async () => {
    setLoading(true);

    try {
      console.log("Environment check:", {
        hasRazorpayKey: !!process.env.REACT_APP_RAZORPAY_KEY_ID,
        razorpayKey:
          process.env.REACT_APP_RAZORPAY_KEY_ID?.substring(0, 10) + "...",
        hasApiUrl: !!process.env.REACT_APP_API_URL,
        apiUrl: process.env.REACT_APP_API_URL,
      });

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
        amount: orderData.amount, // This will be in paise from the order
        currency: orderData.currency || "INR",
        name: "Panda Machines",
        description: "Guidance Consultation Payment",
        order_id: orderData.id,
        handler: async (response) => {
          console.log("Payment successful with response:", response);
          console.log("Original order data:", orderData);

          try {
            // Log payment details
            console.log("Payment Response Details:", {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
              original_order_id: orderData.id,
            });

            // Since payment is successful, create the booking directly
            console.log("Payment successful, creating booking...");

            const bookingResult = await createBooking(response);

            console.log("All operations completed successfully");
            onSuccess({
              paymentData: response,
              bookingData: bookingResult,
            });
          } catch (bookingError) {
            console.error("Booking creation failed:", bookingError);

            // Payment was successful but booking failed
            onFailure({
              type: "booking_failed",
              message: "Payment successful but booking creation failed",
              error: bookingError,
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
          booking_type: "guidance_consultation",
          discussion_time: bookingData.discussionTime,
          category: bookingData.category,
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

      // Create and open Razorpay instance
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", async (response) => {
        console.error("Razorpay payment failed:", response.error);

        // Handle the failure locally without making API call
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
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full justify-center"
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

export default RazorpayPayment;
