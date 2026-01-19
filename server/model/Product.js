const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    model: { type: String },
    price: { type: Number },
    previous_price: { type: Number },
    isDefault: { type: Boolean },
  },
  { _id: false },
);

// Price By Measurement Schema
const priceByMeasurementSchema = new mongoose.Schema(
  {
    measurement: { type: String },
    price: { type: Number },
    previous_price: { type: Number },
  },
  { _id: false },
);

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

    status: {
      type: String,
      enum: ["pending", "approved", "cancel"],
      default: "pending",
    },

    reason: { type: String, trim: true },

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

    warranty: {
      hasWarranty: { type: Boolean, default: false },
      warrantyDays: { type: String, default: "0 days" },
    },

    automaticGrade: { type: String },
    controlSystem: { type: String },
    productType: { type: String },
    material: { type: String },
    energyConsumption: { type: String },

    tradeInfo: {
      paymentTerms: { type: String },
      deliveryTime: { type: String },
      supplyAbility: { type: String },
      mainDomesticMarket: { type: String },
    },

    hasVariants: { type: Boolean, default: false },

    variants: {
      type: [variantSchema],
      default: [],
    },

    // Size Type
    size_type: {
      type: String,
      enum: ["single", "multiple"],
      required: true,
      default: "single",
    },

    // Single Price Fields
    price: { type: Number },
    previous_price: { type: Number },

    // Multiple Prices by Measurement
    price_by_measurement: [
      {
        measurementLabel: { type: String, default: "Size" },
        allPrice: {
          type: [priceByMeasurementSchema],
          default: [],
        },
      },
    ],

    isBestProduct: { type: Boolean, default: false },
    demo_video: { type: String },
    production_video: { type: String },

    uploadedBy: {
      type: String,
      enum: ["admin", "supplier"],
      default: "admin",
      required: true,
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: function () {
        return this.uploadedBy === "supplier";
      },
    },
  },
  { timestamps: true },
);

productSchema.pre("save", function (next) {
  if (!this.hasVariants) {
    // Single size type
    if (this.size_type === "single") {
      if (this.price == null) {
        return next(
          new Error("Price is required when product size_type is single"),
        );
      }
    }

    // Multiple size type
    if (this.size_type === "multiple") {
      if (
        !this.price_by_measurement ||
        this.price_by_measurement.length === 0 ||
        !this.price_by_measurement[0].allPrice ||
        this.price_by_measurement[0].allPrice.length === 0
      ) {
        return next(
          new Error(
            "price_by_measurement is required when product size_type is multiple",
          ),
        );
      }
    }
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);

// const mongoose = require("mongoose");

// const variantSchema = new mongoose.Schema(
//   {
//     model: { type: String },
//     price: { type: Number },
//     previous_price: { type: Number },
//     isDefault: { type: Boolean },
//   },
//   { _id: false },
// );

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
//     brandStatus: { type: Boolean, default: false },

//     images: [{ type: String }],

//     ratings: { type: Number, min: 1, max: 5, default: 0 },
//     features: [{ type: String }],

//     status: {
//       type: String,
//       enum: ["pending", "approved", "cancel"],
//       default: "pending",
//     },

//     reason: { type: String, trim: true },

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

//     warranty: {
//       hasWarranty: { type: Boolean, default: false },
//       warrantyDays: { type: String, default: "0 days" },
//     },

//     automaticGrade: { type: String },
//     controlSystem: { type: String },
//     productType: { type: String },
//     material: { type: String },
//     energyConsumption: { type: String },

//     tradeInfo: {
//       paymentTerms: { type: String },
//       deliveryTime: { type: String },
//       supplyAbility: { type: String },
//       mainDomesticMarket: { type: String },
//     },

//     hasVariants: { type: Boolean, default: false },

//     variants: {
//       type: [variantSchema],
//       default: [],
//     },
//     price: { type: Number },
//     previous_price: { type: Number },

//     isBestProduct: { type: Boolean, default: false },
//     demo_video: { type: String },
//     production_video: { type: String },

//     uploadedBy: {
//       type: String,
//       enum: ["admin", "supplier"],
//       default: "admin",
//       required: true,
//     },

//     supplier: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Supplier",
//       required: function () {
//         return this.uploadedBy === "supplier";
//       },
//     },
//   },
//   { timestamps: true },
// );

// productSchema.pre("save", function (next) {
//   if (!this.hasVariants && this.price == null) {
//     return next(new Error("Price is required when product has no variants"));
//   }
//   next();
// });

// module.exports = mongoose.model("Product", productSchema);

// // const mongoose = require("mongoose");

// // const productSchema = new mongoose.Schema(
// //   {
// //     pm_id: { type: String, required: true, unique: true },
// //     name: { type: String, required: true },
// //     description: { type: String, required: true },
// //     category: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "Category",
// //       required: true,
// //     },
// //     subCategory: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "SubCategory",
// //       required: true,
// //     },
// //     subSubCategory: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "SubSubCategory",
// //       required: true,
// //     },
// //     brand: { type: String, required: true },
// //     brandStatus: { type: Boolean, default: false },
// //     images: [{ type: String }],
// //     ratings: { type: Number, min: 1, max: 5, default: 0 },
// //     features: [{ type: String }],
// //     status: {
// //       type: String,
// //       enum: ["pending", "approved", "cancel"],
// //       default: "pending",
// //     },
// //     reason: {
// //       type: String,
// //       trim: true,
// //     },

// //     stock_status: {
// //       type: String,
// //       enum: ["active", "inactive", "out of stock"],
// //       default: "active",
// //     },
// //     return_policy: { type: String },
// //     gstPercentage: { type: Number, required: true },
// //     extraTaxPercentage: { type: Number },
// //     shippingCharge: { type: Number, required: true },
// //     measurement: { type: String },

// //     // Warranty fields
// //     warranty: {
// //       hasWarranty: { type: Boolean, default: false },
// //       warrantyDays: { type: String, default: "0 days" },
// //     },

// //     // Fields from the image
// //     automaticGrade: { type: String },
// //     controlSystem: { type: String },
// //     productType: { type: String },
// //     material: { type: String },
// //     energyConsumption: { type: String },

// //     // Trade Information fields
// //     tradeInfo: {
// //       paymentTerms: { type: String },
// //       deliveryTime: { type: String },
// //       supplyAbility: { type: String },
// //       mainDomesticMarket: { type: String },
// //     },

// //     price: { type: Number, required: true },
// //     previous_price: { type: Number, required: true },
// //     isBestProduct: { type: Boolean, default: false },
// //     uploadedBy: {
// //       type: String,
// //       enum: ["admin", "supplier"],
// //       required: true,
// //       default: "admin",
// //     },
// //     supplier: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "Supplier",
// //       required: function () {
// //         return this.uploadedBy === "supplier";
// //       },
// //     },
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("Product", productSchema);
