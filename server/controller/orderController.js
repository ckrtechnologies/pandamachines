const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Order = require("../model/Order");
const Product = require("../model/Product");
const Address = require("../model/address");
const Cart = require("../model/Cart");

const resolveBasePrice = (productData, item) => {
  if (productData.hasVariants && item.variantModel) {
    const variant = productData.variants?.find((v) => v.model === item.variantModel);
    if (variant) return Number(variant.price) || 0;
  }

  if (productData.size_type === "multiple" && item.measurement) {
    const mp = productData.price_by_measurement?.[0]?.allPrice?.find(
      (p) => p.measurement === item.measurement
    );
    if (mp) return Number(mp.price) || 0;
  }

  return Number(productData.price) || 0;
};

const buildPricing = (items) => {
  let subtotal = 0, gstTotal = 0, extraTaxTotal = 0, shippingTotal = 0;

  for (const item of items) {
    const qty = item.quantity || 1;
    subtotal += item.price * qty;
    gstTotal += item.gst * qty;
    extraTaxTotal += item.extraTax * qty;
    shippingTotal += item.shippingCharge * qty;
  }

  return {
    subtotal: Number(subtotal.toFixed(2)),
    gstTotal: Number(gstTotal.toFixed(2)),
    extraTaxTotal: Number(extraTaxTotal.toFixed(2)),
    shippingTotal: Number(shippingTotal.toFixed(2)),
    grandTotal: Number((subtotal + gstTotal + extraTaxTotal + shippingTotal).toFixed(2)),
  };
};

exports.placeOrder = async (req, res) => {
  const { userId, products, shippingAddress, paymentMethod, razorpayId } = req.body;

  // Validate before touching DB
  if (!userId || !products?.length || !shippingAddress) {
    return res.status(400).json({ message: "userId, products and shippingAddress are required" });
  }
  if (paymentMethod === "Rzrpay" && !razorpayId) {
    return res.status(400).json({ message: "razorpayId is required for Razorpay payments" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const shippingData = await Address.findById(shippingAddress).session(session);
    if (!shippingData) {
      return res.status(404).json({ message: "Shipping address not found" });
    }

    // Build enriched product list
    const orderProducts = [];

    for (const item of products) {
      const productData = await Product.findById(item.product).session(session);

      if (!productData) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (productData.stock_status !== "active") {
        return res.status(400).json({ message: `"${productData.name}" is currently unavailable` });
      }

      const basePrice = resolveBasePrice(productData, item);
      const quantity = Number(item.quantity) || 1;
      const gstPerUnit = Number(((basePrice * (productData.gstPercentage || 0)) / 100).toFixed(2));
      const extraTaxPerUnit = Number(((basePrice * (productData.extraTaxPercentage || 0)) / 100).toFixed(2));
      const shippingChargePerUnit = Number(productData.shippingCharge || 0);

      orderProducts.push({
        product: productData._id,
        quantity,
        // Snapshots — frozen at order time
        productName: productData.name,
        productImage: productData.images?.[0] || "",
        brand: productData.brand || "",
        price: Number(basePrice.toFixed(2)),
        gst: gstPerUnit,
        extraTax: extraTaxPerUnit,
        shippingCharge: shippingChargePerUnit,
        size: item.measurement || null,
        variantModel: item.variantModel || null,
        sellerId: productData.uploadedBy === "supplier" ? productData.supplier : null,
        sellerType: productData.uploadedBy === "supplier" ? "supplier" : "admin",
      });
    }

    // Group by seller
    const groups = {};
    for (const item of orderProducts) {
      const key = item.sellerId ? item.sellerId.toString() : "admin";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }

    const groupOrderId = `GRP-${uuidv4().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
    const resolvedMethod = paymentMethod || "COD";
    const resolvedRazorpay = resolvedMethod === "Rzrpay" ? razorpayId : null;
    const paymentStatus = resolvedMethod === "Rzrpay" ? "Paid" : "Pending";
    const createdOrders = [];

    for (const items of Object.values(groups)) {
      const order = new Order({
        groupOrderId,
        razorpayId: resolvedRazorpay,
        user: userId,
        sellerId: items[0].sellerId || null,
        sellerType: items[0].sellerType,
        products: items,
        pricing: buildPricing(items),
        paymentMethod: resolvedMethod,
        paymentStatus,
        shippingAddress,
        orderStatus: "Pending",
      });

      await order.save({ session });
      createdOrders.push(order);
    }

    const cart = await Cart.findOne({ user: userId }).session(session);

    if (cart) {
      const orderedProductIds = products.map(
        item => item.product.toString()
      );

      cart.items = cart.items.filter(
        item => !orderedProductIds.includes(item.product.toString())
      );

      await cart.save({ session });
    }

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Orders placed successfully",
      groupOrderId,
      totalOrders: createdOrders.length,
      orders: createdOrders,
    });

  } catch (err) {
    await session.abortTransaction();
    console.error("[placeOrder]", err);
    return res.status(500).json({ success: false, message: "Failed to place order", error: err.message });
  } finally {
    session.endSession();
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      status,
      paymentMethod,
      paymentStatus,
      sort = "newest",
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { user: userId };

    if (status) filter.orderStatus = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    if (search && search.trim()) {
      const re = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { orderId: re },
        { groupOrderId: re },
        { "products.productName": re },
        { "products.brand": re },
      ];
    }

    // ── Sort ──────────────────────────────────────────
    const sortOrder = sort === "oldest" ? 1 : -1;

    // ── Pagination ────────────────────────────────────
    const currentPage = Math.max(1, Number(page));
    const pageSize = Math.min(50, Math.max(1, Number(limit)));
    const skip = (currentPage - 1) * pageSize;

    // ── Query ─────────────────────────────────────────
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("products.product", "name images price")
        .populate("shippingAddress")
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(pageSize)
        .lean(),

      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      total,
      page: currentPage,
      limit: pageSize,
      hasMore: currentPage * pageSize < total,
      orders,
    });

  } catch (err) {
    console.error("[getUserOrders]", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = id.startsWith("ORD-") ? { orderId: id } : { _id: id };

    const order = await Order.findOne(query)
      .populate("products.product", "name images price")
      .populate("shippingAddress")
      .populate("user", "firstName lastName email phone");

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json(order);
  } catch (err) {
    console.error("[getOrderById]", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getOrdersByGroup = async (req, res) => {
  try {
    const { groupOrderId } = req.params;

    const orders = await Order.find({ groupOrderId })
      .populate("products.product", "name images price")
      .populate("shippingAddress")
      .sort({ createdAt: 1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this group" });
    }

    const groupTotal = Number(
      orders.reduce((sum, o) => sum + o.pricing.grandTotal, 0).toFixed(2)
    );

    return res.status(200).json({ groupOrderId, orderCount: orders.length, groupTotal, orders });
  } catch (err) {
    console.error("[getOrdersByGroup]", err);
    return res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// USER — CANCEL ORDER
// ─────────────────────────────────────────────

/**
 * PUT /orders/cancel-order/:id
 * Cancels a single seller-order (not the whole group).
 * Only allowed when orderStatus === "Pending".
 */
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== "Pending") {
      return res.status(400).json({
        message: `Cannot cancel an order with status "${order.orderStatus}". Only Pending orders can be cancelled.`,
      });
    }

    order.orderStatus = "Cancelled";

    if (order.paymentMethod === "Rzrpay") {
      // FUTURE: Razorpay partial refund
      // await razorpay.payments.refund(order.razorpayId, {
      //   amount: Math.round(order.pricing.grandTotal * 100),
      //   notes: { orderId: order.orderId }
      // });
      order.paymentStatus = "Refunded";
    }
    // COD: no payment taken, no refund needed

    await order.save();
    return res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("[cancelOrder]", err);
    return res.status(500).json({ error: err.message });
  }
};


/**
 * PUT /orders/order-exchange-request/:id
 * Body: { reason }
 */
exports.requestExchange = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason?.trim()) {
      return res.status(400).json({ message: "Reason is required" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({ message: "Exchange is only allowed for delivered orders" });
    }
    if (order.exchangeRequest?.isRequested) {
      return res.status(400).json({ message: "Exchange already requested for this order" });
    }

    order.orderStatus = "Exchange Requested";
    order.exchangeRequest = {
      isRequested: true,
      reason,
      status: "Requested",
      requestedAt: new Date(),
    };

    await order.save();
    return res.status(200).json({ message: "Exchange requested", order });
  } catch (err) {
    console.error("[requestExchange]", err);
    return res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// ADMIN — GET ALL ORDERS
// ─────────────────────────────────────────────

/**
 * GET /orders/get-all-orders
 * Query: status?, sellerType?, sellerId?, paymentMethod?, paymentStatus?, search?, page?, limit?
 */
exports.getAllOrders = async (req, res) => {
  try {
    const {
      status, sellerType, sellerId,
      paymentMethod, paymentStatus,
      page = 1, limit = 20, search,
    } = req.query;

    const filter = {};
    if (status) filter.orderStatus = status;
    if (sellerType) filter.sellerType = sellerType;
    if (sellerId) filter.sellerId = sellerId;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { groupOrderId: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate("user", "firstName lastName email phone")
      .populate("products.product", "name images")
      .populate("shippingAddress")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({ total, page: Number(page), limit: Number(limit), orders });
  } catch (err) {
    console.error("[getAllOrders]", err);
    return res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// ADMIN — UPDATE ORDER STATUS
// ─────────────────────────────────────────────

/**
 * PUT /orders/update-order-status/:id
 * Body: { status, pod_img_url? }
 *
 * Enforces forward-only transitions in the main flow.
 * Terminal states (Cancelled, Returned) reachable from anywhere.
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, pod_img_url } = req.body;

    const validStatuses = [
      "Pending", "Confirmed", "Processing",
      "Shipped", "Delivered", "Cancelled", "Returned",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Forward-only guard for main flow
    const mainFlow = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
    const currentIdx = mainFlow.indexOf(order.orderStatus);
    const newIdx = mainFlow.indexOf(status);
    const isTerminal = ["Cancelled", "Returned"].includes(status);

    if (!isTerminal && currentIdx !== -1 && newIdx !== -1 && newIdx < currentIdx) {
      return res.status(400).json({
        message: `Cannot move order from "${order.orderStatus}" back to "${status}"`,
      });
    }

    order.orderStatus = status;

    if (status === "Delivered") {
      if (pod_img_url) order.pod_img_url = pod_img_url;
      // COD: mark paid on delivery
      if (order.paymentMethod === "COD") order.paymentStatus = "Paid";
    }

    if (status === "Cancelled" && order.paymentMethod === "Rzrpay") {
      // FUTURE: Razorpay refund
      // await razorpay.payments.refund(order.razorpayId, {
      //   amount: Math.round(order.pricing.grandTotal * 100),
      // });
      order.paymentStatus = "Refunded";
    }

    if (status === "Shipped") {
      // FUTURE: Shiprocket shipment creation
      // const shipment = await createShiprocketShipment(order);
      // order.shiprocket = { orderId: shipment.order_id, awb: shipment.awb_code, ... };
    }

    await order.save();
    return res.status(200).json({ message: `Order updated to ${status}`, order });
  } catch (err) {
    console.error("[updateOrderStatus]", err);
    return res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// ADMIN — UPDATE EXCHANGE STATUS
// ─────────────────────────────────────────────

/**
 * PUT /orders/update-exchange-status/:id
 * Body: { status }  "Approved" | "Rejected" | "Completed"
 */
exports.updateExchangeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Approved", "Rejected", "Completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid exchange status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order?.exchangeRequest?.isRequested) {
      return res.status(404).json({ message: "No exchange request found for this order" });
    }

    order.exchangeRequest.status = status;

    if (status === "Completed") {
      order.exchangeRequest.completedAt = new Date();
      order.orderStatus = "Delivered";
    }
    if (status === "Rejected") {
      order.orderStatus = "Delivered";
    }

    await order.save();
    return res.status(200).json({ message: `Exchange status updated to ${status}`, order });
  } catch (err) {
    console.error("[updateExchangeStatus]", err);
    return res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// SUPPLIER — GET OWN ORDERS
// ─────────────────────────────────────────────

/**
 * GET /orders/supplier-orders/:supplierId
 * Query: status?, page?, limit?
 *
 * Each order already contains only that supplier's products
 * (split at creation time — no JS filtering needed).
 */
exports.getSupplierOrders = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    const filter = { sellerId: supplierId };
    if (status) filter.orderStatus = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(filter);

    const [orders, pending, shipped, delivered, cancelled] = await Promise.all([
      Order.find(filter)
        .populate("user", "firstName lastName email phone")
        .populate("products.product", "name images price")
        .populate("shippingAddress")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments({ sellerId: supplierId, orderStatus: "Pending" }),
      Order.countDocuments({ sellerId: supplierId, orderStatus: "Shipped" }),
      Order.countDocuments({ sellerId: supplierId, orderStatus: "Delivered" }),
      Order.countDocuments({ sellerId: supplierId, orderStatus: "Cancelled" }),
    ]);

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      stats: { total, pending, shipped, delivered, cancelled },
      orders,
    });
  } catch (err) {
    console.error("[getSupplierOrders]", err);
    return res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// ADMIN — ORDER ANALYTICS
// ─────────────────────────────────────────────

/**
 * GET /orders/analytics
 * Query: from? (ISO date), to? (ISO date) — defaults to last 30 days
 */
exports.getOrderAnalytics = async (req, res) => {
  try {
    const to = req.query.to ? new Date(req.query.to) : new Date();
    const from = req.query.from ? new Date(req.query.from) : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dateFilter = { createdAt: { $gte: from, $lte: to } };

    const [counts, revenue] = await Promise.all([
      Order.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { ...dateFilter, paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$pricing.grandTotal" }, avg: { $avg: "$pricing.grandTotal" } } },
      ]),
    ]);

    const statusBreakdown = {};
    for (const row of counts) statusBreakdown[row._id] = row.count;

    return res.status(200).json({
      from,
      to,
      statusBreakdown,
      totalOrders: counts.reduce((s, r) => s + r.count, 0),
      revenue: revenue[0]?.total?.toFixed(2) || "0.00",
      avgOrderValue: revenue[0]?.avg?.toFixed(2) || "0.00",
    });
  } catch (err) {
    console.error("[getOrderAnalytics]", err);
    return res.status(500).json({ error: err.message });
  }
};