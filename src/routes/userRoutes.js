const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", userController.createUser);

router.delete("/:userId", userController.deleteUser); //Sök DELETE på /api/user/ (det unika user id:et)

router.get("/:userId", userController.getUserById); //Sök GET på /api/user/ (det unika user id:et)

module.exports = router;
