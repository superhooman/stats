const mongoose = require('mongoose');

const importSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        default: "[]"
    }
});

module.exports = mongoose.model('Import', importSchema);