const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fornavn: {
        type: String,
        required: true,
    },
    etternavn: {
        type: String,
        required: true,
    },
    epost: {
        type: String,
        required: true,
        unique: true,
    },
    passord: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;