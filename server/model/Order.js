const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },

  groupOrderId: {
    type: String,
    required: true,
    index: true,
  },

  razorpayId: {
    type: String,
    default: null,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    default: null,
  },

  sellerType: {
    type: String,
    enum: ["admin", "supplier"],
    default: "admin",
  },

  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      quantity: Number,

      // SNAPSHOTS
      productName: String,
      productImage: String,
      brand: String,

      price: Number,
      gst: Number,
      extraTax: Number,
      shippingCharge: Number,

      size: String,
      variantModel: String,

      sellerId: mongoose.Schema.Types.ObjectId,
      sellerType: String,
    },
  ],

  pricing: {
    subtotal: Number,
    gstTotal: Number,
    extraTaxTotal: Number,
    shippingTotal: Number,
    grandTotal: Number,
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "Rzrpay"],
    default: "COD",
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded", "Partially Refunded"],
    default: "Pending",
  },

  orderStatus: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
    ],
    default: "Pending",
  },

  exchangeRequest: {
    isRequested: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        "Requested",
        "Approved",
        "Completed",
        "Rejected",
      ],
      default: null,
    },

    reason: String,

    requestedAt: Date,
    approvedAt: Date,
    completedAt: Date,
    rejectedAt: Date,
  },

  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },

  pod_img_url: String,
}, { timestamps: true });

orderSchema.index({ user: 1 });
orderSchema.index({ sellerId: 1 });
orderSchema.index({ groupOrderId: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    const date = new Date();

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const shortUUID = uuidv4()
      .replace(/-/g, "")
      .slice(0, 6)
      .toUpperCase();

    this.orderId = `ORD-${yyyy}${mm}${dd}-${shortUUID}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
