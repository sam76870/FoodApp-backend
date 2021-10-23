const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const express = require('express');
const { JWT_KEY } = require("../secrets");
// const emailSender = require('../externalServices/emailSender')
const authRouter = express.Router();
authRouter
    .post("/signup", setCreatedAt, signupUser)
    .post("/login", loginUser)
    .post("/forgetpassword", forgetPassword)
    .post("/resetpassword", resetPassword)

async function signupUser(req, res) {
    // email, password, name
    try {
        // let { email, password, name } = req.body;
        let userObj = req.body;
        console.log("userObj", userObj);
        let user = await userModel.create(userObj);
        console.log("user", user);
        // user.push({
        //     email, password, name
        // });
        res.status(200).json({
            message: "user created",
            createdUser: user
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
async function loginUser(req, res) {
    try {
        if (req.body.email) {
            let userCredential = await userModel.findOne({ email: req.body.email });
            if (userCredential) {
                if (userCredential.password == req.body.password) {
                    // http header
                    let payload = userCredential["_id"];
                    // console.log(JWT_KEY);
                    let token = jwt.sign({ id: payload }, JWT_KEY);
                    res.cookie("jwt", token, { httpOnly: true })
                    return res.status(200).json({
                        userCredential,
                        "message": "user logged in"
                    })
                } else {
                    return res.status(401).json({
                        "message": "email or password is wrong"
                    })
                }
            } else {
                return res.status(401).json({
                    "message": "email or password is wrong"
                })
            }

        } else {
            return res.status(403).json({
                "message": "email is not found"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
async function forgetPassword(req, res) {
    let email = req.body.email;
    let seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    console.log(seq);
    try {
        if (email) {
            await userModel.updateOne({ email }, { token: seq });
            // email send to
            // nodemailer -> table tag through
            //  service -> gmail

            let user = await userModel.findOne({ email });
            await emailSender(seq);
            console.log(user);
            if (user?.token) {
                return res.status(200).json({
                    message: "Email send with token" + seq
                })
            } else {
                return res.status(404).json({
                    message: "user not found"
                })
            }
        } else {
            return res.status(400).json({
                message: "kindly enter email"
            })
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
}
async function resetPassword(req, res) {
    let { token, password, confirmPassword } = req.body;
    try {
        if (token) {
            let user = await userModel.findOne({ token });
            if (user) {
                user.resetHandler(password, confirmPassword);
                // user.password = password;
                // user.confirmPassword = confirmPassword;
                // // token reuse is not possible
                // user.token = undefined;
                console.log(user);
                await user.save();
                res.status(200).json({
                    message: "user Password change"
                })
            } else {
                return res.status(404).json({
                    message: "incorrect token"
                })
            }
        } else {
            return res.status(404).json({
                message: "user not found"
            })
        }
    } catch {
        console.log(err)
        res.status(500).json({
            message: err.message
        })
    }

}

// function createUser(req, res) {
//     console.log("req data", req.body);
//     user = req.body;
//     res.status(200).send("data recieved and used added");
// }
function setCreatedAt(req, res, next) {
    let body = req.body;
    let length = Object.keys(body).length;
    if (length == 0) {
        return res.status(400).json({
            message: "can't create user when body is empty",
        })
    }
    req.body.createdAt = new Date().toISOString();
    // return res.json({
    //     text: "bye bye"
    // })
    next();
}

module.exports = authRouter;