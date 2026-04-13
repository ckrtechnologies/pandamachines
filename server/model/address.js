const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    landmark: { type: String },
    addressType: {
      type: String,
      enum: ["Home", "Work", "Other"],
      required: true
    },
    isDefault: { type: Boolean, default: false },
    coordinates: {
      type: [Number], // [lng, lat]
      index: "2dsphere",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
