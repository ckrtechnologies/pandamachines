const Product = require("../model/Product");
const Category = require("../model/Category");
const HomepageConfig = require("../model/homepageconfig");

//  Shared helpers 

// Minimal fields needed for a product card on home screen
const HOME_CARD_FIELDS =
    "name price previous_price discount images ratings shippingType warranty stock_status";

// Base match — only approved products from non-blocked suppliers
const baseProductPipeline = () => [
    {
        $match: {
            status: "approved",
            stock_status: { $ne: "out of stock" },
            images: {
                $exists: true,
                $type: "array",
                $ne: [],
            },
        },
    },
    {
        $lookup: {
            from: "suppliers",
            localField: "supplier",
            foreignField: "_id",
            as: "supplierData",
        },
    },
    {
        $match: {
            $or: [
                { supplierData: { $size: 0 } },           // admin product (no supplier)
                { "supplierData.0.isBlocked": { $ne: true } }, // supplier not blocked
            ],
        },
    },
    {
        $project: {
            supplierData: 0, // drop the joined supplier — not needed on cards
        },
    },
];

// Compute discount and attach it
const discountAddField = {
    $addFields: {
        discount: {
            $cond: {
                if: {
                    $and: [
                        { $gt: ["$previous_price", 0] },
                        { $gt: ["$price", 0] },
                        { $gt: ["$previous_price", "$price"] },
                    ],
                },
                then: {
                    $round: [
                        {
                            $multiply: [
                                {
                                    $divide: [
                                        { $subtract: ["$previous_price", "$price"] },
                                        "$previous_price",
                                    ],
                                },
                                100,
                            ],
                        },
                        0,
                    ],
                },
                else: 0,
            },
        },
    },
};

// Project only card-level fields
const cardProjection = {
    $project: {
        name: 1,
        price: 1,
        previous_price: 1,
        discount: 1,
        images: { $slice: ["$images", 1] }, // only first image
        ratings: 1,
        shippingType: 1,
        "warranty.hasWarranty": 1,
        stock_status: 1,
    },
};

//  1. New Arrivals 
// Sort by createdAt desc, limit 10
exports.getNewArrivals = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const products = await Product.aggregate([
            ...baseProductPipeline(),
            discountAddField,
            { $sort: { createdAt: -1 } },
            { $limit: limit },
            cardProjection,
        ]);

        return res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error("getNewArrivals error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

//  2. Hot Deals 
// Products where previous_price > price, sorted by discount % desc
exports.getHotDeals = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const products = await Product.aggregate([
            ...baseProductPipeline(),
            // Only products that actually have a real discount
            {
                $match: {
                    previous_price: { $exists: true, $gt: 0 },
                    $expr: { $gt: ["$previous_price", "$price"] },
                },
            },
            discountAddField,
            { $sort: { discount: -1 } },  // highest discount first
            { $limit: limit },
            cardProjection,
        ]);

        return res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error("getHotDeals error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

//  3. Category Strips 
// Returns featured categories (from HomepageConfig) each with 8 products
exports.getCategoryStrips = async (req, res) => {
    try {
        const config = await HomepageConfig.findOne().lean();

        if (!config || !config.featuredCategoryIds?.length) {
            return res.status(200).json({ success: true, data: [] });
        }

        const categoryIds = config.featuredCategoryIds;

        // Fetch category details + their products in parallel
        const strips = await Promise.all(
            categoryIds.map(async (categoryId) => {
                const [category, products] = await Promise.all([
                    Category.findById(categoryId).select("name imgUrl").lean(),
                    Product.aggregate([
                        {
                            $match: {
                                category: categoryId,
                                status: "approved",
                                stock_status: { $ne: "out of stock" },
                            },
                        },
                        {
                            $lookup: {
                                from: "suppliers",
                                localField: "supplier",
                                foreignField: "_id",
                                as: "supplierData",
                            },
                        },
                        {
                            $match: {
                                $or: [
                                    { supplierData: { $size: 0 } },
                                    { "supplierData.0.isBlocked": { $ne: true } },
                                ],
                            },
                        },
                        discountAddField,
                        { $sort: { createdAt: -1 } },
                        { $limit: 8 },
                        cardProjection,
                    ]),
                ]);

                if (!category) return null; // skip deleted categories

                return {
                    category,
                    products,
                };
            })
        );

        // Drop nulls (categories that were deleted after being configured)
        const validStrips = strips.filter(Boolean);

        return res.status(200).json({
            success: true,
            data: validStrips,
        });
    } catch (error) {
        console.error("getCategoryStrips error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

//  4. Homepage Config (Admin) 

// GET current config
exports.getHomepageConfig = async (req, res) => {
    try {
        const config = await HomepageConfig.findOne()
            .populate("featuredCategoryIds", "name imgUrl")
            .lean();

        return res.status(200).json({
            success: true,
            data: config || { featuredCategoryIds: [] },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT — upsert featured category list (admin only)
exports.updateHomepageConfig = async (req, res) => {
    try {
        const { featuredCategoryIds } = req.body;

        if (!Array.isArray(featuredCategoryIds)) {
            return res.status(400).json({
                success: false,
                message: "featuredCategoryIds must be an array",
            });
        }

        if (featuredCategoryIds.length > 6) {
            return res.status(400).json({
                success: false,
                message: "Maximum 6 featured categories allowed",
            });
        }

        // Verify all IDs actually exist
        const found = await Category.find({
            _id: { $in: featuredCategoryIds },
        }).select("_id");

        if (found.length !== featuredCategoryIds.length) {
            return res.status(400).json({
                success: false,
                message: "One or more category IDs are invalid",
            });
        }

        // Singleton upsert — always update the one document
        const config = await HomepageConfig.findOneAndUpdate(
            {},
            { featuredCategoryIds },
            { upsert: true, new: true }
        ).populate("featuredCategoryIds", "name imgUrl");

        return res.status(200).json({
            success: true,
            message: "Homepage config updated successfully",
            data: config,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//  5. View All — products by category (paginated) 
// This is what "See All →" calls. Reuses your existing getAllProductsOptimized
// pattern but scoped to a category.
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        let {
            page = 1,
            limit = 20,
            sortBy = "createdAt",
            order = "desc",
            search,
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const matchStage = {
            category: new require("mongoose").Types.ObjectId(categoryId),
            status: "approved",
            stock_status: { $ne: "out of stock" },
        };

        if (search) {
            matchStage.$or = [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
            ];
        }

        const pipeline = [
            { $match: matchStage },
            {
                $lookup: {
                    from: "suppliers",
                    localField: "supplier",
                    foreignField: "_id",
                    as: "supplierData",
                },
            },
            {
                $match: {
                    $or: [
                        { supplierData: { $size: 0 } },
                        { "supplierData.0.isBlocked": { $ne: true } },
                    ],
                },
            },
            discountAddField,
            {
                $project: {
                    supplierData: 0,
                },
            },
            { $sort: { [sortBy]: order === "asc" ? 1 : -1 } },
            {
                $facet: {
                    data: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        cardProjection,
                    ],
                    totalCount: [{ $count: "count" }],
                },
            },
        ];

        const [result, category] = await Promise.all([
            Product.aggregate(pipeline),
            Category.findById(categoryId).select("name imgUrl").lean(),
        ]);

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const data = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;

        return res.status(200).json({
            success: true,
            category,
            data,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("getProductsByCategory error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTopRated = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const products = await Product.aggregate([
            ...baseProductPipeline(),
            // Only products with a meaningful rating
            {
                $match: {
                    ratings: { $gte: 4 },
                },
            },
            discountAddField,
            { $sort: { ratings: -1, createdAt: -1 } },
            { $limit: limit },
            cardProjection,
        ]);

        return res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error("getTopRated error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};