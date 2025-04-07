// Skriv "npm start" för att starta upp servern.
// [nodemon] gör man inte behöver starta om servern för att se ändringarna.
const cors = require("cors");
const express = require("express");
const app = express();
const orderRoute = require("./routes/orderRoutes");
const productRoute = require("./routes/productRoutes");
const userRoute = require("./routes/userRoutes");
const productModel = require("./models/productModel");
const PORT = 4001;

app.use(express.json());
app.use(cors());
// app.use(express.static("public"));  <--- Kod för att få frontend att fungera.

// Skräp-kod för att se meddelande på startsidan. Kan tas bort senare.
app.get("/", (req, res) => {
  res.send("Det här är startsidan!");
});

// Kopplar till respektive fil i "routes" mappen
// Nu kan dem hittas i http://localhost:4001/api/order etc
app.use("/api/order", orderRoute);
app.use("/api/products", productRoute);
app.use("/api/user", userRoute);

// Importerar produkterna
productModel.importMenuData();

// Gör att serven körs på PORT 4001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
