const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Kontrollera om en produkt finns i menyn
function isValidProduct(productId, callback) {
  const sql = `SELECT * FROM products WHERE id = ?`;
  db.get(sql, [productId], (err, row) => {
    if (err) return callback(err);
    callback(null, !!row);
  });
}

// Skapa en ny order
function createOrder(userId, items, callback) {
  const orderId = uuidv4();
  const now = new Date().toISOString();

  const insertOrderSQL = `INSERT INTO orders (id, user_id, created_at) VALUES (?, ?, ?)`;

  db.run(insertOrderSQL, [orderId, userId, now], function (err) {
    if (err) return callback(err);

    const insertItemSQL = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;

    let added = 0;

    items.forEach(item => {
      isValidProduct(item.productId, (err, valid) => {
        if (err) return callback(err);
        if (!valid) return callback(new Error(`Ogiltig produkt: ${item.productId}`));

        db.run(insertItemSQL, [orderId, item.productId, item.quantity, item.price], (err) => {
          if (err) return callback(err);
          added++;
          if (added === items.length) {
            callback(null, { id: orderId, userId, created_at: now, items });
          }
        });
      });
    });
  });
}

// Lägg till produkt i befintlig order
function addProductToOrder(orderId, productId, quantity, price, callback) {
  isValidProduct(productId, (err, valid) => {
    if (err) return callback(err);
    if (!valid) return callback(new Error("Produkten finns inte i menyn"));

    const sql = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
    db.run(sql, [orderId, productId, quantity, price], function (err) {
      if (err) return callback(err);
      callback(null, { success: true });
    });
  });
}

// Ta bort produkt från en order
function removeProductFromOrder(orderItemId, callback) {
  const sql = `DELETE FROM order_items WHERE id = ?`;
  db.run(sql, [orderItemId], function (err) {
    if (err) return callback(err);
    callback(null, { success: true });
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
  addProductToOrder,
  removeProductFromOrder,
  getOrderHistory
};
