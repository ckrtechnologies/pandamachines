const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },          // Per unit price
        gst: { type: Number, required: true },            // Per unit GST
        extraTax: { type: Number, required: true },       // Per unit extra tax
        shippingCharge: { type: Number, required: true }, // Per unit shipping charge
        size: { type: String },                           // Optional size field (measurement)
        variantModel: { type: String },

        // NEW — snapshot at order time, never re-derive
        sellerId: { type: mongoose.Schema.Types.ObjectId, refPath: "products.sellerType" },
        sellerType: { type: String, enum: ["admin", "supplier"], default: "admin" },
      },
    ],

    totalAmount: { type: Number, required: true },

    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },

    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    exchangeRequest: {
      isRequested: { type: Boolean, default: false },
      reason: { type: String },
      status: {
        type: String,
        enum: ["Requested", "Approved", "Rejected", "Completed"],
        default: "Requested",
      },
      requestedAt: { type: Date },
      completedAt: { type: Date },
    },

    pod_img_url: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
