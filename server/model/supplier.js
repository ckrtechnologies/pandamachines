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
    commission: {
      type: Number,
      required: true,
      enum: [5, 10, 15, 20, 30],
      default: 20,
    },
    bulkOrderCommission: {
      type: Number,
      min: 0,
      max: 50,
      default: 0,
      validate: {
        validator: function (value) {
          return value >= 0 && value <= 50;
        },
        message: "Bulk order commission must be between 0 and 50",
      },
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
    role: {
      type: String,
      enum: ["supplier"],
      default: "supplier",
      required: true,
    },
    userType: {
      type: String,
      enum: ["supplier"],
      default: "supplier",
      required: true,
    },
    permissions: {
      "supplier-dashboard": { type: Boolean, default: true },
      "supplier-categories": { type: Boolean, default: true },
      "supplier-subCategories": { type: Boolean, default: true },
      "supplier-tier3Categories": { type: Boolean, default: true },
      "supplier-products": { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

supplierSchema.pre("save", function (next) {
  if (this.role && !this.userType) {
    this.userType = this.role;
  } else if (this.userType && !this.role) {
    this.role = this.userType;
  }
  next();
});

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
