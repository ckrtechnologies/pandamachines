const express = require("express");
const subCategoryController = require("../controller/subCategoryController");

const router = express.Router();

router.post("/create-sub-category", subCategoryController.createSubCategory); 
router.get("/get-all-sub-categories", subCategoryController.getAllSubCategories);
router.get("/get-sub-category-by-id/:id", subCategoryController.getSubCategoryById);
router.get("/get-sub-categories-by-category/:categoryId", subCategoryController.getSubCategoriesByCategory);
router.put("/update-sub-category/:id", subCategoryController.updateSubCategory);
router.delete("/delete-sub-category/:id", subCategoryController.deleteSubCategory);

module.exports = router;
