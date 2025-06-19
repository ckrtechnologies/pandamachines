const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

router.post('/admin-register', adminController.createAdmin);
router.get('/all-admins', adminController.getAllAdmins);
router.post('/admin-login-by-phone', adminController.loginByPhone);
router.put('/edit-admin/:id', adminController.updateAdmin);
router.get('/admin-by-id/:id', adminController.getAdminById);
router.delete('/delete-admin/:id', adminController.deleteAdmin);

module.exports = router;