const Supplier = require("../model/supplier");

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.supplierRegister = async (req, res) => {
  try {
    const {
      fullName,
      mobNo,
      emailId,
      gender,
      address,
      businessName,
      businessType,
      businessRegistrationName,
      panNo,
      gstIn,
      shopImage,
      panImage,
      addressProof,
      ownerIdProof,
      gstCertificate,
      otherDocuments,
    } = req.body;

    const existingSupplier = await Supplier.findOne({
      $or: [{ emailId: emailId.toLowerCase() }, { mobNo: mobNo }],
    });

    if (existingSupplier) {
      return res.status(400).json({
        success: false,
        error: "Supplier with this email or mobile number already exists",
      });
    }

    const supplierData = {
      fullName,
      mobNo,
      emailId: emailId.toLowerCase(),
      gender,
      address,
      businessName,
      businessType,
      businessRegistrationName,
      panNo: panNo.toUpperCase(),
      gstIn: gstIn ? gstIn.toUpperCase() : undefined,
      shopImage,
      panImage,
      addressProof,
      ownerIdProof,
      gstCertificate,
      otherDocuments: otherDocuments || [],
      status: "Pending",
      adminType: "supplier",
    };

    const supplier = new Supplier(supplierData);
    await supplier.save();

    res.status(201).json({
      success: true,
      message: "Supplier registered successfully. Waiting for approval.",
      data: supplier,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: errors.join(", "),
      });
    }
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Email ID already exists",
      });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.supplierLogin = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      error: "Phone number is required",
    });
  }

  try {
    const supplier = await Supplier.findOne({
      mobNo: phoneNumber,
    });

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: "Supplier not found",
      });
    }

    if (supplier.status !== "Approved") {
      return res.status(403).json({
        success: false,
        error:
          "Your registration is pending approval. Please wait for admin approval.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: supplier,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid supplier ID",
      });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

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
      { new: true, runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Supplier status updated to ${status}`,
      data: supplier,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid supplier ID",
      });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.editSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    if (updateData.emailId) {
      updateData.emailId = updateData.emailId.toLowerCase();
    }

    if (updateData.panNo) {
      updateData.panNo = updateData.panNo.toUpperCase();
    }

    if (updateData.gstIn) {
      updateData.gstIn = updateData.gstIn.toUpperCase();
    }

    const supplier = await Supplier.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: supplier,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid supplier ID",
      });
    }
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: errors.join(", "),
      });
    }
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Email ID already exists",
      });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
      data: supplier,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid supplier ID",
      });
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

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
