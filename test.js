// test.js
const userModel = require('./src/models/userModel');
const orderModel = require('./src/models/orderModel');

//Skapa en användare
userModel.createUser("Hassan", "hassan@example.com", (err, user) => {
  if (err) return console.error("Fel vid skapande av användare:", err);
  console.log("Användare skapad:", user);

  // Skapa en order för användaren
  const items = [
    { productId: 1, quantity: 2, price: 49 },
    { productId: 3, quantity: 1, price: 39 }
  ];

  orderModel.createOrder(user.id, items, (err, order) => {
    if (err) return console.error("Fel vid skapande av order:", err);
    console.log(" Order skapad:", order);

    // Hämta orderhistorik
    orderModel.getOrderHistory(user.id, (err, history) => {
      if (err) return console.error("Fel vid hämtning av orderhistorik:", err);
      console.log("📜 Orderhistorik:", history);
    });
  });
});
