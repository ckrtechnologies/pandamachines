const Grievance = require("../model/grievance.js")

/* ===========================
   CREATE GRIEVANCE
=========================== */
exports.createGrievance = async (req, res) => {
    try {
        const { name, mobile, email, message } = req.body;

        // Validation
        if (!name || !mobile || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, mobile and message are required",
            });
        }

        if (!/^[0-9]{10}$/.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Invalid mobile number",
            });
        }

        //  Save
        const grievance = await Grievance.create({
            name,
            mobile,
            email,
            message,
            status: "pending",
        });

        /* ===========================
           EMAIL (Non-blocking safe)
        =========================== */
        // try {
        //     const transporter = nodemailer.createTransport({
        //         service: "gmail",
        //         auth: {
        //             user: process.env.EMAIL_USER,
        //             pass: process.env.EMAIL_PASS,
        //         },
        //     });

        //     await transporter.sendMail({
        //         from: process.env.EMAIL_USER,
        //         to: [
        //             "admin@gmail.com",
        //             "developer@gmail.com",
        //             "you@gmail.com",
        //         ],
        //         subject: " New Site Grievance Submitted",
        //         html: `
        //   <h3>New Grievance Received</h3>
        //   <p><b>Name:</b> ${name}</p>
        //   <p><b>Mobile:</b> ${mobile}</p>
        //   <p><b>Email:</b> ${email || "N/A"}</p>
        //   <p><b>Issue:</b></p>
        //   <p>${message}</p>
        // `,
        //     });
        // } catch (emailErr) {
        //     console.error("Email failed:", emailErr.message);
        // }

        return res.status(201).json({
            success: true,
            message: "Grievance submitted successfully",
            data: grievance,
        });
    } catch (error) {
        console.error("Create Grievance Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

/* ===========================
   GET ALL GRIEVANCES (Admin)
=========================== */
exports.getAllGrievances = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 10,
            search = "",
            status = ""
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page - 1) * limit;

        const query = {};

        // Search (name, email, mobile)
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobile: { $regex: search, $options: "i" } },
            ];
        }

        // Status filter
        if (status) {
            query.status = status;
        }

        const [grievances, total] = await Promise.all([
            Grievance.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Grievance.countDocuments(query),
        ]);

        return res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: grievances,
        });
    } catch (error) {
        console.error("Get All Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch grievances",
        });
    }
};

/* ===========================
   GET SINGLE GRIEVANCE
=========================== */
exports.getGrievanceById = async (req, res) => {
    try {
        const { id } = req.params;

        const grievance = await Grievance.findById(id);

        if (!grievance) {
            return res.status(404).json({
                success: false,
                message: "Grievance not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: grievance,
        });
    } catch (error) {
        console.error("Get One Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching grievance",
        });
    }
};

/* ===========================
   UPDATE STATUS (IMPORTANT)
=========================== */
exports.updateGrievanceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatus = ["pending", "in-progress", "resolved"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const grievance = await Grievance.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!grievance) {
            return res.status(404).json({
                success: false,
                message: "Grievance not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Status updated",
            data: grievance,
        });
    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update grievance",
        });
    }
};

/* ===========================
   DELETE GRIEVANCE (Optional)
=========================== */
exports.deleteGrievance = async (req, res) => {
    try {
        const { id } = req.params;

        const grievance = await Grievance.findByIdAndDelete(id);

        if (!grievance) {
            return res.status(404).json({
                success: false,
                message: "Grievance not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Grievance deleted",
        });
    } catch (error) {
        console.error("Delete Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete grievance",
        });
    }
};