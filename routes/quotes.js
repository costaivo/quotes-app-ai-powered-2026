const express = require('express');
const router = express.Router();

const quotesController = require('../controllers/quotes.controller')


router.get('/search', quotesController.searchQuotes);
router.get('/:id', quotesController.getQuote);
router.delete('/:id', quotesController.deleteQuote);
router.patch('/:id', quotesController.editQuote);
router.get('/', quotesController.getQuotes);
router.post('/', quotesController.addQuote);



router.post('/:id/likes/up', quotesController.updateLikesUp);
router.post('/:id/likes/down', quotesController.updateLikesDown);
router.post('/:id/dislike/up', quotesController.updateDislikesUp);
router.post('/:id/dislike/down', quotesController.updateDislikesDown);



module.exports = router;