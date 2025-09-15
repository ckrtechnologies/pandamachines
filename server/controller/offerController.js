const Offer = require("../model/offer");

const getOfferStatus = (startDate, endDate) => {
  const now = new Date();
  const startParts = startDate.split("-");
  const endParts = endDate.split("-");
  const start = new Date(`${startParts[2]}-${startParts[1]}-${startParts[0]}`);
  const end = new Date(`${endParts[2]}-${endParts[1]}-${endParts[0]}`);

  if (now < start) {
    return "Incoming";
  } else if (now >= start && now <= end) {
    return "Ongoing";
  } else {
    return "Expired";
  }
};

exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });

    const offersWithStatus = offers.map((offer) => {
      return {
        ...offer._doc,
        status: getOfferStatus(offer.startDate, offer.endDate),
      };
    });

    res.json(offersWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const offerWithStatus = {
      ...offer._doc,
      status: getOfferStatus(offer.startDate, offer.endDate),
    };

    res.json(offerWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new offer
exports.createOffer = async (req, res) => {
  try {
    const { name, description, image, startDate, endDate } = req.body;

    // Basic validation
    if (!name || !description || !startDate || !endDate) {
      return res.status(400).json({
        message: "Name, description, startDate and endDate are required",
      });
    }

    const newOffer = new Offer({
      name,
      description,
      image: image || "", // Optional
      startDate,
      endDate,
    });

    await newOffer.save();
    res.status(201).json(newOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing offer
exports.updateOffer = async (req, res) => {
  try {
    const { name, description, image, startDate, endDate } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (image) updateData.image = image;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;

    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json(updatedOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an offer
exports.deleteOffer = async (req, res) => {
  try {
    const deletedOffer = await Offer.findByIdAndDelete(req.params.id);

    if (!deletedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
