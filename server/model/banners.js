const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    imgUrl: {
      type: String,
      required: true,
    },

    bannerType: {
      type: String,
      enum: ["main-banner", "small-banner"],
      default: "main-banner",
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Banner", bannerSchema);