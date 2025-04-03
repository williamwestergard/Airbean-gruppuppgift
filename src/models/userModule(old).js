const db = require("../db");
const { v4: uuidv4 } = require("uuid");

// Kontrollera om användare redan finns
function getUserByEmail(email, callback) {
  const sql = `SELECT * FROM users WHERE email = ?`;
  db.get(sql, [email], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
}

// Skapa ny användare, om e-post inte redan finns
function createUser(name, email, callback) {
  getUserByEmail(email, (err, existingUser) => {
    if (err) return callback(err);

    if (existingUser) {
      // Användaren finns redan → returnera den
      return callback(null, existingUser);
    }

    // Annars: skapa ny användare
    const userId = uuidv4();
    const sql = `INSERT INTO users (id, name, email) VALUES (?, ?, ?)`;
    db.run(sql, [userId, name, email], function (err) {
      if (err) return callback(err);
      callback(null, { id: userId, name, email });
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

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
};
