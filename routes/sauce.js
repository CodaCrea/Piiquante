const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceController = require('../controllers/sauce');
const router = express.Router();



router.get('/', auth, sauceController.getAllSauce);
router.post('/', auth, multer, sauceController.createSauce);
router.post('/:id/like', auth, sauceController.quoteSauce);
router.get('/:id', auth, sauceController.getOneSauce);
router.put('/:id', auth, multer, sauceController.modifySauce);
router.delete('/:id', auth, sauceController.deleteSauce);

module.exports = router;