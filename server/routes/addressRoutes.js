const express = require("express");
const router = express.Router();
const addressController = require("../controller/addressController");

router.post("/create-address", addressController.createAddress);
router.get("/user/:userId", addressController.getAddressesByUser);
router.get("/address-by-id/:id", addressController.getAddressById);
router.put("/update-address/:id", addressController.updateAddress);
router.delete("/delete-address/:id", addressController.deleteAddress);
router.put('/set-default-address/:id', addressController.setDefaultAddress);

module.exports = router;
