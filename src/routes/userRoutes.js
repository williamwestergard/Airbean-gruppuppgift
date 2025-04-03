const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Existerande routes
router.post('/register', userController.registerUser);

// Ny route: total summa per användare
router.get('/:id/total', userController.getUserTotal);

module.exports = router;
