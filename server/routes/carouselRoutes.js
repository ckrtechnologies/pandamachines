const express = require("express");
const router = express.Router();

const {
  createCarousel,
  getAllCarousels,
  getCarouselById,
  updateCarousel,
  deleteCarousel,
} = require("../controller/carouselController");

router.post("/create-carousel", createCarousel);
router.get("/get-all-carousel", getAllCarousels);
router.get("/carousel-by-id/:id", getCarouselById);
router.put("/update-carousel/:id", updateCarousel);
router.delete("/delete-carousel/:id", deleteCarousel);

module.exports = router;
