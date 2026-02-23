// const mongoose = require("mongoose");

// const guidanceBookingSchema = new mongoose.Schema(
//   {
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },
//     subCategory: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubCategory",
//       required: true,
//     },
//     subSubCategory: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubSubCategory",
//     },
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },

//     investmentAmount: { type: Number, required: true },

//     fullName: { type: String, required: true },
//     mobileNumber: { type: String, required: true },
//     email: { type: String },

//     discussionTime: {
//       type: String,
//       enum: ["30 mins", "60 mins", "Full Day", "Until Project Completion"],
//       required: true,
//     },
//     discussionFee: { type: Number, required: true },

//     date: { type: Date, required: true },
//     time: { type: String, required: true },
//     status: {
//       type: String,
//       enum: ["pending", "completed", "rejected"],
//       default: "pending",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("GuidanceBooking", guidanceBookingSchema);

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

    investmentAmount: { type: Number },

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
