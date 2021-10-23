const mongoose = require("mongoose");
let { DB_LINK } = require("../secrets");
// link
// connnection form 
mongoose.connect(DB_LINK).then(function () {
    // console.log(db);
    console.log("connected to db")
}).catch(function (err) {
    console.log("err", err);
})

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "userModel",
        required: [true, "booking must belong to a user"]
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: "planModel",
        required: [true, "booking must belong to a plan "]
    },
    bokkedAt: {
        type: Date,
        default: Date.now
    },
    PriceAtThatTime: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "succesful", "rejected"],
        required: true,
        default: "pending"
    }
})

const bookingModel = mongoose.model("bookingModel", bookingSchema);
module.exports = bookingModel