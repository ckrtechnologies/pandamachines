const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");

router.post("/admin-register", adminController.createAdmin);
router.get("/all-admins", adminController.getAllAdmins);
router.get("/all-staff", adminController.getAllStaff);
router.post("/admin-login-by-phone", adminController.loginByPhone);
router.put("/edit-admin/:id", adminController.updateAdmin);
router.get("/admin-by-id/:id", adminController.getAdminById);
router.delete("/delete-admin/:id", adminController.deleteAdmin);
router.put("/update-permissions/:id", adminController.updatePermissions);

module.exports = router;
