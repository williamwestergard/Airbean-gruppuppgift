const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", userController.createUser);

router.delete("/", userController.deleteUser);

router.get("/", userController.dummyGetCode); // tas bort senare

module.exports = router;
