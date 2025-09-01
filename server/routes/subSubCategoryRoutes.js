const express = require("express");
const router = express.Router();
const subSubCategoryController = require("../controller/subSubCategoryController");

router.post("/create", subSubCategoryController.createSubSubCategory);
router.get("/get-all", subSubCategoryController.getAllSubSubCategories);
router.get(
  "/get-sub-sub-category/:id",
  subSubCategoryController.getSubSubCategoryById
);
router.put(
  "/update-sub-sub-category/:id",
  subSubCategoryController.updateSubSubCategory
);
router.delete(
  "/delete-sub-sub-category/:id",
  subSubCategoryController.deleteSubSubCategory
);
router.get(
  "/subcategory/:subCategoryId",
  subSubCategoryController.getSubSubCategoriesBySubCategory
);
router.get(
  "/category/:categoryId",
  subSubCategoryController.getSubSubCategoriesByCategory
);

module.exports = router;
