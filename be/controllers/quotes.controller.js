const Joi = require('joi');
const quotesValidationSchema = require('../validations/quotes')
const Quote = require('../models/quote')
var ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose')

const getAuthors = async (req, res) => {
    try {
        const authors = await Quote.find({}).distinct('author');
        res.status(200).send(authors)
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
}
const getQuotes = async (req, res) => {
    try {
        const { author, quote: quoteText, tags } = req.query;

        // If any search parameters are present, perform search
        if (author || quoteText || tags) {
            let quotes;
            if (author) {
                quotes = await searchByAuthor(author);
            } else if (quoteText) {
                quotes = await searchByQuote(quoteText);
            } else if (tags) {
                quotes = await searchByTags(tags);
            }
            return res.status(200).send(quotes);
        }

        // If no search parameters, return all quotes
        const quotes = await Quote.find({});
        res.status(200).send(quotes);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
}

async function searchByAuthor(authorName) {
    console.log('search by Author')
    const regex = new RegExp(authorName, 'i') // i for case insensitive
    const quotes = await Quote.find({ author: { $regex: regex } });
    return quotes
}

async function searchByQuote(quote) {
    const regex = new RegExp(quote, 'i') // i for case insensitive
    const quotes = await Quote.find({ quote: { $regex: regex } });
    return quotes
}

async function searchByTags(tags) {
    const regex = new RegExp(tags, 'i') // i for case insensitive
    const quotes = await Quote.find({ tags: { $regex: regex } });
    return quotes
}

const getQuote = async (req, res) => {
    try {
        const quoteId = req.params['id']
        const quotes = await Quote.findById(quoteId)
        res.status(200).send(quotes)
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
}

const addQuote = async (req, res) => {
    console.log('before joi')
    const validation = Joi.validate(req.body, quotesValidationSchema.addQuote);
    console.log('after joi')
    if (validation.error) {
        res.status(400).send({
            message: validation.error.details[0].message
        });
    } else {
        try {
            const userCheck = await Quote.findOne({
                quote: req.body.quote
            });
            if (userCheck) return res.status(409).send({
                message: 'Quote already present!'
            });

            const quote = new Quote(req.body);

            await quote.save();

            res.status(201).send({
                message: "quote added",
                quote
            })
        } catch (error) {
            res.status(400).send({
                error: error.message
            });
        }
    }
}

const editQuote = async (req, res) => {
    const quoteId = req.params['id'];

    if (quoteId == null && quoteId == '') {
        res.status(400).send({
            message: 'quoteId required for edit operation'
        });
    }
    const validation = Joi.validate(req.body, quotesValidationSchema.editQuote);

    if (validation.error) {
        res.status(400).send({
            message: validation.error.details[0].message
        });
    } else {
        try {
            let quoteIDValid = ObjectId.isValid(quoteId);

            if (!quoteIDValid)
                return res.status(403).send({
                    message: 'Invalid quote Id!'
                });
            let quote = await Quote.findById(quoteId)

            if (!quote)
                return res.status(404).send({
                    message: `Quote with id ${quoteId}not found!`
                });
            await Quote.findByIdAndUpdate(quoteId, req.body);

            res.status(202).send({
                message: "Quote updated successfully"
            })
        } catch (error) {
            res.status(400).send({
                error: error.message
            });
        }
    }
}

const deleteQuote = async (req, res) => {
    const quoteId = req.params['id'];
    console.log(quoteId)
    if (quoteId == null && quoteId == '') {
        res.status(400).send({
            message: 'QuoteId required for delete operation'
        });
    } else {
        try {
            const result = await Quote.deleteOne({
                _id: quoteId
            });

            if (result.n > 0)
                res.status(202).send({
                    message: "quote deleted"
                })
            else
                res.status(404).send({
                    message: "quote not found"
                })
        } catch (error) {
            res.status(400).send({
                error: error.message
            });
        }
    }
}


const updateLikes = async (req, res, shouldLike, shouldIncrement) => {
    const quoteId = req.params['id'];
    console.log('quote id:', quoteId)
    if (quoteId == null && quoteId == '') {
        res.status(400).send({
            message: 'quoteId required for updation operation'
        });
    }

    try {
        const quote = await Quote.findOne({
            _id: quoteId
        });

        if (!quote)
            return res.status(404).send({
                message: 'Quote not present!'
            });

        if (shouldLike) {
            if (shouldIncrement)
                quote.likes = quote.likes + 1
            else
                quote.likes = quote.likes - 1

            if (quote.likes < 0)
                quote.likes = 0
        }
        else {
            if (shouldIncrement)
                quote.dislikes = quote.dislikes + 1
            else
                quote.dislikes = quote.dislikes - 1

            if (quote.dislikes < 0)
                quote.dislikes = 0
        }

        await quote.save();

        res.status(202).send({
            message: `quote likes  : ${quote.likes} disliked ${quote.dislikes}`
        })
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
}
const updateLikesUp = async (req, res) => {
    return updateLikes(req, res, true, true)

}

const updateLikesDown = async (req, res) => {
    return updateLikes(req, res, true, false)
}

const updateDislikesUp = async (req, res) => {
    return updateLikes(req, res, false, true)
}

const updateDislikesDown = async (req, res) => {
    return updateLikes(req, res, false, false)
}

module.exports = {
    getAuthors,
    getQuote,
    getQuotes,
    addQuote,
    editQuote,
    deleteQuote,
    updateLikesUp,
    updateLikesDown,
    updateDislikesUp,
    updateDislikesDown
}