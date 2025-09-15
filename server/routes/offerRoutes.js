const express = require("express");
const router = express.Router();
const offerController = require("../controller/offerController");

router.get("/get-all-offer", offerController.getAllOffers);
router.get("/get-offer-by-id/:id", offerController.getOfferById);
router.post("/create-offer", offerController.createOffer);
router.put("/edit-offer/:id", offerController.updateOffer);
router.delete("/delete-offer/:id", offerController.deleteOffer);

module.exports = router;
