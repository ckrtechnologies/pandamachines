const express = require("express");
const router = express.Router();
const technicianController = require("../controller/technicianController");

router.post("/register", technicianController.registerTechnician);
router.get("/all-technicians", technicianController.getTechniciansByStatus);
router.put("/change-status/:id", technicianController.changeTechnicianStatus);
module.exports = router;