const express = require("express");
const router = express.Router();
const homeController = require("../controller/homeController");

//Public endpoints (called by mobile/web app) 

// New arrivals — sort by createdAt desc
// GET /home/new-arrivals?limit=10
router.get("/new-arrivals", homeController.getNewArrivals);
router.get("/top-rated", homeController.getTopRated);

// Hot deals — previous_price > price, sort by discount desc
// GET /home/hot-deals?limit=10
router.get("/hot-deals", homeController.getHotDeals);

// Category strips — featured categories with 8 products each
router.get("/category-strips", homeController.getCategoryStrips);




// View All — paginated products scoped to a category
// GET /home/category/:categoryId/products?page=1&limit=20&sortBy=createdAt&order=desc&search=
router.get("/category/:categoryId/products", homeController.getProductsByCategory);



//Admin endpoints 
router.get("/config", homeController.getHomepageConfig);
router.put("/config", homeController.updateHomepageConfig);

module.exports = router;