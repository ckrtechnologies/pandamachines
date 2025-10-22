const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

router.post("/create-product", productController.createProduct);
router.get("/get-all-products", productController.getAllProducts);
router.get("/get-product-by-id/:id", productController.getProductById);
router.put("/update-product/:id", productController.updateProduct);
router.delete("/delete-product/:id", productController.deleteProduct);
router.get(
  "/products-by-sub-category/:subCategoryId",
  productController.getProductsBySubCategory
);
router.get(
  "/products-by-sub-sub-category/:subSubCategoryId",
  productController.getProductsBySubSubCategory
);
router.get(
  "/sub-categories-products-by-category/:categoryId",
  productController.getSubCategoriesAndProductsByCategory
);
router.patch("/change-stock-status/:id", productController.updateStockStatus);
router.put("/toggle-best-product/:id", productController.toggleBestProduct);
router.get("/all-best-products", productController.getBestProducts);
router.get(
  "/products-by-supplier/:supplierId",
  productController.getProductsBySupplier
);

module.exports = router;
