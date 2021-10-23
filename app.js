// for install express
// npm init -y 
// npm i express
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

// post accept
app.use(express.static('Frontend_folder'));
app.use(express.json());
app.use(cookieParser());

// app.get("/",function(req,res){
//     console.log("hello from home page");
//     res.send("<h1>Hello from backened");
// });
// app.get("/",function(req,res) {
//    console.log("users");
//    res.json(user); 
// });

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
// let user = [];
// const userModel = require("./models/userModel");
// app.post("/api/user",createUser);
// //get
// app.get("/api/user",getUser);
// // update
// app.patch("/api/user",updateUser);
// // delete
// app.delete("/api/user",deleteUser);
// // template routes
// app.get("/api/user/:id", getUserById);

app.listen(process.env.PORT || 8080, function () {
    console.log("server started");
})