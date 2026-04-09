const mongoose = require("mongoose")

const grievanceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        email: { type: String },
        message: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "in-progress", "resolved"],
            default: "pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Grievance", grievanceSchema);