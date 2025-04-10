const orderModel = require("../models/orderModel"); // Importerar order model

// Skapa en ny order
const createOrder = async (req, res) => {
  const { user_id, items } = req.body; // Hämta user_id och produkter från requesten

  // Validera requestdata
  if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Felaktig beställningsinformation." });
  }

  try {
    // Anropa modellen för att skapa ordern
    const order = await orderModel.createOrder(user_id, items);

    // Skicka tillbaka det skapade ordern som svar
    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating Order.", err.message);
    return res.status(500).json({ error: err.message });
  }
};

// Hitta beställning via ID
const findOrder = async (req, res) => {
  const { orderId } = req.params;

  orderModel.findOrder(orderId, (err, order) => {
    if (err) {
      console.error("Error trying to find the order.", err.message);
      return res.status(404).json({ message: "Beställningen hittades inte." });
    }

    return res.status(200).json(order);
  });
};

// Ta bort produkt från order
const removeProductFromOrder = async (req, res) => {
  const { orderId, productId } = req.params;

  if (!orderId || !productId) {
    return res.status(400).json({ error: "OrderId eller productId saknas." });
  }

  try {
    const result = await orderModel.removeProductFromOrder(orderId, productId);

    if (result.changes === 0) {
      return res
        .status(404)
        .json({ error: "Produkten hittades inte i ordern." });
    }

    res.status(200).json({ message: "Produkten togs bort från ordern." });
  } catch (err) {
    console.error("Error with trying to remove product.", err);
    return res.status(500).json({ error: err.message });
  }
};

//Funktion för att uppdatera beställningen
const addProductToOrder = async (req, res) => {
  const { orderId } = req.params;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ error: "product_id och quantity krävs." });
  }

  // Flytta all databaslogik till modellen
  orderModel.addProductToOrder(orderId, product_id, quantity, (err, result) => {
    if (err) {
      console.error("Error while trying to add product.", err.message);
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(result);
  });
};

module.exports = {
  createOrder,
  findOrder,
  addProductToOrder,
  removeProductFromOrder,
};
