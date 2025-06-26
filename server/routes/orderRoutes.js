const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");

// User actions
router.post("/place-order", orderController.placeOrder);
router.get("/get-user-orders/:userId", orderController.getUserOrders);
router.get("/get-order-by-id/:id", orderController.getOrderById);
router.put("/cancel-order/:id", orderController.cancelOrder);
router.put("/order-exchange-request/:id", orderController.requestExchange);

// Admin actions
router.get("/get-all-orders", orderController.getAllOrders);
router.put("/update-order-status/:id", orderController.updateOrderStatus);
router.put("/update-exchange-status/:id", orderController.updateExchangeStatus);

module.exports = router;
