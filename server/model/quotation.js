const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobNumber: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: false },
    state: { type: String, required: false },
    subject: { type: String, required: false },
    referral: {
      type: String,
      required: false,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
      required: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: false,
    },
    subSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSubCategory",
      required: false,
    },

    products: [
      {
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
        subCategory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubCategory",
          required: true,
        },
        subSubCategory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubSubCategory",
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quotation", quotationSchema);

// const mongoose = require("mongoose");

// const quotationSchema = new mongoose.Schema(
//   {
//     fullName: { type: String, required: true },
//     mobNumber: { type: String, required: true },
//     email: { type: String, required: true },
//     address: { type: String, required: false },
//     subject: { type: String, required: false },
//     referral: {
//       type: String,
//       required: false,
//     },

//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: false,
//     },
//     quantity: {
//       type: Number,
//       default: 1,
//       min: 1,
//       required: false,
//     },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: false,
//     },
//     subCategory: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubCategory",
//       required: false,
//     },
//     subSubCategory: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubSubCategory",
//       required: false,
//     },

//     products: [
//       {
//         category: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Category",
//           required: true,
//         },
//         subCategory: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "SubCategory",
//           required: true,
//         },
//         subSubCategory: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "SubSubCategory",
//           required: true,
//         },
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           default: 1,
//           min: 1,
//         },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Quotation", quotationSchema);
