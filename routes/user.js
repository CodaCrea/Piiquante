const express = require('express');
const rateLimit = require('express-rate-limit');
const userController = require('../controllers/user');
const Password = require('../models/Password');
const router = express.Router();

const  limiter  =  rateLimit ({
	windowMs : 15  *  60  *  1000,  // 15 minutes
	max : 100,  // Limite chaque IP à 100 requêtes par `window` (ici, par 15 minutes)
	standardHeaders : true,  // Return rate limit info dans les en-têtes `RateLimit-*`
	legacyHeaders : true,  // Active les en-têtes `X-RateLimit-*`
});

router.post('/signup', userController.signup);
router.post('/login', limiter, userController.login);

module.exports = router;