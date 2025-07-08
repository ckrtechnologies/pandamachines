const express = require('express');
const router = express.Router();
const bannerController = require('../controller/bannerController');

// CRUD routes
router.get('/all-banners', bannerController.getAllBanners);
router.get('/banner-by-id/:id', bannerController.getBannerById);
router.post('/create-banner', bannerController.createBanner);
router.put('/update-banner/:id', bannerController.updateBanner);
router.delete('/delete-banner/:id', bannerController.deleteBanner);

module.exports = router;
