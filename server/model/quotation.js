const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobNumber: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    subject: { type: String, required: true },

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
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quotation", quotationSchema);
