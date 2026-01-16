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

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ success: true, data: admins });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllStaff = async (req, res) => {
  try {
    const staffUsers = await Admin.find({ userType: "staff" });

    res.status(200).json({
      success: true,
      data: staffUsers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

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

exports.updateAdmin = async (req, res) => {
  try {
    const { userType, permissions, ...otherFields } = req.body;
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }
    if (userType && userType !== admin.userType) {
      admin.userType = userType;
      if (userType === "admin") {
        admin.permissions = {
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
          allOffers: false,
          staffManagement: false,
          p_approve: false,
        };
      } else if (userType === "staff") {
        admin.permissions = {
          dashboard: false,
          categories: false,
          subCategories: false,
          tier3Categories: false,
          products: false,
          orders: false,
          customers: false,
          suppliers: false,
          guideBookings: false,
          appBanners: false,
          allBlogs: false,
          inquiry: false,
          ourStaffs: false,
          allOffers: false,
          staffManagement: false,
          p_approve: false,
        };
      }
    }
    if (permissions) {
      admin.permissions = permissions;
    }
    Object.assign(admin, otherFields);
    await admin.save();

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

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

exports.updatePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;

    console.log("permissions", permissions);

    if (!permissions) {
      return res.status(400).json({
        success: false,
        error: "Permissions are required",
      });
    }
    const allPermissions = {
      dashboard: false,
      categories: false,
      subCategories: false,
      tier3Categories: false,
      products: false,
      orders: false,
      customers: false,
      suppliers: false,
      guideBookings: false,
      appBanners: false,
      allBlogs: false,
      inquiry: false,
      ourStaffs: false,
      allOffers: false,
      staffManagement: false,
      p_approve: false,
    };
    for (let key in permissions) {
      allPermissions[key] = permissions[key];
    }

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { permissions: allPermissions },
      { new: true, runValidators: true }
    );

    if (!admin) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Permissions updated successfully",
      data: admin,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};
