const express = require('express');
const router = express.Router();
const adminRoutes = require('./adminRoutes');
const userRoutes = require('./userRoutes');
const addressRoutes = require('./addressRoutes');
const categoryRoutes = require('./categoryRoutes');
const subCategoryRoutes = require('./subCategoryRoutes');
const productRoutes = require ('./productRoutes');
const orderRoutes = require ('./orderRoutes');
const wishlistRoutes = require ('./wishlistRoutes');
const cartRoutes = require ('./cartRoutes');
const bannerRoutes = require ('./bannerRoutes');

router.use('/admins', adminRoutes);
router.use('/customers', userRoutes);
router.use('/address', addressRoutes);
router.use('/categories', categoryRoutes);
router.use('/sub-categories',subCategoryRoutes);
router.use('/products',productRoutes);
router.use('/orders',orderRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/cart", cartRoutes);
router.use("/banners", bannerRoutes);

module.exports = router;