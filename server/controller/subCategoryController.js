const SubCategory = require("../model/SubCategory");
const Category = require("../model/Category");

// Create a new sub-category
exports.createSubCategory = async (req, res) => {
  try {
    const { name, description, imgUrl, categoryId } = req.body;

    // Validate if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }

    const subCategory = new SubCategory({ name, description, imgUrl, category: categoryId });
    await subCategory.save();
    res.status(201).json({ message: "Sub-category created successfully", subCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sub-categories
exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("category");
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get sub-categories by category ID
exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ category: req.params.categoryId }).populate("category");
    if (!subCategories.length) {
      return res.status(404).json({ message: "No sub-categories found for this category" });
    }
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get sub-category by ID
exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate("category", "name");
    if (!subCategory) {
      return res.status(404).json({ message: "Sub-category not found" });
    }
    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update sub-category
exports.updateSubCategory = async (req, res) => {
  try {
    const { name, description, imgUrl, categoryId } = req.body;

    // Validate if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { name, description, imgUrl, category: categoryId },
      { new: true }
    ).populate("category", "name");

    if (!updatedSubCategory) {
      return res.status(404).json({ message: "Sub-category not found" });
    }

    res.status(200).json({ message: "Sub-category updated successfully", subCategory: updatedSubCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete sub-category
exports.deleteSubCategory = async (req, res) => {
  try {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!deletedSubCategory) {
      return res.status(404).json({ message: "Sub-category not found" });
    }
    res.status(200).json({ message: "Sub-category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
