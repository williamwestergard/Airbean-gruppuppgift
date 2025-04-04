// Skriv "npm start" för att starta upp servern.
// [nodemon] gör att man inte behöver starta om servern för att se ändringarna.

const express = require("express");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = 4001;

app.use(express.json());

// Koppla order-routes
app.use("/api/order", orderRoutes);

app.get("/", (req, res) => {
  res.send(`Denna text är på startsidan!`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});