// Test kod för att servern inte ska krascha.
// // Ska kopplas till models-filerna
const UserModel = require("../models/userModel(old)");

const findUser = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "Användare hittas ej" });
};

module.exports = {};
