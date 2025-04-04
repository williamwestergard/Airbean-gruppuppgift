const UserModel = require("../models/userModele(old)"); // Adjust path as needed

const createUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Fält måste fyllas in." });
  }

  UserModel.createUser(name, email, (err, user) => {
    if (err) {
      console.error("Error creating user:", err);
      return res
        .status(500)
        .json({ message: "Serverfel vid skapande av användare." });
    }

    return res.status(201).json(user);
  });
};

module.exports = {
  createUser,
};
