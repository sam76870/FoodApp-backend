const userModel = require("../models/userModel");
const protectRoute = require('./authHelper');
const factory = require("../helpers/factory");
const express = require('express');
const userRouter = express.Router();
const createUser = factory.createElements(userModel);
const getUser = factory.getElements(userModel);
const deleteUser = factory.deleteElements(userModel);
const updateUser = factory.updateElements(userModel);
const getUserById = factory.getElementById(userModel);
userRouter
    .route("/")
    // .post(createUser)
    .get(protectRoute, authorizeUser(["admin"]),getUser)
    .post(protectRoute, authorizeUser(["admin"]), createUser)
    
userRouter
    .route("/:id")
    .patch(updateUser)
    .get(protectRoute, authorizeUser(["admin", "manager"]), getUserById)
    .delete(protectRoute, authorizeUser(["admin"]), deleteUser);
    


// async function getUser(req, res) {
//     try {
//         let users = await userModel.find();
//         res.status(200).json({
//             "message": "list of all the users",
//             user: users
//         })
//     } catch {
//         res.status(500).json({
//             error: err.meassage,
//             "meassage": "can't get user"
//         })
//     }
//     console.log("user");
//     // for sending key value pair
//     // res.json(users);
// }
// function updateUser(req, res) {
//     let obj = req.body;
//     for (let key in obj) {
//         user[key] = obj[key];
//     }
//     res.status(200).json(user);
// }
// function deleteUser(res, res) {
//     user = {};
//     res.status(200).json(user);
// }
// function getUserById(req, res) {
//     console.log(req.params);
//     res.status(200).send("hello");
// }
function authorizeUser(rolesArr) {
    return async function (req, res, next) {
        let uid = req.uid;
        let { role } = await userModel.findById(uid);
        let isAuthorized = rolesArr.includes(role);
        if (isAuthorized) {
            next();
        } else {
            res.status(403).json({
                message: "user not authorized contact admin"
            })
        }
    }
}
module.exports = userRouter;