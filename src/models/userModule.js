const db = require("../db"); // importera din db-anslutning
const { v4: uuidv4 } = require("uuid");

// Skapa ny användare, om e-post inte redan finns
function createUser({ name, email, address }, callback) {
  // Kolla först om användaren redan finns baserat på e-post
  const checkSql = `SELECT * FROM users WHERE email = ?`;
  db.get(checkSql, [email], (err, existingUser) => {
    if (err) return callback(err);

    if (existingUser) {
      // Användare finns redan
      return callback(null, existingUser);
    }

    // Skapa ny användare
    const userId = uuidv4();
    const insertSql = `INSERT INTO users (id, name, email, address) VALUES (?, ?, ?, ?)`;
    db.run(insertSql, [userId, name, email, address], function (err) {
      if (err) return callback(err);
      callback(null, { id: userId, name, email, address });
    });
  });
}

// Hämta användare via ID
function getUserById(userId, callback) {
  const sql = `SELECT * FROM users WHERE id = ?`;
  db.get(sql, [userId], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
}

// Lägg till order till en användare
function addOrderToUser(userId, orderId, callback) {
  // Vi antar att det finns en separat orders-tabell kopplad via user_id
  const sql = `INSERT INTO orders (id, user_id) VALUES (?, ?)`;
  db.run(sql, [orderId, userId], function (err) {
    if (err) return callback(err);
    callback(null, { orderId, userId });
  });
}

// Deletefunktionen

// Funktion för att ta bort en användare
function deleteUser(userId, callback) {
  const sql = "DELETE FROM users WHERE id = ?";
  db.run(sql, [userId], function (err) {
    if (err) {
      return callback(err); // Om det finns ett fel, returnera det
    }
    if (this.changes === 0) {
      return callback(
        new Error("Användaren finns inte eller är redan borttagen.") // Om användaren inte finns eller redan tagits bort.
      );
    }
    callback(null, this.changes); // Denna rad returnerar antal rader som ändrades (0 betyder att ingenting togs bort)
  });
}

module.exports = {
  createUser,
  getUserById,
  addOrderToUser,
  deleteUser,
};
