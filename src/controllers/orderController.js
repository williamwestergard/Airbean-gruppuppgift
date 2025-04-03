const db = require('../db'); // Databasanslutning
const { v4: uuidv4 } = require('uuid'); // För att skapa unika order-ID:n

exports.createOrder = (req, res) => {
    const { user_id, items } = req.body; // Hämta user_id och produkter från requesten

    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Invalid order data' });
    }

    const orderId = uuidv4(); // Skapa ett unikt order-ID
    const status = 'pending'; // Standardstatus för en ny order
    const createdAt = new Date().toISOString(); // Skapa en tidsstämpel

    // Beräkna totalpris
    let totalPrice = 0;
    items.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    db.run(
        `INSERT INTO orders (id, user_id, status, total_price, created_at) VALUES (?, ?, ?, ?, ?)`,
        [orderId, user_id, status, totalPrice, createdAt],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Lägg till produkter i order_items-tabellen
            const insertItemStmt = db.prepare(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`
            );

            items.forEach(item => {
                insertItemStmt.run(orderId, item.product_id, item.quantity, item.price);
            });

            insertItemStmt.finalize(); // Stäng statement

            res.status(201).json({ orderId, status, totalPrice, createdAt });
        }
    );
};
