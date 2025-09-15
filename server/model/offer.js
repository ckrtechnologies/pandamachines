const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
