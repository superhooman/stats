const mongoose = require('mongoose');

const yearSchema = mongoose.Schema({
    key: {
        type: String,
    },
    value: {
        type: Number,
        default: 0
    },
    child: {
        type: Boolean,
        default: false
    },
    year: {
        type: Number,
        default: 2021
    }
});

module.exports = mongoose.model('Year', yearSchema);