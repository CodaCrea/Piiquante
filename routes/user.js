const express = require('express');
const rateLimit = require('express-rate-limit');
const userController = require('../controllers/user');
const Password = require('../models/Password');
const router = express.Router();

const limiter = rateLimit({
	// 15 minutes.
	windowMs: 15 * 60 * 1000,
	// Limite chaque IP à 100 requêtes par "window" (ici, par 15 minutes).
	max: 100,
	// Informations sur la limite du taux de retour dans les en-têtes "RateLimit-*".
	standardHeaders: true,
	// Active les en-têtes "X-RateLimit-*".
	legacyHeaders: true,
});

// Les routes pour l'incription et l'authentification.
router.post('/signup', userController.signup);
router.post('/login', limiter, userController.login);

module.exports = router;