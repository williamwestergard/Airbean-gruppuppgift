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
    return res.status(400).json({ message: "Användar-Id saknas." });
  }
  UserModel.deleteUser(userId, (err) => {
    if (err) {
      return res.status(404).json({ message: err.message });
    }

    return res.status(200).json({ message: "Användare borttagen." });
  });
};

//Funktion för att uppdatera beställningen
const getOrderHistory = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "Historik hittas inte." });
  }

  // Flytta all databaslogik till modellen
  UserModel.getOrderHistory(userId, (err, result) => {
    if (err) {
      console.error("Error while trying to find user history.", err.message);
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json(result);
  });
};

module.exports = {
  createUser,
  getUserById,
  deleteUser,
  getOrderHistory,
};
