const sqlite3 = require("sqlite3").verbose();

// Skapar eller anslut till databasen
const db = new sqlite3.Database("./db/database.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the database.db");
  }
});

// Skapar användartabellen om den inte finns
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
  // Skapar produkttabellen om den inte finns
  db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        desc TEXT,
        price REAL NOT NULL,
        image_url TEXT
      )
    `);

  db.run(`DROP TABLE IF EXISTS orders;`, (err) => {
    if (err) {
      console.error("Error dropping orders table:", err.message);
    } else {
      console.log("Orders table dropped (if it existed).");
    }

    // Skapar orders om den inte finns.
    db.run(
      `CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      total_price REAL NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
      (err) => {
        if (err) {
          console.error("Error creating orders table:", err.message);
        } else {
          console.log("Orders table created or already exists.");
        }
      }
    );
  });

  // Skapar order_items tabellen om den inte finns
  db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id TEXT NOT NULL,
          product_id TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `);
  console.log("Database tables initialized");
});

module.exports = db;
