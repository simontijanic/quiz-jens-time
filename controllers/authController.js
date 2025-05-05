const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const { blacklistToken } = require('../utils/tokenBlacklist');

exports.registerUser = async (req, res) => {
    const { fornavn, etternavn, epost, passord } = req.body;

    if(!fornavn || !etternavn || !epost || !passord) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ epost });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(passord, 10);

        const newUser = new User({
            fornavn,
            etternavn,
            epost,
            passord: hashedPassword,
        });

        await newUser.save();

        res.redirect('/login');
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.loginUser = async (req, res) => {
    const { epost, passord } = req.body;

    if(!epost || !passord) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ epost });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(passord, user.passord);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true }); // Set the token in cookies

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.logoutUser = async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        blacklistToken(token);
    }
    res.clearCookie('token');
    res.redirect('/');
};