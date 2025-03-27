// Skriv "npm start" för att starta upp servern.
// [nodemon] gör man inte behöver starta om servern för att se ändringarna.

const express = require("express");
const app = express();
const PORT = 4001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Den här texten är på startsidan!`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
