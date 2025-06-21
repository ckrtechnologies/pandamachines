const express = require('express');
const router = express.Router();
const adminRoutes = require('./adminRoutes');
const userRoutes = require('./userRoutes');
const addressRoutes = require('./addressRoutes');
const categoryRoutes = require('./categoryRoutes')
const subCategoryRoutes = require('./subCategoryRoutes')
const productRoutes = require ('./productRoutes')

router.use('/admins', adminRoutes);
router.use('/customers', userRoutes);
router.use('/address', addressRoutes);
router.use('/categories', categoryRoutes);
router.use('/sub-categories',subCategoryRoutes)
router.use('/products',productRoutes)

module.exports = router;