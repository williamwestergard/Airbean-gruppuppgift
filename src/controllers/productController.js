const productsData = require("../../data/menu.json");

module.exports = {
  // Lägger in kaffe-informationen som finns i menu.json filen
  // Nu kan den hittas på http://localhost:4001/api/products
  getAll: (req, res) => {
    const products = productsData.menu || productsData;
    res.json(products);
  },
  // Lägger in varje inviduell kaffe ID  som finns i menu.json filen
  // Nu kan dem hittas på http://localhost:4001/api/products/1 - 2 - 3 etc
  getById: (req, res) => {
    const productId = parseInt(req.params.id);
    const product = productsData.menu.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: "Produkten finns inte." });
    }

    res.json(product);
  },
};
