const Inquiry = require("../model/Inquiry");

exports.createInquiry = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const inquiry = new Inquiry({ name, phone, email });
    await inquiry.save();

    res.status(201).json({
      message: "Inquiry created successfully",
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// New controller to update inquiry status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({
        message: "Status must be either 'pending' or 'completed'",
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json({
      message: "Inquiry status updated successfully",
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Optional: Get inquiries by status
exports.getInquiriesByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({
        message: "Status must be either 'pending' or 'completed'",
      });
    }

    const inquiries = await Inquiry.find({ status }).sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
