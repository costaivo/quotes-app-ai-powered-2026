var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuoteSchema = new Schema({
    quote: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    tags: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
});

module.exports = mongoose.model('Quote', QuoteSchema);