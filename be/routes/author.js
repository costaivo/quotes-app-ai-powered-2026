const express = require('express');
const router = express.Router();

const quotesController = require('../controllers/quotes.controller')

/**
 * @swagger
 * /author:
 *   get:
 *     summary: Get all authors
 *     responses:
 *       200:
 *         description: List of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

router.get('/', quotesController.getAuthors);

module.exports = router;