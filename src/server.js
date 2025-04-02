// Skriv "npm start" för att starta upp servern.
// [nodemon] gör man inte behöver starta om servern för att se ändringarna.
const express = require("express");
const app = express();
const products = require("../data/menu.json");
const orderRoute = require("./routes/orderRoutes");
const PORT = 4001;

app.use(express.json());

// Skräp kod för att se att man är kopplad till servern på localhost. Kan tas bort senare.
app.get("/", (req, res) => {
  res.send(`Denna text är på startsidan!`);
});

// Kopplad till orderRoutes.js
app.use("/order", orderRoute);

// Lägger in kaffe-informationen som finns i menu.json filen
// Nu kan den hittas på /api/products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Lägger in varje inviduell kaffe ID  som finns i menu.json filen
// Nu kan dem hittas på /api/products/1 - 2 - 3 etc
app.get("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.menu.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: "Produkten finns inte." });
  }
  res.json(product);
});

// Gör att serven körs på PORT 4001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
