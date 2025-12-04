const LiveChatUser = require("../model/liveChatUser");

// Create Inquiry
exports.createInquiry = async (req, res) => {
  try {
    const { name, phone, email, product, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, product, and message are required",
      });
    }

    const inquiry = new LiveChatUser({
      name,
      phone,
      email: email || "",
      product,
      message,
    });

    await inquiry.save();

    res.status(201).json({
      success: true,
      message: "Inquiry created successfully",
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating inquiry",
      error: error.message,
    });
  }
};

// Get All Inquiries
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await LiveChatUser.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching inquiries",
      error: error.message,
    });
  }
};

// Get Inquiry by ID
exports.getInquiryById = async (req, res) => {
  try {
    const inquiry = await LiveChatUser.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching inquiry",
      error: error.message,
    });
  }
};

// Update Inquiry
exports.updateInquiry = async (req, res) => {
  try {
    const { name, phone, email, product, message } = req.body;

    const inquiry = await LiveChatUser.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, product, message },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inquiry updated successfully",
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating inquiry",
      error: error.message,
    });
  }
};
