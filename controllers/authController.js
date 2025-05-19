const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const { blacklistToken } = require('../utils/tokenBlacklist');

exports.registerUser = async (req, res) => {
    const { fornavn, etternavn, epost, passord } = req.body;

    if(!fornavn || !etternavn || !epost || !passord) {
        req.flash('error', 'Alle felt må fylles ut');
        return res.redirect('/register');
    }

    try {
        const existingUser = await User.findOne({ epost });
        if (existingUser) {
            req.flash('error', 'En bruker med denne e-postadressen finnes allerede');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(passord, 10);

        const newUser = new User({
            fornavn,
            etternavn,
            epost,
            passord: hashedPassword,
        });

        await newUser.save();
        
        req.flash('success', 'Registrering vellykket! Du kan nå logge inn');
        res.redirect('/login');
    }
    catch (error) {
        console.error(error);
        req.flash('error', 'Det oppstod en feil ved registrering');
        res.redirect('/register');
    }
}

exports.loginUser = async (req, res) => {
    const { epost, passord } = req.body;

    if(!epost || !passord) {
        req.flash('error', 'Alle felt må fylles ut');
        return res.redirect('/login');
    }

    try {
        const user = await User.findOne({ epost });
        if (!user) {
            req.flash('error', 'Ugyldig e-post eller passord');
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(passord, user.passord);
        if (!isMatch) {
            req.flash('error', 'Ugyldig e-post eller passord');
            return res.redirect('/login');
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true });
        
        req.flash('success', 'Du er nå logget inn');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Det oppstod en feil ved innlogging');
        res.redirect('/login');
    }
}

exports.logoutUser = async (req, res) => {
    const token = req.cookies.token;
    if (token) {
        blacklistToken(token);
    }
    res.clearCookie('token');
    req.flash('success', 'Du er nå logget ut');
    res.redirect('/');
};