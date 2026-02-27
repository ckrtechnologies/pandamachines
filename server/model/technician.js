const mongoose = require("mongoose");

const technicianSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    whatsappNumber: {
      type: String,
      match: /^[0-9]{10}$/,
    },
    operatorName: {
      type: String,
      required: true,
      trim: true,
    },
    expectedSalaryMin: {
      type: Number,
      required: true,
      min: 0,
    },
    expectedSalaryMax: {
      type: Number,
      required: true,
      min: 0,
    },
    aadharFront: {
      type: String, // URL from frontend
      required: true,
    },
    aadharBack: {
      type: String, // URL from frontend
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Technician", technicianSchema);