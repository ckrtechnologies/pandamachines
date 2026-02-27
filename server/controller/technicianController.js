const Technician = require("../model/technician");

/**
 * Register Technician
 */
exports.registerTechnician = async (req, res) => {
  try {
    const {
      name,
      address,
      mobileNumber,
      whatsappNumber,
      operatorName,
      expectedSalaryMin,
      expectedSalaryMax,
      aadharFront,
      aadharBack,
    } = req.body;

    if (!aadharFront || !aadharBack) {
      return res.status(400).json({
        success: false,
        message: "Aadhar front and back image URLs are required",
      });
    }

    if (Number(expectedSalaryMin) > Number(expectedSalaryMax)) {
      return res.status(400).json({
        success: false,
        message: "Minimum salary cannot be greater than maximum salary",
      });
    }

    const technician = await Technician.create({
      name,
      address,
      mobileNumber,
      whatsappNumber,
      operatorName,
      expectedSalaryMin,
      expectedSalaryMax,
      aadharFront,
      aadharBack,
    });

    res.status(201).json({
      success: true,
      message: "Technician registered successfully",
      data: technician,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get technicians by status
 * Example:
 * /api/technicians?status=pending
 */
exports.getTechniciansByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {};

    const technicians = await Technician.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: technicians.length,
      data: technicians,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Change Technician Status
 * PATCH /api/technicians/:id/status
 */
exports.changeTechnicianStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["pending", "approved", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const technician = await Technician.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Technician not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Technician status updated to ${status}`,
      data: technician,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};