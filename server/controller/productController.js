const Product = require("../model/Product");
const Category = require("../model/Category");
const SubCategory = require("../model/SubCategory");

const generateBBId = async () => {
  const lastProduct = await Product.findOne().sort({ createdAt: -1 });
  if (!lastProduct) return "PM01";

  try {
    const lastId = lastProduct.bb_id.match(/\d+/)?.[0];
    if (!lastId) return "PM01";
    
    const newId = parseInt(lastId) + 1;
    return `PM${newId.toString().padStart(2, "0")}`;
  } catch (error) {
    console.error("Error generating new BB_ID:", error);
    return "PM01";
  }
};

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
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
      previous_price
    } = req.body;

    // Validate category and subCategory
    const catExists = await Category.findById(category);
    if (!catExists)
      return res.status(400).json({ message: "Category not found" });

    const subCatExists = await SubCategory.findById(subCategory);
    if (!subCatExists)
      return res.status(400).json({ message: "Sub-Category not found" });

    // Validate required pricing fields
    if (price === undefined || previous_price === undefined) {
      return res.status(400).json({ message: "Price and previous price are required" });
    }

    if (gstPercentage === undefined || shippingCharge === undefined) {
      return res.status(400).json({ message: "GST and Shipping Charge are required" });
    }

    const bb_id = await generateBBId();

    const product = new Product({
      bb_id,
      name,
      description,
      category,
      subCategory,
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
        mainDomesticMarket: ""
      },
      price,
      previous_price
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category subCategory");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category subCategory"
    );
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
      previous_price
    } = req.body;

    // Validate category if provided
    if (category) {
      const catExists = await Category.findById(category);
      if (!catExists)
        return res.status(400).json({ message: "Category not found" });
    }

    // Validate subCategory if provided
    if (subCategory) {
      const subCatExists = await SubCategory.findById(subCategory);
      if (!subCatExists)
        return res.status(400).json({ message: "Sub-Category not found" });
    }

    // Prepare update object
    const updateData = {
      name,
      description,
      category,
      subCategory,
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
      // extraTaxPercentage is optional - only include if provided
      ...(extraTaxPercentage !== undefined && { extraTaxPercentage }),
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

// Delete Product
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

    const products = await Product.find({ subCategory: subCategoryId });

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

// Get all sub-categories and products by category
exports.getSubCategoriesAndProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Fetch sub-categories under the given category
    const subCategories = await SubCategory.find({ category: categoryId }).populate('category');

    if (!subCategories || subCategories.length === 0) {
      return res
        .status(404)
        .json({ message: "No sub-categories found for this category" });
    }

    // Fetch products for each sub-category
    const result = await Promise.all(
      subCategories.map(async (subCategory) => {
        const products = await Product.find({ subCategory: subCategory._id });
        return {
          subCategory,
          products,
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

    // Validate stock status
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