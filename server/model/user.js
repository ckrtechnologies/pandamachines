const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    imageUrl: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    phone: { type: String, required: true, unique: true },
    email: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
