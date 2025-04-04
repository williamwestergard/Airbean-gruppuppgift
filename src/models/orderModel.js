const db = require("../db");
const { v4: uuidv4 } = require("uuid");

// Mattias kod
const createOrder = (userId, products) => {
  const orderId = uuidv4(); // Generate unique order ID
  const status = "pending"; // Default order status
  const createdAt = new Date().toISOString(); // Get current timestamp

  return new Promise((resolve, reject) => {
    let totalPrice = 0;

    // Calculate total price
    products.forEach(({ price, quantity }) => {
      totalPrice += price * quantity;
    });

    // Insert order into the orders table
    db.run(
      `INSERT INTO orders (id, user_id, status, total_price, created_at) VALUES (?, ?, ?, ?, ?)`,
      [orderId, userId, status, totalPrice, createdAt],
      function (err) {
        if (err) {
          console.error("Error inserting into orders table:", err.message);
          return reject(err); // Reject the promise if there's an error
        }

        // Prepare statement for inserting items into the order_items table
        const insertItemStmt = db.prepare(
          `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`
        );

        // Insert each product into the order_items table
        products.forEach((item) => {
          if (!item.product_id) {
            console.error("Missing product_id in items:", item);
            return reject(new Error("Product ID is required.")); // Reject the promise if product_id is missing
          }

          insertItemStmt.run(
            orderId,
            item.product_id,
            item.quantity,
            item.price
          );
        });

        // Finalize the prepared statement
        insertItemStmt.finalize();

        // Resolve the promise with order details
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

module.exports = { createOrder };

// Kontrollera om en produkt finns i menyn
function isValidProduct(productId, callback) {
  const sql = `SELECT * FROM products WHERE id = ?`;
  db.get(sql, [productId], (err, row) => {
    if (err) return callback(err);
    callback(null, !!row);
  });
}

// Skapa en ny order (Samma funktion som Mattias)
// function createOrder(userId, items, callback) {
//   const orderId = uuidv4();
//   const now = new Date().toISOString();

//   const insertOrderSQL = `INSERT INTO orders (id, user_id, created_at) VALUES (?, ?, ?)`;

//   db.run(insertOrderSQL, [orderId, userId, now], function (err) {
//     if (err) return callback(err);

//     const insertItemSQL = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;

//     let added = 0;

//     items.forEach(item => {
//       isValidProduct(item.productId, (err, valid) => {
//         if (err) return callback(err);
//         if (!valid) return callback(new Error(`Ogiltig produkt: ${item.productId}`));

//         db.run(insertItemSQL, [orderId, item.productId, item.quantity, item.price], (err) => {
//           if (err) return callback(err);
//           added++;
//           if (added === items.length) {
//             callback(null, { id: orderId, userId, created_at: now, items });
//           }
//         });
//       });
//     });
//   });
// }

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
  getOrderHistory,
};
