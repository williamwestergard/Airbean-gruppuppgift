const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const db = require("../db");

// Importerar informationen från menu.json till databasen
function importMenuData() {
  const menuPath = path.join(__dirname, "../../data/menu.json");
  const menu = JSON.parse(fs.readFileSync(menuPath, "utf-8"));

  menu.menu.forEach((product) => {
    const checkQuery = `SELECT * FROM products WHERE title = ?`;

    db.get(checkQuery, [product.title], (err, row) => {
      if (err) {
        console.error("Error checking if product exists:", err.message);
      } else if (!row) {
        const uniqueId = uuidv4();
        const stmt =
          "INSERT INTO products (id, title, desc, price) VALUES (?, ?, ?, ?)";
        db.run(
          stmt,
          [uniqueId, product.title, product.desc, product.price],
          (err) => {
            if (err) {
              console.error(
                `Could not add product: ${product.title}:`,
                err.message
              );
            } else {
              console.log(`Added: ${product.title}`);
            }
          }
        );
      } else {
        console.log(`Product ${product.title} already exists.`);
      }
    });
  });
}

// Lägger in produkterna i databasen
function addProduct(product) {
  return new Promise((resolve, reject) => {
    const checkQuery = `SELECT * FROM products WHERE title = ?`;

    db.get(checkQuery, [product.title], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        reject(new Error("Product already exists"));
      } else {
        const uniqueId = uuidv4();

        const insertQuery = `INSERT INTO products (id, title, desc, price, image_url) VALUES (?, ?, ?, ?, ?)`;
        db.run(
          insertQuery,
          [
            uniqueId,
            product.title,
            product.desc,
            product.price,
            product.image_url,
          ],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({ id: uniqueId, ...product });
            }
          }
        );
      }
    });
  });
}

// Hitta alla produkter
function getAllProducts(callback) {
  const stmt = "SELECT * FROM products";
  db.all(stmt, [], (err, rows) => {
    if (err) {
      console.error("Error fetching all products:", err.message);
      return callback([]);
    }
    callback(rows);
  });
}

// Hitta individuella produkter via de unika id:n
function getProductById(productId, callback) {
  const stmt = "SELECT * FROM products WHERE id = ?";
  db.get(stmt, [productId], (err, row) => {
    if (err) {
      console.error("Error fetching product:", err.message);
      return callback(null);
    }
    callback(row);
  });
}

module.exports = {
  importMenuData,
  addProduct,
  getProductById,
  getAllProducts,
};
