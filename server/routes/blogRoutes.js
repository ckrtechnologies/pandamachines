const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");

router.get("/get-all-blog", blogController.getAllBlogs);
router.get("/get-blog-by-id/:id", blogController.getBlogById);
router.post("/create-blog", blogController.createBlog);
router.put("/edit-blog/:id", blogController.updateBlog);
router.delete("/delete-blog/:id", blogController.deleteBlog);

module.exports = router;
