// const Admin = require("../model/admin");

// // Create a new admin
// exports.createAdmin = async (req, res) => {
//   try {
//     const admin = new Admin(req.body);
//     await admin.save();
//     res.status(201).json({ success: true, data: admin });
//   } catch (err) {
//     res.status(400).json({ success: false, error: err.message });
//   }
// };

// // Get all admins
// exports.getAllAdmins = async (req, res) => {
//   try {
//     const admins = await Admin.find();
//     res.status(200).json({ success: true, data: admins });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Get a single admin by ID
// exports.getAdminById = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.params.id);
//     if (!admin) {
//       return res.status(404).json({ success: false, error: "Admin not found" });
//     }
//     res.status(200).json({ success: true, data: admin });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Update admin
// exports.updateAdmin = async (req, res) => {
//   try {
//     const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!admin) {
//       return res.status(404).json({ success: false, error: "Admin not found" });
//     }
//     res.status(200).json({ success: true, data: admin });
//   } catch (err) {
//     res.status(400).json({ success: false, error: err.message });
//   }
// };

// // Delete admin
// exports.deleteAdmin = async (req, res) => {
//   try {
//     const admin = await Admin.findByIdAndDelete(req.params.id);
//     if (!admin) {
//       return res.status(404).json({ success: false, error: "Admin not found" });
//     }
//     res.status(200).json({ success: true, message: "Admin deleted" });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Admin login by phone number
// exports.loginByPhone = async (req, res) => {
//   const { phoneNumber } = req.body;

//   if (!phoneNumber) {
//     return res
//       .status(400)
//       .json({ success: false, error: "Phone number is required" });
//   }

//   try {
//     const admin = await Admin.findOne({ phoneNumber });

//     if (!admin) {
//       return res.status(404).json({ success: false, error: "Admin not found" });
//     }

//     // Simulate login (token can be added here if needed)
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: admin,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

const Admin = require("../model/admin");

exports.createAdmin = async (req, res) => {
  try {
    const { permissions, ...adminData } = req.body;

    const admin = new Admin({
      ...adminData,
      ...(permissions && { permissions }),
    });

    await admin.save();
    res.status(201).json({ success: true, data: admin });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ success: true, data: admins });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a single admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update admin (with permissions handling)
exports.updateAdmin = async (req, res) => {
  try {
    const { permissions, ...updateData } = req.body;

    const updateObject = { ...updateData };
    if (permissions) {
      updateObject.permissions = permissions;
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, updateObject, {
      new: true,
      runValidators: true,
    });

    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }
    res.status(200).json({ success: true, message: "Admin deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.loginByPhone = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res
      .status(400)
      .json({ success: false, error: "Phone number is required" });
  }

  try {
    const admin = await Admin.findOne({ phoneNumber });

    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: admin,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update admin permissions specifically
exports.updateAdminPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    admin.permissions = {
      ...admin.permissions,
      ...permissions,
    };

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Permissions updated successfully",
      data: admin,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
