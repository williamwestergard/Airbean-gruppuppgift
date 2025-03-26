const sqlite3 = require("sqlite3").verbose();

//Kopplar till SQLite databas. Ha detta högts upp i koden.
const db = new sqlite3.Database("./db/mydatabase.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

//Mer kod under här -->

module.exports = db;
