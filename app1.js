// // for install express
// // npm init -y 
// // npm i express
// const express = require("express");
// const app = express();

// // post accept
// app.use(express.json());

// // app.get("/",function(req,res){
//     // console.log("hello from home page");
// //     res.send("<h1>Hello from backened");
// // });

// // app.get("/",function(req,res) {
// //    console.log("users");
// //    res.json(user); 
// // });

// let user = {  
// };
// app.post("/user",function(req,res){
//     console.log("req data", req.body);
//     user = req.body;
//     res.status(200).send("data recieved and used added");
// })

// //get
// app.get("/user",function(req,res){
//     console.log("user");
//     // for sending key value pair
//     res.json(user);
// })

// // update
// app.patch("/user",function(req,res){
//     let obj = req.body;
//     for(let key in obj){
//         user[key] = obj[key];
//     }
//     res.status(200).json(user);
// })
// // delete
// app.delete("/user",function(res,res){
//     user={};
//     res.status(200).json(user);
// })
// // template routes
// app.get("/user/:id",function(req,res){
//     console.log(req.params);
//     res.status(200).send("hello");
// })
// app.listen(8080,function(){
//     console.log("server started");
// })