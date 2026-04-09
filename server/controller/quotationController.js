const { VALID_SUBJECTS } = require("../constants/quotation");
const Quotation = require("../model/quotation");
const mongoose = require("mongoose");

const generateQuotationRef = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const randomNum = Math.floor(Math.random() * 900) + 100;
  return `PM-${year}${month}${randomNum}`;
};

const validateSubject = (subject) => {
  return VALID_SUBJECTS.includes(subject);
};

exports.createQuotation = async (req, res) => {
  try {
    const {
      fullName,
      mobNumber,
      email,
      city,
      state,
      subject,
      heading,
      description,
      referral,
      category,
      subCategory,
      subSubCategory,
      product,
      quantity,
      products,
    } = req.body;

    // Validate required fields
    if (!fullName || !mobNumber || !email) {
      return res.status(400).json({
        success: false,
        message: "All personal details are required",
      });
    }



    // Validate subject if provided
    if (subject && !validateSubject(subject)) {
      return res.status(400).json({
        success: false,
        message: `Subject must be one of: ${VALID_SUBJECTS.join(", ")}`,
      });
    }

    // Validate products
    if (
      (!product || product.length === 0) &&
      (!products || products.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one product is required",
      });
    }

    if (products && products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        const productItem = products[i];
        if (
          !productItem.category ||
          !productItem.subCategory ||
          !productItem.subSubCategory ||
          !productItem.product
        ) {
          return res.status(400).json({
            success: false,
            message: `Product ${i + 1
              } is missing required category hierarchy or product reference`,
          });
        }
      }
    }

    const quotation = new Quotation({
      fullName,
      mobNumber,
      email,
      city,
      state,
      referral,
      subject,
      heading,
      description,
      category: category || null,
      subCategory: subCategory || null,
      subSubCategory: subSubCategory || null,
      quantity: quantity || 1,
      product: product || null,
      products: products || [],
      quotationRef: generateQuotationRef(),
    });

    await quotation.save();

    const populatedQuotation = await Quotation.findById(quotation._id)
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("product")
      .populate({
        path: "products.product",
        model: "Product",
      })
      .populate({
        path: "products.category",
        model: "Category",
      })
      .populate({
        path: "products.subCategory",
        model: "SubCategory",
      })
      .populate({
        path: "products.subSubCategory",
        model: "SubSubCategory",
      });

    res.status(201).json({
      success: true,
      message:
        products && products.length > 0
          ? "Quotation created successfully with multiple products"
          : "Quotation created successfully with single product",
      data: populatedQuotation,
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
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("product")
      .populate({
        path: "products.product",
        model: "Product",
      })
      .populate({
        path: "products.category",
        model: "Category",
      })
      .populate({
        path: "products.subCategory",
        model: "SubCategory",
      })
      .populate({
        path: "products.subSubCategory",
        model: "SubSubCategory",
      });

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
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("product")
      .populate({
        path: "products.product",
        model: "Product",
      })
      .populate({
        path: "products.category",
        model: "Category",
      })
      .populate({
        path: "products.subCategory",
        model: "SubCategory",
      })
      .populate({
        path: "products.subSubCategory",
        model: "SubSubCategory",
      });

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

    // Validate subject if it's being updated
    if (updates.subject && !validateSubject(updates.subject)) {
      return res.status(400).json({
        success: false,
        message: `Subject must be one of: ${VALID_SUBJECTS.join(", ")}`,
      });
    }

    // Optional: Add validation for heading/description length if needed
    if (updates.heading && updates.heading.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Heading cannot exceed 200 characters",
      });
    }

    if (updates.description && updates.description.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Description cannot exceed 1000 characters",
      });
    }

    const updatedQuotation = await Quotation.findByIdAndUpdate(
      quotationId,
      updates,
      { new: true, runValidators: true },
    )
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("product")
      .populate({
        path: "products.product",
        model: "Product",
      })
      .populate({
        path: "products.category",
        model: "Category",
      })
      .populate({
        path: "products.subCategory",
        model: "SubCategory",
      })
      .populate({
        path: "products.subSubCategory",
        model: "SubSubCategory",
      });

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

exports.createQuotationByProduct = async (req, res) => {
  try {
    const {
      fullName,
      mobNumber,
      email,
      city,
      state,
      subject,
      heading,
      description,
      product,
      quantity,
    } = req.body;

    if (!fullName || !mobNumber || !email || !product) {
      return res.status(400).json({
        success: false,
        message: "All fields including product are required",
      });
    }

    // Validate subject if provided
    if (subject && !validateSubject(subject)) {
      return res.status(400).json({
        success: false,
        message: `Subject must be one of: ${VALID_SUBJECTS.join(", ")}`,
      });
    }

    const productDoc = await mongoose
      .model("Product")
      .findById(product)
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory");

    if (!productDoc) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const quotation = new Quotation({
      fullName,
      mobNumber,
      email,
      city,
      state,
      subject,
      heading,
      description,
      product: productDoc._id,
      quantity: quantity || 1,
      category: productDoc.category?._id || null,
      subCategory: productDoc.subCategory?._id || null,
      subSubCategory: productDoc.subSubCategory?._id || null,
      products: [],
      quotationRef: generateQuotationRef(),
    });

    await quotation.save();

    const populatedQuotation = await Quotation.findById(quotation._id)
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("product");

    res.status(201).json({
      success: true,
      message: "Quotation created successfully using single product",
      data: populatedQuotation,
    });
  } catch (error) {
    console.error("Error creating quotation by product:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.createQuotationWithMultipleProducts = async (req, res) => {
  try {
    const {
      fullName,
      mobNumber,
      email,
      city,
      state,
      subject,
      heading,
      description,
      products,
    } = req.body;

    if (!fullName || !mobNumber || !email) {
      return res.status(400).json({
        success: false,
        message: "All personal details are required",
      });
    }

    // Validate subject if provided
    if (subject && !validateSubject(subject)) {
      return res.status(400).json({
        success: false,
        message: `Subject must be one of: ${VALID_SUBJECTS.join(", ")}`,
      });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product is required",
      });
    }

    for (let i = 0; i < products.length; i++) {
      const productItem = products[i];
      if (
        !productItem.category ||
        !productItem.subCategory ||
        !productItem.subSubCategory ||
        !productItem.product
      ) {
        return res.status(400).json({
          success: false,
          message: `Product ${i + 1} is missing required category hierarchy`,
        });
      }
      const productDoc = await mongoose.model("Product").findOne({
        _id: productItem.product,
        category: productItem.category,
        subCategory: productItem.subCategory,
        subSubCategory: productItem.subSubCategory,
      });

      if (!productDoc) {
        return res.status(400).json({
          success: false,
          message: `Product ${i + 1
            } not found or doesn't belong to the specified category hierarchy`,
        });
      }
    }

    const quotation = new Quotation({
      fullName,
      mobNumber,
      email,
      city,
      state,
      subject,
      heading,
      description,
      products: products,
      quotationRef: generateQuotationRef(),
    });

    await quotation.save();

    const populatedQuotation = await Quotation.findById(quotation._id)
      .populate({
        path: "products.product",
        model: "Product",
      })
      .populate({
        path: "products.category",
        model: "Category",
      })
      .populate({
        path: "products.subCategory",
        model: "SubCategory",
      })
      .populate({
        path: "products.subSubCategory",
        model: "SubSubCategory",
      });

    res.status(201).json({
      success: true,
      message: "Quotation created successfully with multiple products",
      data: populatedQuotation,
    });
  } catch (error) {
    console.error("Error creating quotation with multiple products:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};