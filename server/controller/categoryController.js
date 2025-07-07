const Category = require("../model/Category");
const SubCategory = require("../model/SubCategory");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, imgUrl, sequence } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({ name, description, imgUrl, sequence });
    await category.save();
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all categories with subcategories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "subcategories",
          localField: "_id",
          foreignField: "category",
          as: "subcategories",
        },
      },
      {
        $addFields: {
          sequenceNum: { $toInt: "$sequence" }, // Convert sequence to number
        },
      },
      {
        $sort: { sequenceNum: 1 }, // Sort by numeric sequence
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// exports.getAllCategories = async (req, res) => {
//   try {
//     const categories = await Category.aggregate([
//       {
//         $lookup: {
//           from: "subcategories",
//           localField: "_id",
//           foreignField: "category",
//           as: "subcategories",
//         },
//       },
//       {
//         $sort: { sequence: 1 }
//       }
//     ]);

//     res.status(200).json(categories);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit category (update)
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, imgUrl, sequence } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, imgUrl, sequence },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res
      .status(200)
      .json({
        message: "Category updated successfully",
        category: updatedCategory,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
