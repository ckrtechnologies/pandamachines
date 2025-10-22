const express = require("express");
const router = express.Router();
const {
  createChatBotInquiry,
  getAllChatBotInquiries,
} = require("../controller/chatBotInquiryController");

router.post("/create", createChatBotInquiry);
router.get("/get-all", getAllChatBotInquiries);

module.exports = router;
