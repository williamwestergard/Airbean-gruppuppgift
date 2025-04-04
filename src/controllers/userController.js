const UserModel = require("../models/userModule");

//Funktion för att skapa användare.
const createUser = async (req, res) => {
  const { name, email, address } = req.body;

  if (!name || !email || !address) {
    return res.status(400).json({ message: "Fält måste fyllas in." });
  }

  UserModel.createUser({ name, email, address }, (err, user) => {
    if (err) {
      console.error("Error creating user:", err);
      return res
        .status(500)
        .json({ message: "Serverfel vid skapande av användare." });
    }

    return res.status(201).json(user);
  });
};

//Funktion för att hitta användare.
const getUserById = async (req, res) => {
  const { userId } = req.params;

  UserModel.getUserById(userId, (err, user) => {
    if (err) {
      console.error("Error finding user:", err);
      return res.status(500).json({ message: "Användare hittas ej." });
    }

    return res.status(201).json(user);
  });
};

//Funktion för att ta bort användare.
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Användar-ID saknas." });
  }
  UserModel.deleteUser(userId, (err) => {
    if (err) {
      return res.status(404).json({ message: err.message });
    }

    return res.status(200).json({ message: "Användare borttagen." });
  });
};

module.exports = {
  createUser,
  getUserById,
  deleteUser,
};
