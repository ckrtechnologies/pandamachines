const Supplier = require("../model/supplier");

// Get all suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
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

    // Validate commission value
    if (!commission || ![5, 10, 15, 20, 30].includes(commission)) {
      return res.status(400).json({
        success: false,
        error: "Commission must be one of: 5, 10, 15, 20, 30",
      });
    }

    // Validate bulk order commission if provided
    if (
      bulkOrderCommission &&
      (bulkOrderCommission < 0 || bulkOrderCommission > 50)
    ) {
      return res.status(400).json({
        success: false,
        error: "Bulk order commission must be between 0 and 50",
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

// Supplier login
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

// Get supplier by ID
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

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

// Update supplier status
exports.updateSupplierStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Status must be one of: Pending, Approved, Rejected",
      });
    }

    const supplier = await Supplier.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, error: "Supplier not found" });
    }

    res.status(200).json({
      success: true,
      message: `Supplier status updated to ${status}`,
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

    // Validate commission if provided
    if (commission && ![5, 10, 15, 20, 30].includes(commission)) {
      return res.status(400).json({
        success: false,
        error: "Commission must be one of: 5, 10, 15, 20, 30",
      });
    }

    // Validate bulk order commission if provided
    if (
      bulkOrderCommission !== undefined &&
      (bulkOrderCommission < 0 || bulkOrderCommission > 50)
    ) {
      return res.status(400).json({
        success: false,
        error: "Bulk order commission must be between 0 and 50",
      });
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

// Delete supplier
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

// Get suppliers by status
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

// Update supplier permissions specifically
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

    // Update permissions by merging existing with new ones
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
