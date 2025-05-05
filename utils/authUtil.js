const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('./tokenBlacklist');

exports.validateAuthToken = (token) => {
    try {
        if (isTokenBlacklisted(token)) {
            return null; // Token is blacklisted
        }
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        console.error('Invalid or expired token:', error.message);
        return null;
    }
};