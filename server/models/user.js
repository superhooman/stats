const mongoose = require('mongoose');

const Types = {
    USER: 'user',
    ADMIN: 'admin',
};

const userSchema = new mongoose.Schema({
    type: {
        type: String,
        default: Types.USER,
    },
    name: {
        type: String,
        min: 2,
        max: 255,
        required: true,
    },
    lastName: {
        type: String,
        min: 2,
        max: 255,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.index({
    name: 'text', lastName: 'text', email: 'text',
});

module.exports = mongoose.model('User', userSchema);
module.exports.Types = Types;