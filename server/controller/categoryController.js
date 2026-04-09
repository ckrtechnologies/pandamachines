const Category = require("../model/Category");

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

exports.getAllCategoriesOptimized = async (req, res) => {
  try {
    let {
      simple,
      page = 1,
      limit = 10,
      search,
      sortBy = "sequence",
      order = "asc",
    } = req.query;

    const isSimple = simple === "true";
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    //  Base match (search support)
    const matchStage = {};

    if (search) {
      matchStage.name = { $regex: search, $options: "i" };
    }

    //  Base pipeline
    const basePipeline = [
      { $match: matchStage },

      {
        $addFields: {
          sequenceNum: { $toInt: "$sequence" },
        },
      },
    ];

    //  FULL MODE → include subcategories
    if (!isSimple) {
      basePipeline.push({
        $lookup: {
          from: "subcategories",
          localField: "_id",
          foreignField: "category",
          as: "subcategories",
        },
      });
    }

    //  Sorting logic
    const sortField = sortBy === "sequence" ? "sequenceNum" : sortBy;

    basePipeline.push({
      $sort: {
        [sortField]: order === "asc" ? 1 : -1,
      },
    });

    //  Projection (payload control)
    basePipeline.push({
      $project: isSimple
        ? {
          name: 1,
          imgUrl: 1,
          sequence: 1,
        }
        : {
          name: 1,
          description: 1,
          imgUrl: 1,
          sequence: 1,
          subcategories: 1,
        },
    });

    //  Pagination using facet
    const pipeline = [
      ...basePipeline,
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limitNum }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Category.aggregate(pipeline);

    const data = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;

    res.status(200).json({
      success: true,
      mode: isSimple ? "simple" : "full",
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
          sequenceNum: { $toInt: "$sequence" },
        },
      },
      {
        $sort: { sequenceNum: 1 },
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
