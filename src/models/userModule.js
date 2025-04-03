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

// Kopplar till respektive fil i "routes" mappen
// Nu kan dem hittas i http://localhost:4001/api/order etc
app.use("/user", userRoute);
app.use("/order", orderRoute);
app.use("/api/order", orderRoute);
app.use("/api/products", productRoute);
app.use("/api/user", userRoute);
