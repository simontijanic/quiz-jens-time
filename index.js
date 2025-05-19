require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const app = express();

const database = require('./config/database');
const authUtil = require('./utils/authUtil');
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const quizRouter = require('./routes/quizRoute');
const adminRouter = require('./routes/adminRoute');

const userMiddleware = require('./middleware/user');

database.connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.set("view engine", "ejs");

// Middleware to check authentication and make user available to views
app.use(userMiddleware);


// Route to FAQ page
app.get('/faq', (req, res) => {
    res.render('faq');
});

app.use(authRouter);
app.use(userRouter);
app.use(quizRouter);
app.use(adminRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});