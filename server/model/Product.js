const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    pm_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    subSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSubCategory",
      required: true,
    },
    brand: { type: String, required: true },
    brandStatus: { type: Boolean, default: false },
    images: [{ type: String }],
    ratings: { type: Number, min: 1, max: 5, default: 0 },
    features: [{ type: String }],

    // Add status field here
    status: {
      type: String,
      enum: ["pending", "approved", "cancel"],
      default: "pending",
    },

    stock_status: {
      type: String,
      enum: ["active", "inactive", "out of stock"],
      default: "active",
    },
    return_policy: { type: String },
    gstPercentage: { type: Number, required: true },
    extraTaxPercentage: { type: Number },
    shippingCharge: { type: Number, required: true },
    measurement: { type: String },

    // Warranty fields
    warranty: {
      hasWarranty: { type: Boolean, default: false },
      warrantyDays: { type: String, default: "0 days" },
    },

    // Fields from the image
    automaticGrade: { type: String },
    controlSystem: { type: String },
    productType: { type: String },
    material: { type: String },
    energyConsumption: { type: String },

    // Trade Information fields
    tradeInfo: {
      paymentTerms: { type: String },
      deliveryTime: { type: String },
      supplyAbility: { type: String },
      mainDomesticMarket: { type: String },
    },

    price: { type: Number, required: true },
    previous_price: { type: Number, required: true },
    isBestProduct: { type: Boolean, default: false },
    uploadedBy: {
      type: String,
      enum: ["admin", "supplier"],
      required: true,
      default: "admin",
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: function () {
        return this.uploadedBy === "supplier";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema(
//   {
//     pm_id: { type: String, required: true, unique: true },
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },
//     subCategory: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubCategory",
//       required: true,
//     },
//     subSubCategory: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubSubCategory",
//       required: true,
//     },
//     brand: { type: String, required: true },
//     images: [{ type: String }],
//     ratings: { type: Number, min: 1, max: 5, default: 0 },
//     features: [{ type: String }],
//     stock_status: {
//       type: String,
//       enum: ["active", "inactive", "out of stock"],
//       default: "active",
//     },
//     return_policy: { type: String },
//     gstPercentage: { type: Number, required: true },
//     extraTaxPercentage: { type: Number },
//     shippingCharge: { type: Number, required: true },
//     measurement: { type: String },

//     // Warranty fields
//     warranty: {
//       hasWarranty: { type: Boolean, default: false },
//       warrantyDays: { type: String, default: "0 days" },
//     },

//     // Fields from the image
//     automaticGrade: { type: String },
//     controlSystem: { type: String },
//     productType: { type: String },
//     material: { type: String },
//     energyConsumption: { type: String },

//     // Trade Information fields
//     tradeInfo: {
//       paymentTerms: { type: String },
//       deliveryTime: { type: String },
//       supplyAbility: { type: String },
//       mainDomesticMarket: { type: String },
//     },

//     price: { type: Number, required: true },
//     previous_price: { type: Number, required: true },
//     isBestProduct: { type: Boolean, default: false },
//     uploadedBy: {
//       type: String,
//       enum: ["admin", "supplier"],
//       required: true,
//       default: "admin",
//     },
//     supplier: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Supplier",
//       required: function () {
//         return this.uploadedBy === "supplier";
//       },
//     },
//   },

//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", productSchema);
