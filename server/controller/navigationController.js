const Category = require("../model/Category");
const SubCategory = require("../model/SubCategory");
const Product = require("../model/Product");
const mongoose = require("mongoose");

exports.getCategories = async (req, res) => {
    try {
        let { page = 1, limit = 12 } = req.query;

        // Convert to numbers (important)
        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page - 1) * limit;

        // Aggregation for paginated data
        const categories = await Category.aggregate([
            {
                $addFields: {
                    sequenceNum: { $toInt: "$sequence" },
                },
            },
            {
                $sort: { sequenceNum: 1 },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    name: 1,
                    imgUrl: 1,
                    sequence: 1,
                },
            },
        ]);

        // Total count (for infinite scroll control)
        const total = await Category.countDocuments();

        return res.status(200).json({
            success: true,
            page,
            limit,
            total,
            hasMore: skip + categories.length < total,
            categories,
        });
    } catch (error) {
        console.error("Get Categories Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getSubCategories = async (req, res) => {
    try {
        let { categoryId, page = 1, limit = 12 } = req.query;

        /* ── Validation ── */
        if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                success: false,
                message: "Valid categoryId is required",
            });
        }

        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const categoryObjectId = new mongoose.Types.ObjectId(categoryId);

        /* ── 1. Paginated subcategories ── */
        const subCategories = await SubCategory.find({
            category: categoryObjectId,
        })
            .select("_id name imgUrl")
            .skip(skip)
            .limit(limit)
            .lean();

        /* ── 2. Total count (for hasMore) ── */
        const total = await SubCategory.countDocuments({
            category: categoryObjectId,
        });

        if (!subCategories.length) {
            return res.status(200).json({
                success: true,
                page,
                limit,
                total,
                hasMore: false,
                subCategories: [],
            });
        }

        /* ── 3. Product counts ── */
        const counts = await Product.aggregate([
            {
                $match: {
                    category: categoryObjectId,
                },
            },
            {
                $group: {
                    _id: "$subCategory",
                    count: { $sum: 1 },
                },
            },
        ]);

        /* ── 4. Map counts ── */
        const countMap = {};
        for (const c of counts) {
            if (c._id) {
                countMap[c._id.toString()] = c.count;
            }
        }

        /* ── 5. Merge ── */
        const finalSubCategories = subCategories.map((sub) => ({
            _id: sub._id,
            name: sub.name,
            imgUrl: sub.imgUrl,
            productCount: countMap[sub._id.toString()] || 0,
        }));

        return res.status(200).json({
            success: true,
            page,
            limit,
            total,
            hasMore: skip + finalSubCategories.length < total,
            subCategories: finalSubCategories,
        });
    } catch (error) {
        console.error("Get SubCategories Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

