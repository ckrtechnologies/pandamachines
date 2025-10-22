// const mongoose = require('mongoose');

// const adminSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     phoneNumber: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     userType: {
//         type: String,
//         required: true,
//         enum: ['admin', 'sub-admin'],
//     },
//     gender: {
//         type: String,
//         required: true,
//         enum: ['male', 'female', 'other'],
//     },
//     dateOfBirth: {
//         type: Date,
//         required: true,
//     },
//     address: {
//         type: String,
//         required: true,
//     },
//     nationality: {
//         type: String,
//         required: true,
//     },
//     profilePic: {
//         type: String,
//         required: true
//     }
// });

// module.exports = mongoose.model('Admin', adminSchema);

const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "sub-admin"],
  },
  userType: {
    type: String,
    required: true,
    enum: ["admin", "sub-admin"],
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    required: true,
  },

  permissions: {
    dashboard: { type: Boolean, default: false },
    categories: { type: Boolean, default: false },
    subCategories: { type: Boolean, default: false },
    tier3Categories: { type: Boolean, default: false },
    products: { type: Boolean, default: false },
    orders: { type: Boolean, default: false },
    customers: { type: Boolean, default: false },
    suppliers: { type: Boolean, default: false },
    guideBookings: { type: Boolean, default: false },
    appBanners: { type: Boolean, default: false },
    allBlogs: { type: Boolean, default: false },
    inquiry: { type: Boolean, default: false },
    ourStaffs: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false },
    reports: { type: Boolean, default: false },
    buyingGuide: { type: Boolean, default: false },
    career: { type: Boolean, default: false },
    testimonial: { type: Boolean, default: false },
  },
});

adminSchema.pre("save", function (next) {
  if (this.role && !this.userType) {
    this.userType = this.role;
  } else if (this.userType && !this.role) {
    this.role = this.userType;
  }

  if (this.role === "admin") {
    this.permissions = {
      dashboard: true,
      categories: true,
      subCategories: true,
      tier3Categories: true,
      products: true,
      orders: true,
      customers: true,
      suppliers: true,
      guideBookings: true,
      appBanners: true,
      allBlogs: true,
      inquiry: true,
      ourStaffs: true,
      analytics: true,
      reports: true,
      buyingGuide: true,
      career: true,
      testimonial: true,
    };
  } else if (this.role === "sub-admin") {
    this.permissions = {
      dashboard: true,
      categories: true,
      subCategories: true,
      tier3Categories: true,
      products: true,
      inquiry: true,
      orders: false,
      customers: false,
      suppliers: false,
      guideBookings: false,
      appBanners: false,
      allBlogs: false,
      ourStaffs: false,
      analytics: false,
      reports: false,
      buyingGuide: false,
      career: false,
      testimonial: false,
    };
  }

  next();
});

module.exports = mongoose.model("Admin", adminSchema);
