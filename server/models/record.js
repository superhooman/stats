const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
    key: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    value: {
        type: Number,
        default: 0
    },
    child: {
        type: Boolean,
        default: false
    },
    notes: [String]
});

module.exports = mongoose.model('Record', recordSchema);