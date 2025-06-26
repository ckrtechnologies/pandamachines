const Order = require("../model/Order");
const Product = require("../model/Product");
const Address = require("../model/address");

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { userId, products, shippingAddress } = req.body;

    const shippingData = await Address.findById(shippingAddress);
    if (!shippingData) return res.status(404).json({ message: "Shipping address not found" });

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const productData = await Product.findById(item.product);
      if (!productData) return res.status(404).json({ message: `Product ${item.product} not found` });

      let basePrice = productData.singleSize?.price || 0;

      if (productData.sizeType === "multiple" && item.size) {
        const sizeData = productData.multipleSizes.find(s => s.size === item.size);
        if (!sizeData) return res.status(400).json({ message: `Size ${item.size} not available` });
        basePrice = sizeData.price;
      }

      const gst = (basePrice * productData.gstPercentage) / 100;
      const extraTax = (basePrice * (productData.extraTaxPercentage || 0)) / 100;
      const shippingCharge = productData.shippingCharge || 0;
      const quantity = item.quantity || 1;

      const itemTotal = (basePrice + gst + extraTax + shippingCharge) * quantity;
      totalAmount += itemTotal;

      orderProducts.push({
        product: item.product,
        quantity,
        price: basePrice,
        gst,
        extraTax,
        shippingCharge,
        size: item.size || null,
      });
    }

    const order = new Order({
      user: userId,
      products: orderProducts,
      totalAmount,
      shippingAddress,
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get orders by user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("products.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });
      
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product")
      .populate("shippingAddress");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "Pending") return res.status(400).json({ message: "Only pending orders can be cancelled" });

    order.status = "Cancelled";
    await order.save();
    res.status(200).json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, pod_img_url } = req.body;
    const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    if (status === "Delivered" && pod_img_url) order.pod_img_url = pod_img_url;

    await order.save();
    res.status(200).json({ message: `Order updated to ${status}`, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email phone")
      .populate("products.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Request exchange
exports.requestExchange = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "Delivered") return res.status(400).json({ message: "Exchange allowed only for delivered orders" });
    if (order.exchangeRequest?.isRequested) return res.status(400).json({ message: "Exchange already requested" });

    order.exchangeRequest = {
      isRequested: true,
      reason,
      status: "Requested",
      requestedAt: new Date(),
    };

    await order.save();
    res.status(200).json({ message: "Exchange requested", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update exchange status (Admin)
exports.updateExchangeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Approved", "Rejected", "Completed"];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id);
    if (!order?.exchangeRequest?.isRequested) return res.status(404).json({ message: "No exchange request found" });

    order.exchangeRequest.status = status;
    if (status === "Completed") order.exchangeRequest.completedAt = new Date();

    await order.save();
    res.status(200).json({ message: `Exchange status updated to ${status}`, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
