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
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
};
