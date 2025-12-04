const Product = require("../model/Product");
const Category = require("../model/Category");
const SubCategory = require("../model/SubCategory");
const SubSubCategory = require("../model/subSubCartegory");
const Supplier = require("../model/supplier");

const generateBBId = async () => {
  const lastProduct = await Product.findOne().sort({ createdAt: -1 });
  if (!lastProduct) return "PM01";

  try {
    const lastId = lastProduct.pm_id.match(/\d+/)?.[0];
    if (!lastId) return "PM01";

    const newId = parseInt(lastId) + 1;
    return `PM${newId.toString().padStart(2, "0")}`;
  } catch (error) {
    console.error("Error generating new PM_ID:", error);
    return "PM01";
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      subSubCategory,
      brand,
      images,
      ratings,
      features,
      stock_status,
      return_policy,
      gstPercentage,
      extraTaxPercentage,
      shippingCharge,
      measurement,
      warranty,
      automaticGrade,
      controlSystem,
      productType,
      material,
      energyConsumption,
      tradeInfo,
      price,
      previous_price,
      isBestProduct,
      uploadedBy,
      supplier, // This should be the supplier ID
    } = req.body;

    // Validate category, subCategory, and subSubCategory
    const catExists = await Category.findById(category);
    if (!catExists)
      return res.status(400).json({ message: "Category not found" });

    const subCatExists = await SubCategory.findById(subCategory);
    if (!subCatExists)
      return res.status(400).json({ message: "Sub-Category not found" });

    const subSubCatExists = await SubSubCategory.findById(subSubCategory);
    if (!subSubCatExists)
      return res.status(400).json({ message: "Sub-Sub-Category not found" });

    // Validate that subSubCategory belongs to the provided subCategory and category
    if (subSubCatExists.subCategory.toString() !== subCategory) {
      return res.status(400).json({
        message:
          "Sub-sub-category does not belong to the provided sub-category",
      });
    }

    if (subSubCatExists.category.toString() !== category) {
      return res.status(400).json({
        message: "Sub-sub-category does not belong to the provided category",
      });
    }

    // Validate required pricing fields
    if (price === undefined || previous_price === undefined) {
      return res
        .status(400)
        .json({ message: "Price and previous price are required" });
    }

    if (gstPercentage === undefined || shippingCharge === undefined) {
      return res
        .status(400)
        .json({ message: "GST and Shipping Charge are required" });
    }

    // Determine supplier based on uploadedBy
    let finalSupplier = null;
    let productStatus = "pending"; // Default status

    if (uploadedBy === "supplier") {
      if (!supplier) {
        return res.status(400).json({
          message: "Supplier ID is required when uploadedBy is 'supplier'",
        });
      }

      // Validate that supplier exists
      const supplierExists = await Supplier.findById(supplier);
      if (!supplierExists) {
        return res.status(400).json({ message: "Supplier not found" });
      }

      finalSupplier = supplier;
      // Status remains "pending" for supplier-created products
    } else {
      finalSupplier = null;
      // Auto-approve admin-created products
      productStatus = "approved";
    }

    const pm_id = await generateBBId();

    const product = new Product({
      pm_id,
      name,
      description,
      category,
      subCategory,
      subSubCategory,
      brand,
      images,
      ratings,
      features,
      stock_status,
      return_policy,
      gstPercentage,
      extraTaxPercentage,
      shippingCharge,
      measurement,
      warranty: warranty || { hasWarranty: false, warrantyDays: "0 days" },
      automaticGrade,
      controlSystem,
      productType,
      material,
      energyConsumption,
      tradeInfo: tradeInfo || {
        paymentTerms: "",
        deliveryTime: "",
        supplyAbility: "",
        mainDomesticMarket: "",
      },
      price,
      previous_price,
      isBestProduct: isBestProduct || false,
      uploadedBy: uploadedBy || "admin",
      supplier: finalSupplier,
      status: productStatus, // Add status field
    });

    await product.save();

    // Populate the created product with supplier details
    const populatedProduct = await Product.findById(product._id)
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier");

    res.status(201).json({
      message: `Product created successfully. Status: ${productStatus}`,
      product: populatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { showAll, status } = req.query;

    let query = {};

    if (showAll === "true" || showAll === true) {
      if (status && ["pending", "approved", "cancel"].includes(status)) {
        query.status = status;
      }
    } else {
      query.status = "approved";

      if (status && ["pending", "approved", "cancel"].includes(status)) {
        query.status = status;
      }
    }

    const products = await Product.find(query)
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      subSubCategory,
      brand,
      images,
      ratings,
      features,
      stock_status,
      return_policy,
      gstPercentage,
      extraTaxPercentage,
      shippingCharge,
      measurement,
      warranty,
      automaticGrade,
      controlSystem,
      productType,
      material,
      energyConsumption,
      tradeInfo,
      price,
      previous_price,
      isBestProduct,
      uploadedBy,
    } = req.body;

    let uploadedByUpdate = {};
    if (uploadedBy) {
      if (uploadedBy === "admin") {
        uploadedByUpdate = { uploadedBy };
      } else if (uploadedBy === "supplier") {
        uploadedByUpdate = { uploadedBy };
      }
    }

    const updateData = {
      name,
      description,
      category,
      subCategory,
      subSubCategory,
      brand,
      images,
      ratings,
      features,
      stock_status,
      return_policy,
      gstPercentage,
      shippingCharge,
      measurement,
      warranty,
      automaticGrade,
      controlSystem,
      productType,
      material,
      energyConsumption,
      tradeInfo,
      price,
      previous_price,
      ...uploadedByUpdate,
      ...(extraTaxPercentage !== undefined && { extraTaxPercentage }),
      ...(isBestProduct !== undefined && { isBestProduct }),
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products by sub-category
exports.getProductsBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    const products = await Product.find({ subCategory: subCategoryId })
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory");

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this sub-category" });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products by sub-sub-category
exports.getProductsBySubSubCategory = async (req, res) => {
  try {
    const { subSubCategoryId } = req.params;

    const products = await Product.find({ subSubCategory: subSubCategoryId })
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory");

    // Always return 200, even if no products found
    res.status(200).json(products || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sub-categories and products by category
exports.getSubCategoriesAndProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const subCategories = await SubCategory.find({
      category: categoryId,
    }).populate("category");

    if (!subCategories || subCategories.length === 0) {
      return res
        .status(404)
        .json({ message: "No sub-categories found for this category" });
    }

    const result = await Promise.all(
      subCategories.map(async (subCategory) => {
        const subSubCategories = await SubSubCategory.find({
          subCategory: subCategory._id,
        });

        const subSubCategoriesWithProducts = await Promise.all(
          subSubCategories.map(async (subSubCategory) => {
            const products = await Product.find({
              subSubCategory: subSubCategory._id,
            });
            return {
              subSubCategory,
              products,
            };
          })
        );

        return {
          subCategory,
          subSubCategories: subSubCategoriesWithProducts,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Stock Status Only
exports.updateStockStatus = async (req, res) => {
  try {
    const { stock_status } = req.body;
    const { id } = req.params;

    const validStatuses = ["active", "inactive", "out of stock"];
    if (!validStatuses.includes(stock_status)) {
      return res.status(400).json({ message: "Invalid stock status" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { stock_status },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Stock status updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark product as Best Product
exports.toggleBestProduct = async (req, res) => {
  try {
    const { isBestProduct } = req.body;
    const { id } = req.params;

    if (typeof isBestProduct !== "boolean") {
      return res
        .status(400)
        .json({ message: "isBestProduct must be true or false" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { isBestProduct },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const message = isBestProduct
      ? "Product marked as Best Product successfully"
      : "Product removed from Best Product list successfully";

    res.status(200).json({
      message,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Best Products
exports.getBestProducts = async (req, res) => {
  try {
    const bestProducts = await Product.find({ isBestProduct: true })
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory");

    if (!bestProducts || bestProducts.length === 0) {
      return res.status(404).json({ message: "No Best Products found" });
    }

    res.status(200).json(bestProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products by supplier ID
exports.getProductsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;

    // Validate that supplierId is provided
    if (!supplierId) {
      return res.status(400).json({ message: "Supplier ID is required" });
    }

    // First, check if the supplier exists
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Find all products with the matching supplier ID
    // Since product.supplier is String type, we convert supplier._id to string for comparison
    const products = await Product.find({ supplier: supplierId.toString() })
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!products || products.length === 0) {
      return res.status(200).json({
        message: "No products found for this supplier",
        supplier: {
          _id: supplier._id,
          fullName: supplier.fullName,
          businessName: supplier.businessName,
          emailId: supplier.emailId,
          mobNo: supplier.mobNo,
        },
        products: [],
        count: 0,
      });
    }

    res.status(200).json({
      message: "Products retrieved successfully",
      supplier: {
        _id: supplier._id,
        fullName: supplier.fullName,
        businessName: supplier.businessName,
        emailId: supplier.emailId,
        mobNo: supplier.mobNo,
      },
      count: products.length,
      products,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid supplier ID format",
      });
    }

    res.status(500).json({
      error: error.message,
      message: "Error fetching products by supplier",
    });
  }
};
// Approve a product (for admin)
exports.approveProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true, runValidators: true }
    )
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product approved successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel/Reject a product (for admin)
exports.cancelProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const updateData = { status: "cancel" };
    if (reason) {
      updateData.cancellationReason = reason; // You might want to add this field to schema
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: reason
        ? `Product cancelled: ${reason}`
        : "Product cancelled successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product status (general function)
exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "approved", "cancel"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: `Product status updated to ${status}`,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products by status
exports.getProductsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const validStatuses = ["pending", "approved", "cancel"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const products = await Product.find({ status })
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pending products (for admin dashboard)
exports.getPendingProducts = async (req, res) => {
  try {
    const pendingProducts = await Product.find({ status: "pending" })
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: pendingProducts.length,
      products: pendingProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get supplier's products by status
exports.getSupplierProductsByStatus = async (req, res) => {
  try {
    const { supplierId, status } = req.params;

    // Validate status
    const validStatuses = ["pending", "approved", "cancel"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // First, check if the supplier exists
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Find products by supplier and status
    const products = await Product.find({
      supplier: supplierId.toString(),
      status: status,
    })
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: `Supplier's ${status} products retrieved successfully`,
      supplier: {
        _id: supplier._id,
        fullName: supplier.fullName,
        businessName: supplier.businessName,
      },
      count: products.length,
      products,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid supplier ID format" });
    }
    res.status(500).json({ error: error.message });
  }
};
