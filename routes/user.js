const express = require('express');
const rateLimit = require('express-rate-limit');
const userController = require('../controllers/user');
const password = require('../middleware/password');
const email = require('../middleware/email');
const router = express.Router();

const limiter = rateLimit({
	// 3 minutes.
	windowMs: 30000,
	// Limite chaque IP à 3 requêtes par "window" (ici, par 15 minutes).
	max: 3,
	// Informations sur la limite du taux de retour dans les en-têtes "RateLimit-*".
	standardHeaders: true,
	// Active les en-têtes "X-RateLimit-*".
	legacyHeaders: true,
});

// Les routes pour l'incription et l'authentification.
router.post('/signup', email, password, userController.signup);
router.post('/login', limiter, userController.login);

module.exports = router;