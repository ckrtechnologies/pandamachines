const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
} = require("../controller/liveChatUserController");

// Routes
router.post("/create", createInquiry);
router.get("/all", getAllInquiries);
router.get("/:id", getInquiryById);
router.put("/:id", updateInquiry);

module.exports = router;
