const router = require("express").Router();
const quizController = require("../controllers/quizController");
const requireAuth = require("../utils/requireAuth");
const requireAdmin = require("../utils/requireAdmin");

// Public routes
router.get("/quiz/:id", quizController.getQuizById);
router.post("/quiz/:id/submit", quizController.submitQuiz);

// Protected routes (require login)
router.get("/create-quiz", requireAuth, quizController.getCreateQuizPage);
router.post("/create-quiz", requireAuth, quizController.createQuiz);
router.put("/quiz/:id", requireAuth, quizController.updateQuiz);
router.post("/quiz/:id", requireAuth, quizController.deleteQuiz);
router.put("/quiz/:id/publish", requireAuth, quizController.publishQuiz);

module.exports = router;