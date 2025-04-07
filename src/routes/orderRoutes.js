const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Om man går in i Thunder Client och skriver in http://localhost:4001/api/order
// Så kan man ändra GET, POST, PUT eller delete för att få de olika svaren.

// Skapa beställning
router.post("/", orderController.createOrder);
// Hitta beställning
router.get("/:orderId", orderController.findOrder);

// Lägg till produkt i existerande beställning
router.patch("/:orderId/", orderController.addProductToOrder);

//Ta bort produkt från beställning
router.delete(
  "/:orderId/product/:productId",
  orderController.removeProductFromOrder
);

module.exports = router;
