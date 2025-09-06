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

// Register supplier
exports.supplierRegister = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json({ success: true, data: supplier });
  } catch (err) {
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
      return res
        .status(404)
        .json({
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

// Update supplier
exports.editSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
