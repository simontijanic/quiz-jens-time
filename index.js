require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

const database = require('./config/database');
const authUtil = require('./utils/authUtil');
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');

database.connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.set("view engine", "ejs");

// Middleware to check authentication and make user available to views
app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        const user = authUtil.validateAuthToken(token);
        if (user) {
            req.user = user;
            res.locals.user = user; // Make user available to all views
        } else {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

app.use(authRouter);
app.use(userRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running`);
});