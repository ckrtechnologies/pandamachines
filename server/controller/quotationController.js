const Quotation = require("../model/quotation");

exports.createQuotation = async (req, res) => {
  try {
    const {
      fullName,
      mobNumber,
      email,
      address,
      subject,
      category,
      subCategory,
      subSubCategory,
      product,
    } = req.body;

    const quotation = new Quotation({
      fullName,
      mobNumber,
      email,
      address,
      subject,
      category,
      subCategory,
      subSubCategory,
      product,
    });

    await quotation.save();

    res.status(201).json({
      success: true,
      message: "Quotation created successfully",
      data: quotation,
    });
  } catch (error) {
    console.error("Error creating quotation:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("subSubCategory", "name")
      .populate("product", "name");

    res.status(200).json({
      success: true,
      data: quotations,
    });
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("subSubCategory", "name")
      .populate("product", "name");

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    console.error("Error fetching quotation:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deleteQuotation = async (req, res) => {
  try {
    const quotationId = req.params.id;

    const deletedQuotation = await Quotation.findByIdAndDelete(quotationId);

    if (!deletedQuotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quotation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quotation:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateQuotation = async (req, res) => {
  try {
    const quotationId = req.params.id;
    const updates = req.body;

    const updatedQuotation = await Quotation.findByIdAndUpdate(
      quotationId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedQuotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quotation updated successfully",
      data: updatedQuotation,
    });
  } catch (error) {
    console.error("Error updating quotation:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
