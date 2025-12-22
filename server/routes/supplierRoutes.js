const express = require("express");
const router = express.Router();
const supplierController = require("../controller/supplierController");

router.get("/suppliers", supplierController.getAllSuppliers);
router.post("/suppliers/register", supplierController.supplierRegister);
router.post("/suppliers/login", supplierController.supplierLogin);
router.get("/suppliers-by-id/:id", supplierController.getSupplierById);
router.put(
  "/change-suppliers-status/:id",
  supplierController.updateSupplierStatus
);
router.put("/update-suppliers/:id", supplierController.editSupplier);
router.delete("/delete-suppliers/:id", supplierController.deleteSupplier);
router.get(
  "/suppliers/status/:status",
  supplierController.getSuppliersByStatus
);
router.put("/block-supplier/:id", supplierController.blockSupplier);
router.put("/unblock-supplier/:id", supplierController.unblockSupplier);
router.get("/blocked-suppliers", supplierController.getBlockedSuppliers);

module.exports = router;
