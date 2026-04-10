const Product = require("../model/Product");
const mongoose = require("mongoose");
const SubSubCategory = require("../model/subSubCartegory");
const SubCategory = require("../model/SubCategory");


exports.getProducts = async (req, res) => {
    try {
        let {
            category,
            subCategory,
            subSubCategory,
            page = 1,
            limit = 20,
            search = "",
            sort = "newest",
            minPrice,
            maxPrice,
        } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        /* ── 1. Build match query ── */
        const match = {};

        if (category) {
            match.category = new mongoose.Types.ObjectId(category);
        }

        if (subCategory) {
            match.subCategory = new mongoose.Types.ObjectId(subCategory);
        }

        if (subSubCategory) {
            const subSub = await SubSubCategory.findById(subSubCategory);

            if (subSub) {
                match.subSubCategory = subSub._id;
                match.subCategory = subSub.subCategory;
                match.category = subSub.category;
            }
        }

        if (minPrice || maxPrice) {
            match.price = {};

            if (minPrice) match.price.$gte = Number(minPrice);
            if (maxPrice) match.price.$lte = Number(maxPrice);
        }
        
        if (search) {
            match.name = { $regex: search, $options: "i" };
        }

        /* ── 2. Sorting ── */
        let sortOption = { createdAt: -1 };

        if (sort === "price_asc") sortOption = { price: 1 };
        if (sort === "price_desc") sortOption = { price: -1 };
        if (sort === "name_asc") sortOption = { name: 1 };
        if (sort === "rating") sortOption = { ratings: -1 };

        /* ── 3. Aggregation ── */
        const pipeline = [
            { $match: match },

            {
                $project: {
                    name: 1,
                    price: 1,
                    previous_price: 1,
                    ratings: 1,
                    isBestProduct: 1,
                    images: { $slice: ["$images", 1] },

                    discount: {
                        $cond: [
                            { $gt: ["$previous_price", 0] },
                            {
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
                            0,
                        ],
                    },
                },
            },

            { $sort: sortOption },

            {
                $facet: {
                    products: [{ $skip: skip }, { $limit: limitNum }],
                    totalCount: [{ $count: "count" }],
                },
            },
        ];

        const result = await Product.aggregate(pipeline);

        const products = result[0].products;
        const total = result[0].totalCount[0]?.count || 0;

        res.status(200).json({
            success: true,
            products,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error("Catalog Error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getSubCategoryFeed = async (req, res) => {
    try {
        const { subCategoryId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
            return res.status(400).json({ message: "Invalid subCategoryId" });
        }

        const subCatId = new mongoose.Types.ObjectId(subCategoryId);

        const subCategoryDoc = await SubCategory.findById(subCatId)
            .select("name category")
            .populate("category", "name");

        const result = await SubSubCategory.aggregate([
            {
                $match: {
                    subCategory: subCatId,
                },
            },

            /* Lookup products once */
            {
                $lookup: {
                    from: "products",
                    let: { subSubId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$subSubCategory", "$$subSubId"],
                                },
                            },
                        },

                        /* Project only required fields */
                        {
                            $project: {
                                name: 1,

                                /* Handle variants vs normal price */
                                price: {
                                    $cond: [
                                        "$hasVariants",
                                        { $arrayElemAt: ["$variants.price", 0] },
                                        "$price",
                                    ],
                                },

                                previous_price: {
                                    $cond: [
                                        "$hasVariants",
                                        { $arrayElemAt: ["$variants.previous_price", 0] },
                                        "$previous_price",
                                    ],
                                },

                                ratings: 1,
                                isBestProduct: 1,

                                /* Send only first image */
                                images: { $slice: ["$images", 1] },

                                /* Discount calculation */
                                discount: {
                                    $cond: [
                                        { $gt: ["$previous_price", 0] },
                                        {
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
                                        0,
                                    ],
                                },
                            },
                        },
                    ],
                    as: "allProducts",
                },
            },

            /* Add count + slice products */
            {
                $addFields: {
                    productCount: { $size: "$allProducts" },
                    products: { $slice: ["$allProducts", 10] },
                },
            },

            /* Remove empty categories */
            {
                $match: {
                    productCount: { $gt: 0 },
                },
            },

            /* Final shape */
            {
                $project: {
                    _id: 1,
                    name: 1,
                    imgUrl: 1,
                    productCount: 1,
                    products: 1,
                    hasMore: {
                        $gt: ["$productCount", 10],
                    },
                },
            },

            /* Optional: sort by product count (better UX) */
            {
                $sort: { productCount: -1 },
            },
        ]);

        res.status(200).json({
            success: true,

            breadcrumb: {
                categoryName: subCategoryDoc?.category?.name || "",
                subCategoryName: subCategoryDoc?.name || "",
            },

            shopByCategories: result.map((r) => ({
                _id: r._id,
                name: r.name,
                imgUrl: r.imgUrl,
                productCount: r.productCount,
            })),
            sections: result,
        });
    } catch (err) {
        console.error("SubCategory Feed Error:", err);
        res.status(500).json({ message: err.message });
    }
};