const express = require('express');
const router = express.Router();

const quotesController = require('../controllers/quotes.controller')


router.get('/', quotesController.getQuotes);
router.post('/', quotesController.addQuote);
router.get('/:id', quotesController.getQuote);
router.patch('/:id', quotesController.editQuote);
router.delete('/:id', quotesController.deleteQuote);



router.post('/:id/likes', quotesController.updateLikesUp);
router.delete('/:id/likes', quotesController.updateLikesDown);
router.post('/:id/dislikes', quotesController.updateDislikesUp);
router.delete('/:id/dislikes', quotesController.updateDislikesDown);



module.exports = router;