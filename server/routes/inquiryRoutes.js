const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  deleteInquiry,
  updateInquiryStatus,
  getInquiriesByStatus,
} = require("../controller/inquiryController");

router.post("/create", createInquiry);
router.get("/get-all", getInquiries);
router.get("/get-by-status/:status", getInquiriesByStatus);
router.patch("/update-status/:id", updateInquiryStatus);
router.delete("/delete-inquiry/:id", deleteInquiry);

module.exports = router;
