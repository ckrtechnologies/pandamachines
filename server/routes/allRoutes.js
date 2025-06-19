const express = require('express');
const router = express.Router();
const adminRoutes = require('./adminRoutes');
const userRoutes = require('./userRoutes');
const addressRoutes = require('./addressRoutes');

router.use('/admins', adminRoutes);
router.use('/customers', userRoutes);
router.use('/address', addressRoutes);

module.exports = router;