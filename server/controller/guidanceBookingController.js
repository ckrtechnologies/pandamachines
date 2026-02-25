// const GuidanceBooking = require("../model/guidanceBooking");
// const mongoose = require("mongoose");

// const bookGuidance = async (req, res) => {
//   try {
//     const {
//       category,
//       subCategory,
//       subSubCategory,
//       product,
//       investmentAmount,
//       fullName,
//       mobileNumber,
//       email,
//       discussionTime,
//       discussionFee,
//       date,
//       time,
//     } = req.body;

//     if (
//       !category ||
//       !subCategory ||
//       !product ||
//       !investmentAmount ||
//       !fullName ||
//       !mobileNumber ||
//       !discussionTime ||
//       !discussionFee ||
//       !date ||
//       !time
//     ) {
//       return res
//         .status(400)
//         .json({ error: "All required fields must be provided" });
//     }

//     const booking = await GuidanceBooking.create({
//       category,
//       subCategory,
//       subSubCategory,
//       product,
//       investmentAmount,
//       fullName,
//       mobileNumber,
//       email,
//       discussionTime,
//       discussionFee,
//       date,
//       time,
//     });

//     const populatedBooking = await GuidanceBooking.findById(booking._id)
//       .populate("category", "name")
//       .populate("subCategory", "name")
//       .populate("subSubCategory", "name")
//       .populate("product", "name");

//     res.status(201).json({
//       message: "Guidance booking created successfully",
//       booking: populatedBooking,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const getAllGuidanceBookings = async (req, res) => {
//   try {
//     const { status, sortBy = "createdAt", sortOrder = "desc" } = req.query;

//     const filter = {};
//     if (status) filter.status = status;

//     const sortOptions = {};
//     sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

//     const bookings = await GuidanceBooking.find(filter)
//       .populate("category", "name")
//       .populate("subCategory", "name")
//       .populate("subSubCategory", "name")
//       .populate("product", "name")
//       .sort(sortOptions);

//     res.status(200).json({
//       bookings,
//       totalCount: bookings.length,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const getGuidanceBookingById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid booking ID" });
//     }

//     const booking = await GuidanceBooking.findById(id)
//       .populate("category", "name")
//       .populate("subCategory", "name")
//       .populate("subSubCategory", "name")
//       .populate("product", "name");

//     if (!booking) {
//       return res.status(404).json({ error: "Guidance booking not found" });
//     }

//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const updateBookingStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid booking ID" });
//     }

//     if (!["pending", "completed", "rejected"].includes(status)) {
//       return res.status(400).json({ error: "Invalid status value" });
//     }

//     const booking = await GuidanceBooking.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true, runValidators: true }
//     )
//       .populate("category", "name")
//       .populate("subCategory", "name")
//       .populate("subSubCategory", "name")
//       .populate("product", "name");

//     if (!booking) {
//       return res.status(404).json({ error: "Guidance booking not found" });
//     }

//     res.status(200).json({
//       message: "Booking status updated successfully",
//       booking,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const editGuidanceBooking = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid booking ID" });
//     }

//     delete updates._id;
//     delete updates.createdAt;
//     delete updates.updatedAt;

//     const booking = await GuidanceBooking.findByIdAndUpdate(id, updates, {
//       new: true,
//       runValidators: true,
//     })
//       .populate("category", "name")
//       .populate("subCategory", "name")
//       .populate("subSubCategory", "name")
//       .populate("product", "name");

//     if (!booking) {
//       return res.status(404).json({ error: "Guidance booking not found" });
//     }

//     res.status(200).json({
//       message: "Guidance booking updated successfully",
//       booking,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const deleteGuidanceBooking = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid booking ID" });
//     }

//     const booking = await GuidanceBooking.findByIdAndDelete(id);

//     if (!booking) {
//       return res.status(404).json({ error: "Guidance booking not found" });
//     }

//     res.status(200).json({ message: "Guidance booking deleted successfully" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// module.exports = {
//   bookGuidance,
//   getAllGuidanceBookings,
//   getGuidanceBookingById,
//   updateBookingStatus,
//   editGuidanceBooking,
//   deleteGuidanceBooking,
// };

const GuidanceBooking = require("../model/guidanceBooking");
const mongoose = require("mongoose");

const bookGuidance = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      subSubCategory,
      product,
      investmentAmount,
      fullName,
      mobileNumber,
      email,
      discussionTime,
      discussionFee,
      date,
      time,
    } = req.body;

    // Only check for category as required field
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    const booking = await GuidanceBooking.create({
      category,
      subCategory,
      subSubCategory,
      product,
      investmentAmount,
      fullName,
      mobileNumber,
      email,
      discussionTime,
      discussionFee,
      date,
      time,
    });

    const populatedBooking = await GuidanceBooking.findById(booking._id)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("subSubCategory", "name")
      .populate("product", "name");

    res.status(201).json({
      message: "Guidance booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllGuidanceBookings = async (req, res) => {
  try {
    const { status, sortBy = "createdAt", sortOrder = "desc" } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const bookings = await GuidanceBooking.find(filter)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("subSubCategory", "name")
      .populate("product", "name")
      .sort(sortOptions);

    res.status(200).json({
      bookings,
      totalCount: bookings.length,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getGuidanceBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const booking = await GuidanceBooking.findById(id)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("subSubCategory", "name")
      .populate("product", "name");

    if (!booking) {
      return res.status(404).json({ error: "Guidance booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    if (!["pending", "completed", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const booking = await GuidanceBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    )
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("subSubCategory", "name")
      .populate("product", "name");

    if (!booking) {
      return res.status(404).json({ error: "Guidance booking not found" });
    }

    res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const editGuidanceBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const booking = await GuidanceBooking.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("subSubCategory", "name")
      .populate("product", "name");

    if (!booking) {
      return res.status(404).json({ error: "Guidance booking not found" });
    }

    res.status(200).json({
      message: "Guidance booking updated successfully",
      booking,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteGuidanceBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const booking = await GuidanceBooking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ error: "Guidance booking not found" });
    }

    res.status(200).json({ message: "Guidance booking deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  bookGuidance,
  getAllGuidanceBookings,
  getGuidanceBookingById,
  updateBookingStatus,
  editGuidanceBooking,
  deleteGuidanceBooking,
};
