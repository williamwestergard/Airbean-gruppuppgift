const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

//Skräp-kod för test. Ska tas bort sen
// router.get("/", (req, res) => {
//   res.send("Här är din order!");
// });

// Om man går in i insomnia och skriver in http://localhost:4001/api/order
// Så kan man ändra GET, POST, PUT eller delete för att få de olika svaren.

router.post("/", orderController.createOrder);

router.get("/:orderId", orderController.findOrder);

router.patch("/:orderId", orderController.addProductToOrder);

router.delete("/", (req, res) => {
  res.send("Ordern har tagits bort.");
});

module.exports = router;
