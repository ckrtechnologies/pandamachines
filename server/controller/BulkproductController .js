const Product = require("../model/Product");
const Category = require("../model/Category");
const SubCategory = require("../model/SubCategory");
const SubSubCategory = require("../model/subSubCartegory");
const Supplier = require("../model/supplier");
const { validateProductRow } = require("../validators/productValidator");
const Counter = require("../model/counter");

const generateBulkPmIds = async (count) => {
    const counter = await Counter.findOneAndUpdate(
        { _id: "product_pm_id" },
        { $inc: { seq: count } },
        { new: true, upsert: true }
    );

    const start = counter.seq - count + 1;

    return Array.from({ length: count }, (_, i) => {
        const num = start + i;
        return `PM${num.toString().padStart(4, "0")}`;
    });
};

// Case-insensitive name match helper
const findByName = (list, name) => {
    if (!name) return null;
    const normalized = name.trim().toLowerCase();
    return list.find((item) => item.name.trim().toLowerCase() === normalized) || null;
};

// ─ POST /products/bulk-preview 
// Receives raw rows from frontend, resolves category names → ObjectIds,
// validates fields, returns structured preview payload. NO DB insertion.

exports.bulkPreview = async (req, res) => {
    try {
        const { rows } = req.body;

        if (!rows || !Array.isArray(rows) || rows.length === 0) {
            return res.status(400).json({ message: "No rows provided" });
        }

        if (rows.length > 50) {
            return res.status(400).json({ message: "Maximum 50 rows allowed per upload" });
        }

        //  Fetch entire category tree in 3 queries (not per-row) 
        const [allCategories, allSubCategories, allSubSubCategories] = await Promise.all([
            Category.find({}).select("_id name").lean(),
            SubCategory.find({}).select("_id name category").lean(),
            SubSubCategory.find({}).select("_id name subCategory category").lean(),
        ]);

        //  Process each row
        const processedRows = rows.map((row, index) => {
            const errors = {};
            const resolved = { ...row };

            //  Category resolution (case-insensitive) 
            const matchedCategory = findByName(allCategories, row.category);
            if (!matchedCategory) {
                errors.category = `Category "${row.category}" not found`;
                resolved.categoryId = null;
            } else {
                resolved.categoryId = matchedCategory._id;
                resolved.categoryName = matchedCategory.name;
            }

            //  SubCategory resolution (must belong to matched category) 
            if (matchedCategory) {
                const subsUnderCat = allSubCategories.filter(
                    (s) => s.category.toString() === matchedCategory._id.toString()
                );
                const matchedSub = findByName(subsUnderCat, row.subCategory);

                if (!matchedSub) {
                    errors.subCategory = `SubCategory "${row.subCategory}" not found under "${matchedCategory.name}"`;
                    resolved.subCategoryId = null;
                } else {
                    resolved.subCategoryId = matchedSub._id;
                    resolved.subCategoryName = matchedSub.name;

                    //  SubSubCategory resolution (must belong to matched subCategory) ─
                    const subSubsUnderSub = allSubSubCategories.filter(
                        (s) => s.subCategory.toString() === matchedSub._id.toString()
                    );
                    const matchedSubSub = findByName(subSubsUnderSub, row.subSubCategory);

                    if (!matchedSubSub) {
                        errors.subSubCategory = `SubSubCategory "${row.subSubCategory}" not found under "${matchedSub.name}"`;
                        resolved.subSubCategoryId = null;
                    } else {
                        resolved.subSubCategoryId = matchedSubSub._id;
                        resolved.subSubCategoryName = matchedSubSub.name;
                    }
                }
            } else {
                // Can't resolve sub/subsub without a valid category
                resolved.subCategoryId = null;
                resolved.subSubCategoryId = null;
                if (!errors.subCategory) errors.subCategory = "Cannot resolve: category is invalid";
                if (!errors.subSubCategory) errors.subSubCategory = "Cannot resolve: category is invalid";
            }

            Object.assign(errors, validateProductRow(row, { isStrict: false }));

            return {
                rowIndex: index,
                status: Object.keys(errors).length === 0 ? "valid" : "invalid",
                resolvedData: resolved,
                errors,
            };
        });

        //  Build dropdown data for frontend (for invalid rows) 
        // Send the full tree so frontend can render dependent dropdowns
        const categoryTree = allCategories.map((cat) => ({
            _id: cat._id,
            name: cat.name,
            subCategories: allSubCategories
                .filter((s) => s.category.toString() === cat._id.toString())
                .map((sub) => ({
                    _id: sub._id,
                    name: sub.name,
                    subSubCategories: allSubSubCategories
                        .filter((ss) => ss.subCategory.toString() === sub._id.toString())
                        .map((ss) => ({ _id: ss._id, name: ss.name })),
                })),
        }));

        const validCount = processedRows.filter((r) => r.status === "valid").length;
        const invalidCount = processedRows.length - validCount;

        return res.status(200).json({
            success: true,
            summary: {
                total: rows.length,
                valid: validCount,
                invalid: invalidCount,
            },
            rows: processedRows,
            categoryTree, // Used by frontend to render dropdowns for failed rows
        });
    } catch (error) {
        console.error("Bulk Preview Error:", error);
        return res.status(500).json({ message: "Server error during preview", error: error.message });
    }
};

// ─ POST /products/bulk-submit 
// Receives corrected, user-confirmed rows. Re-validates everything strictly.
// Inserts valid products via insertMany. Sets status: "pending".

exports.bulkSubmit = async (req, res) => {
    try {
        const { rows, uploadedBy, supplierId } = req.body;

        //  Basic guards 
        if (!rows || !Array.isArray(rows) || rows.length === 0) {
            return res.status(400).json({ message: "No rows provided" });
        }

        if (rows.length > 50) {
            return res.status(400).json({ message: "Maximum 50 rows allowed per upload" });
        }

        if (!["admin", "supplier"].includes(uploadedBy)) {
            return res.status(400).json({ message: "uploadedBy must be 'admin' or 'supplier'" });
        }

        //  Supplier validation 
        let finalSupplier = null;
        if (uploadedBy === "supplier") {
            if (!supplierId) {
                return res.status(400).json({ message: "supplierId is required for supplier uploads" });
            }
            const supplierExists = await Supplier.findById(supplierId);
            if (!supplierExists) {
                return res.status(404).json({ message: "Supplier not found" });
            }
            finalSupplier = supplierId;
        }

        //  Fetch category tree once ─
        const [allCategories, allSubCategories, allSubSubCategories] = await Promise.all([
            Category.find({}).select("_id name").lean(),
            SubCategory.find({}).select("_id name category").lean(),
            SubSubCategory.find({}).select("_id name subCategory category").lean(),
        ]);

        //  Validate and build insertable docs ─
        const validDocs = [];
        const failedRows = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowErrors = {};

            //  Re-validate category relationships (never trust frontend) 

            // If frontend sent ObjectIds (from dropdown selections), verify them
            // If frontend sent names (unchanged), re-resolve via name matching
            let categoryId = null;
            let subCategoryId = null;
            let subSubCategoryId = null;

            // Category
            if (row.categoryId) {
                const cat = allCategories.find((c) => c._id.toString() === row.categoryId.toString());
                if (!cat) rowErrors.category = "Invalid category ID";
                else categoryId = cat._id;
            } else {
                const cat = findByName(allCategories, row.category);
                if (!cat) rowErrors.category = `Category "${row.category}" not found`;
                else categoryId = cat._id;
            }

            // SubCategory
            if (categoryId) {
                if (row.subCategoryId) {
                    const sub = allSubCategories.find(
                        (s) =>
                            s._id.toString() === row.subCategoryId.toString() &&
                            s.category.toString() === categoryId.toString()
                    );
                    if (!sub) rowErrors.subCategory = "Invalid subCategory or it doesn't belong to selected category";
                    else subCategoryId = sub._id;
                } else {
                    const subsUnderCat = allSubCategories.filter(
                        (s) => s.category.toString() === categoryId.toString()
                    );
                    const sub = findByName(subsUnderCat, row.subCategory);
                    if (!sub) rowErrors.subCategory = `SubCategory "${row.subCategory}" not found`;
                    else subCategoryId = sub._id;
                }
            }

            // SubSubCategory
            if (subCategoryId) {
                if (row.subSubCategoryId) {
                    const subSub = allSubSubCategories.find(
                        (s) =>
                            s._id.toString() === row.subSubCategoryId.toString() &&
                            s.subCategory.toString() === subCategoryId.toString()
                    );
                    if (!subSub) rowErrors.subSubCategory = "Invalid subSubCategory or it doesn't belong to selected subCategory";
                    else subSubCategoryId = subSub._id;
                } else {
                    const subSubsUnderSub = allSubSubCategories.filter(
                        (s) => s.subCategory.toString() === subCategoryId.toString()
                    );
                    const subSub = findByName(subSubsUnderSub, row.subSubCategory);
                    if (!subSub) rowErrors.subSubCategory = `SubSubCategory "${row.subSubCategory}" not found`;
                    else subSubCategoryId = subSub._id;
                }
            }

            Object.assign(rowErrors, validateProductRow(row, { isStrict: true }));

            //  If any errors — skip this row ─
            if (Object.keys(rowErrors).length > 0) {
                failedRows.push({
                    row: i + 1,
                    data: row,
                    errors: rowErrors,
                });
                continue;
            }

            //  Build clean product doc ─
            const features = typeof row.features === "string"
                ? row.features.split(",").map((f) => f.trim()).filter(Boolean)
                : Array.isArray(row.features)
                    ? row.features
                    : [];

            validDocs.push({
                _rowIndex: i,

                name: row.name.trim(),
                description: row.description.trim(),
                brand: row.brand.trim(),
                category: categoryId,
                subCategory: subCategoryId,
                subSubCategory: subSubCategoryId,

                images: Array.isArray(row.images) ? row.images.filter(Boolean) : [],

                features,

                //  SHIPPING DEFAULTS
                shippingType: row.shippingType?.toLowerCase() || "free",
                shippingCharge: Number(row.shippingCharge) || 0,

                //  PRICING
                price: Number(row.price),
                previous_price: row.previous_price ? Number(row.previous_price) : undefined,

                //  TAX
                gstPercentage: row.gstPercentage ? Number(row.gstPercentage) : 18, // sensible default

                //  SYSTEM DEFAULTS
                size_type: "single",
                stock_status: row.stock_status || "active",

                ratings: 5,
                brandStatus: false,
                isBestProduct: false,

                //  OPTIONAL SAFE DEFAULTS
                return_policy: row.return_policy || "No return policy specified",

                warranty: {
                    hasWarranty: false,
                    warrantyDays: "0 days",
                },

                howToBuy: {
                    enabled: true,
                    showLimit: 3,
                    steps: [
                        { stepNo: 1, title: "Select Product", desc: "Choose your product", isActive: true },
                        { stepNo: 2, title: "Place Order", desc: "Confirm and place order", isActive: true },
                        { stepNo: 3, title: "Get Delivery", desc: "Receive your product", isActive: true },
                    ],
                },

                //  META
                status: "pending",
                uploadedBy,
                supplier: finalSupplier,
            });
        }

        //  Nothing to insert ─
        if (validDocs.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid rows to insert",
                summary: { total: rows.length, success: 0, failed: failedRows.length },
                errors: failedRows,
            });
        }

        //  Generate pm_ids for all valid docs in one shot 
        const pmIds = await generateBulkPmIds(validDocs.length);
        const docsToInsert = validDocs.map((doc, i) => {
            const { _rowIndex, ...cleanDoc } = doc;
            return { ...cleanDoc, pm_id: pmIds[i] };
        });

        //  insertMany with ordered:false → partial success supported ─
        let insertedProducts = [];
        const insertErrors = [];

        try {
            insertedProducts = await Product.insertMany(docsToInsert, {
                ordered: false, // don't stop on first error
            });
        } catch (bulkError) {
            // Even with ordered:false, mongoose throws if ANY doc fails.
            // The successfully inserted docs are in bulkError.insertedDocs
            if (bulkError.name === "MongoBulkWriteError") {
                insertedProducts = bulkError.insertedDocs || [];

                bulkError.writeErrors?.forEach((we) => {
                    insertErrors.push({
                        row: we.index + 1,
                        message: we.err?.errmsg || we.err?.message || "Insert failed"
                    });
                });
            } else {
                throw bulkError; // rethrow unexpected errors
            }
        }



        //  Final response 
        return res.status(201).json({
            success: true,
            summary: {
                total: rows.length,
                success: insertedProducts.length,
                failed: failedRows.length + insertErrors.length,
            },
            insertedProducts: insertedProducts.map((p) => ({
                _id: p._id,
                pm_id: p.pm_id,
                name: p.name,
                status: p.status,
            })),
            errors: [
                ...failedRows.map((f) => ({ row: f.row, errors: f.errors, type: "validation" })),
                ...insertErrors.map((e) => ({ row: e.row, message: e.message, type: "db_error" })),
            ],
        });
    } catch (error) {
        console.error("Bulk Submit Error:", error);
        return res.status(500).json({ message: "Server error during bulk submit", error: error.message });
    }
};

// ─ GET /products/bulk-category-tree ─
// Returns full category tree for frontend dropdowns.
// Called once when the preview page loads, or on-demand when a row has errors.

exports.getCategoryTree = async (req, res) => {
    try {
        const [allCategories, allSubCategories, allSubSubCategories] = await Promise.all([
            Category.find({}).select("_id name").lean(),
            SubCategory.find({}).select("_id name category").lean(),
            SubSubCategory.find({}).select("_id name subCategory").lean(),
        ]);

        const categoryTree = allCategories.map((cat) => ({
            _id: cat._id,
            name: cat.name,
            subCategories: allSubCategories
                .filter((s) => s.category.toString() === cat._id.toString())
                .map((sub) => ({
                    _id: sub._id,
                    name: sub.name,
                    subSubCategories: allSubSubCategories
                        .filter((ss) => ss.subCategory.toString() === sub._id.toString())
                        .map((ss) => ({ _id: ss._id, name: ss.name })),
                })),
        }));

        return res.status(200).json({ success: true, categoryTree });
    } catch (error) {
        console.error("Category Tree Error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};