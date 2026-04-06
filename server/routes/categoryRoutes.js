const express = require("express");
const categoryController = require("../controller/categoryController");

const router = express.Router();

router.get("/", categoryController.getAllCategoriesOptimized);

router.post("/create-category", categoryController.createCategory);
router.get("/get-all-categories", categoryController.getAllCategories);
router.get("/get-category-by-id/:id", categoryController.getCategoryById);
router.put("/update-category/:id", categoryController.updateCategory);
router.delete("/delete-category/:id", categoryController.deleteCategory);

module.exports = router;
