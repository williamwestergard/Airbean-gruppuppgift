let users = [];

function createUser({ name, email, address }) {
  const user = {
    user_id: users.length + 1,
    name,
    email,
    address,
    orders: [], // här sparas order-ID:n
  };
  users.push(user);
  return user;
}

function getUserById(id) {
  return users.find((u) => u.user_id === parseInt(id));
}

function addOrderToUser(userId, orderId) {
  const user = getUserById(userId);
  if (user) {
    user.orders.push(orderId);
  }
}

module.exports = {
  createUser,
  getUserById,
  addOrderToUser,
};

// Deletefunktionen

// Funktion för att ta bort en användare
function deleteUser(userId, callback) {
  const sql = "DELETE FROM users WHERE id = ?";
  db.run(sql, [userId], function (err) {
    if (err) {
      return callback(err); // Om det finns ett fel, returnera det
    }
    callback(null, this.changes); // Denna rad returnerar antal rader som ändrades (0 betyder att ingenting togs bort)
  });
}

module.exports = {
  deleteUser,
};
