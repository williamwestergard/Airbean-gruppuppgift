const db = require("../db");
const { v4: uuidv4 } = require("uuid");

// Mattias kod
const createOrder = (userId, products) => {
  const orderId = uuidv4(); // Genererar unika order ID
  const status = "pending"; // Default order status
  const createdAt = new Date().toISOString(); // Orderns skapade tidpunkt

  return new Promise((resolve, reject) => {
    let totalPrice = 0;
    // Totalt pris
    products.forEach(({ price, quantity }) => {
      totalPrice += price * quantity;
    });

    db.run(
      `INSERT INTO orders (id, user_id, status, total_price, created_at) VALUES (?, ?, ?, ?, ?)`,
      [orderId, userId, status, totalPrice, createdAt],
      function (err) {
        if (err) {
          console.error("Error inserting into orders table:", err.message);
          return reject(err);
        }

        const insertItemStmt = db.prepare(
          `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`
        );

        products.forEach((item) => {
          if (!item.product_id) {
            console.error("Missing product_id in items:", item);
            return reject(new Error("Product ID is required."));
          }

          insertItemStmt.run(
            orderId,
            item.product_id,
            item.quantity,
            item.price
          );
        });

        insertItemStmt.finalize();

        resolve({
          orderId,
          status,
          totalPrice,
          createdAt,
        });
      }
    );
  });
};

//Funktion för att hitta beställning
function findOrder(orderId, callback) {
  const orderSql = `SELECT * FROM orders WHERE id = ?`;
  const itemsSql = `SELECT * FROM order_items WHERE order_id = ?`;

  db.get(orderSql, [orderId], (err, order) => {
    if (err) return callback(err);

    if (!order) return callback(new Error("Order not found"));

    db.all(itemsSql, [orderId], (err, items) => {
      if (err) return callback(err);

      order.items = items;
      callback(null, order);
    });
  });
}

// Kontrollera om en produkt finns i menyn
function isValidProduct(productId, callback) {
  const sql = `SELECT * FROM products WHERE id = ?`;
  db.get(sql, [productId], (err, row) => {
    if (err) return callback(err);
    callback(null, !!row);
  });
}

// Lägg till produkt i befintlig order
function addProductToOrder(orderId, productId, quantity, price, callback) {
  isValidProduct(productId, (err, valid) => {
    if (err) return callback(err);
    if (!valid) return callback(new Error("Product not found"));

    const sql = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
    db.run(sql, [orderId, productId, quantity, price], function (err) {
      if (err) return callback(err);
      callback(null, { success: true });
    });
  });
}

// Ta bort produkt från en order
function removeProductFromOrder(orderId, productId) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM order_items WHERE order_id = ? AND product_id = ?`;

    db.run(sql, [orderId, productId], function (err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
}

// Hämta orderhistorik för användare
function getOrderHistory(userId, callback) {
  const sql = `
    SELECT o.id as order_id, o.created_at, p.title, oi.quantity, oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;
  db.all(sql, [userId], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

module.exports = {
  createOrder,
  findOrder,
  addProductToOrder,
  removeProductFromOrder,
  getOrderHistory,
};
