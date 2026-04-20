const Technician = require("../model/technician");

/**
 * Register Technician
 */
exports.registerTechnician = async (req, res) => {
  try {
    const {
      name,
      address,
      mobileNumber,
      whatsappNumber,
      operatorName,
      expectedSalaryMin,
      expectedSalaryMax,
      aadharFront,
      aadharBack,
    } = req.body;

    if (!aadharFront || !aadharBack) {
      return res.status(400).json({
        success: false,
        message: "Aadhar front and back image URLs are required",
      });
    }

    if (Number(expectedSalaryMin) > Number(expectedSalaryMax)) {
      return res.status(400).json({
        success: false,
        message: "Minimum salary cannot be greater than maximum salary",
      });
    }

    const technician = await Technician.create({
      name,
      address,
      mobileNumber,
      whatsappNumber,
      operatorName,
      expectedSalaryMin,
      expectedSalaryMax,
      aadharFront,
      aadharBack,
    });

    res.status(201).json({
      success: true,
      message: "Technician registered successfully",
      data: technician,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get technicians by status
 * Example:
 * /api/technicians?status=pending
 */
exports.getTechniciansByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {};

    const technicians = await Technician.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: technicians.length,
      data: technicians,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Change Technician Status
 * PATCH /api/technicians/:id/status
 */
exports.changeTechnicianStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["pending", "approved", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const technician = await Technician.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: "Technician not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Technician status updated to ${status}`,
      data: technician,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTechniciansAdvanced = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      status,
      operatorName,
      sort = "newest",
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    /*  MATCH STAGE  */
    const match = {};

    //  Search (name, mobile, whatsapp, operator)
    if (search) {
      match.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { whatsappNumber: { $regex: search, $options: "i" } },
        { operatorName: { $regex: search, $options: "i" } },
      ];
    }

    //  Status filter
    if (status && status !== "all") {
      match.status = status;
    }

    //  Operator filter
    if (operatorName && operatorName !== "all") {
      match.operatorName = operatorName;
    }

    /*  SORTING  */
    let sortOption = { createdAt: -1, _id: -1 }; // default newest

    if (sort === "oldest") sortOption = { createdAt: 1, _id: 1 };
    if (sort === "salary_high") sortOption = { expectedSalaryMax: -1 };
    if (sort === "salary_low") sortOption = { expectedSalaryMin: 1 };

    /*  AGGREGATION  */
    const pipeline = [
      { $match: match },

      {
        $facet: {
          technicians: [
            { $sort: sortOption },
            { $skip: skip },
            { $limit: limitNum },
          ],
          totalCount: [{ $count: "count" }],

        },
      },
    ];

    const result = await Technician.aggregate(pipeline);

    const technicians = result[0].technicians;
    const total = result[0].totalCount[0]?.count || 0;

    res.status(200).json({
      success: true,
      data: technicians,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTechnicianStats = async (req, res) => {
  try {
    const stats = await Technician.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const formatted = {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0
    };

    stats.forEach((item) => {
      formatted[item._id] = item.count;
      formatted.total += item.count;
    });

    res.status(200).json({
      success: true,
      data: formatted
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.exportTechnicians = async (req, res) => {
  try {
    let {
      search = "",
      status,
      operatorName,
      sort = "newest",
      ids
    } = req.query;

    if (ids) {
      let parsedIds = [];

      // handle both: ids=1,2,3 AND ids[]=1&ids[]=2
      if (Array.isArray(ids)) {
        parsedIds = ids;
      } else if (typeof ids === "string") {
        parsedIds = ids.split(",");
      }

      const technicians = await Technician.find({
        _id: { $in: parsedIds }
      }).lean();

      return res.status(200).json({
        success: true,
        count: technicians.length,
        data: technicians,
      });
    }

    /* MATCH */
    const match = {};

    if (search) {
      match.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { whatsappNumber: { $regex: search, $options: "i" } },
        { operatorName: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      match.status = status;
    }

    if (operatorName && operatorName !== "all") {
      match.operatorName = operatorName;
    }

    /* SORT */
    let sortOption = { createdAt: -1 };

    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "salary_high") sortOption = { expectedSalaryMax: -1 };
    if (sort === "salary_low") sortOption = { expectedSalaryMin: 1 };

    /* FETCH ALL (NO PAGINATION ) */
    const technicians = await Technician.find(match)
      .sort(sortOption)
      .lean();

    /* RESPONSE */
    res.status(200).json({
      success: true,
      count: technicians.length,
      data: technicians,
    });

  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};