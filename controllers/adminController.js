const User = require('../models/userModel');
const Quiz = require('../models/quizModel');

exports.getAdminDashboard = async (req, res) => {
    try {
        const users = await User.find({}).sort('fornavn');
        const quizzes = await Quiz.find({}).populate('creator', 'fornavn etternavn');
        
        res.render('admin', { users, quizzes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        await User.findByIdAndUpdate(userId, { role });
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};