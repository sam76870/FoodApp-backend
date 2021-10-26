// for install express
// npm init -y 
// npm i express
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const helmet = require("helmet");
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

// post accept
app.use(express.static('Frontend_folder'));
app.use(hpp({
    whitelist:[
        'select',
        'page',
        'sort',
        'myquery'
    ]
}));
// to set http header
app.use(helmet());
app.use(express.json());
// cross side scripting
app.use(xss());
// to filter mongodb query
app.use(mongoSanitize());
app.use(cookieParser());

// mounting in express

const authRouter = require('./Router/authRouter');
const userRouter = require('./Router/userRouter');
const planRouter = require('./Router/planRouter');
const reviewRouter = require('./Router/reviewRouter');
const bookingRouter = require('./Router/bookingRouter');

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/plan', planRouter);
app.use('/api/review', reviewRouter);
app.use('/api/booking', bookingRouter);
app.use(function (req, res) {
    res.status(404).json({
        message: "404 oops Page not Found"
    });
})
// It prevent to come many request from the user it block request within time upto max request
// for e.g., if, in 15 min user post request to server upto 100 so rateLimit will block that request
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message:
        "Too many accounts created from this IP, please try again after an hour"
}));
// it will not extra parameter except below


app.listen(process.env.PORT || 8080, function () {
    console.log("server started");
})