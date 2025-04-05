const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Sökväg till alla produkter
router.get("/", productController.getAll);
// Sökväg till individuella produkter
router.get("/:id", productController.getProductById);

module.exports = router;
