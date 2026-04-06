const mongoose = require("mongoose");

// Variants Schema
const variantSchema = new mongoose.Schema(
  {
    model: { type: String, trim: true },
    price: { type: Number },
    previous_price: { type: Number },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

// Price By Measurement Schema
const priceByMeasurementSchema = new mongoose.Schema(
  {
    measurement: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    previous_price: { type: Number },
  },
  { _id: false }
);

// How To Buy Step Schema
const howToBuyStepSchema = new mongoose.Schema(
  {
    stepNo: { type: Number },

    title: { type: String, trim: true, maxlength: 80 },
    desc: { type: String, trim: true, maxlength: 250 },

    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

// Product Schema
const productSchema = new mongoose.Schema(
  {
    pm_id: { type: String, required: true, unique: true, trim: true },

    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

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

    brand: { type: String, required: true, trim: true },
    brandStatus: { type: Boolean, default: false },

    images: [{ type: String }],

    ratings: { type: Number, min: 0, max: 5, default: 0 },
    features: [{ type: String, trim: true }],

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

    return_policy: { type: String, trim: true },

    gstPercentage: { type: Number, required: true },
    extraTaxPercentage: { type: Number, default: 0 },
    shippingType: {
      type: String,
      enum: ["free", "extra", "actual"],
      default: "free",
      required: true,
    },
    shippingCharge: { type: Number, default: 0 },

    measurement: { type: String, trim: true },

    warranty: {
      hasWarranty: { type: Boolean, default: false },
      warrantyDays: { type: String, default: "0 days", trim: true },
    },

    automaticGrade: { type: String, trim: true },
    controlSystem: { type: String, trim: true },
    productType: { type: String, trim: true },
    material: { type: String, trim: true },
    energyConsumption: { type: String, trim: true },

    tradeInfo: {
      paymentTerms: { type: String, trim: true },
      deliveryTime: { type: String, trim: true },
      supplyAbility: { type: String, trim: true },
      mainDomesticMarket: { type: String, trim: true },
    },

    // How to Buy Steps
    howToBuy: {
      enabled: { type: Boolean, default: true },
      showLimit: { type: Number, default: 4 },

      steps: {
        type: [howToBuyStepSchema],
        default: [],
      },
    },

    // Variants Support
    hasVariants: { type: Boolean, default: false },

    variants: {
      type: [variantSchema],
      default: [],
    },

    // Price Type
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
        measurementLabel: { type: String, default: "Size", trim: true },
        allPrice: {
          type: [priceByMeasurementSchema],
          default: [],
        },
      },
    ],

    isBestProduct: { type: Boolean, default: false },
    demo_video: { type: String, trim: true },
    production_video: { type: String, trim: true },

    product_banner: {
      type: String,
    },

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
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  // HowToBuy validation
  if (this.howToBuy?.enabled) {
    const activeSteps =
      this.howToBuy.steps?.filter((s) => s.isActive !== false) || [];

    if (activeSteps.length === 0) {
      return next(
        new Error("How to Buy steps are required when howToBuy is enabled")
      );
    }

    // Sort steps by stepNo
    this.howToBuy.steps = this.howToBuy.steps.sort(
      (a, b) => a.stepNo - b.stepNo
    );

    // Prevent duplicate stepNo
    const stepNos = this.howToBuy.steps.map((s) => s.stepNo);
    const uniqueStepNos = new Set(stepNos);

    if (stepNos.length !== uniqueStepNos.size) {
      return next(
        new Error("Duplicate stepNo is not allowed in howToBuy.steps")
      );
    }
  }

  // Variant validation
  if (this.hasVariants) {
    if (!this.variants || this.variants.length === 0) {
      return next(new Error("Variants are required when hasVariants is true"));
    }
  }

  // Price validations only when hasVariants is false
  if (!this.hasVariants) {
    // Single size type
    if (this.size_type === "single") {
      if (this.price == null) {
        return next(
          new Error("Price is required when product size_type is single")
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
            "price_by_measurement is required when product size_type is multiple"
          )
        );
      }
    }
  }

  next();
});

productSchema.index({ status: 1 });
productSchema.index({ name: "text", brand: "text" });

module.exports = mongoose.model("Product", productSchema);
