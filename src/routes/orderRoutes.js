const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orderController");


router.post("/", createOrder); // borde vara rätt

module.exports = router;