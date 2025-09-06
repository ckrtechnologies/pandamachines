const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    mobNo: {
      type: String,
      required: true,
      unique: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    businessType: {
      type: String,
      required: true,
    },
    businessRegistrationName: {
      type: String,
      required: true,
      trim: true,
    },
    panNo: {
      type: String,
      required: true,
      unique: true,
    },
    gstIn: {
      type: String,
      required: true,
      unique: true,
    },
    shopImage: {
      type: String,
      required: true,
    },
    panImage: {
      type: String,
    },
    addressProof: {
      type: String,
    },
    ownerIdProof: {
      type: String,
    },
    gstCertificate: {
      type: String,
    },
    otherDocuments: [String],
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    userType: {
      type: String,
      enum: ["supplier"],
      default: "supplier",
      required: true,
    },
  },
  { timestamps: true }
);

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
