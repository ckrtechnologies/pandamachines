const express = require("express");
const router = express.Router();
const navigationController = require("../controller/navigationController.js");

router.get("/categories", navigationController.getCategories);
router.get("/subcategories", navigationController.getSubCategories);

module.exports = router;