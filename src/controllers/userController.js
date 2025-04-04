const UserModel = require("../models/userModule");

//Test för att pröva GET funktionen. Ska tas bort senare
const dummyGetCode = async (req, res) => {
  res.send("Här är din användare!");
};

const createUser = async (req, res) => {
  const { name, email, address } = req.body;

  if (!name || !email) {
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

module.exports = {
  createUser,
  dummyGetCode,
};
