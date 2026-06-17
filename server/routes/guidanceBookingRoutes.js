const express = require("express");
const router = express.Router();
const {
  bookGuidance,
  getAllGuidanceBookings,
  getGuidanceBookingById,
  updateBookingStatus,
  editGuidanceBooking,
  deleteGuidanceBooking,
} = require("../controller/guidanceBookingController");

router.post("/book", bookGuidance);

router.get("/get-all-booking", getAllGuidanceBookings);

router.get("/get-book-by-id/:id", getGuidanceBookingById);

router.patch("/change-status/:id", updateBookingStatus);

router.put("/update/:id", editGuidanceBooking);

router.delete("/delete/:id", deleteGuidanceBooking);

module.exports = router;
