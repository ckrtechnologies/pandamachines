// const mongoose = require("mongoose");

// const chatBotInquirySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//       trim: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     message: {
//       type: String,
//       default: "I want to know more about this product.",
//       trim: true,
//     },
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("ChatBotInquiry", chatBotInquirySchema);

const mongoose = require("mongoose");

const chatBotInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: "I want to know more about this product.",
      trim: true,
    },
    product: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatBotInquiry", chatBotInquirySchema);
