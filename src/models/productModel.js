const fs = require("fs");
const path = require("path");
const db = require("../db");

// Importerar informationen från menu.json till databasen
function importMenuData() {
  const menuPath = path.join(__dirname, "../../data/menu.json");
  const menu = JSON.parse(fs.readFileSync(menuPath, "utf-8"));

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
}

// Hämta produkter från databasen (Inte kollat om det fungerar än)
function getProducts(callback) {
  const stmt = "SELECT * FROM products";
  db.all(stmt, [], (err, rows) => {
    if (err) {
      console.error("Error fetching products:", err.message);
    } else {
      callback(rows);
    }
  });
}

module.exports = {
  importMenuData,
  getProducts,
};
