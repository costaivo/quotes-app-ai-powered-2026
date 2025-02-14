const express = require('express');
const router = express.Router();

const quotesController = require('../controllers/quotes.controller')

/**
 * @swagger
 * components:
 *   schemas:
 *     Quote:
 *       type: object
 *       required:
 *         - quote
 *         - author
 *       properties:
 *         quote:
 *           type: string
 *           description: The quote text
 *         author:
 *           type: string
 *           description: The author of the quote
 *         tags:
 *           type: string
 *           description: Tags associated with the quote
 *         likes:
 *           type: number
 *           description: Number of likes
 *         dislikes:
 *           type: number
 *           description: Number of dislikes
 *         isActive:
 *           type: boolean
 *           description: Whether the quote is active
 */

/**
 * @swagger
 * /quote:
 *   get:
 *     summary: Get all quotes
 *     parameters:
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter quotes by author
 *       - in: query
 *         name: quote
 *         schema:
 *           type: string
 *         description: Search quotes by text
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter quotes by tags
 *     responses:
 *       200:
 *         description: List of quotes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quote'
 *   post:
 *     summary: Add a new quote
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quote'
 *     responses:
 *       201:
 *         description: Quote created successfully
 *       409:
 *         description: Quote already exists
 */

/**
 * @swagger
 * /quote/{id}:
 *   get:
 *     summary: Get a quote by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quote details
 *       404:
 *         description: Quote not found
 *   put:
 *     summary: Update a quote
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quote'
 *     responses:
 *       202:
 *         description: Quote updated successfully
 *       404:
 *         description: Quote not found
 *   delete:
 *     summary: Delete a quote
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Quote deleted successfully
 *       404:
 *         description: Quote not found
 */

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