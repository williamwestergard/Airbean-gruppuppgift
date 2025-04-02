// Skriv "npm start" för att starta upp servern.
// [nodemon] gör man inte behöver starta om servern för att se ändringarna.
const cors = require("cors");
const express = require("express");
const app = express();
const orderRoute = require("./routes/orderRoutes");
const productRoute = require("./routes/productRoutes");
const userRoute = require("./routes/userRoutes");
const PORT = 4001;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Kopplar till respektive fil i "routes" mappen
app.use("/api/order", orderRoute);
app.use("/api/products", productRoute);
app.use("/api/user", userRoute);

// Gör att serven körs på PORT 4001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
