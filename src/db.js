// Ansluter till "./db/database.db" så att databas-informationen sparas permanent.
// Annars försvinner informationen när servern startars om.
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/database.db", (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to database.db");
});


module.exports = db;
