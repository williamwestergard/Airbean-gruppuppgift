const db = require('../db'); // Korrekt sökväg

const createOrder = (userId, products) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO orders (user_id) VALUES (?)', [userId], function (err) {
            if (err) {
                return reject(err);
            }

            const orderId = this.lastID;
            const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)');

            products.forEach(({ productId, quantity }) => {
                stmt.run(orderId, productId, quantity);
            });

            stmt.finalize();
            resolve(orderId);
        });
    });
};

module.exports = { createOrder };
