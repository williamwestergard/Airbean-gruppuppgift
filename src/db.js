// Ansluter till "./db/database.db" så att databas-informationen sparas permanent.
// Annars försvinner informationen när servern startars om.
// const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database("./db/database.db", (err) => {
//   if (err) console.error(err.message);
//   else console.log("Connected to database.db");
// });

// module.exports = db;

// Ny db.js fil från Daniel
const sqlite3 = require("sqlite3").verbose();

// Skapa eller anslut till databasen
const db = new sqlite3.Database("./db/database.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the database.db");
  }
});

// Skapa användartabellen om den inte finns
db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      address TEXT 
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating users table:", err.message);
      }
    }
  );

  // Skapa ordertabellen om den inte finns
  db.run(
    `
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating orders table:", err.message);
      }
    }
  );
});

module.exports = db;
