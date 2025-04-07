const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Skapa ny användare
router.post("/", userController.createUser);
// Radera användaren via id
router.delete("/:userId", userController.deleteUser); //Sök DELETE på /api/user/ (det unika user id:et)
// Hitta användaren via id
router.get("/:userId", userController.getUserById); //Sök GET på /api/user/ (det unika user id:et)
// Hitta användarens beställningshistorik
router.get("/history/:userId", userController.getOrderHistory); //Sök GET på /api/user/history/ (det unika user id:et)

module.exports = router;
