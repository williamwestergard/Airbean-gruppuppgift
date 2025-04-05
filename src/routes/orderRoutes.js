const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Om man går in i Thunder Client och skriver in http://localhost:4001/api/order
// Så kan man ändra GET, POST, PUT eller delete för att få de olika svaren.

router.post("/", orderController.createOrder);

router.get("/:orderId", orderController.findOrder);

router.patch("/:orderId/product/:productId", orderController.addProductToOrder);

router.delete(
  "/:orderId/product/:productId",
  orderController.removeProductFromOrder
);

module.exports = router;
