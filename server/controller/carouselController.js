const Carousel = require("../model/carousel");

exports.createCarousel = async (req, res) => {
  try {
    const carousel = await Carousel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Carousel created successfully",
      data: carousel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllCarousels = async (req, res) => {
  try {
    const carousels = await Carousel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: carousels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCarouselById = async (req, res) => {
  try {
    const carousel = await Carousel.findById(req.params.id);

    if (!carousel) {
      return res.status(404).json({
        success: false,
        message: "Carousel not found",
      });
    }

    res.status(200).json({
      success: true,
      data: carousel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCarousel = async (req, res) => {
  try {
    const carousel = await Carousel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!carousel) {
      return res.status(404).json({
        success: false,
        message: "Carousel not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Carousel updated successfully",
      data: carousel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCarousel = async (req, res) => {
  try {
    const carousel = await Carousel.findByIdAndDelete(req.params.id);

    if (!carousel) {
      return res.status(404).json({
        success: false,
        message: "Carousel not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Carousel deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
