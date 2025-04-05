const productModel = require("../models/productModel");

// Visar alla produkter i http://localhost:4001/api/products/
const getAll = async (req, res) => {
  try {
    productModel.getAllProducts((products) => {
      const uniqueProducts = Array.from(
        new Map(products.map((item) => [item.title, item])).values()
      );
      res.status(200).json(uniqueProducts);
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Error fetching products" });
  }
};

// Hitta individuell produkt via dess id i http://localhost:4001/api/products/  [id]
const getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    productModel.getProductById(productId, (product) => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "Produkten finns inte." });
      }
    });
  } catch (err) {
    console.error("Error retrieving product:", err.message);
    res.status(500).json({ message: "Problem att hitta produkten." });
  }
};

module.exports = {
  getAll,
  getProductById,
};
