const express = require("express");
const router = express.Router();
const technicianController = require("../controller/technicianController");

router.get("/", technicianController.getTechniciansAdvanced);
router.get("/stats", technicianController.getTechnicianStats);
router.get("/export", technicianController.exportTechnicians);

router.post("/register", technicianController.registerTechnician);
router.get("/all-technicians", technicianController.getTechniciansByStatus);
router.put("/change-status/:id", technicianController.changeTechnicianStatus);
module.exports = router;