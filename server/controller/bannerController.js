const Banner = require("../model/banners");

// =====================================================
// GET ALL BANNERS
// =====================================================
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find()
      .populate("productId");

    res.status(200).json(banners);
  } catch (err) {
    console.error("Get all banners error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};


// =====================================================
// GET BANNER BY ID
// =====================================================
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)
      .populate("productId");

    if (!banner) {
      return res.status(404).json({
        message: "Banner not found",
      });
    }

    res.status(200).json(banner);
  } catch (err) {
    console.error("Get banner by ID error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};


// =====================================================
// CREATE BANNER
// =====================================================
exports.createBanner = async (req, res) => {
  try {
    const {
      name,
      imgUrl,
      bannerType,
      productId,
    } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({
        message: "Banner name is required",
      });
    }

    if (!imgUrl) {
      return res.status(400).json({
        message: "Banner image is required",
      });
    }

    if (!bannerType) {
      return res.status(400).json({
        message: "Banner type is required",
      });
    }

    const newBanner = new Banner({
      name,
      imgUrl,
      bannerType,
      productId: productId || undefined,
    });

    const savedBanner = await newBanner.save();

    // Return populated product
    const populatedBanner = await Banner.findById(
      savedBanner._id
    ).populate("productId");

    res.status(201).json(populatedBanner);
  } catch (err) {
    console.error("Create banner error:", err);

    res.status(400).json({
      error: err.message,
    });
  }
};


// =====================================================
// UPDATE BANNER
// =====================================================
exports.updateBanner = async (req, res) => {
  try {
    const {
      name,
      imgUrl,
      bannerType,
      productId,
    } = req.body;

    const updatedBanner =
      await Banner.findByIdAndUpdate(
        req.params.id,
        {
          name,
          imgUrl,
          bannerType,
          productId: productId || undefined,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate("productId");

    if (!updatedBanner) {
      return res.status(404).json({
        message: "Banner not found",
      });
    }

    res.status(200).json(updatedBanner);
  } catch (err) {
    console.error("Update banner error:", err);

    res.status(400).json({
      error: err.message,
    });
  }
};


// =====================================================
// DELETE BANNER
// =====================================================
exports.deleteBanner = async (req, res) => {
  try {
    const deletedBanner =
      await Banner.findByIdAndDelete(req.params.id);

    if (!deletedBanner) {
      return res.status(404).json({
        message: "Banner not found",
      });
    }

    res.status(200).json({
      message: "Banner deleted successfully",
    });
  } catch (err) {
    console.error("Delete banner error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};