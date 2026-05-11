const mongoose = require("mongoose");

const homepageConfigSchema = new mongoose.Schema(
    {
        featuredCategoryIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            },
        ],
    },
    { timestamps: true }
);

// Only ever one document — singleton pattern
module.exports = mongoose.model("HomepageConfig", homepageConfigSchema);