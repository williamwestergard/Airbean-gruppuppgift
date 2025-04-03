const orderModel = require('../models/orderModel');

function getUserTotal(req, res) {
  const userId = req.params.id;

  orderModel.getTotalSpentByUser(userId, (err, total) => {
    if (err) return res.status(500).json({ error: 'Något gick fel' });
    res.json({ userId, total });
  });
}
function registerUser(req, res) {
  res.json({ message: "Registrering är inte implementerad ännu" });
}


module.exports = {
  registerUser,
  getUserTotal
};


