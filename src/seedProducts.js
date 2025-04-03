const fs = require("fs");
const path = require("path");
const db = require("../src/db");

// Läs in menu.json
const menuPath = path.join(__dirname, "../data/menu.json");
const menu = JSON.parse(fs.readFileSync(menuPath, "utf-8"));

// Lägg in varje produkt i "products"-tabellen
menu.menu.forEach((product) => {
  const stmt =
    "INSERT INTO products (id, title, desc, price) VALUES (?, ?, ?, ?)";
  db.run(
    stmt,
    [product.id, product.title, product.desc, product.price],
    (err) => {
      if (err) {
        console.error(`Kunde inte lägga till ${product.title}:`, err.message);
      } else {
        console.log(`Lade till: ${product.title}`);
      }
    }
  );
});
