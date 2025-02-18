const express = require('express');
const router = express.Router();

const quotesController = require('../controllers/quotes.controller')


    // #swagger.description = 'Get all distinct  Authors from the database. '
router.get('/', quotesController.getAuthors);

module.exports = router;