const db = require("../db");
const { v4: uuidv4 } = require("uuid");

// Funktion för att skapa beställning
const createOrder = (userId, products) => {
  const orderId = uuidv4();
  const status = "pending";
  const createdAt = new Date().toISOString();

  return new Promise((resolve, reject) => {
    let totalPrice = 0;
    const detailedProducts = [];

    const fetchPrices = products.map(({ product_id, quantity }) => {
      return new Promise((res, rej) => {
        const sql = `SELECT price FROM products WHERE id = ?`;
        db.get(sql, [product_id], (err, row) => {
          if (err) return rej(err);
          if (!row) return rej(new Error(`Product not found: ${product_id}`));
          const itemTotal = row.price * quantity;
          totalPrice += itemTotal;
          detailedProducts.push({ product_id, quantity, price: row.price });
          res();
        });
      });
    });

    Promise.all(fetchPrices)
      .then(() => {
        db.run(
          `INSERT INTO orders (id, user_id, status, total_price, created_at) VALUES (?, ?, ?, ?, ?)`,
          [orderId, userId, status, totalPrice, createdAt],
          function (err) {
            if (err) return reject(err);

            const stmt = db.prepare(
              `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`
            );

            detailedProducts.forEach(({ product_id, quantity, price }) => {
              stmt.run(orderId, product_id, quantity, price);
            });

            stmt.finalize();

            resolve({
              orderId,
              status,
              totalPrice,
              createdAt,
            });
          }
        );
      })
      .catch((err) => reject(err));
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

// Lägg till produkt i existerande order
function addProductToOrder(orderId, productId, quantity, callback) {
  const sql = `SELECT price FROM products WHERE id = ?`;

  db.get(sql, [productId], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(new Error("Product not found"));

    const price = row.price;

    const insertSql = `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES (?, ?, ?, ?)
    `;

    db.run(insertSql, [orderId, productId, quantity, price], function (err) {
      if (err) return callback(err);

      const updateSql = `
        UPDATE orders
        SET total_price = (
          SELECT SUM(quantity * price)
          FROM order_items
          WHERE order_id = ?
        )
        WHERE id = ?
      `;
      db.run(updateSql, [orderId, orderId], function (err) {
        if (err) return callback(err);
        callback(null, { success: true, productId, quantity, price });
      });
    });
  });
}

// Ta bort produkt från en order
function removeProductFromOrder(orderId, productId) {
  return new Promise((resolve, reject) => {
    const deleteSql = `DELETE FROM order_items WHERE order_id = ? AND product_id = ?`;

    db.run(deleteSql, [orderId, productId], function (err) {
      if (err) return reject(err);

      const sumSql = `SELECT SUM(quantity * price) as newTotal FROM order_items WHERE order_id = ?`;

      db.get(sumSql, [orderId], (err, row) => {
        if (err) return reject(err);

        const newTotal = row.newTotal || 0;

        const updateSql = `UPDATE orders SET total_price = ? WHERE id = ?`;
        db.run(updateSql, [newTotal, orderId], function (err) {
          if (err) return reject(err);

          resolve({
            message: "Product removed and total price updated",
            newTotal,
          });
        });
      });
    });
  });
}

module.exports = {
  createOrder,
  findOrder,
  addProductToOrder,
  removeProductFromOrder,
};
