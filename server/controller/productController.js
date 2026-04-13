const Product = require("../model/Product");
const Category = require("../model/Category");
const SubCategory = require("../model/SubCategory");
const SubSubCategory = require("../model/subSubCartegory");
const Supplier = require("../model/supplier");

const generateBBId = async () => {
  const lastProduct = await Product.findOne().sort({ createdAt: -1 });
  if (!lastProduct) return "PM01";

  try {
    const lastId = lastProduct.pm_id.match(/\d+/)?.[0];
    if (!lastId) return "PM01";

    const newId = parseInt(lastId) + 1;
    return `PM${newId.toString().padStart(2, "0")}`;
  } catch (error) {
    console.error("Error generating new PM_ID:", error);
    return "PM01";
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      subSubCategory,
      brand,
      images,
      ratings,
      features,
      stock_status,
      return_policy,
      gstPercentage,
      extraTaxPercentage,
      shippingType,
      shippingCharge,
      measurement,
      warranty,
      automaticGrade,
      controlSystem,
      productType,
      material,
      energyConsumption,
      tradeInfo,
      price,
      previous_price,
      isBestProduct,
      demo_video,
      production_video,
      product_banner,
      uploadedBy,
      supplier,
      hasVariants = false,
      variants = [],
      measurementLable,
      allPrice = [],
      size_type,
      price_by_measurement = [],
      howToBuy,
    } = req.body;

    const catExists = await Category.findById(category);
    if (!catExists)
      return res.status(400).json({ message: "Category not found" });

    const subCatExists = await SubCategory.findById(subCategory);
    if (!subCatExists)
      return res.status(400).json({ message: "Sub-Category not found" });

    const subSubCatExists = await SubSubCategory.findById(subSubCategory);
    if (!subSubCatExists)
      return res.status(400).json({ message: "Sub-Sub-Category not found" });

    if (subSubCatExists.subCategory.toString() !== subCategory) {
      return res.status(400).json({
        message:
          "Sub-sub-category does not belong to the provided sub-category",
      });
    }

    if (subSubCatExists.category.toString() !== category) {
      return res.status(400).json({
        message: "Sub-sub-category does not belong to the provided category",
      });
    }

    // Variant validation - now includes model field (optional string)
    if (hasVariants) {
      if (!variants || variants.length === 0) {
        return res.status(400).json({
          message: "At least one variant is required when hasVariants is true",
        });
      }

      // Validate each variant
      for (const variant of variants) {
        if (variant.price === undefined) {
          return res.status(400).json({
            message: "Price is required for all variants",
          });
        }
        // model field is optional string - no validation needed
      }

      // Default variant validation
      const defaultVariants = variants.filter((v) => v.isDefault);
      if (defaultVariants.length > 1) {
        return res.status(400).json({
          message: "Only one variant can be marked as default",
        });
      }

      // Set first variant as default if none specified
      if (defaultVariants.length === 0) {
        variants[0].isDefault = true;
      }
    } else {
      // Validation moved to avoid conflict with size_type check
    }

    // Required fields validation
    if (gstPercentage === undefined || shippingCharge === undefined) {
      return res
        .status(400)
        .json({ message: "GST and Shipping Charge are required" });
    }

    // Supplier logic
    let finalSupplier = null;
    let productStatus = "pending";

    if (uploadedBy === "supplier") {
      if (!supplier) {
        return res.status(400).json({
          message: "Supplier ID is required when uploadedBy is 'supplier'",
        });
      }
      const supplierExists = await Supplier.findById(supplier);
      if (!supplierExists) {
        return res.status(400).json({ message: "Supplier not found" });
      }
      finalSupplier = supplier;
    } else {
      finalSupplier = null;
      productStatus = "approved";
    }

    // Dynamic Pricing & Size Validation
    if (hasVariants) {
      // ... (existing variant validation)
    } else {
      // Validate based on size_type
      if (size_type === "multiple") {
        if (!price_by_measurement || price_by_measurement.length === 0) {
          return res.status(400).json({ message: "Price by measurement is required for multiple size type" });
        }
        // Validate internal structure of price_by_measurement if needed, 
        // though schema validation might handle deep checks, basic check here is good.
        if (!price_by_measurement[0].allPrice || price_by_measurement[0].allPrice.length === 0) {
          return res.status(400).json({ message: "At least one price entry is required for multiple size type" });
        }
      } else {
        // Default to 'single' if not provided or explicitly 'single'
        if (price === undefined) {
          return res.status(400).json({
            message: "Price is required when product size_type is single",
          });
        }
      }
    }

    if (allPrice && allPrice.length > 0) {
      for (const item of allPrice) {
        if (!item.measurement || item.price === undefined) {
          return res.status(400).json({
            message: "Measurement and Price are required for all price items",
          });
        }
      }
    }

    // Generate product ID
    const pm_id = await generateBBId();

    // Create product object
    const product = new Product({
      pm_id,
      name,
      description,
      category,
      subCategory,
      subSubCategory,
      brand,
      images,
      ratings,
      features,
      stock_status,
      return_policy,
      gstPercentage,
      extraTaxPercentage,
      shippingType,
      shippingCharge,
      measurement,
      warranty: warranty || { hasWarranty: false, warrantyDays: "0 days" },
      automaticGrade,
      controlSystem,
      productType,
      material,
      energyConsumption,
      tradeInfo: tradeInfo || {
        paymentTerms: "",
        deliveryTime: "",
        supplyAbility: "",
        mainDomesticMarket: "",
      },
      hasVariants,
      variants, // Includes model field
      measurementLable,
      allPrice,
      products_by_measurement: price_by_measurement, // Mapping if names differ, or just direct
      size_type: size_type || "single",
      price_by_measurement,
      ...(!hasVariants && size_type !== "multiple" && {
        price,
        previous_price,
      }),
      isBestProduct: isBestProduct || false,
      demo_video,
      production_video,
      product_banner,
      uploadedBy: uploadedBy || "admin",
      supplier: finalSupplier,
      howToBuy,
      status: productStatus,
    });

    await product.save();
    const populatedProduct = await Product.findById(product._id)
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier");

    res.status(201).json({
      message: `Product created successfully. Status: ${productStatus}`,
      product: populatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { showAll, status } = req.query;

    let query = {};

    if (showAll === "true" || showAll === true) {
      if (status && ["pending", "approved", "cancel"].includes(status)) {
        query.status = status;
      }
    } else {
      query.status = "approved";

      if (status && ["pending", "approved", "cancel"].includes(status)) {
        query.status = status;
      }
    }
    const products = await Product.find(query)
      .populate({
        path: "category",
      })
      .populate({
        path: "subCategory",
      })
      .populate({
        path: "subSubCategory",
      })
      .populate({
        path: "supplier",
      });
    const filteredProducts = products.filter((product) => {
      if (!product.supplier) {
        return true;
      }

      return product.supplier && !product.supplier.isBlocked;
    });

    res.status(200).json(filteredProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProductsOptimized = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const matchStage = {
      status: status || "approved",
    };

    // Search condition
    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    const pipeline = [
      { $match: matchStage },

      //  Join category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      //  Join subCategory
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategory",
        },
      },
      { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } },

      //  Join subSubCategory
      {
        $lookup: {
          from: "subsubcategories",
          localField: "subSubCategory",
          foreignField: "_id",
          as: "subSubCategory",
        },
      },
      {
        $unwind: {
          path: "$subSubCategory",
          preserveNullAndEmptyArrays: true,
        },
      },

      //  Join supplier
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplier",
        },
      },
      { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },

      //  Filter blocked suppliers at DB level
      {
        $match: {
          $or: [
            { supplier: null },
            { "supplier.isBlocked": { $ne: true } },
          ],
        },
      },

      // Select only required fields
      {
        $project: {
          name: 1,
          brand: 1,
          price: 1,
          images: 1,
          status: 1,
          stock_status: 1,
          isBestProduct: 1,
          createdAt: 1,
          "category.name": 1,
          "subCategory.name": 1,
          "subSubCategory.name": 1,
          "supplier.fullName": 1,
          "supplier.businessName": 1,
        },
      },

      //  Sorting
      {
        $sort: {
          [sortBy]: order === "asc" ? 1 : -1,
        },
      },

      {
        $facet: {
          data: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Product.aggregate(pipeline);

    const data = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      subSubCategory,
      brand,
      images,
      ratings,
      features,
      stock_status,
      return_policy,
      gstPercentage,
      extraTaxPercentage,
      shippingType,
      shippingCharge,
      measurement,
      warranty,
      automaticGrade,
      controlSystem,
      productType,
      material,
      energyConsumption,
      tradeInfo,
      price,
      previous_price,
      isBestProduct,
      demo_video,
      production_video,
      product_banner,
      uploadedBy,
      hasVariants,
      variants,
      measurementLable,
      allPrice,
      size_type,
      price_by_measurement,
      howToBuy,
    } = req.body;
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    const updateData = {
      name,
      description,
      category,
      subCategory,
      subSubCategory,
      brand,
      images,
      ratings,
      features,
      stock_status,
      return_policy,
      gstPercentage,
      shippingType,
      shippingCharge,
      measurement,
      warranty,
      automaticGrade,
      controlSystem,
      productType,
      material,
      energyConsumption,
      tradeInfo,
      ...(uploadedBy &&
        ["admin", "supplier"].includes(uploadedBy) && { uploadedBy }),
      ...(extraTaxPercentage !== undefined && { extraTaxPercentage }),
      ...(isBestProduct !== undefined && { isBestProduct }),
      ...(demo_video !== undefined && { demo_video }),
      ...(production_video !== undefined && { production_video }),
      ...(product_banner !== undefined && { product_banner }),
      ...(measurementLable !== undefined && { measurementLable }),
      ...(allPrice !== undefined && { allPrice }),
      ...(size_type !== undefined && { size_type }),
      ...(price_by_measurement !== undefined && { price_by_measurement }),
      ...(howToBuy !== undefined && { howToBuy }),
    };

    if (hasVariants !== undefined) {
      updateData.hasVariants = hasVariants;

      if (hasVariants === true) {
        if (variants && variants.length > 0) {
          for (const variant of variants) {
            if (variant.price === undefined) {
              return res.status(400).json({
                message: "Price is required for all variants",
              });
            }
          }
          const defaultVariants = variants.filter((v) => v.isDefault);
          if (defaultVariants.length > 1) {
            return res.status(400).json({
              message: "Only one variant can be marked as default",
            });
          }
          if (defaultVariants.length === 0) {
            variants[0].isDefault = true;
          }
          updateData.variants = variants;
        } else if (currentProduct.hasVariants) {
          updateData.variants = currentProduct.variants;
        }
        updateData.price = undefined;
        updateData.previous_price = undefined;
      } else {
        updateData.hasVariants = false;
        updateData.variants = [];

        // Check if we are updating size_type or using existing
        const effectiveSizeType = size_type !== undefined ? size_type : currentProduct.size_type;

        if (effectiveSizeType === "multiple") {
          if (price_by_measurement === undefined && (!currentProduct.price_by_measurement || currentProduct.price_by_measurement.length === 0)) {
            return res.status(400).json({ message: "Price by measurement is required for multiple size type" });
          }
          updateData.price = undefined;
          updateData.previous_price = undefined;

        } else {
          // Single
          if (price === undefined && !currentProduct.price) {
            return res.status(400).json({
              message: "Price is required when switching to single size type",
            });
          }
          if (price !== undefined) updateData.price = price;
          if (previous_price !== undefined) updateData.previous_price = previous_price;
        }
      }
    } else if (variants !== undefined) {
      if (currentProduct.hasVariants) {
        if (variants.length === 0) {
          return res.status(400).json({
            message:
              "At least one variant is required when product has variants",
          });
        }
        for (const variant of variants) {
          if (variant.price === undefined) {
            return res.status(400).json({
              message: "Price is required for all variants",
            });
          }
        }
        const defaultVariants = variants.filter((v) => v.isDefault);
        if (defaultVariants.length > 1) {
          return res.status(400).json({
            message: "Only one variant can be marked as default",
          });
        }
        if (defaultVariants.length === 0) {
          variants[0].isDefault = true;
        }

        updateData.variants = variants;
      } else {
        return res.status(400).json({
          message:
            "Cannot add variants to a non-variant product. Set hasVariants to true first.",
        });
      }
    } else if (!currentProduct.hasVariants) {
      if (price !== undefined) {
        updateData.price = price;
      }
      if (previous_price !== undefined) {
        updateData.previous_price = previous_price;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    const products = await Product.find({
      subCategory: subCategoryId,
      status: "approved",
    })
      .populate({
        path: "category",
      })
      .populate({
        path: "subCategory",
      })
      .populate({
        path: "subSubCategory",
      })
      .populate({
        path: "supplier",
      });

    // Filter out products from blocked suppliers
    const filteredProducts = products.filter((product) => {
      if (!product.supplier) {
        return true;
      }
      return product.supplier && !product.supplier.isBlocked;
    });

    if (!filteredProducts || filteredProducts.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this sub-category" });
    }

    res.status(200).json(filteredProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsBySubSubCategory = async (req, res) => {
  try {
    const { subSubCategoryId } = req.params;

    const products = await Product.find({
      subSubCategory: subSubCategoryId,
      status: "approved",
    })
      .populate({
        path: "category",
      })
      .populate({
        path: "subCategory",
      })
      .populate({
        path: "subSubCategory",
      })
      .populate({
        path: "supplier",
      });

    // Filter out products from blocked suppliers
    const filteredProducts = products.filter((product) => {
      if (!product.supplier) {
        return true;
      }
      return product.supplier && !product.supplier.isBlocked;
    });

    res.status(200).json(filteredProducts || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubCategoriesAndProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const subCategories = await SubCategory.find({
      category: categoryId,
    }).populate("category");

    if (!subCategories || subCategories.length === 0) {
      return res
        .status(404)
        .json({ message: "No sub-categories found for this category" });
    }

    const result = await Promise.all(
      subCategories.map(async (subCategory) => {
        const subSubCategories = await SubSubCategory.find({
          subCategory: subCategory._id,
        });

        const subSubCategoriesWithProducts = await Promise.all(
          subSubCategories.map(async (subSubCategory) => {
            const products = await Product.find({
              subSubCategory: subSubCategory._id,
              status: "approved",
            }).populate("supplier");
            const filteredProducts = products.filter((product) => {
              if (!product.supplier) {
                return true;
              }
              return product.supplier && !product.supplier.isBlocked;
            });

            return {
              subSubCategory,
              products: filteredProducts,
            };
          }),
        );

        return {
          subCategory,
          subSubCategories: subSubCategoriesWithProducts,
        };
      }),
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStockStatus = async (req, res) => {
  try {
    const { stock_status } = req.body;
    const { id } = req.params;

    const validStatuses = ["active", "inactive", "out of stock"];
    if (!validStatuses.includes(stock_status)) {
      return res.status(400).json({ message: "Invalid stock status" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { stock_status },
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Stock status updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleBestProduct = async (req, res) => {
  try {
    const { isBestProduct } = req.body;
    const { id } = req.params;

    if (typeof isBestProduct !== "boolean") {
      return res
        .status(400)
        .json({ message: "isBestProduct must be true or false" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { isBestProduct },
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const message = isBestProduct
      ? "Product marked as Best Product successfully"
      : "Product removed from Best Product list successfully";

    res.status(200).json({
      message,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBestProducts = async (req, res) => {
  try {
    const bestProducts = await Product.find({
      isBestProduct: true,
      status: "approved", // Only show approved best products
    })
      .populate({
        path: "category",
      })
      .populate({
        path: "subCategory",
      })
      .populate({
        path: "subSubCategory",
      })
      .populate({
        path: "supplier",
      });

    const filteredProducts = bestProducts.filter((product) => {
      if (!product.supplier) {
        return true;
      }
      return product.supplier && !product.supplier.isBlocked;
    });

    if (!filteredProducts || filteredProducts.length === 0) {
      return res.status(404).json({ message: "No Best Products found" });
    }

    res.status(200).json(filteredProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFeaturedProductsOptimized = async (req, res) => {
  try {
    // pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // base query
    const query = {
      isBestProduct: true,
      status: "approved",
    };

    // fetch products
    const products = await Product.find(query)
      .populate({
        path: "supplier",
        match: { isBlocked: false }, //  filter at DB level
        select: "_id name isBlocked",
      })
      .select(
        "name price previous_price discount images ratings supplier"
      ) //  only required fields
      .sort({ createdAt: -1 }) // latest first (optional)
      .skip(skip)
      .limit(limit)
      .lean();

    // remove products where supplier got filtered out
    const filteredProducts = products.filter(
      (p) => p.supplier !== null || !p.supplier
    );

    // total count (for frontend pagination)
    const total = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: filteredProducts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Featured Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.getProductsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    if (!supplierId) {
      return res.status(400).json({ message: "Supplier ID is required" });
    }
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    const products = await Product.find({ supplier: supplierId.toString() })
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return res.status(200).json({
        message: "No products found for this supplier",
        supplier: {
          _id: supplier._id,
          fullName: supplier.fullName,
          businessName: supplier.businessName,
          emailId: supplier.emailId,
          mobNo: supplier.mobNo,
        },
        products: [],
        count: 0,
      });
    }

    res.status(200).json({
      message: "Products retrieved successfully",
      supplier: {
        _id: supplier._id,
        fullName: supplier.fullName,
        businessName: supplier.businessName,
        emailId: supplier.emailId,
        mobNo: supplier.mobNo,
      },
      count: products.length,
      products,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid supplier ID format",
      });
    }

    res.status(500).json({
      error: error.message,
      message: "Error fetching products by supplier",
    });
  }
};

exports.approveProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true, runValidators: true },
    )
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product approved successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const updateData = {
      status: "cancel",
      ...(reason && { rejectionReason: reason }),
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: reason
        ? `Product rejected: ${reason}`
        : "Product rejected successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const validStatuses = ["pending", "approved", "cancel"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updateData = {
      status,
      ...(status === "cancel" &&
        rejectionReason && { reason: rejectionReason }),
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: `Product status updated to ${status}`,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products by status
exports.getProductsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const validStatuses = ["pending", "approved", "cancel"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const products = await Product.find({ status })
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pending products (for admin dashboard)
exports.getPendingProducts = async (req, res) => {
  try {
    const pendingProducts = await Product.find({ status: "pending" })
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .populate("supplier")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: pendingProducts.length,
      products: pendingProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get supplier's products by status
exports.getSupplierProductsByStatus = async (req, res) => {
  try {
    const { supplierId, status } = req.params;

    // Validate status
    const validStatuses = ["pending", "approved", "cancel"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // First, check if the supplier exists
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Find products by supplier and status
    const products = await Product.find({
      supplier: supplierId.toString(),
      status: status,
    })
      .populate("category")
      .populate("subCategory")
      .populate("subSubCategory")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: `Supplier's ${status} products retrieved successfully`,
      supplier: {
        _id: supplier._id,
        fullName: supplier.fullName,
        businessName: supplier.businessName,
      },
      count: products.length,
      products,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid supplier ID format" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update ONLY brandStatus (true/false)
exports.updateBrandStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { brandStatus } = req.body;

    if (brandStatus === undefined) {
      return res.status(400).json({ message: "brandStatus is required" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { brandStatus },
      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({
      message: "Brand status updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating brand status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
