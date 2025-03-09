const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();


// Route pour l'inscription d'un nouvel utilisateur
router.post('/register', register);

// Route pour la connexion d'un utilisateur existant
router.post('/login', login);

module.exports = router;