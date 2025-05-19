const Quiz = require('../models/quizModel');

exports.getIndexPage = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ isPublished: true })
            .populate('creator', 'fornavn etternavn')
            .sort({ createdAt: -1 });
        
        res.render("index", { quizzes });
    } catch (error) {
        console.error(error);
        res.render("index", { quizzes: [] });
    }
}

exports.getLoginPage = (req, res) => {
    res.render("login");
}

exports.getRegisterPage = (req, res) => {
    res.render("register");
}

exports.getFaqPage = (req, res) => {
    res.render("faq");
}

