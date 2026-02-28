const mongoose = require("mongoose");

const guidanceBookingSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    subSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSubCategory",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    investmentAmount: {
      type: String,
      enum: [
        "5-10 Lakh",
        "10-20 Lakh",
        "20-30 Lakh",
        "30-40 Lakh",
        "40-50 Lakh",
        "50 Lakh - 1 Cr",
        "1 Cr+",
      ],
    },

    fullName: { type: String },
    mobileNumber: { type: String },
    email: { type: String },

    discussionTime: {
      type: String,
      enum: ["30 mins", "60 mins", "Full Day", "Until Project Completion"],
    },
    discussionFee: { type: Number },

    date: { type: Date },
    time: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("GuidanceBooking", guidanceBookingSchema);
