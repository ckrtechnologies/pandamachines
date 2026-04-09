const express = require("express")
const {
    createGrievance,
    getAllGrievances,
    getGrievanceById,
    updateGrievanceStatus,
    deleteGrievance,
} = require("../controller/grievanceController.js")

const router = express.Router();

router.post("/", createGrievance);


/* ===========================
   ADMIN ROUTES
=========================== */

// GET all grievances
router.get("/", getAllGrievances);

// GET single grievance
router.get("/:id", getGrievanceById);

// UPDATE status only
router.patch("/:id/status", updateGrievanceStatus);

// DELETE grievance
router.delete("/:id", deleteGrievance);

module.exports = router;