const Joi = require('joi');

const addQuote = {
    quote: Joi.string().min(20).required(),
    author: Joi.string().min(3).required(),
    tags: Joi.string().min(4).optional()
}

const editQuote = {
    quote: Joi.string().min(20).required(),
    author: Joi.string().min(3).required(),
    tags: Joi.string().min(4).optional(),
    likes: Joi.number().optional(),
    dislikes: Joi.number().optional()
}


module.exports = {
    addQuote,
    editQuote
}