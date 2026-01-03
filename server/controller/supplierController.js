const Supplier = require("../model/supplier");
const Category = require("../model/Category");

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate("businessType.categories", "name sequence description")
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: suppliers.length, data: suppliers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.supplierRegister = async (req, res) => {
  try {
    const {
      permissions,
      mobNo,
      emailId,
      commission,
      bulkOrderCommission,
      ...supplierData
    } = req.body;

    if (!commission || ![5, 10, 15, 20, 30, 40].includes(commission)) {
      return res.status(400).json({
        success: false,
        error: "Commission must be one of: 5, 10, 15, 20, 30, 40",
      });
    }
    if (
      bulkOrderCommission &&
      (bulkOrderCommission < 0 || bulkOrderCommission > 50)
    ) {
      return res.status(400).json({
        success: false,
        error: "Bulk order commission must be between 0 and 50",
      });
    }
    if (!supplierData.businessType) {
      return res.status(400).json({
        success: false,
        error: "Business type is required",
      });
    }

    const { businessType } = supplierData;
    if (
      !businessType.categories ||
      !Array.isArray(businessType.categories) ||
      businessType.categories.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "At least one category must be selected",
      });
    }

    if (businessType.hasOther && !businessType.otherType) {
      return res.status(400).json({
        success: false,
        error: "Please specify the business type when selecting 'Other'",
      });
    }

    if (!businessType.hasOther && businessType.otherType) {
      return res.status(400).json({
        success: false,
        error:
          "Cannot specify other business type without selecting 'Other' option",
      });
    }

    const categories = await Category.find({
      _id: { $in: businessType.categories },
    });
    if (categories.length !== businessType.categories.length) {
      return res.status(400).json({
        success: false,
        error: "One or more selected categories are invalid",
      });
    }

    const existingMobile = await Supplier.findOne({ mobNo });
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        error:
          "Mobile number already registered. Please use a different number.",
      });
    }

    const existingEmail = await Supplier.findOne({ emailId });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        error:
          "Email address already registered. Please use a different email.",
      });
    }

    const supplier = new Supplier({
      mobNo,
      emailId,
      commission,
      bulkOrderCommission: bulkOrderCommission || 0,
      ...supplierData,
      ...(permissions && { permissions }),
    });

    await supplier.save();

    let successMessage = `Supplier registered successfully with ${commission}% commission`;
    if (bulkOrderCommission > 0) {
      successMessage += ` and ${bulkOrderCommission}% extra commission on bulk orders`;
    }

    res.status(201).json({
      success: true,
      message: successMessage,
      data: supplier,
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      let errorMessage = `${field} already exists.`;

      if (field === "mobNo") {
        errorMessage =
          "Mobile number already registered. Please use a different number.";
      } else if (field === "emailId") {
        errorMessage =
          "Email address already registered. Please use a different email.";
      }

      return res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }

    res.status(400).json({ success: false, error: err.message });
  }
};

exports.supplierLogin = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res
        .status(400)
        .json({ success: false, error: "Phone number is required" });
    }

    const supplier = await Supplier.findOne({ mobNo: phoneNumber });

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: "Your number is not Registered, Please Register first.",
      });
    }
    if (supplier.isBlocked) {
      return res.status(403).json({
        success: false,
        error: "Your account has been blocked. Please contact admin.",
        reason: supplier.blockReason || "No reason provided",
      });
    }

    if (supplier.status === "Rejected") {
      return res.status(403).json({
        success: false,
        error: "Your registration has been rejected. Please contact admin.",
        reason: supplier.rejectionReason || "No reason provided",
      });
    }

    if (supplier.status !== "Approved") {
      return res.status(403).json({
        success: false,
        error:
          "Your registration is pending approval. Please wait for admin approval.",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Login successful", data: supplier });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate(
      "businessType.categories",
      "name sequence description"
    );

    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, error: "Supplier not found" });
    }

    res.status(200).json({ success: true, data: supplier });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid supplier ID" });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateSupplierStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Status must be one of: Pending, Approved, Rejected",
      });
    }
    const updateData = { status };
    if (status === "Rejected") {
      if (reason && reason.trim() !== "") {
        updateData.rejectionReason = reason.trim();
      }
      updateData.isBlocked = false;
      updateData.blockReason = undefined;
    } else {
      updateData.rejectionReason = undefined;
    }

    const supplier = await Supplier.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, error: "Supplier not found" });
    }

    let message = `Supplier status updated to ${status}`;
    if (status === "Rejected" && reason) {
      message += ` with reason: ${reason}`;
    }

    res.status(200).json({
      success: true,
      message,
      data: supplier,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid supplier ID" });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.editSupplier = async (req, res) => {
  try {
    const { permissions, commission, bulkOrderCommission, ...updateData } =
      req.body;
    if (commission && ![5, 10, 15, 20, 30, 40].includes(commission)) {
      return res.status(400).json({
        success: false,
        error: "Commission must be one of: 5, 10, 15, 20, 30, 40",
      });
    }
    if (
      bulkOrderCommission !== undefined &&
      (bulkOrderCommission < 0 || bulkOrderCommission > 50)
    ) {
      return res.status(400).json({
        success: false,
        error: "Bulk order commission must be between 0 and 50",
      });
    }
    if (updateData.businessType) {
      const { businessType } = updateData;
      if (
        !businessType.categories ||
        !Array.isArray(businessType.categories) ||
        businessType.categories.length === 0
      ) {
        return res.status(400).json({
          success: false,
          error: "At least one category must be selected",
        });
      }

      if (businessType.hasOther && !businessType.otherType) {
        return res.status(400).json({
          success: false,
          error: "Please specify the business type when selecting 'Other'",
        });
      }
      if (!businessType.hasOther && businessType.otherType) {
        return res.status(400).json({
          success: false,
          error:
            "Cannot specify other business type without selecting 'Other' option",
        });
      }
      const categories = await Category.find({
        _id: { $in: businessType.categories },
      });
      if (categories.length !== businessType.categories.length) {
        return res.status(400).json({
          success: false,
          error: "One or more selected categories are invalid",
        });
      }
    }

    const updateObject = { ...updateData };
    if (permissions) {
      updateObject.permissions = permissions;
    }
    if (commission) {
      updateObject.commission = commission;
    }
    if (bulkOrderCommission !== undefined) {
      updateObject.bulkOrderCommission = bulkOrderCommission;
    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      updateObject,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, error: "Supplier not found" });
    }

    res.status(200).json({ success: true, data: supplier });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, error: "Supplier not found" });
    }

    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
      data: supplier,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid supplier ID" });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSuppliersByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Status must be one of: Pending, Approved, Rejected",
      });
    }

    const suppliers = await Supplier.find({ status }).sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, count: suppliers.length, data: suppliers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateSupplierPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, error: "Supplier not found" });
    }

    supplier.permissions = {
      ...supplier.permissions,
      ...permissions,
    };

    await supplier.save();

    res.status(200).json({
      success: true,
      message: "Supplier permissions updated successfully",
      data: supplier,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.blockSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const supplier = await Supplier.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
        blockReason: reason && reason.trim() !== "" ? reason.trim() : undefined,
      },
      { new: true }
    );

    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, error: "Supplier not found" });
    }

    let message = "Supplier has been blocked";
    if (reason) {
      message += ` with reason: ${reason}`;
    }

    res.status(200).json({
      success: true,
      message,
      data: supplier,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid supplier ID" });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.unblockSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
        blockReason: undefined,
      },
      { new: true }
    );

    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, error: "Supplier not found" });
    }

    res.status(200).json({
      success: true,
      message: "Supplier has been unblocked and is now active",
      data: supplier,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid supplier ID" });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.getBlockedSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ isBlocked: true }).sort({
      createdAt: -1,
    });

    res
      .status(200)
      .json({ success: true, count: suppliers.length, data: suppliers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
