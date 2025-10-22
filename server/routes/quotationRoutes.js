const express = require("express");
const router = express.Router();
const {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  createQuotationByProduct,
  createQuotationWithMultipleProducts,
} = require("../controller/quotationController");

router.post("/create-quotation", createQuotation);
router.post("/create-quotation/by-product", createQuotationByProduct);
router.post(
  "/create-quotation/multiple-products",
  createQuotationWithMultipleProducts
);
router.get("/get-all-quotation", getQuotations);
router.get("/get-quotation-by-id/:id", getQuotationById);
router.put("/update-quotation/:id", updateQuotation);
router.delete("/delete-quotation/:id", deleteQuotation);

module.exports = router;
