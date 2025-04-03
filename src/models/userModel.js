const db = require('../db');
const { v4: uuidv4 } = require('uuid');

function createUser(name, email, callback) {
  const userId = uuidv4();
  const sql = `INSERT INTO users (id, name, email) VALUES (?, ?, ?)`;
  db.run(sql, [userId, name, email], function (err) {
    if (err) return callback(err);
    callback(null, { id: userId, name, email });
  });
}

function getUserById(userId, callback) {
  const sql = `SELECT * FROM users WHERE id = ?`;
  db.get(sql, [userId], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
}

module.exports = {
  createUser,
  getUserById
};

// Deletefunktionen

// Funktion för att ta bort en användare
function deleteUser(userId, callback) {
  const sql = 'DELETE FROM users WHERE id = ?';
  db.run(sql, [userId], function(err) {
    if (err) {
      return callback(err);  // Om det finns ett fel, returnera det
    }
    callback(null, this.changes);  // Denna rad returnerar antal rader som ändrades (0 betyder att ingenting togs bort)
  });
}

module.exports = {
  deleteUser
};