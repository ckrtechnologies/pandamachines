const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const bulkProductController = require("../controller/BulkproductController ");

router.get("/", productController.getAllProductsOptimized);
router.get("/featured", productController.getFeaturedProductsOptimized);

router.get("/bulk-category-tree", bulkProductController.getCategoryTree);
router.post("/bulk-preview", bulkProductController.bulkPreview);
router.post("/bulk-submit", bulkProductController.bulkSubmit);

router.get("/get-all-products", productController.getAllProducts);
router.post("/create-product", productController.createProduct);
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
router.put("/:id/approve", productController.approveProduct);
router.put("/:id/cancel", productController.cancelProduct);
router.put("/:id/status", productController.updateProductStatus);
router.get("/status/:status", productController.getProductsByStatus);
router.get("/pending", productController.getPendingProducts);
router.get(
  "/supplier/:supplierId/status/:status",
  productController.getSupplierProductsByStatus
);
router.put("/brand-status/:id", productController.updateBrandStatus);

module.exports = router;
