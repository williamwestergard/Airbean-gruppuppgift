const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/", orderController.get);

//Ska konverteras till orderController. Är här för att testa CRUD.
router.post("/", (req, res) => {
  res.send("Ordern är skapad!");
});

router.put("/", (req, res) => {
  res.send("Ordern är uppdaterad.");
});

router.delete("/", (req, res) => {
  res.send("Ordern har tagits bort.");
});

module.exports = router;
