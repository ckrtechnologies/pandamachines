const SubSubCategory = require("../model/subSubCartegory");
const SubCategory = require("../model/SubCategory");
const Category = require("../model/Category");

exports.createSubSubCategory = async (req, res) => {
  try {
    const { name, description, imgUrl, subCategoryId, categoryId } = req.body;

    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return res.status(400).json({ message: "Sub-category not found" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }

    const subSubCategory = new SubSubCategory({
      name,
      description,
      imgUrl,
      subCategory: subCategoryId,
      category: categoryId,
    });

    await subSubCategory.save();
    res.status(201).json({
      message: "Sub-sub-category created successfully",
      subSubCategory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSubSubCategories = async (req, res) => {
  try {
    const subSubCategories = await SubSubCategory.find()
      .populate("subCategory")
      .populate("category");
    res.status(200).json(subSubCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubSubCategoriesBySubCategory = async (req, res) => {
  try {
    const subSubCategories = await SubSubCategory.find({
      subCategory: req.params.subCategoryId,
    })
      .populate("subCategory")
      .populate("category");
    if (!subSubCategories.length) {
      return res.status(200).json([]);
    }

    res.status(200).json(subSubCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubSubCategoriesByCategory = async (req, res) => {
  try {
    const subSubCategories = await SubSubCategory.find({
      category: req.params.categoryId,
    })
      .populate("subCategory")
      .populate("category");

    if (!subSubCategories.length) {
      return res.status(404).json({
        message: "No sub-sub-categories found for this category",
      });
    }
    res.status(200).json(subSubCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubSubCategoryById = async (req, res) => {
  try {
    const subSubCategory = await SubSubCategory.findById(req.params.id)
      .populate("subCategory", "name")
      .populate("category", "name");

    if (!subSubCategory) {
      return res.status(404).json({ message: "Sub-sub-category not found" });
    }
    res.status(200).json(subSubCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSubSubCategory = async (req, res) => {
  try {
    const { name, description, imgUrl, subCategoryId, categoryId } = req.body;
    const subSubCategory = await SubSubCategory.findById(req.params.id);
    if (!subSubCategory) {
      return res.status(404).json({ message: "Sub-sub-category not found" });
    }
    if (subCategoryId) {
      const subCategory = await SubCategory.findById(subCategoryId);
      if (!subCategory) {
        return res.status(400).json({ message: "Sub-category not found" });
      }
    }
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: "Category not found" });
      }
    }
    subSubCategory.name = name || subSubCategory.name;
    subSubCategory.description = description || subSubCategory.description;
    subSubCategory.imgUrl = imgUrl || subSubCategory.imgUrl;
    subSubCategory.subCategory = subCategoryId || subSubCategory.subCategory;
    subSubCategory.category = categoryId || subSubCategory.category;
    await subSubCategory.save();
    res.status(200).json({
      message: "Sub-sub-category updated successfully",
      subSubCategory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSubSubCategory = async (req, res) => {
  try {
    const deletedSubSubCategory = await SubSubCategory.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSubSubCategory) {
      return res.status(404).json({ message: "Sub-sub-category not found" });
    }
    res.status(200).json({ message: "Sub-sub-category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
