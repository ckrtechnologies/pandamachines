const express = require("express");
const router = express.Router();
const catalogController = require("../controller/catalogController");

router.get("/products", catalogController.getProducts);

/* SubCategory landing feed */
router.get(
    "/subcategory/:subCategoryId",
    catalogController.getSubCategoryFeed
);
module.exports = router;