const router = require("express").Router();

const authUtil = require("../utils/authUtil");
const userController = require("../controllers/userController");

router.get("/", userController.getIndexPage);
router.get("/login", userController.getLoginPage);
router.get("/register", userController.getRegisterPage);

module.exports = router;