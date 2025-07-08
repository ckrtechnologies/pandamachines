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
      default: 'main-banner',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
