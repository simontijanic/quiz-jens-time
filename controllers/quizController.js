const Quiz = require('../models/quizModel');

exports.getCreateQuizPage = async (req, res) => {
    res.render('create-quiz');
};

exports.createQuiz = async (req, res) => {
    try {
        const { title, description, category, questions } = req.body;
        
        if (!title || !description || !category || !questions || questions.length === 0) {
            req.flash('error', 'Alle felt må fylles ut');
            return res.redirect('/create-quiz');
        }
        
        const newQuiz = new Quiz({
            title,
            description,
            category,
            questions,
            creator: req.user.id,
            isPublished: false
        });
        
        await newQuiz.save();
        
        req.flash('success', 'Quiz opprettet');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Kunne ikke opprette quiz');
        res.redirect('/create-quiz');
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const quizFromDB = await Quiz.findById(req.params.id)
            .populate('creator', 'fornavn etternavn')
            .lean(); // Use .lean() for a plain JS object, making it easier to modify
        
        if (!quizFromDB) {
            req.flash('error', 'Quiz ikke funnet');
            return res.redirect('/');
        }

        // Sanitize questions to remove correct answers before sending to client
        const sanitizedQuiz = {
            ...quizFromDB,
            questions: quizFromDB.questions.map(q => ({
                _id: q._id, // Keep question ID if needed by form
                questionText: q.questionText,
                options: q.options,
                questionType: q.questionType,
                points: q.points
                // correctAnswer is deliberately omitted
            }))
        };

        res.render('take-quiz', { quiz: sanitizedQuiz }); // Render take-quiz.ejs
    } catch (error) {
        console.error(error);
        req.flash('error', 'Kunne ikke hente quiz');
        res.redirect('/');
    }
};

exports.updateQuiz = async (req, res) => {
    try {
        const { title, description, questions } = req.body;
        
        if (!title || !description || !questions || questions.length === 0) {
            req.flash('error', 'Alle felt må fylles ut');
            return res.redirect(`/edit-quiz/${req.params.id}`);
        }
        
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            req.flash('error', 'Quiz ikke funnet');
            return res.redirect('/');
        }
        
        if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin') {
            req.flash('error', 'Du har ikke tillatelse til å redigere denne quizen');
            return res.redirect('/');
        }
        
        quiz.title = title;
        quiz.description = description;
        quiz.questions = questions;
        
        await quiz.save();
        
        req.flash('success', 'Quiz oppdatert');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Kunne ikke oppdatere quiz');
        res.redirect(`/edit-quiz/${req.params.id}`);
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            req.flash('error', 'Quiz ikke funnet');
            return res.redirect('/');
        }
        
        if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin') {
            req.flash('error', 'Du har ikke tillatelse til å slette denne quizen');
            return res.redirect('/');
        }
        
        await Quiz.findByIdAndDelete(req.params.id);
        
        req.flash('success', 'Quiz slettet');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Kunne ikke slette quiz');
        res.redirect('/');
    }
};

exports.publishQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        
        if (!quiz) {
            req.flash('error', 'Quiz ikke funnet');
            return res.redirect('/');
        }
        
        if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin') {
            req.flash('error', 'Du har ikke tillatelse til å publisere denne quizen');
            return res.redirect('/');
        }
        
        quiz.isPublished = true;
        await quiz.save();
        
        req.flash('success', 'Quiz publisert');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Kunne ikke publisere quiz');
        res.redirect('/');
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const userSubmittedAnswers = req.body.answers;
        const quizId = req.params.id;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            req.flash('error', 'Quiz ikke funnet');
            return res.redirect('/');
        }

        // Convert userSubmittedAnswers to an array in the correct order
        let answersArray = [];
        if (Array.isArray(userSubmittedAnswers)) {
            answersArray = userSubmittedAnswers;
        } else if (typeof userSubmittedAnswers === 'object' && userSubmittedAnswers !== null) {
            // answers is an object with keys as question indices
            answersArray = quiz.questions.map((_, idx) => userSubmittedAnswers[idx] !== undefined ? userSubmittedAnswers[idx] : '');
        }

        let achievedPoints = 0;
        let correctAnswers = [];
        let isCorrectArray = [];

        quiz.questions.forEach((question, index) => {
            const userAnswer = answersArray[index];
            let isCorrect = false;
            let correctAnswer = question.correctAnswer;

            if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
                // Unanswered
                isCorrect = false;
            } else if (question.questionType === 'multiple-choice') {
                // Both should be string for comparison
                if (String(userAnswer) === String(correctAnswer)) {
                    isCorrect = true;
                }
            } else if (question.questionType === 'true-false') {
                // Accept 'true'/'false' as string
                if (String(userAnswer).toLowerCase() === String(correctAnswer).toLowerCase()) {
                    isCorrect = true;
                }
            } else if (question.questionType === 'text-input') {
                if (userAnswer.trim().toLowerCase() === String(correctAnswer).trim().toLowerCase()) {
                    isCorrect = true;
                }
            }
            isCorrectArray.push(isCorrect);
            correctAnswers.push(correctAnswer);
            if (isCorrect) {
                achievedPoints += (question.points || 1);
            }
        });

        const totalQuestions = quiz.questions.length;
        const percentage = totalQuestions > 0 ? Math.round((achievedPoints / totalQuestions) * 100) : 0;

        res.render('quiz-results', {
            quiz,
            score: achievedPoints,
            totalQuestions,
            percentage,
            userAnswers: answersArray,
            correctAnswers,
            isCorrectArray
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Det oppstod en feil ved innsending av quiz');
        res.redirect('/');
    }
};