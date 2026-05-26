const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");

// ── User ──────────────────────────────────────────────
router.post("/place-order", orderController.placeOrder);
router.get("/get-user-orders/:userId", orderController.getUserOrders);
router.get("/get-order-by-id/:id", orderController.getOrderById);
router.get("/get-group/:groupOrderId", orderController.getOrdersByGroup);
router.put("/cancel-order/:id", orderController.cancelOrder);
router.put("/order-exchange-request/:id", orderController.requestExchange);

// ── Supplier ──────────────────────────────────────────
router.get("/supplier-orders/:supplierId", orderController.getSupplierOrders);

// ── Admin ─────────────────────────────────────────────
router.get("/get-all-orders", orderController.getAllOrders);
router.get("/analytics", orderController.getOrderAnalytics);
router.put("/update-order-status/:id", orderController.updateOrderStatus);
router.put("/update-exchange-status/:id", orderController.updateExchangeStatus);

module.exports = router;