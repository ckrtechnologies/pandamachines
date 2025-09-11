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
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
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
      enum: ["Retail", "Wholesale", "Manufacturer", "Service", "Other"],
    },
    businessRegistrationName: {
      type: String,
      required: true,
      trim: true,
    },
    panNo: {
      type: String,
      required: true,
      uppercase: true,
      validate: {
        validator: function (v) {
          return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid PAN number!`,
      },
    },
    gstIn: {
      type: String,
      uppercase: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid GSTIN!`,
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
    otherDocuments: [
      {
        name: String,
        filePath: String,
      },
    ],

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    adminType: {
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
