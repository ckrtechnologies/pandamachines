const Banner = require('../model/banners');

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new banner
exports.createBanner = async (req, res) => {
  try {
    const { name, imgUrl, bannerType } = req.body;

    const newBanner = new Banner({ name, imgUrl, bannerType });
    const savedBanner = await newBanner.save();

    res.status(201).json(savedBanner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an existing banner
exports.updateBanner = async (req, res) => {
  try {
    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBanner) return res.status(404).json({ message: "Banner not found" });

    res.status(200).json(updatedBanner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a banner
exports.deleteBanner = async (req, res) => {
  try {
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
    if (!deletedBanner) return res.status(404).json({ message: "Banner not found" });

    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
