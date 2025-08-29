const mongoose = require("mongoose");

const subSubCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imgUrl: { type: String, required: false },
    description: { type: String, required: true },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubSubCategory", subSubCategorySchema);
